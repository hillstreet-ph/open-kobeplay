# Portal Boundary Test and Evidence Plan

Status: review required  
Tracks: [#5](https://github.com/hillstreet-ph/open-kobeplay/issues/5)

## Purpose

Prove that the Client Portal cannot read or infer Private Operations finance,
salary, credentials, internal margin, security evidence, or unpublished records.
This plan defines evidence requirements only. It does not authorize a production
deployment, an access-policy change, or use of production data.

## Pre-test gates

Do not execute live boundary tests until all gates are satisfied:

- an owner confirms whether this repository is Open-KobePlay or Open-Payment;
- repository visibility is reconciled with the canonical Notion project;
- a dedicated non-production Supabase project and test tenants are approved;
- the exact migration set is reviewed and applied only to staging;
- test identities are synthetic and contain no real staff, client, payment, KYC,
  credential, salary, invoice, vendor-cost, or margin data;
- a second authorized reviewer is available for any auth, role, or RLS change.

A green build, a Git tag, or a GitHub Release is not portal-boundary evidence.

## Canonical roles and deny-by-default rule

| Test identity | Permitted surface | Prohibited surface |
|---|---|---|
| Owner | Approved private and client records in its organization | Other organizations |
| Operator | Approved operational records in its organization | Other organizations and secret values |
| Client | Published client-safe records for its organization | Draft/rejected records, Private Operations, internal cost/margin, salary, credentials, raw conversations, audit/security internals |
| Staff | Explicitly assigned staff-safe records | Client-private and Private Operations records |
| Auditor | Approved audit scope | Secret values and unrelated organizations |
| Anonymous | Public health endpoint only | Every organization, project, finance, audit, and integration record |

The database, API, server-rendered routes, client-side queries, exports, logs, and
error messages must independently enforce the same boundary. Hiding a field in
the UI is not access control.

## Required test matrix

Each test records request identity, organization, route or query, expected result,
actual result, timestamp, build SHA, migration identifiers, and redacted evidence.

### Organization isolation

1. A member of organization A cannot select, count, search, export, update, or
   infer any organization B record.
2. A guessed UUID, changed query parameter, direct API request, and pagination
   cursor cannot bypass isolation.
3. Service-role credentials are unavailable to browser code and client-visible
   responses.

### Client publication boundary

1. A client can read only records explicitly approved and published for that
   client's organization.
2. Draft, Needs Review, rejected, archived-private, and Private Operations
   records return no rows or an authorization error.
3. Empty, malformed, or missing approval metadata fails closed.
4. Search, filters, aggregates, counts, relationships, and exports do not reveal
   the existence of prohibited records.

### Sensitive field boundary

For a record that has both a client-safe amount and private cost data, verify that
the client can receive the approved client-safe projection without receiving or
inferring:

- internal cost, internal margin, vendor rate, or agency markup;
- staff salary, payee, payment method, or payroll schedule;
- credentials, tokens, connection strings, secret fingerprints, or recovery data;
- raw private conversations, KYC, banking, invoices, or security evidence.

Test REST, GraphQL if enabled, generated types, RPC functions, views, CSV/export
paths, logs, error payloads, and browser network responses. Column grants alone
do not prove row-level publication safety.

### Role mutation and privilege escalation

1. Client and staff identities cannot create or alter memberships or roles.
2. Client and staff identities cannot approve or publish records.
3. Self-assignment, organization reassignment, mass update, upsert, RPC, and
   forged JWT metadata attempts fail.
4. Removing a membership revokes access on the next authorized request and does
   not leave export or cache access behind.

### Audit and redaction

1. Allowed and denied privileged actions create traceable audit evidence where
   policy requires it.
2. Audit metadata never stores secret values or prohibited client/private fields.
3. Client identities cannot read internal audit or security records.
4. Logs, Sentry events, Telegram summaries, Pipedream, Composio, and Notion/GitHub
   sync reports contain only approved references and redacted metadata.

### Notion to GitHub synchronization

1. Mapping uses immutable page and data-source IDs, not titles alone.
2. Re-running the same event is idempotent and does not create duplicate issues,
   branches, PRs, records, workflows, or deployments.
3. A fresh Processing claim blocks a competing mutation.
4. Ambiguous duplicate mappings, missing parents, or broken relations stop the
   run for review.
5. Sync is non-destructive by default and opens one issue-linked branch and PR.
6. Client-facing output is generated only from explicitly approved fields; private
   page content is never copied into client databases, GitHub, logs, or messages.

## Current baseline findings

The following are blockers, not acceptance evidence:

- GitHub reports this repository as public while the canonical Notion project
  records it as private.
- The current package, landing page, CI image name, and initial Supabase migration
  identify as Open-Payment inside the Open-KobePlay repository.
- No dedicated Open-KobePlay Supabase project is currently available for staging.
- The existing migration includes authorization and financial RLS behavior; any
  correction is HIGH risk and requires independent review plus staging tests.
- Release `v1.0.0` and current green main CI prove build health only.

## Evidence bundle

Store only redacted evidence references:

- Git commit SHA and PR URL;
- CI run URL and exact tested head SHA;
- staging environment reference, never credentials;
- migration filenames and database migration IDs;
- test runner summary with pass/fail counts;
- representative redacted allowed/denied responses;
- reviewer identity and decision;
- rollback Git SHA and immutable image digest;
- Notion task and GitHub issue update.

A passing result requires all mandatory cases on the same staging artifact.
Any privacy-boundary failure freezes promotion and is classified HIGH or CRITICAL.

## Release and handoff gate

Before merge of an implementation PR:

- current-head required CI and security checks are green;
- boundary tests pass in staging;
- no unresolved review threads remain;
- an independent authorized reviewer approves auth/RLS/privacy changes;
- the change is linked to the canonical Notion task and GitHub issue;
- rollback is documented and does not rely on reversing a destructive migration.

Before production promotion, obtain written owner approval, promote the same
immutable staging artifact, and verify health, TLS, API, database, auth, worker,
audit, and privacy-boundary paths. Never claim `PRODUCTION_VERIFIED` without
live evidence.
