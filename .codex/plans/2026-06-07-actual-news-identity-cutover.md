---
title: "Actual News to Records Watch Identity Cutover"
description: "Surgical preparation for the Phase 1 identity transition from 'The Actual News' to 'Records Watch' on recordswatch.org."
generated: "2026-06-07T14:30:00Z"
repo: "/Users/4jp/Code/organvm/the-actual-news"
branch: "codex/phase1-identity-cutover"
irf: "IRF-III-059"
---

# Actual News to Records Watch Identity Cutover

## Governing Context

Based on the hall-monitor audit (2026-06-07), the recommended Phase 1 public identity is **Records Watch** on **recordswatch.org**. The current repository contains hard-coded references to "The Actual News" and "theactual.news".

This plan outlines the repo-side changes needed to parameterize and update these identity markers in preparation for the final domain delegation and worker binding.

## Goals

1.  Transition all public-facing display strings to "Records Watch".
2.  Update site descriptions to reflect the "Records Watch" mission.
3.  Update configuration files (wrangler.jsonc, seed.yaml) with the new canonical domain (recordswatch.org) while preserving worker preview URLs.
4.  Parameterize identity markers where possible to allow defensive aliasing (recordswatch.news).

## Implementation Steps

### 1. Configuration Updates

-   **wrangler.jsonc**:
    -   `NEXT_PUBLIC_SITE_TITLE`: "Records Watch"
    -   `NEXT_PUBLIC_SITE_DESCRIPTION`: "Verifiable news ledger providing public claim graphs, evidence audits, and correction history for civic records."
    -   `NEXT_PUBLIC_ANALYTICS_DOMAIN`: "recordswatch.org"
-   **seed.yaml**:
    -   Update metadata with the new canonical plan once domain is secured.

### 2. Source Code Updates (Public Web)

-   Review and update components in `apps/public-web/src/` that use hard-coded titles.
-   Update `apps/public-web/src/pages/icon.svg.tsx` if it contains branding text.
-   Update `apps/public-web/src/pages/media-kit.json.tsx` branding.

### 3. Documentation & Contracts

-   Update OpenAPI titles and descriptions in `contracts/openapi/`.
-   Update `docs/architecture.md` and `docs/local-development.md` branding.

## Verification

-   `pnpm launch:local` - Verify all routes show "Records Watch".
-   `pnpm cloudflare:build` - Ensure worker bundle reflects new variables.
-   `pnpm domain:doctor` - Verify it now flags `recordswatch.org` as the target.
-   `make civic-replay` - Ensure civic bundle integrity remains unchanged.

## Non-Goals

-   This session will **not** register the domain or delegate DNS.
-   This session will **not** mutate Cloudflare account settings.
