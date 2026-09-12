# Host adapters

The canonical instructions are in `skills/kobeplay-portal-router/`. Do not fork the policy per vendor.

| Host | Import or instruction |
|---|---|
| ChatGPT / Codex | Install this plugin or load the skill folder. Configure approved apps separately. |
| Claude | Add `AGENTS.md` and the skill references to project knowledge; connect Notion/GitHub through approved MCP servers. |
| Grok | Use `AGENTS.md` as system instructions and attach only portal-approved references. |
| Open WebUI | Import `adapters/open-webui.json`; map tool names to approved connectors. |
| Hermes Agent | Import `adapters/hermes-agent.yaml`; keep credentials in its server-side secret store. |
| LobeHub | Use `adapters/lobehub-agent.json` as the agent-profile source and configure MCP connections in the host. |

Host adapters contain no credentials. Connector availability and action names must be verified during installation.
