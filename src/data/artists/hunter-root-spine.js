// Builds the player spine (the Exhibit.jsx contract) from the foundation
// export (src/data/exhibits/hunter_root.json). Replaces the hand-authored
// SPINE — the foundation is the source of truth; this module only reshapes.
//
// Contract consumed by Exhibit.jsx (do not change):
//   album = { id, title, year, art, accent, tracks: [ track ] }
//   track = { title, videos: [ video ] }
//   video = { ytId, audioUrl, label, type }   // ytId for YouTube, audioUrl for mp3
//
// Albums with no foundation art (cover_artifact_id null) get art:null and
// accent:null — Exhibit.jsx renders its placeholder gradient. Never
// re-hardcode the retired bandcamp art here.

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[‘’']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function titleFromSlug(slug) {
  return slug
    .split("_")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// "Hunter Root - Town Rat Heathen (Official Music Video)" -> "Town Rat Heathen"
// "Brain Cell — audio recording"                           -> "Brain Cell"
// Cross-checks the parsed name against the song: slug and falls back to the
// slug when they disagree (e.g. "Sleight of Hand (Official Audio)" is tagged
// song:shapeshifter -> "Shapeshifter", matching hr_facts trackIds).
function cleanTrackTitle(rawTitle, songSlug) {
  const raw = (rawTitle || "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .trim();

  const audio = raw.match(/^(.*?)\s*[–—]\s*audio recording$/i);
  if (audio) return audio[1].trim();

  const m = raw.match(/^Hunter Root\s*-\s*(.+?)\s*(?:\([^)]*\))?$/);
  if (m) {
    const candidate = m[1].trim();
    if (!songSlug || slugify(candidate) === songSlug) return candidate;
  }
  if (songSlug) return titleFromSlug(songSlug);
  return raw;
}

// "Hunter Root - Reverend (Official Music Video)" -> "Official Music Video"
// "Brain Cell — audio recording"                  -> "Audio Recording"
function cleanLabel(rawLabel) {
  const raw = (rawLabel || "").trim();
  const paren = raw.match(/\(([^)]*)\)\s*$/);
  if (paren) return paren[1].trim();
  if (/[–—]\s*audio recording$/i.test(raw)) return "Audio Recording";
  return raw;
}

/**
 * @param exhibitJson  the foundation export ({ metadata, artifacts })
 * @param albumsConfig presentation config, in coverflow order:
 *                     [{ id, tag, year?, accent? }]
 *                     id   = short album id (hr_facts albumIds key off these)
 *                     tag  = the container's tags.album[0] (stable join key)
 *                     year = display year (foundation track year tags are
 *                            video years, not album years — see plan notes)
 */
export function buildSpineFromArtifacts(exhibitJson, albumsConfig) {
  const containers = (exhibitJson?.artifacts || []).filter(a => a.card_kind === "album");
  const byTag = new Map();
  for (const c of containers) {
    const tag = c.tags?.album?.[0];
    if (tag && !byTag.has(tag)) byTag.set(tag, c);
  }

  const spine = [];
  for (const cfg of albumsConfig) {
    const c = byTag.get(cfg.tag);
    if (!c) continue; // container absent from this export — skip, don't crash

    spine.push({
      id: cfg.id,
      title: c.title,
      year: cfg.year ?? null,
      art: c.thumbnail_url ?? null,
      accent: cfg.accent ?? null,
      tracks: (c.tracks || []).map(t => ({
        title: cleanTrackTitle(t.title, t.song ?? t.tags?.song?.[0] ?? null),
        videos: (t.videos || []).map(v => ({
          ytId: v.ytId ?? null,
          audioUrl: v.audioUrl ?? null,
          label: cleanLabel(v.label),
          type: v.type,
        })),
      })),
    });
  }
  return spine;
}
