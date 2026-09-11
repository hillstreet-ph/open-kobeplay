# Open Portfolio E2E Readiness (Canonical)

**Last updated:** 2026-09-12  
**Org tracker:** [#6](https://github.com/hillstreet-ph/open-kobeplay/issues/6)  
**Coordination:** Notion Private Operations · AITeam · open_e2e_deploy_worker

This document is the single source of truth for purpose, stack, done vs missing, human gates, and autonomous drivers across the eight Open projects.

---

## 1. Portfolio purpose

| Project | Role |
|---------|------|
| **Open-KobePlay** | Governance, Notion/workspace ops, org alignment |
| **Open-System** | Hermes execution plane, workers, jobs, approval gates |
| **Open-Connect** | AI control plane: Resource Registry, Connection Hub, Model Hub, MCP/API gateway (`open-connect.site`) |
| **Open-Box** | Data plane: files, artifacts, knowledge |
| **Open-TGate** | Telegram observe / TDLib boundary (not ops spam) |
| **Open-Hub** | Staff chat / Open WebUI consumption of approved gateway |
| **Open-Teleset** | Telemetry / set operations plane |
| **Open-Payment** | Payments plane (compliance-sensitive) |

**Deployment stack (locked):** GitHub · Docker Hub · Cloudflare · Supabase · Sentry · Zeabur (preferred) / Railway fallback · Pipedream · Composio · slim.tools  
**Credentials:** Open-Secret + Google Drive/Sheets inventory for `kairocasino8@gmail.com` — never paste secrets into Notion/GitHub issues.

---

## 2. GitHub repository status

| Logical project | Primary repo (when present) | Notes |
|-----------------|----------------------------|--------|
| Open-KobePlay | `hillstreet-ph/open-kobeplay` | Portfolio docs + tracker live here |
| Open-Connect | `hillstreet-ph/open-connect` | Production edge + CI active |
| Open-System | *(ensure repo exists / linked)* | Execution plane |
| Open-Box | *(ensure repo exists / linked)* | Data plane |
| Open-TGate | *(ensure repo exists / linked)* | Telegram product plane |
| Open-Hub | *(ensure repo exists / linked)* | Hub UI |
| Open-Teleset | *(ensure repo exists / linked)* | Telemetry |
| Open-Payment | *(ensure repo exists / linked)* | Payments |

Related: `open-template`, `open-custom-skills`, `v1-open-connect` (legacy).

---

## 3. Already done

### Sentry (`hillstreet`)
- All **8** projects: `open-kobeplay`, `open-system`, `open-connect`, `open-box`, `open-tgate`, `open-hub`, `open-teleset`, `open-payment`
- **Production** DSNs created for each (store in runtime secrets only)
- Uptime monitors: `open-connect.site/` and `/api/v1/health`

### Telegram — Open Notifications
- Group `chat_id`: `-1004438815187`
- Bot: `@open_notify8_bot`
- Forum topics verified (test messages):

| Topic | thread_id | Sentry project |
|-------|-----------|----------------|
| Open-System | 2 | open-system |
| Open-Connect | 3 | open-connect |
| Open-Box | 4 | open-box |
| Open-TGate | 5 | open-tgate |
| Open-Teleset | 6 | open-teleset |
| Open-Kobeplay | 7 | open-kobeplay |
| Open-Hub | 8 | open-hub |
| Open-Payment | 9 | open-payment |
| General | omit thread | fallback |

### Ops artifacts
- Worker sketch: `ops/sentry-telegram-worker/` (this repo)
- Issues: #6 E2E, #7 alert rules, #9 Telegram map, open-connect#27 SDK
- Notion: E2E Master, multi-agent coordination, Sentry/Telegram tasks
- Open-Connect CI: validator, control-plane, self-heal, release, CodeQL

---

## 4. Missing / blockers

| ID | Gap | Owner |
|----|-----|--------|
| M1 | Sentry **issue/metric alert rules** empty | Human UI or API token |
| M2 | `SENTRY_DSN` not in Zeabur/CF/GH secrets | Human |
| M3 | SDK not initialized in app code | AI PR → human merge |
| M4 | Sentry → Telegram Worker **not deployed** | AI deploy + human secrets |
| M5 | Bot may still be **member** not admin | Human |
| M6 | Bot token may need **rotation** (was shared in chat) | Human |
| M7 | Some logical Open repos not visible under org search | Human create/link |
| M8 | Supabase inactive projects (if any) | Human billing |

---

## 5. Human gates (cannot fully automate)

1. Promote `@open_notify8_bot` to admin (post messages).
2. Place secrets: Production `SENTRY_DSN` ×8, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID=-1004438815187`, optional `SENTRY_CLIENT_SECRET`.
3. Sentry Internal Integration webhook URL → deployed Worker **or** Telegram Alerts Bot install.
4. Create/duplicate alert Templates A (new high errors) + B (regression) with action → integration.
5. Merge SDK/ops PRs; rotate token if required.

---

## 6. Autonomous / AI-driveable

| Loop | Action |
|------|--------|
| Daily Grok worker | Claim Notion phase task; no duplicate work; update #6 |
| Health | Curl production URLs; post summary to Telegram |
| Sentry | List issues/uptime; escalate regressions |
| Code | Open PRs for SDK init, `.env.example` placeholders |
| Docs | Keep this file + per-repo `docs/OPEN_PROJECT.md` in sync |
| Worker | Deploy `ops/sentry-telegram-worker` when CF account secrets ready |

**Stop conditions:** missing secrets, billing, alert UI without token, protected branch merge.

---

## 7. Alert rule templates (summary)

- **A** New issue + level ≥ error + production → notify integration  
- **B** Regression → notify  
- **C** Frequency spike (optional)  
Details: issue #7 and Notion Sentry tasks. MCP cannot create rules.

---

## 8. Per-project checklist (copy into each repo)

```markdown
## Open project ops checklist
- [ ] Sentry project exists + Production DSN in secrets as SENTRY_DSN
- [ ] SDK init (env-based DSN, environment, release, tracesSampleRate)
- [ ] .env.example has SENTRY_DSN= (empty)
- [ ] Telegram topic mapped (see OPEN_PORTFOLIO_E2E.md)
- [ ] CI green on main
- [ ] Production health URL documented
- [ ] No secrets in git
```

---

## 9. Related links

- Sentry org: https://hillstreet.sentry.io  
- open-connect.site  
- Worker README: `ops/sentry-telegram-worker/README.md`  
- Multi-agent rules: Notion Open E2E Multi-Agent Coordination  
