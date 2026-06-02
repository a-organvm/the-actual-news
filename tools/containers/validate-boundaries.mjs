import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`[OK] ${message}`);
}

function requireMatch(label, text, pattern, message) {
  if (!pattern.test(text)) fail(`${label}: ${message}`);
}

function forbidMatch(label, text, pattern, message) {
  if (pattern.test(text)) fail(`${label}: ${message}`);
}

const dockerignore = read(".dockerignore");
const publicDockerfile = read("apps/public-web/Dockerfile");
const serviceDockerfile = read("services/Dockerfile");
const publicCompose = read("infra/docker-compose.public.yml");
const internalCompose = read("infra/docker-compose.internal.yml");
const nextConfig = read("apps/public-web/next.config.js");

requireMatch(".dockerignore", dockerignore, /^\.env$/m, "must exclude .env");
requireMatch(".dockerignore", dockerignore, /^\.env\.\*$/m, "must exclude .env.*");
requireMatch(".dockerignore", dockerignore, /^!\.env\.public\.example$/m, "must allow the public example env");
requireMatch(".dockerignore", dockerignore, /^!\.env\.internal\.example$/m, "must allow the internal example env");
requireMatch(".dockerignore", dockerignore, /^data$/m, "must exclude generated local runtime state");
requireMatch(".dockerignore", dockerignore, /^postgres-data$/m, "must exclude local database volumes");

forbidMatch("public Dockerfile", publicDockerfile, /COPY\s+.*\.env/i, "must not copy env files");
requireMatch("public Dockerfile", publicDockerfile, /USER\s+nextjs/, "should run as non-root nextjs user");
requireMatch("public Dockerfile", publicDockerfile, /CMD\s+\["node",\s*"apps\/public-web\/server\.js"\]/, "should start the standalone server");
requireMatch("public Next config", nextConfig, /output:\s*"standalone"/, "must produce standalone output for optional container packaging");

requireMatch("service Dockerfile", serviceDockerfile, /ARG\s+SERVICE_DIR/, "must be parameterized by SERVICE_DIR");
requireMatch("service Dockerfile", serviceDockerfile, /ARG\s+SERVICE_NAME/, "must be parameterized by SERVICE_NAME");
requireMatch("service Dockerfile", serviceDockerfile, /USER\s+service/, "should run as non-root service user");
requireMatch("service Dockerfile", serviceDockerfile, /dist\/server\.js/, "should start built service output");

requireMatch("public compose", publicCompose, /dockerfile:\s+apps\/public-web\/Dockerfile/, "must use the public web Dockerfile");
requireMatch("public compose", publicCompose, /env_file:\s*\n\s+- \.\.\/\.env\.public\.example/, "must use .env.public.example");
requireMatch("public compose", publicCompose, /NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE:\s+"false"/, "must disable the verifier workspace");
requireMatch("public compose", publicCompose, /\/api\/healthz/, "must health-check the public health endpoint");
forbidMatch("public compose", publicCompose, /\.env\.internal/, "must not reference internal env files");
forbidMatch("public compose", publicCompose, /POSTGRES_|PASSWORD|SECRET|TOKEN|ACCESS_KEY|API_KEY/, "must not include secret-bearing env names");

requireMatch("internal compose", internalCompose, /env_file:\s*\n\s+- \.\.\/\.env\.internal\.example/, "must use .env.internal.example");
requireMatch("internal compose", internalCompose, /POSTGRES_PASSWORD/, "must configure Postgres password internally");
requireMatch("internal compose", internalCompose, /POSTGRES_URI/, "must configure gateway database URI internally");
forbidMatch("internal compose", internalCompose, /NEXT_PUBLIC_/, "must not set browser-visible env keys");

for (const service of ["gateway", "story", "claim", "evidence", "verify"]) {
  const serviceBlock = new RegExp(`${service}:[\\s\\S]*?ports:[\\s\\S]*?- "127\\.0\\.0\\.1:\\$\\{`, "m");
  requireMatch("internal compose", internalCompose, serviceBlock, `${service} should bind localhost by default`);
}

if (!process.exitCode) {
  ok("Optional container files preserve the public/internal packaging boundary.");
}
