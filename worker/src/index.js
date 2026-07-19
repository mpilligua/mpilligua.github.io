// Cloudflare Worker: /ask endpoint that answers questions about Maria's work.
// Uses OpenRouter (OpenAI-compatible API) with a free model. API key stored as
// Cloudflare secret OPENROUTER_API_KEY.

import { KB } from "./kb.js";

// Allowed origins for CORS. Add localhost for local development.
const ALLOWED_ORIGINS = new Set([
  "https://mpilligua.github.io",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]);

const MODEL = "nvidia/nemotron-nano-9b-v2:free";
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://mpilligua.github.io";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildSystemPrompt() {
  return `You are Maria Pilligua's portfolio assistant. You are NOT Maria. You are a separate entity that answers questions about her on her behalf, similar to a receptionist or a research group's website bot.

Identity rules (strict):
- ALWAYS speak in the third person about Maria. Use "Maria", "she", "her".
- NEVER use first person for Maria's actions. Do NOT say "I did", "I worked", "my paper", "my project", "my thesis". Wrong: "I published HyperNVD at CVPR 2025." Right: "Maria published HyperNVD at CVPR 2025."
- You may use first person for YOURSELF (the assistant), e.g. "I do not have information about that in her profile."
- If the visitor addresses you as if you were Maria ("what are you working on?"), gently correct by answering about her: "Maria is currently working on..."

Answering rules:
- Answer only from the KNOWLEDGE_BASE below. If it is not in the KB, say so honestly ("I do not have information about that in Maria's profile") rather than making things up.
- Be concise, factual, and warm. 2 to 4 short sentences unless the question genuinely needs more detail.
- When asked about a topic (e.g. "has she worked on NeRF?"), scan projects, publications, courses, and experience. Mention specific items by name with links.
- If the topic is adjacent but not exact (e.g. NeRF vs Gaussian Splatting), mention the closest match and explain the relationship briefly.
- When multiple things are relevant, list the top 2 to 3, most relevant first.
- Do not invent grades, dates, titles, coauthors, or venues.
- Do not answer questions unrelated to Maria's work (politics, personal life beyond the KB, opinions on unrelated topics, code help). Politely redirect.

Formatting rules:
- Output plain prose with markdown for links only: [label](url).
- Do NOT use headings (#, ##, ###).
- Do NOT use bullet points or numbered lists unless the visitor explicitly asks for a list. Prefer flowing sentences.
- Do NOT use em-dashes (—) or en-dashes (–). Use commas, colons, parentheses, or split sentences instead.
- Do NOT add blank lines between sentences of the same paragraph. Keep paragraphs tight.
- One line break between paragraphs is fine, but only if the answer really has two distinct paragraphs.

KNOWLEDGE_BASE:
${JSON.stringify(KB, null, 2)}`;
}

async function handleAsk(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }
  const question = (body?.question || "").toString().trim();
  if (!question) {
    return new Response(JSON.stringify({ error: "missing_question" }), { status: 400 });
  }
  if (question.length > 2000) {
    return new Response(JSON.stringify({ error: "question_too_long" }), { status: 400 });
  }
  const history = Array.isArray(body?.history) ? body.history.slice(-6) : [];

  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "server_missing_key" }), { status: 500 });
  }

  // Build OpenAI-style messages array.
  const messages = [{ role: "system", content: buildSystemPrompt() }];
  for (const turn of history) {
    if (turn && typeof turn.role === "string" && typeof turn.text === "string") {
      messages.push({
        role: turn.role === "assistant" ? "assistant" : "user",
        content: turn.text.slice(0, 4000),
      });
    }
  }
  messages.push({ role: "user", content: question });

  const payload = {
    model: MODEL,
    messages,
    stream: true,
    temperature: 0.3,
    top_p: 0.9,
    max_tokens: 800,
  };

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://mpilligua.github.io",
      "X-Title": "ask-maria",
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: "upstream_error", status: upstream.status, detail: errText.slice(0, 2000) }),
      { status: 502 }
    );
  }

  // Transform OpenRouter's OpenAI-style SSE into plain-text SSE chunks
  // so the client just concatenates data: lines.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;
            if (jsonStr === "[DONE]") continue;
            try {
              const chunk = JSON.parse(jsonStr);
              const text = chunk?.choices?.[0]?.delta?.content;
              if (text) {
                const safe = text.replace(/\r/g, "").split("\n").map(l => `data: ${l}`).join("\n");
                controller.enqueue(encoder.encode(safe + "\n\n"));
              }
            } catch { /* ignore malformed chunk */ }
          }
        }
        controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
      } catch (e) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${String(e).slice(0, 200)}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("ask-maria worker up. POST /ask", {
        status: 200,
        headers: { "Content-Type": "text/plain", ...cors },
      });
    }

    if (request.method === "POST" && url.pathname === "/ask") {
      const response = await handleAsk(request, env);
      const newHeaders = new Headers(response.headers);
      for (const [k, v] of Object.entries(cors)) newHeaders.set(k, v);
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    return new Response("not found", { status: 404, headers: cors });
  },
};
