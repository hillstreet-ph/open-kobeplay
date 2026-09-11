/**
 * Sentry → Telegram webhook Worker (Open portfolio)
 * Env secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, optional SENTRY_CLIENT_SECRET
 */
const TOPIC_MAP = {
  "open-system": 2,
  "open-connect": 3,
  "open-box": 4,
  "open-tgate": 5,
  "open-teleset": 6,
  "open-kobeplay": 7,
  "open-hub": 8,
  "open-payment": 9,
};

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return json({ ok: true, service: "sentry-telegram-worker", topics: TOPIC_MAP });
    }
    if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

    const raw = await request.text();
    if (env.SENTRY_CLIENT_SECRET) {
      const ok = await verifySentrySignature(raw, request.headers.get("sentry-hook-signature"), env.SENTRY_CLIENT_SECRET);
      if (!ok) return json({ error: "invalid signature" }, 401);
    }

    let body;
    try { body = JSON.parse(raw || "{}"); } catch { return json({ error: "invalid json" }, 400); }

    const resource = (request.headers.get("sentry-hook-resource") || "").toLowerCase();
    const messages = buildMessages(body, resource, env);
    if (!messages.length) return json({ ok: true, skipped: true });

    const results = [];
    for (const msg of messages) results.push(await sendTelegram(env, msg.text, msg.threadId));
    const failed = results.filter((r) => !r.ok);
    return json({ ok: failed.length === 0, results }, failed.length ? 502 : 200);
  },
};

function buildMessages(body, resource, env) {
  const out = [];
  if (resource === "metric_alert" || body?.data?.metric_alert) {
    const ma = body.data?.metric_alert || {};
    const rule = ma.alert_rule || {};
    const projects = rule.projects || [];
    const project = Array.isArray(projects) ? projects[0] : projects;
    out.push({
      threadId: resolveThread(project, env),
      text: formatHtml({
        kind: "metric",
        action: body.action || "triggered",
        title: body.data?.description_title || rule.name || "Metric alert",
        project: project || "unknown",
        body: body.data?.description_text || "",
        url: body.data?.web_url || "",
      }),
    });
    return out;
  }

  const issue = body.data?.issue || body.issue || null;
  const event = body.data?.event || body.event || null;
  const projectSlug =
    body.project_slug || body.data?.project_slug || body.project?.slug ||
    issue?.project?.slug || event?.project || "unknown";
  const title = issue?.title || event?.title || body.data?.description_title || body.message || "Sentry alert";
  out.push({
    threadId: resolveThread(projectSlug, env),
    text: formatHtml({
      kind: "issue",
      action: body.action || resource || "alert",
      title,
      project: projectSlug,
      level: event?.level || issue?.level || "",
      culprit: issue?.culprit || event?.culprit || "",
      env: event?.environment || "",
      url: issue?.permalink || issue?.web_url || body.url || "",
    }),
  });
  return out;
}

function resolveThread(projectSlug, env) {
  if (!projectSlug) return undefined;
  const key = String(projectSlug).toLowerCase();
  if (TOPIC_MAP[key] != null) return TOPIC_MAP[key];
  for (const [slug, id] of Object.entries(TOPIC_MAP)) if (key.includes(slug)) return id;
  return env.DEFAULT_THREAD_ID ? Number(env.DEFAULT_THREAD_ID) : undefined;
}

function formatHtml({ kind, action, title, project, level, culprit, env, body, url }) {
  const icon = kind === "metric" ? "📊" : "🚨";
  const lines = [`${icon} <b>${esc(title)}</b>`, `Project: <code>${esc(project)}</code>`];
  if (action) lines.push(`Action: ${esc(String(action))}`);
  if (level) lines.push(`Level: <code>${esc(String(level))}</code>`);
  if (env) lines.push(`Env: <code>${esc(String(env))}</code>`);
  if (culprit) lines.push(`Culprit: <code>${esc(String(culprit).slice(0, 200))}</code>`);
  if (body) lines.push(`\n${esc(String(body).slice(0, 800))}`);
  if (url) lines.push(`\n<a href="${esc(url)}">Open in Sentry</a>`);
  return lines.join("\n");
}

async function sendTelegram(env, text, threadId) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return { ok: false, error: "missing telegram env" };
  }
  const payload = { chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true };
  if (threadId != null) payload.message_thread_id = Number(threadId);
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: data.ok === true, threadId: threadId ?? null, message_id: data.result?.message_id, description: data.description };
}

async function verifySentrySignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === signatureHeader.trim().toLowerCase();
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}
