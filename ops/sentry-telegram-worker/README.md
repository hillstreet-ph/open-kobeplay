# sentry-telegram-worker

Routes Sentry webhooks to Telegram **Open Notifications** topics (thread ids 2–9).

See `docs/OPEN_PORTFOLIO_E2E.md` for portfolio context.

```bash
npm i -g wrangler
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
wrangler deploy
```

Sentry → Internal Integration → Webhook URL = Worker URL → Alert Rule Action enabled.
