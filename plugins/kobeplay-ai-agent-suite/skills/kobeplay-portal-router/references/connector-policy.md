# Connector policy

Preferred order: native structured connector → approved Open Connect/MCP endpoint → Composio → Pipedream workflow → browser automation as a last resort.

## Controls

- Use OAuth or server-side credential references; never expose or persist raw tokens in agent context.
- Limit each connection to the portal, app, actions, and environment it needs.
- Keep development, staging, and production identities separate.
- Require human approval for new authentication, expanded scopes, production writes, access policy changes, and destructive actions.
- Record actor, portal, capability, target, approval, result, correlation ID, and timestamp.
- Make workflows idempotent. Use immutable Notion IDs and stable external IDs as deduplication keys.
- On ambiguity, broken relations, validation failure, or permission failure: stop and route to Private Operations.

Composio MCP endpoint: `https://connect.composio.dev/mcp`. Configure it only in the host's connector settings and authenticate interactively. Do not include credentials in this package.

Pipedream may trigger approved Notion-to-GitHub synchronization. It must create a branch and pull request, redact sensitive content, and never delete or push directly to production by default.
