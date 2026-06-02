import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);

const steps = [
  {
    label: "Public/internal env boundary",
    command: "pnpm",
    args: ["env:check"]
  },
  {
    label: "Public web source boundary",
    command: "pnpm",
    args: ["public-source:check"]
  },
  {
    label: "Optional container boundary audit",
    command: "pnpm",
    args: ["container:check"]
  },
  {
    label: "Workspace typecheck",
    command: "pnpm",
    args: ["-r", "typecheck"]
  },
  {
    label: "Service tests without Postgres",
    command: "pnpm",
    args: ["test:services"]
  },
  {
    label: "Standalone public app smoke",
    command: "pnpm",
    args: ["launch:smoke"]
  },
  {
    label: "Conversion redirect boundary smoke",
    command: "pnpm",
    args: ["launch:conversions"]
  },
  {
    label: "Public launch readiness report",
    command: "pnpm",
    args: ["launch:check"]
  },
  {
    label: "Write public launch handoff",
    command: "pnpm",
    args: ["launch:report"]
  }
];

function runStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n[launch-local] ${step.label}`);
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      env: process.env
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.command} ${step.args.join(" ")} exited with ${code}`));
    });
  });
}

for (const step of steps) {
  await runStep(step);
}

console.log("\n[launch-local] Required no-Docker launch gates passed.");
console.log("[launch-local] Strict public launch still requires real provider/API URLs.");
console.log("[launch-local] DB-backed conformance still requires POSTGRES_URI.");
