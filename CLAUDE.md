# CLAUDE.md — the-actual-news

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**The Actual News** — verifiable news ledger platform treating news as a public service. A pnpm monorepo with an OpenAPI-defined gateway, microservices for claims/evidence/stories/verification, and a PostgreSQL-backed audit trail. Deployed as a Next.js static export on Cloudflare Pages.

## Commands

```bash
# Development
make dev             # Run all services in parallel (pnpm -r --parallel dev)
make dev-minimal     # Gateway only (cd services/gateway && pnpm dev)

# Infrastructure
make up              # docker-compose -f infra/docker-compose.yml up -d (PostgreSQL)
make down            # Tear down + remove volumes
make migrate         # Run migrations via tools/migrate.sh

# Quality
make lint            # Lint OpenAPI contracts (npx @redocly/cli lint contracts/openapi/*.yaml)
make test            # Run conformance tests (node tools/conformance/run.mjs)
make reset           # down + up + migrate

# Individual service
cd services/<name> && pnpm dev
```

## Architecture

**Monorepo layout**:
```
services/
├── gateway/      # API gateway — routes all external traffic
├── claim/        # Claim submission and tracking service
├── evidence/     # Evidence attachment service
├── story/        # Story composition service
├── verify/       # Verification and audit service
apps/
└── public-web/   # Next.js 16 frontend (static export)
db/               # PostgreSQL migrations
contracts/
└── openapi/      # OpenAPI specs (source of truth — lint with Redocly)
infra/            # Docker Compose, infrastructure config
tools/
└── conformance/  # Conformance test runner
```

**Contract-first**: `contracts/openapi/*.yaml` are the canonical API definitions. Run `make lint` after editing them.

**Database**: PostgreSQL via Docker Compose locally. `POSTGRES_URI` env var required for migrations.

**Frontend** (`apps/public-web`): Next.js 16 with static export (`output: 'export'`). Deployed to Cloudflare Pages.

**Environment**: Set `PLATFORM_ID` and `POSTGRES_URI` before running make targets that need them.

## Deployment

Live at **https://the-actual-news.pages.dev** (Cloudflare Pages). Next.js static export; React aligned to v19 for CF Pages compatibility.

<!-- ORGANVM:AUTO:START -->
## System Context (auto-generated — do not edit)

**Organ:** ORGAN-III (Commerce) | **Tier:** standard | **Status:** GRADUATED
**Org:** `organvm-iii-ergon` | **Repo:** `the-actual-news`

### Edges
- **Produces** → `unspecified`: product
- **Produces** → `organvm-vi-koinonia/community-hub`: community_signal
- **Produces** → `organvm-vii-kerygma/social-automation`: distribution_signal

### Siblings in Commerce
`classroom-rpg-aetheria`, `gamified-coach-interface`, `trade-perpetual-future`, `fetch-familiar-friends`, `sovereign-ecosystem--real-estate-luxury`, `public-record-data-scrapper`, `search-local--happy-hour`, `multi-camera--livestream--framework`, `universal-mail--automation`, `mirror-mirror`, `the-invisible-ledger`, `enterprise-plugin`, `virgil-training-overlay`, `tab-bookmark-manager`, `a-i-chat--exporter` ... and 16 more

### Governance
- Strictly unidirectional flow: I→II→III. No dependencies on Theory (I).

*Last synced: 2026-06-07T13:29:52Z*

## Active Handoff Protocol

If `.conductor/active-handoff.md` exists, **READ IT FIRST** before doing any work.
It contains constraints, locked files, conventions, and completed work from the
originating agent. You MUST honor all constraints listed there.

If the handoff says "CROSS-VERIFICATION REQUIRED", your self-assessment will
NOT be trusted. A different agent will verify your output against these constraints.

## Session Review Protocol

At the end of each session that produces or modifies files:
1. Run `organvm session review --latest` to get a session summary
2. Check for unimplemented plans: `organvm session plans --project .`
3. Export significant sessions: `organvm session export <id> --slug <slug>`
4. Run `organvm prompts distill --dry-run` to detect uncovered operational patterns

Transcripts are on-demand (never committed):
- `organvm session transcript <id>` — conversation summary
- `organvm session transcript <id> --unabridged` — full audit trail
- `organvm session prompts <id>` — human prompts only


## System Library

Plans: 269 indexed | Chains: 5 available | SOPs: 18 active
Discover: `organvm plans search <query>` | `organvm chains list` | `organvm sop lifecycle`
Library: `/Users/4jp/Code/organvm/praxis-perpetua/library`


## Active Directives

| Scope | Phase | Name | Description |
|-------|-------|------|-------------|
| system | any | atomic-clock | The Atomic Clock |
| system | any | execution-sequence | Execution Sequence |
| system | any | multi-agent-dispatch | Multi-Agent Dispatch |
| system | any | session-handoff-avalanche | Session Handoff Avalanche |
| system | any | system-loops | System Loops |
| system | any | prompting-standards | Prompting Standards |
| system | any | prompting-standards | Prompting Standards |
| system | any | prompting-standards | Prompting Standards |
| system | any | background-task-resilience | background-task-resilience |
| system | any | context-window-conservation | context-window-conservation |
| system | any | session-self-critique | session-self-critique |
| system | any | the-descent-protocol | the-descent-protocol |
| system | any | the-membrane-protocol | the-membrane-protocol |
| system | any | theory-to-concrete-gate | theory-to-concrete-gate |
| system | any | triangulation-protocol | triangulation-protocol |

Linked skills: SOP-TRIADIC-REVIEW-PROTOCOL, cicd-resilience-and-recovery, continuous-learning-agent, evaluation-to-growth, genesis-dna, multi-agent-workforce-planner, promotion-and-state-transitions, quality-gate-baseline-calibration, repo-onboarding-and-habitat-creation, session-self-critique, structural-integrity-audit, the-membrane-protocol, triple-reference


**Prompting (Anthropic)**: context 200K tokens, format: XML tags, thinking: extended thinking (budget_tokens)


## Atomization Pipeline

Run `organvm atoms pipeline --write && organvm atoms fanout --write` to generate task queue.


## System Density (auto-generated)

AMMOI: 25% | Edges: 0 | Tensions: 0 | Clusters: 0 | Adv: 27 | Events(24h): 38788
Structure: 8 organs / 149 repos / 1654 components (depth 17) | Inference: 0% | Organs: META-ORGANVM:63%, ORGAN-I:53%, ORGAN-II:48%, ORGAN-III:55% +5 more
Last pulse: 2026-06-07T13:29:40 | Δ24h: n/a | Δ7d: n/a


## Dialect Identity (Trivium)

**Dialect:** EXECUTABLE_ALGORITHM | **Classical Parallel:** Arithmetic | **Translation Role:** The Engineering — proves that proofs compute

Strongest translations: I (formal), II (structural), VII (structural)

Scan: `organvm trivium scan III <OTHER>` | Matrix: `organvm trivium matrix` | Synthesize: `organvm trivium synthesize`


## Logos Documentation Layer

**Status:** ACTIVE | **Symmetry:** 0.5 (DREAM)

Nature demands a documentation counterpart. This formation maintains its narrative record in `docs/logos/`.

### The Tetradic Counterpart
- **[Telos (Idealized Form)](../docs/logos/telos.md)** — The dream and theoretical grounding.
- **[Pragma (Concrete State)](../docs/logos/pragma.md)** — The honest account of what exists.
- **[Praxis (Remediation Plan)](../docs/logos/praxis.md)** — The attack vectors for evolution.
- **[Receptio (Reception)](../docs/logos/receptio.md)** — The account of the constructed polis.

### Alchemical I/O
- **[Source & Transmutation](../docs/logos/alchemical-io.md)** — Narrative of inputs, process, and returns.



*Compliance: Record exists without implementation.*

<!-- ORGANVM:AUTO:END -->
















## ⚡ Conductor OS Integration
This repository is a managed component of the ORGANVM meta-workspace.
- **Orchestration:** Use `conductor patch` for system status and work queue.
- **Lifecycle:** Follow the `FRAME -> SHAPE -> BUILD -> PROVE` workflow.
- **Governance:** Promotions are managed via `conductor wip promote`.
- **Intelligence:** Conductor MCP tools are available for routing and mission synthesis.

## Dependency Management

This repo uses **manual, intentional** dependency management — **Dependabot is disabled**
(deliberate opt-out, IRF-SYS-007). Grouping config was trialed (`bc8bd90`) then removed by
the maintainer (`c30b204`); only GitHub **security alerts** remain active. Declared in
`seed.yaml` under `dependency_management` and in `.github/SECURITY.md`. To update a
dependency: review, test, and patch it manually rather than relying on automated PRs.