BEGIN;

CREATE TABLE IF NOT EXISTS transparency_checkpoints (
  checkpoint_id TEXT PRIMARY KEY,
  platform_id TEXT NOT NULL,
  event_count INTEGER NOT NULL CHECK (event_count > 0),
  merkle_root TEXT NOT NULL,
  event_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  leaf_hashes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transparency_checkpoint_events (
  checkpoint_id TEXT NOT NULL REFERENCES transparency_checkpoints(checkpoint_id) ON DELETE CASCADE,
  event_id TEXT NOT NULL REFERENCES event_outbox(event_id),
  leaf_index INTEGER NOT NULL CHECK (leaf_index >= 0),
  leaf_hash TEXT NOT NULL,
  PRIMARY KEY (checkpoint_id, event_id),
  UNIQUE (checkpoint_id, leaf_index),
  UNIQUE (event_id)
);

CREATE INDEX IF NOT EXISTS idx_transparency_checkpoints_platform_created
  ON transparency_checkpoints(platform_id, created_at DESC);

COMMIT;
