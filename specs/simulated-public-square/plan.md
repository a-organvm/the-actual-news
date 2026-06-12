# Implementation Plan: Simulated Public Square

## Technical Context

- **Platform**: Node.js / TypeScript (aligning with the existing `the-actual-news` pnpm workspaces)
- **Database**: PostgreSQL (extending the existing schema or creating a new schema `sim_ledger`)
- **LLM Integration**: AI model gateway (similar to the one used by `services/claim/`) or direct integration via Google Gemini SDK for high-throughput persona generation and text generation.
- **Service Architecture**: A new worker service `services/simulation/` running an event-driven loop.

## Architecture

1. **Ingestion Worker**:
   - Listens to the `event_outbox` for `story.published.v1` and `correction.appended.v1`.
   - When a story publishes, it pulls the `story_versions`, `claims`, and `evidence_edges`.

2. **Persona Engine**:
   - A module that prompts the LLM to generate `N` random personas with variables: `bias`, `verbosity`, `skepticism`, `tone`, `archetype`.
   - Stores active personas in memory or Redis for quick access during a simulation run, and persists them to PostgreSQL.

3. **Simulation Tick Loop**:
   - A cron-based or infinite loop (`setInterval`) that ticks every X seconds.
   - On each tick, the engine selects a subset of active personas.
   - For each selected persona, it fetches the recent "conversational turns" in active threads.
   - The LLM is prompted: "You are [Persona]. You are reading [Thread Context] and the original story [Story Summary]. Respond to the latest message. If you agree, build on it. If you disagree, argue using claims from the story or your own generated logic."
   - The output is saved as a new `conversational_turn`.

4. **Environment Rules Engine**:
   - Evaluates thread tension. If `turn_count > threshold` or `sentiment == highly_polarized`, spawns a new persona (e.g., a "Moderator", "Troll", or "Fact-checker") and injects them into the thread.

## Data Model

```sql
-- Schema: simulation

CREATE TABLE personas (
    persona_id ULID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    archetype VARCHAR(100) NOT NULL,
    traits JSONB NOT NULL, -- { bias, skepticism, tone }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE threads (
    thread_id ULID PRIMARY KEY,
    story_id VARCHAR(255) NOT NULL, -- references stories.story_id
    topic_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversational_turns (
    turn_id ULID PRIMARY KEY,
    thread_id ULID NOT NULL REFERENCES threads(thread_id),
    persona_id ULID NOT NULL REFERENCES personas(persona_id),
    parent_turn_id ULID REFERENCES conversational_turns(turn_id),
    content TEXT NOT NULL,
    referenced_claim_ids JSONB, -- Optional references back to story claims
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Phase 0: Foundations
- Create `services/simulation` workspace.
- Define OpenAPI contracts or internal types for the simulation loop.
- Set up DB migrations for the new `personas` and `conversational_turns` tables.

## Phase 1: Ingestion & Spawning
- Implement the outbox listener to trigger when a story is published.
- Implement the Persona Generator using the LLM gateway.

## Phase 2: The Debate Loop
- Implement the tick loop.
- Create the Prompt Builder that injects persona traits + thread history + story claims into the LLM context.
- Parse the LLM response and save it as a `conversational_turn`.

## Phase 3: Display
- Add a new route in `apps/public-web/` (e.g., `/story/[story_id]/simulation`) to render the simulated debate live, displaying persona avatars and thread trees.
