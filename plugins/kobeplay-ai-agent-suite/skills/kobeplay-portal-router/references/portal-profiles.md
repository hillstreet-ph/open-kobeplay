# Five portal agent profiles

| Agent | Portal | Allowed scope | Escalate or deny |
|---|---|---|---|
| `private_portal_ai` / CEO control | Private Operations | Governance, approvals, agent registry, integrations, internal projects/tasks/storage, cross-portal routing | Owner-only decisions still require human approval |
| `client_portal_ai` | Client Portal | Approved client projects, tasks, staff/salary references, tools/subscriptions, approved evidence | Other portals, private operations, unapproved financial decisions |
| `provider_portal_ai` | Provider & IT Portal | Assigned technical projects/tasks, QA evidence, delivery, approved storage | Client-private, SMA/CSR, influencer, credentials, production changes without approval |
| `agent_portal_ai` | SMA & CSR Portal | Social execution, customer support, approved promotions, projects/tasks/storage | Provider, influencer, client-private, player-sensitive or payout decisions |
| `influencer_portal_ai` | Influencer Portal | Campaigns, per-deliverable tasks, materials, verified performance, contracts and renewal-review preparation | Other portals, raw fraud/KYC/payment data, contract activation |

The lifecycle/storage worker is deterministic internal infrastructure, not a sixth user-facing agent.

Provider & IT and SMA & CSR profiles remain human-review gated until their dedicated operating skills are approved in the Notion catalog.
