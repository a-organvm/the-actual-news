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
`classroom-rpg-aetheria`, `gamified-coach-interface`, `trade-perpetual-future`, `fetch-familiar-friends`, `sovereign-ecosystem--real-estate-luxury`, `public-record-data-scrapper`, `search-local--happy-hour`, `multi-camera--livestream--framework`, `universal-mail--automation`, `mirror-mirror`, `the-invisible-ledger`, `enterprise-plugin`, `virgil-training-overlay`, `tab-bookmark-manager`, `a-i-chat--exporter` ... and 14 more

### Governance
- Strictly unidirectional flow: I→II→III. No dependencies on Theory (I).

*Last synced: 2026-03-25T22:27:11Z*

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


## Active Directives

| Scope | Phase | Name | Description |
|-------|-------|------|-------------|
| system | any | prompting-standards | Prompting Standards |
| system | any | research-standards-bibliography | APPENDIX: Research Standards Bibliography |
| system | any | phase-closing-and-forward-plan | METADOC: Phase-Closing Commemoration & Forward Attack Plan |
| system | any | research-standards | METADOC: Architectural Typology & Research Standards |
| system | any | sop-ecosystem | METADOC: SOP Ecosystem — Taxonomy, Inventory & Coverage |
| system | any | autonomous-content-syndication | SOP: Autonomous Content Syndication (The Broadcast Protocol) |
| system | any | autopoietic-systems-diagnostics | SOP: Autopoietic Systems Diagnostics (The Mirror of Eternity) |
| system | any | background-task-resilience | background-task-resilience |
| system | any | cicd-resilience-and-recovery | SOP: CI/CD Pipeline Resilience & Recovery |
| system | any | community-event-facilitation | SOP: Community Event Facilitation (The Dialectic Crucible) |
| system | any | context-window-conservation | context-window-conservation |
| system | any | conversation-to-content-pipeline | SOP — Conversation-to-Content Pipeline |
| system | any | cross-agent-handoff | SOP: Cross-Agent Session Handoff |
| system | any | cross-channel-publishing-metrics | SOP: Cross-Channel Publishing Metrics (The Echo Protocol) |
| system | any | data-migration-and-backup | SOP: Data Migration and Backup Protocol (The Memory Vault) |
| system | any | document-audit-feature-extraction | SOP: Document Audit & Feature Extraction |
| system | any | dynamic-lens-assembly | SOP: Dynamic Lens Assembly |
| system | any | essay-publishing-and-distribution | SOP: Essay Publishing & Distribution |
| system | any | formal-methods-applied-protocols | SOP: Formal Methods Applied Protocols |
| system | any | formal-methods-master-taxonomy | SOP: Formal Methods Master Taxonomy (The Blueprint of Proof) |
| system | any | formal-methods-tla-pluscal | SOP: Formal Methods — TLA+ and PlusCal Verification (The Blueprint Verifier) |
| system | any | generative-art-deployment | SOP: Generative Art Deployment (The Gallery Protocol) |
| system | any | market-gap-analysis | SOP: Full-Breath Market-Gap Analysis & Defensive Parrying |
| system | any | mcp-server-fleet-management | SOP: MCP Server Fleet Management (The Server Protocol) |
| system | any | multi-agent-swarm-orchestration | SOP: Multi-Agent Swarm Orchestration (The Polymorphic Swarm) |
| system | any | network-testament-protocol | SOP: Network Testament Protocol (The Mirror Protocol) |
| system | any | open-source-licensing-and-ip | SOP: Open Source Licensing and IP (The Commons Protocol) |
| system | any | performance-interface-design | SOP: Performance Interface Design (The Stage Protocol) |
| system | any | pitch-deck-rollout | SOP: Pitch Deck Generation & Rollout |
| system | any | polymorphic-agent-testing | SOP: Polymorphic Agent Testing (The Adversarial Protocol) |
| system | any | promotion-and-state-transitions | SOP: Promotion & State Transitions |
| system | any | recursive-study-feedback | SOP: Recursive Study & Feedback Loop (The Ouroboros) |
| system | any | repo-onboarding-and-habitat-creation | SOP: Repo Onboarding & Habitat Creation |
| system | any | research-to-implementation-pipeline | SOP: Research-to-Implementation Pipeline (The Gold Path) |
| system | any | security-and-accessibility-audit | SOP: Security & Accessibility Audit |
| system | any | session-self-critique | session-self-critique |
| system | any | smart-contract-audit-and-legal-wrap | SOP: Smart Contract Audit and Legal Wrap (The Ledger Protocol) |
| system | any | source-evaluation-and-bibliography | SOP: Source Evaluation & Annotated Bibliography (The Refinery) |
| system | any | stranger-test-protocol | SOP: Stranger Test Protocol |
| system | any | strategic-foresight-and-futures | SOP: Strategic Foresight & Futures (The Telescope) |
| system | any | styx-pipeline-traversal | SOP: Styx Pipeline Traversal (The 7-Organ Transmutation) |
| system | any | system-dashboard-telemetry | SOP: System Dashboard Telemetry (The Panopticon Protocol) |
| system | any | the-descent-protocol | the-descent-protocol |
| system | any | the-membrane-protocol | the-membrane-protocol |
| system | any | theoretical-concept-versioning | SOP: Theoretical Concept Versioning (The Epistemic Protocol) |
| system | any | theory-to-concrete-gate | theory-to-concrete-gate |
| system | any | typological-hermeneutic-analysis | SOP: Typological & Hermeneutic Analysis (The Archaeology) |

Linked skills: cicd-resilience-and-recovery, continuous-learning-agent, evaluation-to-growth, genesis-dna, multi-agent-workforce-planner, promotion-and-state-transitions, quality-gate-baseline-calibration, repo-onboarding-and-habitat-creation, structural-integrity-audit


**Prompting (Anthropic)**: context 200K tokens, format: XML tags, thinking: extended thinking (budget_tokens)


## Ecosystem Status

- **delivery**: 1/1 live, 0 planned
- **revenue**: 0/1 live, 1 planned
- **marketing**: 0/3 live, 2 planned
- **community**: 0/1 live, 0 planned
- **content**: 0/2 live, 0 planned
- **listings**: 0/1 live, 1 planned

Run: `organvm ecosystem show the-actual-news` | `organvm ecosystem validate --organ III`


## Entity Identity (Ontologia)

**UID:** `ent_repo_01KKKX3RVNYQQ97D3DRVHVAMMA` | **Matched by:** primary_name

Resolve: `organvm ontologia resolve the-actual-news` | History: `organvm ontologia history ent_repo_01KKKX3RVNYQQ97D3DRVHVAMMA`


## Live System Variables (Ontologia)

| Variable | Value | Scope | Updated |
|----------|-------|-------|---------|
| `active_repos` | 64 | global | 2026-03-25 |
| `archived_repos` | 54 | global | 2026-03-25 |
| `ci_workflows` | 106 | global | 2026-03-25 |
| `code_files` | 0 | global | 2026-03-25 |
| `dependency_edges` | 60 | global | 2026-03-25 |
| `operational_organs` | 8 | global | 2026-03-25 |
| `published_essays` | 29 | global | 2026-03-25 |
| `repos_with_tests` | 0 | global | 2026-03-25 |
| `sprints_completed` | 33 | global | 2026-03-25 |
| `test_files` | 0 | global | 2026-03-25 |
| `total_organs` | 8 | global | 2026-03-25 |
| `total_repos` | 127 | global | 2026-03-25 |
| `total_words_formatted` | 0 | global | 2026-03-25 |
| `total_words_numeric` | 0 | global | 2026-03-25 |
| `total_words_short` | 0K+ | global | 2026-03-25 |

Metrics: 9 registered | Observations: 15536 recorded
Resolve: `organvm ontologia status` | Refresh: `organvm refresh`


## System Density (auto-generated)

AMMOI: 56% | Edges: 41 | Tensions: 33 | Clusters: 5 | Adv: 7 | Events(24h): 23754
Structure: 8 organs / 127 repos / 1654 components (depth 17) | Inference: 98% | Organs: META-ORGANVM:64%, ORGAN-I:55%, ORGAN-II:47%, ORGAN-III:55% +4 more
Last pulse: 2026-03-25T22:27:04 | Δ24h: +3.5% | Δ7d: n/a


## Dialect Identity (Trivium)

**Dialect:** EXECUTABLE_ALGORITHM | **Classical Parallel:** Arithmetic | **Translation Role:** The Engineering — proves that proofs compute

Strongest translations: I (formal), II (structural), VII (structural)

Scan: `organvm trivium scan III <OTHER>` | Matrix: `organvm trivium matrix` | Synthesize: `organvm trivium synthesize`

<!-- ORGANVM:AUTO:END -->


## ⚡ Conductor OS Integration
This repository is a managed component of the ORGANVM meta-workspace.
- **Orchestration:** Use `conductor patch` for system status and work queue.
- **Lifecycle:** Follow the `FRAME -> SHAPE -> BUILD -> PROVE` workflow.
- **Governance:** Promotions are managed via `conductor wip promote`.
- **Intelligence:** Conductor MCP tools are available for routing and mission synthesis.
