#!/usr/bin/env node
// ─── sync-assets-to-r2.mjs ──────────────────────────────────────────────────
// Phase B of Asset Delivery (per docs/ASSET_DELIVERY_SCOPING_BRIEF-20260521-114500.md
// and docs/PHASEA_RUN_REPORT-20260521-181906.md).
//
// Reads MV's mediavault.sqlite directly (per brief §3.2; operator-run, not
// build-time). For each delivery-scope artifact (released + local_asset_path
// set + media_type filter — see SCOPE_FILTER), uploads primary asset to R2
// at a content-addressed path, generates a 400x400 JPEG q85 thumbnail with
// sharp, uploads thumbnail to its own content-addressed path, records both
// URLs in tools/sync-assets-to-r2-manifest.json.
//
// Phase B Option A scope narrowing (per session 2026-05-21): only
// media_type='photo' artifacts sync this phase. The 15 media_type='mixed'
// audio artifacts are deferred to a follow-on scoping brief that addresses
// audio storage, thumbnail strategy, and render layer together. See Phase B
// run report §2 for the scope reversal record.
//
// Usage:
//   node tools/sync-assets-to-r2.mjs [flags]
//   --dry-run        compute hashes + paths; print plan; do not upload, do not write manifest
//   --limit N        process only the first N artifacts (after deterministic order by id)
//   --verbose        per-artifact log lines (hash, size, R2 path, action)
//   --help           show usage and exit
//
// Exits 0 on success; non-zero on any error. Idempotent: re-running is safe;
// objects already at the content-addressed path are skipped via HeadObject.

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import Database from "better-sqlite3";
import sharp from "sharp";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const MV_DB_PATH = "C:/AI/Platform/MediaVault/core/mediavault.sqlite";
const MANIFEST_PATH = resolve(REPO_ROOT, "tools/sync-assets-to-r2-manifest.json");
const ENV_PATH = resolve(REPO_ROOT, ".env");

const REQUIRED_ENV_KEYS = [
  "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET", "R2_PUBLIC_URL", "R2_S3_ENDPOINT",
];

// Phase B Option A scope filter — see header comment.
const SCOPE_SQL = `
  SELECT id, media_type, storage_mode, local_asset_path
  FROM artifacts
  WHERE status = 'released'
    AND local_asset_path IS NOT NULL
    AND local_asset_path <> ''
    AND media_type = 'photo'
  ORDER BY id
`;

const MIME_BY_EXT = {
  ".heic": "image/heic",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const CACHE_CONTROL = "public, max-age=31536000, immutable";

// ─── argv ───────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const FLAGS = {
  dryRun: argv.includes("--dry-run"),
  verbose: argv.includes("--verbose"),
  help: argv.includes("--help") || argv.includes("-h"),
  limit: (() => {
    const i = argv.indexOf("--limit");
    if (i === -1) return null;
    const n = parseInt(argv[i + 1], 10);
    if (!Number.isFinite(n) || n < 1) fail(`--limit requires a positive integer; got ${argv[i + 1]}`);
    return n;
  })(),
};

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function showHelp() {
  console.log(`Usage: node tools/sync-assets-to-r2.mjs [flags]

  --dry-run        compute hashes + R2 paths; print plan; do not upload, do not write manifest
  --limit N        process only the first N artifacts (deterministic order by id)
  --verbose        per-artifact log lines
  --help, -h       show this message`);
  process.exit(0);
}

if (FLAGS.help) showHelp();

// ─── env loading ────────────────────────────────────────────────────────────
if (!existsSync(ENV_PATH)) fail(`.env not found at ${ENV_PATH}`);
dotenv.config({ path: ENV_PATH });

for (const k of REQUIRED_ENV_KEYS) {
  if (!process.env[k] || process.env[k].length === 0) {
    fail(`required env var ${k} is missing or empty in ${ENV_PATH}`);
  }
}

// Sanity: lengths only (never log values), matching Phase A §3.5 baseline.
if (FLAGS.verbose) {
  for (const k of REQUIRED_ENV_KEYS) {
    console.log(`  ${k} length=${process.env[k].length}`);
  }
}

const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
const R2_S3_ENDPOINT = process.env.R2_S3_ENDPOINT;

// ─── R2 client ──────────────────────────────────────────────────────────────
const s3 = new S3Client({
  region: "auto",
  endpoint: R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ─── helpers ────────────────────────────────────────────────────────────────
async function sha256OfFile(path) {
  const buf = await readFile(path);
  return { hash: createHash("sha256").update(buf).digest("hex"), bytes: buf };
}

function sha256OfBuffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function primaryKey(hash, ext) {
  return `assets/${hash.slice(0, 2)}/${hash}${ext.toLowerCase()}`;
}

function thumbnailKey(thumbHash) {
  return `thumbnails/${thumbHash.slice(0, 2)}/${thumbHash}.jpg`;
}

function publicUrl(key) {
  return `${R2_PUBLIC_URL}/${key}`;
}

async function r2ObjectExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch (e) {
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) return false;
    throw e;
  }
}

async function r2Put(key, body, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: CACHE_CONTROL,
  }));
}

async function generateThumbnail(sourceBuf, sourceExt, artifactId) {
  // Per brief §3.3: 400x400 JPEG q85.
  try {
    const out = await sharp(sourceBuf)
      .rotate() // honor EXIF orientation
      .resize(400, 400, { fit: "cover", position: "centre" })
      .jpeg({ quality: 85 })
      .toBuffer();
    return { buf: out, error: null };
  } catch (e) {
    return { buf: null, error: `${e.name}: ${e.message}` };
  }
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return {
      version: 1,
      generated_at: null,
      artifacts: {},
    };
  }
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  } catch (e) {
    fail(`could not parse existing manifest at ${MANIFEST_PATH}: ${e.message}`);
  }
}

function saveManifest(m) {
  m.generated_at = new Date().toISOString();
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2) + "\n", "utf8");
}

// ─── main ───────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log(`sync-assets-to-r2.mjs starting`);
  console.log(`  mode: ${FLAGS.dryRun ? "DRY-RUN (no uploads, no manifest write)" : "REAL SYNC"}`);
  if (FLAGS.limit) console.log(`  limit: first ${FLAGS.limit} artifacts`);
  console.log(`  bucket: ${R2_BUCKET}`);
  console.log(`  public URL base: ${R2_PUBLIC_URL}`);
  console.log(``);

  // 1. Read scope from MV.
  const db = new Database(MV_DB_PATH, { readonly: true, fileMustExist: true });
  let rows = db.prepare(SCOPE_SQL).all();
  db.close();
  if (FLAGS.limit) rows = rows.slice(0, FLAGS.limit);
  console.log(`scope: ${rows.length} artifact(s) match filter`);

  if (rows.length === 0) {
    console.log(`nothing to do`);
    process.exit(0);
  }

  // 2. Load existing manifest.
  const manifest = loadManifest();

  // 3. Per-artifact processing.
  const stats = {
    processed: 0,
    primary_uploaded: 0,
    primary_skipped: 0,
    thumb_uploaded: 0,
    thumb_skipped: 0,
    thumb_failed: 0,
    bytes_uploaded: 0,
    errors: [],
  };

  for (const row of rows) {
    const id = row.id;
    const localPath = row.local_asset_path;
    const ext = extname(localPath);
    const mime = MIME_BY_EXT[ext.toLowerCase()] || "application/octet-stream";

    if (!existsSync(localPath)) {
      stats.errors.push({ id, error: `local file missing: ${localPath}` });
      console.log(`  ${id}  ERROR  local file missing: ${localPath}`);
      continue;
    }

    const stat = statSync(localPath);
    const { hash, bytes } = await sha256OfFile(localPath);
    const pKey = primaryKey(hash, ext);
    const pUrl = publicUrl(pKey);

    if (FLAGS.verbose) {
      console.log(`  ${id}`);
      console.log(`    local: ${localPath}`);
      console.log(`    size:  ${stat.size}`);
      console.log(`    sha256: ${hash}`);
      console.log(`    primary key: ${pKey}`);
      console.log(`    primary url: ${pUrl}`);
    }

    // Primary upload (or skip if present).
    let primaryAction;
    if (FLAGS.dryRun) {
      primaryAction = "dry-run";
    } else {
      const exists = await r2ObjectExists(pKey);
      if (exists) {
        primaryAction = "skip-already-present";
        stats.primary_skipped++;
      } else {
        await r2Put(pKey, bytes, mime);
        primaryAction = "uploaded";
        stats.primary_uploaded++;
        stats.bytes_uploaded += bytes.length;
      }
    }

    // Thumbnail.
    let tUrl = null;
    let thumbAction = "n/a";
    const { buf: thumbBuf, error: thumbErr } = await generateThumbnail(bytes, ext, id);
    if (thumbErr) {
      thumbAction = `failed-generate (${thumbErr})`;
      stats.thumb_failed++;
      stats.errors.push({ id, error: `thumbnail generation: ${thumbErr}` });
    } else {
      const tHash = sha256OfBuffer(thumbBuf);
      const tKey = thumbnailKey(tHash);
      tUrl = publicUrl(tKey);
      if (FLAGS.verbose) {
        console.log(`    thumb key: ${tKey}`);
        console.log(`    thumb url: ${tUrl}`);
        console.log(`    thumb size: ${thumbBuf.length}`);
      }
      if (FLAGS.dryRun) {
        thumbAction = "dry-run";
      } else {
        const exists = await r2ObjectExists(tKey);
        if (exists) {
          thumbAction = "skip-already-present";
          stats.thumb_skipped++;
        } else {
          await r2Put(tKey, thumbBuf, "image/jpeg");
          thumbAction = "uploaded";
          stats.thumb_uploaded++;
          stats.bytes_uploaded += thumbBuf.length;
        }
      }
    }

    // Manifest update (in-memory; written at end unless dry-run).
    manifest.artifacts[id] = {
      primary_url: pUrl,
      primary_sha256: hash,
      primary_bytes: stat.size,
      thumbnail_url: tUrl,
      thumbnail_sha256: thumbBuf ? sha256OfBuffer(thumbBuf) : null,
      last_synced_at: new Date().toISOString(),
    };

    stats.processed++;
    console.log(`  ${id}  primary=${primaryAction}  thumbnail=${thumbAction}`);
  }

  // 4. Save manifest (unless dry-run).
  if (!FLAGS.dryRun) {
    saveManifest(manifest);
    console.log(`\nmanifest written: ${MANIFEST_PATH}`);
  } else {
    console.log(`\n(dry-run: manifest NOT written)`);
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

  console.log(`\nsummary:`);
  console.log(`  processed:         ${stats.processed}`);
  console.log(`  primary uploaded:  ${stats.primary_uploaded}`);
  console.log(`  primary skipped:   ${stats.primary_skipped}`);
  console.log(`  thumb uploaded:    ${stats.thumb_uploaded}`);
  console.log(`  thumb skipped:     ${stats.thumb_skipped}`);
  console.log(`  thumb failed:      ${stats.thumb_failed}`);
  console.log(`  bytes uploaded:    ${stats.bytes_uploaded}`);
  console.log(`  elapsed:           ${elapsed}s`);

  if (stats.errors.length) {
    console.log(`\nerrors (${stats.errors.length}):`);
    for (const e of stats.errors) console.log(`  ${e.id}  ${e.error}`);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error(`FATAL: ${e.stack || e.message || e}`);
  process.exit(1);
});
