# Task List: Simulated Public Square

## Phase 1: Setup & Foundational
- [x] **T001** [P] Create `services/simulation` workspace in `pnpm-workspace.yaml`.
- [x] **T002** [P] Set up `package.json`, `tsconfig.json`, and basic Express/Fastify server or worker process in `services/simulation/`.
- [x] **T003** Create PostgreSQL migration (`004_simulation.sql`) for `personas`, `threads`, and `conversational_turns` tables.
- [x] **T004** Update database types and models in the internal shared DB package (if applicable).

## Phase 2: User Story 1 (News Ingestion & Personas)
- [x] **T005** Implement outbox listener in `services/simulation` that polls or receives webhooks for `story.published.v1`.
- [x] **T006** Implement `PersonaGenerator` class integrating with the LLM API to spawn N personas with diverse traits.
- [x] **T007** Implement LLM prompt builder to construct initial reactions to a published story.
- [x] **T008** Save personas and initial `conversational_turns` to the database.

## Phase 3: User Story 2 (Debate Loop)
- [x] **T009** Implement the Simulation Engine tick loop (e.g., using `setInterval` or a cron job).
- [x] **T010** Implement context-gathering logic: fetching a thread, its history, and the personas involved.
- [x] **T011** Implement `PersonaReply` logic: LLM generates a conversational turn based on persona traits and thread context.
- [x] **T012** Handle threading logic so replies link to a `parent_turn_id`.

## Phase 4: User Story 3 (Environment Rules & Spawning)
- [x] **T013** Implement environment rules evaluator: checks thread depth, tension (sentiment analysis or simple depth limit).
- [x] **T014** Dynamic spawning logic: if threshold met, trigger `PersonaGenerator` with specific constrained archetypes (e.g., "Moderator", "Troll").
- [x] **T015** Inject new persona into the active thread.

## Phase 5: Display
- [x] **T016** [P] Add API endpoints in `services/gateway` (or a dedicated route) to serve threads, turns, and personas.
- [x] **T017** [P] Create React components in `apps/public-web/src/pages/story/[story_id]/simulation.tsx` to render the discussion tree.
- [x] **T018** Add visualizations for persona traits (e.g., radar charts for bias/skepticism).
