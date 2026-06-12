# Feature Specification: Simulated Public Square (Persona Simulation Engine)

**Feature Branch**: `simulated-public-square`
**Created**: 2026-06-11
**Status**: Draft
**Input**: User description: "i want to invent an entire network of entities via randomly generated env-rules-governed digital users endlessly discussing the news and arguing and debating and spawning the entire universe of potential personas and conversational turns"

## User Scenarios & Testing

### User Story 1 - News Ingestion and First Reactions (Priority: P1)

When a new verified story publishes to the platform, the simulation engine ingests the narrative, claims, and evidence. The engine initializes a core set of digital personas with diverse base traits. These personas read the story and emit initial reactions, which are logged as conversational turns in a simulated forum.

**Why this priority**: It establishes the basic ingestion and generation loop, which is the foundation of the entire simulation.

**Independent Test**: Can be tested independently by publishing a test story and verifying that the engine spawns exactly N personas and generates N initial reaction posts without any follow-up debate.

**Acceptance Scenarios**:
1. **Given** a newly published story with a set of claims, **When** the simulation engine polls the outbox, **Then** it generates distinct persona profiles based on environment rules and outputs a first round of commentary.

---

### User Story 2 - Endless Debate and Conversational Spawning (Priority: P2)

Personas observe the reactions of others. Based on their traits (e.g., argumentative, credulous, contrarian, analytical) and environment rules, they reply, debate, and argue. This creates conversational threads that branch endlessly, referencing the original story's evidence graph.

**Why this priority**: Delivers on the core promise of "endlessly discussing the news and arguing and debating."

**Independent Test**: Can be tested by seeding a set of initial reactions and running the simulation loop for X ticks, verifying that replies are generated and threads branch out logically based on persona traits.

**Acceptance Scenarios**:
1. **Given** an existing thread of reactions, **When** the simulation ticks, **Then** personas evaluate the thread, decide whether to reply, and generate new conversational turns that reference prior turns or evidence.
2. **Given** two personas with opposing traits, **When** they encounter each other's turns, **Then** they consistently engage in debate according to their generated biases.

---

### User Story 3 - Persona Evolution and Dynamic Spawning (Priority: P3)

As the debate progresses, the environment rules dictate that new personas enter the conversation based on the volume or heat of the debate (e.g., a "troll" persona spawns when debate gets heated, or an "expert" spawns to correct a chain of false claims). Existing personas evolve their traits (e.g., getting more polarized or exhausted) over time.

**Why this priority**: Creates the "entire universe of potential personas" and ensures the simulation doesn't go stale, offering emergent dynamics.

**Independent Test**: Can be tested by simulating a highly polarized thread and verifying that the engine spawns new personas dynamically to inject into the thread, or that existing personas shift their internal state.

**Acceptance Scenarios**:
1. **Given** a debate thread that reaches a threshold of disagreement, **When** the environment rules are evaluated, **Then** a new, specialized persona is generated and introduced into the conversation.

---

### Edge Cases

- What happens when a story is formally corrected via the `corrections` ledger? Do the personas notice and react to the correction, or do they double down?
- How does the system handle unbounded growth of conversational turns (memory limits, DB storage limits, LLM context window limits)?
- What happens if the LLM generating the conversational turns hallucinates evidence not present in the original story? How is this tracked?

## Requirements

### Functional Requirements

- **FR-001**: System MUST ingest `story.published.v1` and `correction.appended.v1` events from the platform outbox.
- **FR-002**: System MUST generate digital personas using an LLM, assigning traits, biases, and interaction rules based on environment configurations.
- **FR-003**: System MUST execute a tick-based or event-driven simulation loop where personas evaluate state and generate text outputs (conversational turns).
- **FR-004**: System MUST store conversational turns in a hierarchical/threaded data structure.
- **FR-005**: System MUST allow environment rules to be configured via external policy packs or configuration files.
- **FR-006**: System MUST cap the maximum number of active personas and active threads to prevent resource exhaustion [NEEDS CLARIFICATION: What are the exact bounds for API spend and database size?].
- **FR-007**: System MUST provide an interface (API or view) to observe the ongoing debates and the state of the active personas.

### Key Entities

- **Persona**: A digital entity with specific traits, memory window, biases, and behavioral rules.
- **Environment State**: The current configuration of the simulation, including global tension, trending topics, and active personas.
- **Conversational Turn**: A single utterance or post by a persona, which may be a top-level reaction or a reply to a parent turn.
- **Thread**: A chronological graph of conversational turns attached to a specific story or topic.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The system can simulate 50 active personas across 5 active story threads generating at least 1 turn per minute, without exceeding LLM API rate limits.
- **SC-002**: The generated conversational turns demonstrably reference the actual claims and evidence from the published story (verified via sampling).
- **SC-003**: The persona generation system produces a statistically diverse set of at least 30 distinct behavioral archetypes over a 24-hour simulation period, avoiding homogenized responses.
