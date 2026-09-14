# Open projects — status matrix

| Project | Purpose | Sentry | Telegram topic | SDK | Alerts | Deploy notes |
|---------|---------|--------|----------------|-----|--------|--------------|
| Open-KobePlay | Governance / Notion ops | open-kobeplay | 7 | Missing | Missing | This repo |
| Open-System | Hermes execution | open-system | 2 | Missing | Missing | Confirm repo |
| Open-Connect | Control plane / gateway | open-connect | 3 | Missing | Missing | CI + uptime OK |
| Open-Model | Self-hosted AI model platform | open-model | TBD (do not reuse topic 4) | Missing | Missing | Replaces Open-Box; needs own Sentry DSN + topic |
| Open-TGate | Telegram product plane | open-tgate | 5 | Missing | Missing | ≠ ops bot |
| Open-Hub | Staff chat / WebUI | open-hub | 8 | Missing | Missing | Confirm repo |
| Open-Teleset | Telemetry | open-teleset | 6 | Missing | Missing | Confirm repo |
| Open-Payment | Payments | open-payment | 9 | Missing | Missing | Compliance gates |

**Legend:** Missing = code/secrets/rules not verified in production path.

**Replacement:** Open-Model replaces Open-Box in the canonical eight. Legacy Open-Box records (Sentry project `open-box`, Telegram topic 4) remain historical — **do not reuse the Open-Box DSN**. Open-Model does **not** inherit Open-Box's data-plane role; any data-plane decision is tracked separately in Private Operations.

Update this table when a gate closes. Canonical narrative: `docs/OPEN_PORTFOLIO_E2E.md`.
