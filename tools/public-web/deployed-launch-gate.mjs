import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const envFile = process.env.PUBLIC_ENV_FILE ?? path.join(root, ".env.public.example");
const baseUrl = process.env.PUBLIC_WEB_BASE_URL ?? "";

function fail(message) {
  console.error(`[launch-deployed] ${message}`);
  process.exit(1);
}

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return new Map();

  const values = new Map();
  const text = fs.readFileSync(filePath, "utf8");

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values.set(key, value);
  }

  return values;
}

function placeholderHost(hostname) {
  return (
    hostname === "example.com" ||
    hostname === "example.org" ||
    hostname === "example.net" ||
    hostname.endsWith(".example") ||
    hostname.includes("your-") ||
    hostname.includes("todo")
  );
}

function publicHttpsOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !placeholderHost(url.hostname) && !["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function runStep(label, command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    console.log(`\n[launch-deployed] ${label}`);
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      env
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

if (!publicHttpsOrigin(baseUrl)) {
  fail("Set PUBLIC_WEB_BASE_URL to the deployed public https origin, for example https://theactual.news.");
}

const envValues = parseEnv(envFile);
const canonicalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? envValues.get("NEXT_PUBLIC_SITE_URL") ?? "";

if (!publicHttpsOrigin(canonicalSiteUrl)) {
  fail(`Set NEXT_PUBLIC_SITE_URL in ${path.relative(root, envFile)} to the deployed public https origin.`);
}

if (new URL(canonicalSiteUrl).origin !== new URL(baseUrl).origin) {
  fail(`PUBLIC_WEB_BASE_URL (${new URL(baseUrl).origin}) must match NEXT_PUBLIC_SITE_URL (${new URL(canonicalSiteUrl).origin}).`);
}

const stepEnv = {
  ...process.env,
  PUBLIC_ENV_FILE: envFile,
  PUBLIC_WEB_BASE_URL: new URL(baseUrl).origin,
  PUBLIC_CONVERSIONS_EXPECT_CONFIGURED: "true"
};

try {
  await runStep("Strict public env readiness", "pnpm", ["launch:check:strict"], stepEnv);
  await runStep("Deployed public route smoke", "pnpm", ["smoke:public"], stepEnv);
} catch (error) {
  fail(error?.message ?? String(error));
}

console.log("\n[launch-deployed] Deployed public launch gate passed.");
