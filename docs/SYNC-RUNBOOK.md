# Notion ↔ GitHub Sync Runbook

## Authority

- Notion owns live operational records, assignments, statuses, views, and approvals.
- GitHub owns versioned architecture, schemas, automation code, mappings, and change history.
- Google Drive owns approved binary assets. Notion indexes them; GitHub should not duplicate them.
- Secret values must remain in an approved secret store and must never be committed.

## Safe synchronization

1. Read the root organization page and each portal page.
2. Inventory databases by ID and data-source ID, not title alone.
3. Compare the current Notion structure with this repository.
4. Open a change branch for generated documentation or schema changes.
5. Never auto-delete a Notion page, database, relation, or GitHub file.
6. Require human review for access, publishing, contracts, payouts, production, and destructive changes.
7. Record sync time, source page IDs, generated files, validation result, and commit SHA.

## Integration contract

A future Pipedream or Composio workflow may trigger on approved Notion changes and open a GitHub pull request. It must:

- use least-privilege Notion read access and GitHub contents/PR access;
- redact credentials, tokens, raw conversations, KYC, and payment data;
- map resources by immutable Notion IDs;
- write generated snapshots to a dedicated branch;
- be idempotent;
- never push directly to production branches;
- never delete by default;
- stop on ambiguous duplicates or broken relations;
- attach a machine-readable sync report.

## Required secret names

Configure these only in the workflow provider or GitHub environment, never in repository files:

- `NOTION_API_TOKEN`
- `NOTION_ROOT_PAGE_ID`
- `GITHUB_APP_ID`
- `GITHUB_APP_INSTALLATION_ID`
- `GITHUB_APP_PRIVATE_KEY`

## Verification checklist

- Root and all five workspaces are readable.
- Every exported object has a stable Notion ID.
- Portal boundaries remain intact.
- No secret-bearing content is present.
- Generated Markdown passes formatting checks.
- A reviewer can trace each file to its Notion source.
- The sync commit and workflow run are recorded.
