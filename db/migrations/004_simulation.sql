BEGIN;

CREATE TABLE IF NOT EXISTS sim_personas (
  persona_id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  traits JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sim_threads (
  thread_id TEXT PRIMARY KEY,
  platform_id TEXT NOT NULL,
  story_id TEXT NOT NULL REFERENCES stories(story_id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sim_conversational_turns (
  turn_id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL REFERENCES sim_threads(thread_id),
  persona_id TEXT NOT NULL REFERENCES sim_personas(persona_id),
  parent_turn_id TEXT REFERENCES sim_conversational_turns(turn_id),
  content TEXT NOT NULL,
  referenced_claim_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sim_outbox_cursors (
  cursor_id TEXT PRIMARY KEY,
  last_event_id TEXT,
  last_processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_sim_threads_story_id ON sim_threads(story_id);
CREATE INDEX IF NOT EXISTS idx_sim_turns_thread_id ON sim_conversational_turns(thread_id);
CREATE INDEX IF NOT EXISTS idx_sim_turns_persona_id ON sim_conversational_turns(persona_id);
CREATE INDEX IF NOT EXISTS idx_sim_turns_parent_id ON sim_conversational_turns(parent_turn_id);

COMMIT;
