# KobePlay Portal Architecture

Source of truth: KobePlay Organization in Notion.

## Portal boundaries

| Workspace | Audience | Owns | Must not expose |
|---|---|---|---|
| Private Operations | Charles and authorized internal workers | Governance, approvals, AI agents, integrations, internal projects/tasks/storage | Credentials, raw private conversations, payment/KYC data |
| KobePlay Client Portal | Client/main coordination | Approved client projects, tasks, resources | Other departments and private operations |
| Provider & IT Portal | Technical providers and IT team | Assigned technical tasks and approved storage | Client-private, SMA/CSR, influencer, conversation records |
| SMA & CSR Portal | Social media and customer support | Assigned marketing/support tasks and approved storage | Provider, influencer, client-private, conversation records |
| Influencer Portal | Influencer team and approved creators | Campaign projects, per-video tasks, materials, verified performance, contract cycles | Other portals and internal decision logic |
| General Forwarder | Internal approval queue | Routing summaries, approvals, decision evidence | Raw Telegram history and credentials |

## Canonical flow

1. Record internal intake in the canonical Projects or Tasks database.
2. Search for exact and semantic duplicates.
3. Assign one owning portal, owner, status, and next action.
4. Route the same record through filtered views; do not copy it into another database.
5. Require human approval for budgets, publishing, contracts, payouts, access, and production changes.
6. On Done, Cancelled, or Archived, keep the source record and create or update one Storage index row linked to approved evidence.
7. Restore the original record after authorization; never create a replacement.

## Influencer lifecycle

Pending Project → Approved Project → Pending/Approved Video Tasks → Done Task → Needs Review Performance → Verified Performance → Pending Review Contract → Passed Renewal or Failed Closure.

Contract review qualifies when either:

- Actual Qualified FTD ≥ Qualified FTD Target; or
- Actual Verified Total Deposits ≥ Talent Fee.

Register Quota is reference-only. Agency Commission is excluded. Qualification opens human review and does not automatically issue or activate a contract.
