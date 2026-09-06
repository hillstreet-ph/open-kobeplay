# KobePlay Organization

Version-controlled mirror of the KobePlay Notion organization, team workspaces, governance rules, and synchronization contract.

## Canonical documentation

- [Portal architecture](docs/PORTAL-ARCHITECTURE.md)
- [Notion source map](docs/NOTION-SOURCE-MAP.md)
- [Team and agent operating model](docs/TEAM-AND-AGENT-OPERATING-MODEL.md)
- [Notion ↔ GitHub sync runbook](docs/SYNC-RUNBOOK.md)

## Source-of-truth boundaries

- **Notion:** operational records, assignments, statuses, views, approvals, and SOP content.
- **GitHub:** versioned architecture, mappings, automation code, schemas, and change history.
- **Google Drive:** approved binary files and creative assets.
- **Secret manager:** credentials, tokens, OTPs, recovery material, and private keys.

## Safety

This repository must not contain credentials, raw private conversations, KYC, payment data, or internal-only evidence. Automated sync must use immutable Notion IDs, preserve portal access boundaries, create reviewable pull requests, and never delete records by default.

Snapshot: 2026-09-06
