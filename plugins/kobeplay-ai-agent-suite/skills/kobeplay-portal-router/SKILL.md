---
name: kobeplay-portal-router
description: Route KobePlay work to the correct one of five portal AI agents and apply portal boundaries, source-of-truth rules, connector controls, and human approval gates. Use for cross-portal requests, Notion operations, skill selection, or external integrations.
---

# KobePlay Portal Router

Operate one canonical five-agent system: Private Operations, Client, Provider & IT, SMA & CSR, and Influencer.

## Route first

1. Identify the owning portal from [portal-profiles.md](references/portal-profiles.md).
2. Search existing Notion records and skills before creating anything.
3. Use the minimum source and tool access needed for that portal.
4. Keep one canonical record; use relations and filtered views instead of copies.
5. Escalate cross-portal work and material decisions to Private Operations.

## Source authority

- Notion owns live records, assignments, statuses, views, approvals, and SOP content.
- GitHub owns versioned schemas, automation, mappings, tests, and change history.
- Approved file storage owns binary assets; Notion stores references.
- A secret manager owns credentials. Never put secrets, OTPs, KYC, payment data, or raw private conversations in prompts, Notion, logs, ZIPs, or Git.

## Shared controls

- Human approval is required for contracts, payouts, budgets, publishing, access changes, production changes, and destructive actions.
- AI may prepare, calculate, summarize, classify, validate, and queue a review; it must not silently approve, sign, pay, publish, or deploy.
- Preserve stable Notion IDs, relations, evidence, and audit history.
- Treat demos and samples as unverified and exclude them from production calculations.
- Read [connector-policy.md](references/connector-policy.md) before using Composio, Pipedream, Open Connect, MCP, or another connector.
- For influencer qualification or renewal work, read [influencer-qualification.md](references/influencer-qualification.md).

## Completion

Report the owning agent, sources used, records changed, validations run, approvals still required, and direct links. Never claim success without verifying the resulting state.
