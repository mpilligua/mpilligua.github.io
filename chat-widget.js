// Floating "Ask about Maria's work" chat widget.
// Self-injects on load. No dependencies.
// To wire it to the deployed Cloudflare Worker, change WORKER_URL below.

(function () {
  const WORKER_URL = "https://ask-maria.mariaepc31.workers.dev/ask";
  const STORAGE_KEY = "ask-maria-history";

  // --- state -----------------------------------------------------------
  let isOpen = false;
  let isSending = false;
  let history = [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) history = JSON.parse(stored);
  } catch { /* ignore */ }

  // --- helpers ---------------------------------------------------------
  function escapeHTML(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Markdown-lite renderer: paragraphs, bullet lists (even mixed with intro prose),
  // links, bold, italic, code.
  function renderMarkdown(text) {
    // Normalise whitespace:
    let src = text.replace(/\r/g, "").trim();
    // Strip trailing spaces before newlines (markdown "  \n" hard-breaks → just \n)
    src = src.replace(/[ \t]+\n/g, "\n");
    // Collapse 3+ newlines to 2 (single blank line max)
    src = src.replace(/\n{3,}/g, "\n\n");

    // Split into paragraphs by blank lines
    const paragraphs = src.split(/\n{2,}/);

    return paragraphs.map(renderParagraph).join("");

    function renderParagraph(para) {
      const lines = para.split(/\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return "";

      // Walk lines and split into segments: "prose" runs vs "bullet" runs.
      const segments = [];
      let cur = { type: null, items: [] };
      for (const line of lines) {
        const isBullet = /^([-*+])\s+/.test(line);
        const t = isBullet ? "list" : "prose";
        if (cur.type !== t) {
          if (cur.items.length) segments.push(cur);
          cur = { type: t, items: [] };
        }
        cur.items.push(isBullet ? line.replace(/^([-*+])\s+/, "") : line);
      }
      if (cur.items.length) segments.push(cur);

      return segments.map(seg => {
        if (seg.type === "list") {
          return `<ul>${seg.items.map(x => `<li>${inline(x)}</li>`).join("")}</ul>`;
        }
        // Prose: single newlines within one paragraph become a space (not <br>).
        // A "hard break" would need a real blank line in the source, which would
        // have already split into a separate paragraph above.
        return `<p>${inline(seg.items.join(" "))}</p>`;
      }).join("");
    }

    function inline(line) {
      let s = escapeHTML(line);
      // [text](url) markdown links
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        const safe = /^(https?:|mailto:|\/|\.\/|#)/i.test(url) ? url : "#";
        return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      });
      // Bare URLs
      s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
        (_m, lead, url) => `${lead}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
      // **bold**
      s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
      // *italic* (single asterisk, word-boundary-safe)
      s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:!?)]|$)/g, "$1<em>$2</em>");
      // `code`
      s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
      return s;
    }
  }

  function persistHistory() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch { /* ignore */ }
  }

  // --- DOM -------------------------------------------------------------
  const style = document.createElement("style");
  style.textContent = `
    .askmaria-btn {
      position: fixed; right: 24px; bottom: 24px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: #111; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s ease, background 0.15s ease;
      font-family: 'Optima', sans-serif;
    }
    .askmaria-btn:hover { transform: translateY(-2px); background: #333; }
    .askmaria-btn svg { width: 26px; height: 26px; }
    .askmaria-btn__label {
      position: absolute; right: 68px; top: 50%; transform: translateY(-50%);
      background: #111; color: #fff;
      padding: 6px 12px; border-radius: 6px;
      font-size: 0.85em; white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s ease;
    }
    .askmaria-btn:hover .askmaria-btn__label { opacity: 1; }

    .askmaria-panel {
      position: fixed; right: 24px; bottom: 96px; z-index: 9999;
      width: 380px; max-width: calc(100vw - 32px);
      height: 560px; max-height: calc(100vh - 128px);
      background: #fff; border-radius: 12px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.22);
      display: none; flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif;
    }
    .askmaria-panel--open { display: flex; }
    .askmaria-header {
      padding: 14px 16px;
      border-bottom: 1px solid #eee;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .askmaria-header__title {
      font-family: 'Optima', sans-serif;
      font-size: 15px; font-weight: 600; color: #111; margin: 0;
    }
    .askmaria-header__sub {
      font-size: 12px; color: #888; margin: 2px 0 0 0;
    }
    .askmaria-header__actions { display: flex; gap: 6px; }
    .askmaria-header__btn {
      background: none; border: none; cursor: pointer;
      color: #888; font-size: 13px; padding: 4px 8px; border-radius: 4px;
    }
    .askmaria-header__btn:hover { background: #f2f2f2; color: #333; }

    .askmaria-messages {
      flex: 1; overflow-y: auto;
      padding: 14px 16px;
      display: flex; flex-direction: column; gap: 10px;
      background: #fafafa;
    }
    .askmaria-msg {
      max-width: 88%;
      padding: 8px 12px; border-radius: 12px;
      font-size: 14px; line-height: 1.5;
      word-wrap: break-word;
    }
    .askmaria-msg--user {
      align-self: flex-end;
      background: #111; color: #fff;
      border-bottom-right-radius: 4px;
    }
    .askmaria-msg--assistant {
      align-self: flex-start;
      background: #fff; color: #222;
      border: 1px solid #eee;
      border-bottom-left-radius: 4px;
    }
    .askmaria-msg--assistant a { color: #3273dc; text-decoration: underline; }
    .askmaria-msg--assistant a:hover { color: #205cb5; }
    .askmaria-msg--assistant p {
      margin: 0 0 8px 0; padding: 0;
    }
    .askmaria-msg--assistant p:last-child { margin-bottom: 0; }
    .askmaria-msg--assistant ul {
      margin: 4px 0 8px 0; padding: 0 0 0 20px;
    }
    .askmaria-msg--assistant ul:last-child { margin-bottom: 0; }
    .askmaria-msg--assistant li {
      margin: 2px 0; padding: 0;
    }
    .askmaria-msg--assistant strong { font-weight: 600; color: #111; }
    .askmaria-msg--assistant em { font-style: italic; }
    .askmaria-msg--assistant code {
      background: #f4f4f4; padding: 1px 4px; border-radius: 3px;
      font-family: 'Courier New', monospace; font-size: 0.9em; color: #a33;
    }
    .askmaria-msg--error {
      background: #fef0f0; color: #a00; border: 1px solid #fadada;
    }
    .askmaria-thinking { display: inline-block; }
    .askmaria-thinking::after {
      content: "…";
      display: inline-block; width: 20px;
      animation: askmariaBlink 1.2s infinite;
    }
    @keyframes askmariaBlink {
      0%, 100% { opacity: 0.3; }
      50%      { opacity: 1; }
    }
    .askmaria-empty {
      color: #999; font-size: 13px; text-align: center;
      padding: 20px 8px; line-height: 1.6;
    }
    .askmaria-empty__hint {
      display: block; margin-top: 8px;
      font-size: 12px; color: #b8b8b8;
    }
    .askmaria-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 8px 16px 12px 16px;
      border-top: 1px solid #eee;
      background: #fafafa;
      flex-shrink: 0;
    }
    .askmaria-suggestions__label {
      width: 100%; font-size: 11px; color: #888;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding-top: 10px; margin-bottom: 2px;
    }
    .askmaria-chip {
      background: #fff; border: 1px solid #ddd;
      padding: 6px 12px; border-radius: 14px;
      font-size: 12px; color: #333; cursor: pointer;
      transition: background 0.15s ease;
      text-align: left;
      line-height: 1.35;
      max-width: 100%;
      white-space: normal;
      font-family: inherit;
    }
    .askmaria-chip:hover { background: #f2f2f2; }

    .askmaria-input {
      padding: 12px 16px; border-top: 1px solid #eee;
      display: flex; gap: 8px; background: #fff;
      flex-shrink: 0;
    }
    .askmaria-input textarea {
      flex: 1; resize: none;
      border: 1px solid #ddd; border-radius: 8px;
      padding: 8px 12px; font-size: 14px;
      font-family: inherit; color: #222;
      max-height: 100px; min-height: 38px;
      line-height: 1.4; outline: none;
    }
    .askmaria-input textarea:focus { border-color: #111; }
    .askmaria-input button {
      background: #111; color: #fff;
      border: none; border-radius: 8px;
      padding: 0 14px; cursor: pointer;
      font-family: inherit; font-size: 14px; font-weight: 500;
    }
    .askmaria-input button:disabled {
      background: #bbb; cursor: not-allowed;
    }
    .askmaria-disclaimer {
      font-size: 10.5px; color: #aaa;
      text-align: center; padding: 6px 10px 10px;
      background: #fff;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .askmaria-panel {
        right: 0; bottom: 0; width: 100%; height: 80vh; border-radius: 12px 12px 0 0;
      }
      .askmaria-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.className = "askmaria-btn";
  button.setAttribute("aria-label", "Ask about Maria's work");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span class="askmaria-btn__label">Ask about my work</span>
  `;
  document.body.appendChild(button);

  const panel = document.createElement("div");
  panel.className = "askmaria-panel";
  panel.innerHTML = `
    <div class="askmaria-header">
      <div>
        <p class="askmaria-header__title">Ask about my work</p>
        <p class="askmaria-header__sub">Ask about Maria's projects, papers, courses. Answers may be wrong.</p>
      </div>
      <div class="askmaria-header__actions">
        <button class="askmaria-header__btn" data-action="clear" title="Clear conversation">Clear</button>
        <button class="askmaria-header__btn" data-action="close" title="Close">✕</button>
      </div>
    </div>
    <div class="askmaria-messages" role="log" aria-live="polite"></div>
    <div class="askmaria-suggestions">
      <span class="askmaria-suggestions__label">Try asking</span>
      <button class="askmaria-chip" data-q="Has Maria worked on 3D reconstruction?">Has Maria worked on 3D reconstruction?</button>
      <button class="askmaria-chip" data-q="What does Maria do at CARIAD?">What does Maria do at CARIAD?</button>
      <button class="askmaria-chip" data-q="Tell me about HyperNVD">Tell me about HyperNVD</button>
      <button class="askmaria-chip" data-q="Has she taken any NLP courses?">Has she taken any NLP courses?</button>
    </div>
    <div class="askmaria-input">
      <textarea placeholder="Ask about her work…" rows="1"></textarea>
      <button data-action="send">Send</button>
    </div>
    <div class="askmaria-disclaimer">This is an AI assistant. Verify anything important on the source page.</div>
  `;
  document.body.appendChild(panel);

  const $messages = panel.querySelector(".askmaria-messages");
  const $textarea = panel.querySelector("textarea");
  const $sendBtn = panel.querySelector('button[data-action="send"]');
  const $suggestions = panel.querySelector(".askmaria-suggestions");

  // --- rendering -------------------------------------------------------
  function render() {
    $messages.innerHTML = "";
    if (history.length === 0) {
      const empty = document.createElement("div");
      empty.className = "askmaria-empty";
      empty.innerHTML = `Ask me anything about Maria's projects, papers, courses, or experience.<span class="askmaria-empty__hint">Try one of the suggestions below.</span>`;
      $messages.appendChild(empty);
      $suggestions.style.display = "flex";
      return;
    }
    $suggestions.style.display = "none";
    for (const turn of history) {
      const el = document.createElement("div");
      el.className = `askmaria-msg askmaria-msg--${turn.role}`;
      if (turn.role === "user") {
        el.textContent = turn.text;
      } else {
        el.innerHTML = renderMarkdown(turn.text || "");
      }
      $messages.appendChild(el);
    }
    $messages.scrollTop = $messages.scrollHeight;
  }

  function setOpen(open) {
    isOpen = open;
    panel.classList.toggle("askmaria-panel--open", open);
    if (open) {
      render();
      $textarea.focus();
    }
  }

  function autoresize() {
    $textarea.style.height = "auto";
    $textarea.style.height = Math.min($textarea.scrollHeight, 100) + "px";
  }

  // --- send flow -------------------------------------------------------
  async function send(question) {
    if (isSending || !question) return;
    isSending = true;
    $sendBtn.disabled = true;
    $textarea.disabled = true;

    history.push({ role: "user", text: question });
    // placeholder assistant bubble that we stream into
    history.push({ role: "assistant", text: "" });
    render();
    persistHistory();

    // Streaming target
    const assistantMsg = $messages.lastElementChild;
    assistantMsg.innerHTML = '<span class="askmaria-thinking">Thinking</span>';

    const controller = new AbortController();
    let firstToken = true;
    let acc = "";

    try {
      // History we send to the worker: excludes the last two (current user + empty assistant)
      const priorHistory = history.slice(0, -2).map(t => ({ role: t.role, text: t.text }));

      const resp = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: priorHistory }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        let detail = "";
        try { detail = (await resp.json()).error || ""; } catch { /* ignore */ }
        throw new Error(`worker ${resp.status} ${detail}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const ev of events) {
          const lines = ev.split("\n");
          const isDone = lines.some(l => l.trim() === "event: done");
          const isError = lines.some(l => l.trim() === "event: error");
          if (isDone) continue;
          const dataLines = lines
            .filter(l => l.startsWith("data:"))
            .map(l => l.slice(5).replace(/^ /, ""));
          if (dataLines.length === 0) continue;
          const chunk = dataLines.join("\n");
          if (isError) {
            throw new Error(chunk || "stream error");
          }
          if (firstToken) { firstToken = false; assistantMsg.innerHTML = ""; }
          acc += chunk;
          history[history.length - 1].text = acc;
          assistantMsg.innerHTML = renderMarkdown(acc);
          $messages.scrollTop = $messages.scrollHeight;
        }
      }
      if (!acc) {
        assistantMsg.innerHTML = "<em>(No response)</em>";
      }
      persistHistory();
    } catch (err) {
      assistantMsg.className = "askmaria-msg askmaria-msg--assistant askmaria-msg--error";
      assistantMsg.textContent = `Sorry, something went wrong: ${err.message || err}. Try again.`;
      history[history.length - 1].text = assistantMsg.textContent;
      persistHistory();
    } finally {
      isSending = false;
      $sendBtn.disabled = false;
      $textarea.disabled = false;
      $textarea.focus();
    }
  }

  // --- events ----------------------------------------------------------
  button.addEventListener("click", () => setOpen(!isOpen));

  panel.querySelector('[data-action="close"]').addEventListener("click", () => setOpen(false));

  panel.querySelector('[data-action="clear"]').addEventListener("click", () => {
    if (isSending) return;
    history = [];
    persistHistory();
    render();
  });

  $sendBtn.addEventListener("click", () => {
    const q = $textarea.value.trim();
    if (!q) return;
    $textarea.value = "";
    autoresize();
    send(q);
  });

  $textarea.addEventListener("input", autoresize);
  $textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const q = $textarea.value.trim();
      if (!q) return;
      $textarea.value = "";
      autoresize();
      send(q);
    }
  });

  $suggestions.addEventListener("click", (e) => {
    const target = e.target.closest(".askmaria-chip");
    if (!target) return;
    const q = target.dataset.q;
    if (q) send(q);
  });
})();
