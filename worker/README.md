# ask-maria worker

Cloudflare Worker that answers questions about Maria's portfolio using Gemini 1.5 Flash. Called by the floating chat widget on `mpilligua.github.io`.

## Files

- `src/index.js` — the Worker. Handles `POST /ask`, calls Gemini, streams back.
- `src/kb.js` — knowledge base compiled from Maria's CV (projects, papers, courses, experience, awards). Edit this file whenever the CV changes.
- `wrangler.toml` — Cloudflare config. No secrets here.

## First-time deploy (do this once)

Prerequisites: Node 18+ installed.

1. **Install Wrangler** (Cloudflare's CLI):
   ```bash
   npm install -g wrangler
   ```

2. **Create a free Cloudflare account** at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) if you do not have one.

3. **Log in from the terminal**:
   ```bash
   wrangler login
   ```
   This opens a browser to authorize.

4. **Get a Gemini API key** at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → "Create API key".
   Free tier: 15 requests / minute, 1500 / day. Fine for a portfolio.

5. **Store the key as a Cloudflare secret** (from inside this `worker/` folder):
   ```bash
   cd worker
   wrangler secret put GEMINI_API_KEY
   ```
   Paste the key when prompted. It never leaves Cloudflare. **Do NOT commit it.**

6. **Deploy the Worker**:
   ```bash
   wrangler deploy
   ```
   Output will show something like:
   ```
   Published ask-maria (0.42 sec)
     https://ask-maria.<your-account>.workers.dev
   ```
   Copy that URL.

7. **Wire the URL into the widget**: open `../chat-widget.js` and update the `WORKER_URL` constant on line 6 to your deployed URL, ending in `/ask`. Example:
   ```js
   const WORKER_URL = "https://ask-maria.mpilligua.workers.dev/ask";
   ```

8. **Test it locally**: from the repo root, run:
   ```bash
   python3 -m http.server 8080
   ```
   then open [http://localhost:8080](http://localhost:8080). You should see a floating button bottom-right. Click it, ask a question.

9. **Commit and push** (the widget and Worker files — the secret is NOT in the repo). GitHub Pages will pick it up.

## Updating the knowledge base

Whenever you update your CV (yaml files, courses, publications), edit `src/kb.js` accordingly, then redeploy:

```bash
cd worker
wrangler deploy
```

Redeploy takes ~5 seconds. No need to touch the widget or the site.

## Local iteration on the Worker

To run the Worker locally without deploying:

```bash
cd worker
wrangler dev
```

This starts a local server, typically on [http://localhost:8787](http://localhost:8787). Temporarily point `WORKER_URL` in `chat-widget.js` to `http://localhost:8787/ask` while iterating.

## Costs

- **Cloudflare Workers Free**: 100,000 requests/day. You will never hit this.
- **Gemini 1.5 Flash Free**: 15 req/min, 1500 req/day. Fine for a portfolio; the Worker returns an error if you exceed it.

If traffic spikes and you want more headroom, upgrade Gemini to a paid tier (~$0.075 per million input tokens for 1.5 Flash — near-nothing for chat traffic).

## Security notes

- The API key lives ONLY as a Cloudflare secret. It is never in the code, git history, or browser.
- CORS is restricted to `mpilligua.github.io` (plus `localhost` for testing). Other sites cannot call the Worker.
- Rate limiting: Cloudflare's free tier is generous but not rate-limited by IP. If you see abuse, add a rate limiter (Cloudflare Turnstile or a manual counter in KV).
- The Worker refuses questions >2000 chars.
- Safety settings are set to BLOCK_MEDIUM_AND_ABOVE for all Gemini categories.

## Rotating the key

If the key is ever exposed:
1. Revoke it at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Create a new one.
3. Run `wrangler secret put GEMINI_API_KEY` again with the new key.
4. Redeploy is not required — the secret takes effect immediately.
