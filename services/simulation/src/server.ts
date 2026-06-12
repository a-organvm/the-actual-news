import express from "express";
import { startOutboxWorker } from "./outbox.js";
import { engine, startEngineTick } from "./engine.js";

const PORT = Number(process.env.SIMULATION_PORT ?? 8084);
const PLATFORM_ID = process.env.PLATFORM_ID ?? "unknown";

export const app = express();
app.use(express.json());

app.get("/v1/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "simulation", platform_id: PLATFORM_ID });
});

app.post('/v1/simulation/tick', async (req, res) => {
  await engine.tick();
  res.json({ ok: true, message: 'Tick triggered manually' });
});

if (process.env.NODE_ENV !== "test") {
  startOutboxWorker(5000); // Start polling outbox every 5s
  startEngineTick(15000); // Start engine tick every 15s

  const server = app.listen(PORT, () => {
    console.log(JSON.stringify({ service: "simulation", port: PORT, platform_id: PLATFORM_ID }));
  });

  process.on("SIGTERM", () => server.close());
  process.on("SIGINT", () => server.close());
}
