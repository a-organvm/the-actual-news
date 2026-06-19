import { query } from './db.js';
import { generateInitialPersonasAndTurns } from './generator.js';

const PLATFORM_ID = process.env.PLATFORM_ID ?? 'unknown';

export async function processOutbox() {
  // We use a simple cursor in the sim_outbox_cursors table
  const cursorId = 'sim_worker';
  
  // Ensure cursor exists
  await query(`
    INSERT INTO sim_outbox_cursors (cursor_id, last_processed_at) 
    VALUES ($1, now()) 
    ON CONFLICT DO NOTHING
  `, [cursorId]);

  const cursorRes = await query(`SELECT last_event_id FROM sim_outbox_cursors WHERE cursor_id = $1`, [cursorId]);
  const lastEventId = cursorRes.rows[0]?.last_event_id;

  // Fetch new events
  let eventsRes;
  if (lastEventId) {
    // We assume chronological ulids or timestamps
    eventsRes = await query(`
      SELECT event_id, event_type, payload, created_at 
      FROM event_outbox 
      WHERE created_at > (SELECT created_at FROM event_outbox WHERE event_id = $1)
      ORDER BY created_at ASC 
      LIMIT 50
    `, [lastEventId]);
  } else {
    eventsRes = await query(`
      SELECT event_id, event_type, payload, created_at 
      FROM event_outbox 
      ORDER BY created_at ASC 
      LIMIT 50
    `);
  }

  for (const row of eventsRes.rows) {
    if (row.event_type === 'story.published.v1') {
      console.log(`[sim] Processing story.published.v1 for story_id=${row.payload.story_id}`);
      await generateInitialPersonasAndTurns(row.payload.story_id, row.payload.body_markdown);
    }
    
    // Update cursor
    await query(`
      UPDATE sim_outbox_cursors 
      SET last_event_id = $1, last_processed_at = now() 
      WHERE cursor_id = $2
    `, [row.event_id, cursorId]);
  }
}

export function startOutboxWorker(intervalMs = 5000) {
  setInterval(() => {
    processOutbox().catch(err => {
      console.error('[sim] outbox worker error:', err);
    });
  }, intervalMs);
}
