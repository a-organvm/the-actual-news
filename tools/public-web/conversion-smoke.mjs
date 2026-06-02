import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const serverPath = path.join(root, "apps/public-web/.next/standalone/apps/public-web/server.js");
const siteUrl = "https://theactual.news";

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

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function waitForHttp(baseUrl, pathName, timeoutMs = 30000) {
  const started = Date.now();
  let lastStatus = "no response";

  while (Date.now() - started <= timeoutMs) {
    try {
      const response = await fetch(new URL(pathName, baseUrl));
      lastStatus = String(response.status);
      if (response.ok) return;
    } catch (error) {
      lastStatus = error?.message ?? String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${pathName} on ${baseUrl}; last status: ${lastStatus}`);
}

async function withServer(env, runChecks) {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn("node", [serverPath], {
    cwd: root,
    stdio: ["ignore", "inherit", "inherit"],
    env: {
      ...process.env,
      ...env,
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NEXT_PUBLIC_PLATFORM_ID: "plf_conversion_smoke",
      NEXT_PUBLIC_SITE_URL: siteUrl,
      NEXT_PUBLIC_PUBLIC_API_URI: baseUrl,
      NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE: "false"
    }
  });

  let serverExited = false;
  let shuttingDown = false;
  server.once("exit", (code) => {
    serverExited = true;
    if (!shuttingDown && code !== 0) {
      console.error(`[conversion-smoke] Server exited early with ${code}.`);
    }
  });

  try {
    await waitForPort("127.0.0.1", port);
    if (serverExited) throw new Error("Standalone server exited before checks could run.");
    await waitForHttp(baseUrl, "/api/healthz");
    await runChecks(baseUrl);
  } finally {
    if (!serverExited) {
      shuttingDown = true;
      server.kill("SIGTERM");
      await new Promise((resolve) => server.once("exit", resolve));
    }
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(baseUrl, pathName) {
  const response = await fetch(new URL(pathName, baseUrl));
  assert(response.ok, `${pathName} expected 2xx, got ${response.status}`);
  return response.json();
}

async function redirectLocation(baseUrl, pathName) {
  const response = await fetch(new URL(pathName, baseUrl), { redirect: "manual" });
  assert(response.status >= 300 && response.status < 400, `${pathName} expected redirect, got ${response.status}`);
  const location = response.headers.get("location") ?? "";
  assert(location, `${pathName} redirect missing location header`);
  return location;
}

function readinessByLabel(manifest, label) {
  return manifest.readiness.checks.find((check) => check.label === label)?.ready;
}

console.log("[conversion-smoke] Building public-web production artifact...");
await run("pnpm", ["--filter", "public-web", "build"]);

console.log("[conversion-smoke] Checking same-origin fallback URLs remain pending...");
await withServer(
  {
    NEXT_PUBLIC_NEWSLETTER_URL: `${siteUrl}/briefing`,
    NEXT_PUBLIC_MEMBERSHIP_URL: `${siteUrl}/go/membership`,
    NEXT_PUBLIC_SPONSOR_URL: `${siteUrl}/v1/feed`
  },
  async (baseUrl) => {
    const health = await json(baseUrl, "/api/healthz");
    assert(health.conversion_paths.newsletter_configured === false, "newsletter should be pending");
    assert(health.conversion_paths.membership_configured === false, "membership should be pending");
    assert(health.conversion_paths.sponsor_configured === false, "sponsor should be pending");

    const manifest = await json(baseUrl, "/launch.json");
    assert(readinessByLabel(manifest, "Newsletter capture") === false, "newsletter readiness should be false");
    assert(readinessByLabel(manifest, "Membership checkout") === false, "membership readiness should be false");
    assert(readinessByLabel(manifest, "Sponsor intake") === false, "sponsor readiness should be false");

    const membershipLocation = await redirectLocation(baseUrl, "/go/membership?utm_source=conversion_smoke");
    assert(
      membershipLocation === "/membership?utm_source=conversion_smoke&provider=pending",
      `same-origin membership should fall back locally, got ${membershipLocation}`
    );
  }
);

console.log("[conversion-smoke] Checking hosted provider URLs redirect publicly...");
await withServer(
  {
    NEXT_PUBLIC_NEWSLETTER_URL: "https://briefing.theactual.news/join",
    NEXT_PUBLIC_MEMBERSHIP_URL: "https://members.theactual.news/start",
    NEXT_PUBLIC_SPONSOR_URL: "https://sponsor.theactual.news/intake"
  },
  async (baseUrl) => {
    const health = await json(baseUrl, "/api/healthz");
    assert(health.conversion_paths.newsletter_configured === true, "newsletter should be configured");
    assert(health.conversion_paths.membership_configured === true, "membership should be configured");
    assert(health.conversion_paths.sponsor_configured === true, "sponsor should be configured");

    const manifest = await json(baseUrl, "/launch.json");
    assert(readinessByLabel(manifest, "Newsletter capture") === true, "newsletter readiness should be true");
    assert(readinessByLabel(manifest, "Membership checkout") === true, "membership readiness should be true");
    assert(readinessByLabel(manifest, "Sponsor intake") === true, "sponsor readiness should be true");

    const membershipLocation = await redirectLocation(
      baseUrl,
      "/go/membership?utm_source=conversion_smoke&utm_medium=redirect&utm_campaign=membership"
    );
    const membershipUrl = new URL(membershipLocation);
    assert(membershipUrl.origin === "https://members.theactual.news", `membership origin mismatch: ${membershipLocation}`);
    assert(membershipUrl.pathname === "/start", `membership path mismatch: ${membershipLocation}`);
    assert(membershipUrl.searchParams.get("utm_source") === "conversion_smoke", "membership UTM source missing");
    assert(membershipUrl.searchParams.get("utm_medium") === "redirect", "membership UTM medium missing");
    assert(membershipUrl.searchParams.get("utm_campaign") === "membership", "membership UTM campaign missing");
  }
);

console.log("[conversion-smoke] Conversion boundary checks passed.");
