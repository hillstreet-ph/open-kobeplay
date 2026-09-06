# Team and Agent Operating Model

## Human governance

Charles is the private owner and final approver. External collaborators receive only the portal views and approved evidence required for their role.

## Five-agent model

| Agent | Workspace | Scope |
|---|---|---|
| CEO_AI | Private Operations | Orchestration, governance, approvals, routing |
| Client_AI | KobePlay Client Portal | Approved client coordination |
| Provider_IT_AI | Provider & IT Portal | Technical delivery and provider work |
| SMA_CSR_AI | SMA & CSR Portal | Social media and customer-support operations |
| Influencer_AI | Influencer Portal | Campaign, materials, performance, and contract-review preparation |

The Lifecycle & Storage Worker is a deterministic internal worker, not a sixth user-facing agent. It handles close-to-Storage indexing, duplicate prevention, Drive references, and restore preparation.

## Mandatory controls

- One canonical record, owner, department, status, and next action.
- Search before creation.
- Portal-scoped access only.
- Human approval for material decisions.
- No credentials, OTPs, recovery data, raw KYC, payment details, or private conversation history in shared portals or GitHub.
- AI enrichment may summarize or classify; it must not silently approve, publish, pay, sign, or deploy.
