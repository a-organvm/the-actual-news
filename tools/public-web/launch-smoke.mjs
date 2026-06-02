import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const serverPath = path.join(root, "apps/public-web/.next/standalone/apps/public-web/server.js");
const port = process.env.PUBLIC_WEB_PORT ?? "3100";
const baseUrl = `http://127.0.0.1:${port}`;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: options.stdio ?? "inherit",
      env: { ...process.env, ...(options.env ?? {}) }
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function waitForPort(host, targetPort, timeoutMs = 30000) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    function attempt() {
      const socket = net.createConnection({ host, port: Number(targetPort) });
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${targetPort}`));
          return;
        }
        setTimeout(attempt, 250);
      });
    }

    attempt();
  });
}

console.log("[launch-smoke] Building public-web production artifact...");
await run("pnpm", ["--filter", "public-web", "build"]);

console.log(`[launch-smoke] Starting standalone server on ${baseUrl}...`);
const server = spawn("node", [serverPath], {
  cwd: root,
  stdio: ["ignore", "inherit", "inherit"],
  env: {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    PORT: port,
    NEXT_PUBLIC_PUBLIC_API_URI: process.env.NEXT_PUBLIC_PUBLIC_API_URI ?? baseUrl,
    NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE: process.env.NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE ?? "false"
  }
});

let serverExited = false;
let shuttingDown = false;
server.once("exit", (code) => {
  serverExited = true;
  if (!shuttingDown && code !== 0) {
    console.error(`[launch-smoke] Standalone server exited early with ${code}.`);
  }
});

try {
  await waitForPort("127.0.0.1", port);
  if (serverExited) {
    throw new Error("Standalone server exited before smoke checks could run.");
  }
  console.log("[launch-smoke] Running public route smoke checks...");
  await run("node", ["tools/public-web/smoke.mjs"], {
    env: { PUBLIC_WEB_BASE_URL: baseUrl }
  });
  console.log("[launch-smoke] Public standalone smoke checks passed.");
} finally {
  if (!serverExited) {
    shuttingDown = true;
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
}
