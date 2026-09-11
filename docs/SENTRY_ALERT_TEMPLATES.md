# Sentry alert templates (Open portfolio)

MCP cannot create alert rules. Use UI duplicate or API token.

## Template A — New high errors
- When: new issue created
- Filter: level ≥ error; environment production
- Frequency: 30 minutes
- Action: Internal Integration (Telegram Worker) or Telegram Alerts Bot

## Template B — Regression
- When: resolved → unresolved
- Action: same as A

## Template C — Spike (optional)
- When: event frequency > 50 in 5m
- Filter: level ≥ error

Apply to all eight `open-*` Sentry projects. Topic routing is done in the Worker by `project.slug`.
