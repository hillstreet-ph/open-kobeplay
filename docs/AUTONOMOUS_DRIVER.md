# Autonomous E2E driver

## Schedule

- **Notion / Grok automation:** `open-portfolio-e2e-daily-driver` (target 08:00 Asia/Manila)
- **Worker:** `open_e2e_deploy_worker` (AITeam registry)
- **Agents:** ChatGPT Work · Claude Cowork · Grok — claim work on coordination page; search-before-create

## Each run

1. Open Notion E2E Master + earliest incomplete Phase task.  
2. Open GitHub `open-kobeplay#6` — comment progress, no secrets.  
3. Check Sentry projects/uptime (read-only).  
4. Optional: post status to Telegram Open Notifications (main or per-topic).  
5. Open or update issues/PRs for SDK, Worker, CI failures.  
6. Stop at human gates (secrets, alert UI, merge, billing).

## Conflict rules

- One agent owns a task at a time (claim in Notion).  
- Do not recreate existing Sentry projects, topics, or docs.  
- Prefer editing `docs/OPEN_PORTFOLIO_E2E.md` over parallel READMEs with divergent facts.

## Telegram ops (not TGate product)

- Ops bot: `@open_notify8_bot`  
- Chat: `-1004438815187`  
- Secrets only in Worker / Open-Secret  
