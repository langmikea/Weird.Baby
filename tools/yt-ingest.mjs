#!/usr/bin/env node
/**
 * yt-ingest.mjs — museum-side CLI wrapper for the YouTube ingest pipeline.
 *
 * Validates --album, --track, and --type against the museum's SPINE in
 * src/data/artists/hunter-root.js, then shells out to the Python capture
 * script in Hunter Root\tools\yt_archive_capture.py for the actual fetch
 * + register work.
 *
 * Why this split: the museum repo is the canonical home for the album/
 * track/variant taxonomy, so the validation that catches "album doesn't
 * exist" or "track title is misspelled" needs to read SPINE. The capture
 * itself (HTTP, transcript, MV API calls, file I/O) is plain Python and
 * lives next to Hunter Root's archive tree.
 *
 * USAGE
 *   node tools/yt-ingest.mjs --album <id> --track "<title>" --type <variant> \
 *                            --url <youtube-watch-url> [--credit "Name"] \
 *                            [--page-save] [--mv-base http://localhost:51822] \
 *                            [--dry-run]
 *
 * VALIDATION
 *   --album   must be an id in SPINE (e.g. cracked, wheel, dandelions, ...)
 *   --track   must match a track title under that album, exactly
 *   --type    must be one of: official, live, lyrics, cover (locked May 2026)
 *   --url     must be a YouTube watch / youtu.be / embed URL with a
 *             recognizable video id
 *
 *   When --type is "cover", --credit is required (museum convention).
 *
 *   Optional sanity check: warns (does not block) if the URL's video_id
 *   doesn't appear in the track's videos[] in SPINE. New videos getting
 *   ingested before they're added to SPINE is a legitimate flow.
 *
 * SIDE EFFECTS
 *   On success, appends one line to docs/ingest-log.md. The file is
 *   created with a header on first run.
 *
 * EXIT CODES
 *   Inherits from the Python capture script. Adds:
 *     1  museum-side validation failed
 *     2  Python script not found at expected path
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const MUSEUM_ROOT = resolve(__dirname, "..");
const SPINE_PATH = resolve(MUSEUM_ROOT, "src/data/artists/hunter-root.js");
const HR_TOOLS_PYTHON = resolve(
  MUSEUM_ROOT, "..", "..", "Projects", "Hunter Root", "tools",
  "yt_archive_capture.py",
);
const INGEST_LOG_PATH = resolve(MUSEUM_ROOT, "docs", "ingest-log.md");

const ALLOWED_TYPES = new Set(["official", "live", "lyrics", "cover"]);

// ---------------------------------------------------------------------------
// Argument parsing — minimal, no deps
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    album: null,
    albumTitle: null,
    track: null,
    type: null,
    url: null,
    credit: null,
    pageSave: false,
    mvBase: "http://localhost:51822",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--album":       args.album = argv[++i]; break;
      case "--album-title": args.albumTitle = argv[++i]; break;
      case "--track":       args.track = argv[++i]; break;
      case "--type":        args.type = argv[++i]; break;
      case "--url":         args.url = argv[++i]; break;
      case "--credit":      args.credit = argv[++i]; break;
      case "--page-save":   args.pageSave = true; break;
      case "--mv-base":     args.mvBase = argv[++i]; break;
      case "--dry-run":     args.dryRun = true; break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      default:
        die(`unknown flag: ${a}`);
    }
  }
  return args;
}

function printUsage() {
  console.log(`Usage: node tools/yt-ingest.mjs \\
    --album <id> --track "<title>" --type <variant> --url <yt-url> \\
    [--credit "Name"] [--page-save] [--mv-base URL] [--dry-run]

  --album       SPINE album id (cracked, wheel, dandelions, skipping,
                arkansas, crooked)
  --album-title (optional) SPINE album display title. Auto-derived from
                SPINE when omitted. The album: tag slugifies this title
                (album:crooked_home) instead of the id (album:crooked).
  --track       Exact track title from SPINE
  --type        official | live | lyrics | cover
  --url         YouTube watch URL (or youtu.be / embed shape)
  --credit      Required when --type cover
  --page-save   Capture watch-page HTML as a vaulted artifact
  --mv-base     MediaVault base URL (default http://localhost:51822)
  --dry-run     Stage bytes and write manifest, but skip MV API calls
`);
}

function die(msg, code = 1) {
  console.error(`yt-ingest: ${msg}`);
  process.exit(code);
}

// ---------------------------------------------------------------------------
// SPINE parsing — read hunter-root.js as text and pull album+track structure
// ---------------------------------------------------------------------------

/**
 * Parse SPINE without importing it. The file imports JSX (HrExhibitFlow.jsx)
 * so a plain dynamic import would fail in node. We just need the album/track
 * shape, and the file is regularly formatted enough to scan with regexes.
 *
 * Returns: {
 *   <albumId>: {
 *     title: <album title>,
 *     tracks: [
 *       { title, videos: [{ ytId, label, type, credit? }] }, ...
 *     ]
 *   },
 *   ...
 * }
 */
function parseSpine(filePath) {
  if (!existsSync(filePath)) {
    die(`SPINE file not found: ${filePath}`, 1);
  }
  const text = readFileSync(filePath, "utf8");

  // Each album block is bounded by "id: \"...\"" near the top and the closing
  // "    ]," that ends its tracks array, followed by a "  }," at the album
  // brace. Match permissively: capture id, album title, then the inner
  // text up to the tracks-array close.
  const albumRe =
    /\{\s*\n?\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",[\s\S]*?tracks:\s*\[([\s\S]*?)\n\s*\],?\s*\n\s*\},?/g;

  const albums = {};
  let m;
  while ((m = albumRe.exec(text)) !== null) {
    const id = m[1];
    const title = m[2];
    const tracksBlock = m[3];
    const tracks = parseTracksBlock(tracksBlock);
    albums[id] = { title, tracks };
  }
  return albums;
}

/**
 * Inside a tracks: [ ... ] block, each entry is `{ title: "...", videos: [...] }`.
 * Walk through and match each track. Videos use ytId/label/type, not title,
 * so a title-anchored regex naturally finds only track titles.
 */
function parseTracksBlock(block) {
  const tracks = [];
  // Match track openers: { title: "..." (with optional comma/whitespace)
  const trackRe = /\{\s*title:\s*"([^"]+)"\s*,?\s*videos:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = trackRe.exec(block)) !== null) {
    const title = m[1];
    const videosBlock = m[2];
    const videos = [];
    const videoRe =
      /\{\s*ytId:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*,\s*type:\s*"([^"]+)"(?:\s*,\s*credit:\s*"([^"]+)")?\s*\}/g;
    let vm;
    while ((vm = videoRe.exec(videosBlock)) !== null) {
      videos.push({
        ytId: vm[1],
        label: vm[2],
        type: vm[3],
        credit: vm[4] || null,
      });
    }
    tracks.push({ title, videos });
  }
  return tracks;
}

// ---------------------------------------------------------------------------
// URL parsing
// ---------------------------------------------------------------------------

function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("youtu.be")) {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/embed/")[1].split("/")[0];
      }
    }
  } catch {
    return null;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateAgainstSpine(args) {
  if (!args.album) die("--album is required");
  if (!args.track) die("--track is required");
  if (!args.type) die("--type is required");
  if (!args.url) die("--url is required");
  if (!ALLOWED_TYPES.has(args.type)) {
    die(`--type ${JSON.stringify(args.type)} not in {${[...ALLOWED_TYPES].join(", ")}}`);
  }
  if (args.type === "cover" && !args.credit) {
    die("--credit is required when --type is cover");
  }

  const videoId = extractVideoId(args.url);
  if (!videoId) {
    die(`could not extract video id from --url: ${args.url}`);
  }

  const spine = parseSpine(SPINE_PATH);
  const album = spine[args.album];
  if (!album) {
    const known = Object.keys(spine).sort();
    die(
      `--album ${JSON.stringify(args.album)} not found in SPINE.\n` +
      `  Known albums: ${known.join(", ")}`,
    );
  }
  const track = album.tracks.find((t) => t.title === args.track);
  if (!track) {
    const titles = album.tracks.map((t) => t.title);
    die(
      `--track ${JSON.stringify(args.track)} not found under album ` +
      `${JSON.stringify(args.album)}.\n` +
      `  Known tracks (${titles.length}): ${titles.map((t) => JSON.stringify(t)).join(", ")}`,
    );
  }
  // Sanity check: if the track has videos and the URL's video_id isn't one
  // of them, warn but don't block.
  const knownVids = track.videos.map((v) => v.ytId);
  if (knownVids.length > 0 && !knownVids.includes(videoId)) {
    console.error(
      `yt-ingest: warning: video id ${videoId} is not in SPINE under ` +
      `${args.album} / ${JSON.stringify(args.track)}.\n` +
      `  Known: ${knownVids.join(", ")}\n` +
      `  Continuing anyway (this can be a new ingest preceding a SPINE update).`,
    );
  }
  // Sanity: variant type matches one of the SPINE entries for this track
  const knownTypes = new Set(track.videos.map((v) => v.type));
  if (knownTypes.size > 0 && !knownTypes.has(args.type)) {
    console.error(
      `yt-ingest: note: variant type "${args.type}" doesn't match any ` +
      `existing video for this track in SPINE (existing: ${[...knownTypes].join(", ") || "none"}).`,
    );
  }

  return { videoId, album, track };
}

// ---------------------------------------------------------------------------
// Ingest log append
// ---------------------------------------------------------------------------

const INGEST_LOG_HEADER = `# YouTube ingest log

Append-only. Each line records one yt-ingest CLI invocation. Timestamps in UTC.

This file is generated by \`tools/yt-ingest.mjs\`. Don't hand-edit; just append
new runs by running the tool. The wrapper creates the header on first run.

| Timestamp | Album | Track | Type | Video ID | Result |
|---|---|---|---|---|---|
`;

function ensureIngestLog() {
  if (!existsSync(INGEST_LOG_PATH)) {
    mkdirSync(dirname(INGEST_LOG_PATH), { recursive: true });
    writeFileSync(INGEST_LOG_PATH, INGEST_LOG_HEADER, "utf8");
  }
}

function appendIngestLog(args, videoId, exitCode, durationMs) {
  ensureIngestLog();
  const ts = new Date().toISOString();
  const result =
    exitCode === 0
      ? args.dryRun
        ? `dry-run ok (${durationMs} ms)`
        : `ok (${durationMs} ms)`
      : `fail exit=${exitCode} (${durationMs} ms)`;
  // Escape pipe in track titles to keep markdown table valid.
  const safeTrack = args.track.replace(/\|/g, "\\|");
  const line =
    `| ${ts} | ${args.album} | ${safeTrack} | ${args.type} | ${videoId} | ${result} |\n`;
  appendFileSync(INGEST_LOG_PATH, line, "utf8");
}

// ---------------------------------------------------------------------------
// Spawn the Python capture script
// ---------------------------------------------------------------------------

function spawnCapture(args) {
  if (!existsSync(HR_TOOLS_PYTHON)) {
    die(
      `Python capture script not found at:\n  ${HR_TOOLS_PYTHON}\n` +
      `Has Hunter Root\\tools\\yt_archive_capture.py been created?`,
      2,
    );
  }
  const pyArgs = [
    HR_TOOLS_PYTHON,
    "--url", args.url,
    "--album", args.album,
    "--track", args.track,
    "--type", args.type,
    "--mv-base", args.mvBase,
  ];
  if (args.albumTitle) {
    pyArgs.push("--album-title", args.albumTitle);
  }
  if (args.credit) {
    pyArgs.push("--credit", args.credit);
  }
  if (args.pageSave) {
    pyArgs.push("--page-save");
  }
  if (args.dryRun) {
    pyArgs.push("--dry-run");
  }
  // Prefer "python" on Windows; "python3" on Unix-y. Try python first.
  const interpreter = process.platform === "win32" ? "python" : "python3";
  return new Promise((resolveProm) => {
    const child = spawn(interpreter, pyArgs, {
      stdio: "inherit",
      shell: false,
    });
    child.on("error", (err) => {
      console.error(`yt-ingest: failed to spawn ${interpreter}: ${err.message}`);
      resolveProm(127);
    });
    child.on("exit", (code) => {
      resolveProm(code ?? 1);
    });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { videoId, album } = validateAgainstSpine(args);

  // v1B: auto-derive the full SPINE album title when the caller didn't
  // pass --album-title explicitly. The bulk acquirer passes it; operator
  // direct invocations may omit it. Capture script slugifies it into
  // album:<title_slug>.
  if (!args.albumTitle && album && album.title) {
    args.albumTitle = album.title;
  }

  console.error(
    `yt-ingest: validated against SPINE — album=${args.album} ` +
    `album_title=${JSON.stringify(args.albumTitle)} ` +
    `track=${JSON.stringify(args.track)} type=${args.type} ` +
    `videoId=${videoId} dry_run=${args.dryRun}`,
  );

  const start = Date.now();
  const exitCode = await spawnCapture(args);
  const durationMs = Date.now() - start;

  appendIngestLog(args, videoId, exitCode, durationMs);

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`yt-ingest: unhandled error: ${err && err.stack || err}`);
  process.exit(1);
});
