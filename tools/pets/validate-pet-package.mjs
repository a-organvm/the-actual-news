import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const REQUIRED_TOP_LEVEL = [
  "schema_version",
  "pet_id",
  "name",
  "version",
  "description",
  "author",
  "license",
  "id",
  "displayName",
  "spritesheetPath",
  "assets",
  "animations",
  "supported_states",
  "state_protocol",
  "compatibility",
  "provenance",
  "checksums",
  "preview",
  "capabilities"
];

const ALLOWED_TOP_LEVEL = new Set(REQUIRED_TOP_LEVEL);

const REQUIRED_WORKFLOW_STATES = [
  "idle",
  "active",
  "waiting",
  "blocked",
  "complete",
  "error",
  "unknown",
  "stale"
];

const FORBIDDEN_KEYS = new Set([
  "api_key",
  "apikey",
  "authorization",
  "familiarity",
  "mood_profile",
  "password",
  "project_affinity",
  "prompt_history",
  "rhythm_memory",
  "secret",
  "token",
  "user_context",
  "user_history",
  "user_style"
]);

const FORBIDDEN_CAPABILITY_KEYS = new Set([
  "context",
  "eventbus",
  "fetch",
  "hook",
  "memory",
  "network",
  "script"
]);

function usage() {
  return [
    "Usage: node tools/pets/validate-pet-package.mjs <package-dir> [--json] [--output <file>]",
    "",
    "Validates a Level 1 passive Codex pet package manifest, assets, hashes, and atlas dimensions."
  ].join("\n");
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let packageDir = null;
  let json = false;
  let output = null;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--json") {
      json = true;
    } else if (arg === "--output") {
      output = args[i + 1] ?? null;
      i += 1;
    } else if (!packageDir) {
      packageDir = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (!packageDir) throw new Error(usage());
  if (output === "") throw new Error("Missing output file after --output");

  return {
    packageDir: path.resolve(packageDir),
    json,
    output: output ? path.resolve(output) : null
  };
}

function readJson(file, errors) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    errors.push(`Invalid JSON at ${file}: ${String(err?.message ?? err)}`);
    return null;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(obj, key, errors, at = key) {
  if (typeof obj?.[key] !== "string" || obj[key].trim() === "") {
    errors.push(`${at} must be a non-empty string`);
    return null;
  }
  return obj[key];
}

function requireArray(obj, key, errors, at = key) {
  if (!Array.isArray(obj?.[key])) {
    errors.push(`${at} must be an array`);
    return [];
  }
  return obj[key];
}

function requireObject(obj, key, errors, at = key) {
  if (!isObject(obj?.[key])) {
    errors.push(`${at} must be an object`);
    return {};
  }
  return obj[key];
}

function uniqueItems(items) {
  return new Set(items).size === items.length;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readUInt24LE(buf, offset) {
  return buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16);
}

function readWebpDimensions(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("not a RIFF WEBP file");
  }

  let offset = 12;
  while (offset + 8 <= buf.length) {
    const type = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (data + size > buf.length) throw new Error(`invalid WEBP chunk size for ${type}`);

    if (type === "VP8X") {
      if (size < 10) throw new Error("invalid VP8X chunk");
      return {
        width: readUInt24LE(buf, data + 4) + 1,
        height: readUInt24LE(buf, data + 7) + 1
      };
    }

    if (type === "VP8 ") {
      if (size < 10) throw new Error("invalid VP8 chunk");
      if (buf[data + 3] !== 0x9d || buf[data + 4] !== 0x01 || buf[data + 5] !== 0x2a) {
        throw new Error("invalid VP8 frame signature");
      }
      return {
        width: buf.readUInt16LE(data + 6) & 0x3fff,
        height: buf.readUInt16LE(data + 8) & 0x3fff
      };
    }

    if (type === "VP8L") {
      if (size < 5 || buf[data] !== 0x2f) throw new Error("invalid VP8L chunk");
      const bits = buf.readUInt32LE(data + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1
      };
    }

    offset = data + size + (size % 2);
  }

  throw new Error("missing WEBP dimension chunk");
}

function collectForbiddenKeys(value, found, pathParts = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectForbiddenKeys(item, found, [...pathParts, String(index)]));
    return;
  }

  if (!isObject(value)) return;

  for (const [key, child] of Object.entries(value)) {
    const normalized = key.toLowerCase().replace(/[-\s]/g, "_");
    if (FORBIDDEN_KEYS.has(normalized) || FORBIDDEN_CAPABILITY_KEYS.has(normalized)) {
      found.push([...pathParts, key].join("."));
    }
    collectForbiddenKeys(child, found, [...pathParts, key]);
  }
}

function validateAsset(packageDir, label, asset, checksums, errors, warnings, files) {
  if (!isObject(asset)) {
    errors.push(`assets.${label} must be an object`);
    return null;
  }

  const relPath = requireString(asset, "path", errors, `assets.${label}.path`);
  requireString(asset, "mime_type", errors, `assets.${label}.mime_type`);
  const declaredHash = requireString(asset, "sha256", errors, `assets.${label}.sha256`);

  if (!relPath) return null;
  if (path.isAbsolute(relPath) || relPath.includes("..")) {
    errors.push(`assets.${label}.path must be a package-relative path without '..'`);
    return null;
  }

  const file = path.join(packageDir, relPath);
  if (!fs.existsSync(file)) {
    errors.push(`Missing asset file: ${relPath}`);
    return null;
  }

  const actualHash = sha256(file);
  files.push({ label, path: relPath, sha256: actualHash });

  if (declaredHash && declaredHash !== actualHash) {
    errors.push(`assets.${label}.sha256 mismatch for ${relPath}: expected ${declaredHash}, got ${actualHash}`);
  }

  const checksumHash = checksums?.sha256?.[relPath];
  if (!checksumHash) {
    errors.push(`checksums.sha256 missing entry for ${relPath}`);
  } else if (checksumHash !== actualHash) {
    errors.push(`checksums.sha256.${relPath} mismatch: expected ${checksumHash}, got ${actualHash}`);
  }

  if (label === "spritesheet") {
    try {
      const dims = readWebpDimensions(file);
      if (Number(asset.width) !== dims.width) {
        errors.push(`assets.spritesheet.width must match actual WEBP width ${dims.width}`);
      }
      if (Number(asset.height) !== dims.height) {
        errors.push(`assets.spritesheet.height must match actual WEBP height ${dims.height}`);
      }
      const expectedWidth = Number(asset.cell_width) * Number(asset.columns);
      const expectedHeight = Number(asset.cell_height) * Number(asset.rows);
      if (expectedWidth !== dims.width) {
        errors.push(`spritesheet cell_width * columns must equal ${dims.width}`);
      }
      if (expectedHeight !== dims.height) {
        errors.push(`spritesheet cell_height * rows must equal ${dims.height}`);
      }
      return dims;
    } catch (err) {
      errors.push(`Unable to read spritesheet dimensions: ${String(err?.message ?? err)}`);
    }
  }

  if (label === "validation") {
    const validation = readJson(file, errors);
    if (validation && validation.ok !== true) {
      errors.push("assets.validation points to a validation report whose ok field is not true");
    }
  }

  if (label === "preview" && asset.mime_type !== "image/png") {
    warnings.push("preview asset is not image/png");
  }

  return null;
}

function validateManifest(packageDir, manifest, errors, warnings) {
  for (const key of REQUIRED_TOP_LEVEL) {
    if (!(key in manifest)) errors.push(`Missing required top-level field: ${key}`);
  }

  for (const key of Object.keys(manifest)) {
    if (!ALLOWED_TOP_LEVEL.has(key) && !key.startsWith("x-")) {
      errors.push(`Unknown top-level field: ${key}`);
    }
  }

  if (manifest.schema_version !== "1.0.0") {
    errors.push("schema_version must be 1.0.0");
  }

  requireString(manifest, "pet_id", errors);
  requireString(manifest, "name", errors);
  requireString(manifest, "version", errors);
  requireString(manifest, "description", errors);
  requireString(manifest, "author", errors);
  requireString(manifest, "license", errors);
  requireString(manifest, "id", errors);
  requireString(manifest, "displayName", errors);
  requireString(manifest, "spritesheetPath", errors);

  if (manifest.id && manifest.pet_id && manifest.id !== manifest.pet_id) {
    errors.push("legacy id must match pet_id");
  }
  if (manifest.displayName && manifest.name && manifest.displayName !== manifest.name) {
    errors.push("legacy displayName must match name");
  }

  const assets = requireObject(manifest, "assets", errors);
  const checksums = requireObject(manifest, "checksums", errors);
  const checksumMap = requireObject(checksums, "sha256", errors, "checksums.sha256");
  const files = [];

  for (const key of ["spritesheet", "preview", "validation"]) {
    validateAsset(packageDir, key, assets[key], { sha256: checksumMap }, errors, warnings, files);
  }

  if (assets?.spritesheet?.path && manifest.spritesheetPath && assets.spritesheet.path !== manifest.spritesheetPath) {
    errors.push("legacy spritesheetPath must match assets.spritesheet.path");
  }

  const animations = requireArray(manifest, "animations", errors);
  const animationIds = [];
  for (const [index, animation] of animations.entries()) {
    if (!isObject(animation)) {
      errors.push(`animations.${index} must be an object`);
      continue;
    }
    const id = requireString(animation, "id", errors, `animations.${index}.id`);
    animationIds.push(id);
    if (!Number.isInteger(animation.row) || animation.row < 0) {
      errors.push(`animations.${index}.row must be a non-negative integer`);
    }
    if (!Number.isInteger(animation.frame_count) || animation.frame_count < 1) {
      errors.push(`animations.${index}.frame_count must be a positive integer`);
    }
    if (isObject(assets.spritesheet) && Number.isInteger(assets.spritesheet.rows) && animation.row >= assets.spritesheet.rows) {
      errors.push(`animations.${index}.row exceeds spritesheet row count`);
    }
  }

  if (!uniqueItems(animationIds.filter(Boolean))) {
    errors.push("animations ids must be unique");
  }

  const supportedStates = requireArray(manifest, "supported_states", errors);
  if (!uniqueItems(supportedStates)) {
    errors.push("supported_states must be unique");
  }

  const stateProtocol = requireObject(manifest, "state_protocol", errors);
  requireString(stateProtocol, "version", errors, "state_protocol.version");
  requireString(stateProtocol, "authoritative_source", errors, "state_protocol.authoritative_source");
  const protocolStates = requireArray(stateProtocol, "states", errors, "state_protocol.states");
  const stateToAnimation = requireObject(stateProtocol, "state_to_animation", errors, "state_protocol.state_to_animation");

  for (const requiredState of REQUIRED_WORKFLOW_STATES) {
    if (!supportedStates.includes(requiredState)) errors.push(`supported_states missing ${requiredState}`);
    if (!protocolStates.includes(requiredState)) errors.push(`state_protocol.states missing ${requiredState}`);
    if (!stateToAnimation[requiredState]) errors.push(`state_protocol.state_to_animation missing ${requiredState}`);
  }

  for (const [state, animationId] of Object.entries(stateToAnimation)) {
    if (!protocolStates.includes(state)) {
      errors.push(`state_protocol.state_to_animation includes undeclared state ${state}`);
    }
    if (!animationIds.includes(animationId)) {
      errors.push(`state_protocol.state_to_animation.${state} references unknown animation ${animationId}`);
    }
  }

  const compatibility = requireObject(manifest, "compatibility", errors);
  requireString(compatibility, "pet_runtime", errors, "compatibility.pet_runtime");
  requireString(compatibility, "codex_app", errors, "compatibility.codex_app");

  const provenance = requireObject(manifest, "provenance", errors);
  requireString(provenance, "created_at", errors, "provenance.created_at");
  requireString(provenance, "source_run", errors, "provenance.source_run");
  requireString(provenance, "method", errors, "provenance.method");

  const preview = requireObject(manifest, "preview", errors);
  requireString(preview, "path", errors, "preview.path");
  requireString(preview, "description", errors, "preview.description");
  if (preview.path && assets?.preview?.path && preview.path !== assets.preview.path) {
    errors.push("preview.path must match assets.preview.path");
  }

  const capabilities = requireArray(manifest, "capabilities", errors);
  if (capabilities.length !== 0) {
    errors.push("capabilities must be empty for Level 1 passive pet packages");
  }

  const forbidden = [];
  collectForbiddenKeys(manifest, forbidden);
  if (forbidden.length > 0) {
    errors.push(`Forbidden privacy/capability fields present: ${forbidden.join(", ")}`);
  }

  return { files };
}

function validatePackage(packageDir) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(packageDir)) {
    errors.push(`Package directory does not exist: ${packageDir}`);
    return { ok: false, package_dir: packageDir, errors, warnings, files: [] };
  }

  const manifestPath = path.join(packageDir, "pet.json");
  if (!fs.existsSync(manifestPath)) {
    errors.push("Missing pet.json");
    return { ok: false, package_dir: packageDir, errors, warnings, files: [] };
  }

  const manifest = readJson(manifestPath, errors);
  if (!manifest) {
    return { ok: false, package_dir: packageDir, errors, warnings, files: [] };
  }

  const result = validateManifest(packageDir, manifest, errors, warnings);
  const manifestHash = sha256(manifestPath);

  return {
    ok: errors.length === 0,
    package_dir: packageDir,
    manifest: {
      path: "pet.json",
      sha256: manifestHash,
      schema_version: manifest.schema_version ?? null,
      pet_id: manifest.pet_id ?? manifest.id ?? null,
      version: manifest.version ?? null
    },
    files: [{ label: "manifest", path: "pet.json", sha256: manifestHash }, ...(result?.files ?? [])],
    errors,
    warnings
  };
}

function printHuman(report) {
  if (report.ok) {
    console.log(`[OK] ${report.manifest?.pet_id ?? "pet"} ${report.manifest?.version ?? ""}`.trim());
  } else {
    console.error(`[FAIL] ${report.manifest?.pet_id ?? "pet package"}`);
  }

  for (const file of report.files ?? []) {
    console.log(`${file.sha256}  ${file.path}`);
  }

  for (const warning of report.warnings ?? []) {
    console.warn(`[WARN] ${warning}`);
  }

  for (const error of report.errors ?? []) {
    console.error(`[ERROR] ${error}`);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const report = validatePackage(args.packageDir);

  if (args.output) {
    fs.mkdirSync(path.dirname(args.output), { recursive: true });
    fs.writeFileSync(args.output, `${JSON.stringify(report, null, 2)}\n`);
  }

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHuman(report);
  }

  if (!report.ok) process.exit(1);
}

main().catch((err) => {
  console.error(String(err?.message ?? err));
  process.exit(2);
});
