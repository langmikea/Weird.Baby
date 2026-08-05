import React, { Fragment, useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { makeFactCycler, splitFact } from "../../lib/fact-select.js";
import { visitorProse, kept } from "../../lib/visitor-prose.js";
import { useArrival } from "../../lib/use-arrival.js";
import MuseumBar from "../../components/MuseumBar.jsx";
import RecordEntry from "./RecordEntry.jsx";
import {
  entryStamp, groupByPeriod, shouldBand, evidenceOf, docState,
} from "../../lib/record-model.js";
import "./Exhibit.css";

// ─── TYPE CONFIG ──────────────────────────────────────────────────────────────
const TAG_SLOTS = ["official", "live", "lyrics", "clip", "cover", "audio"];
/* [J1 2026-08-02] MIKE'S RULING: the retired 2025 gold `#b8974a` is RETIRED
   EVERYWHERE, the player bar's play/volume/CC included; every site conforms to
   the current palette. OFFICIAL was the one type painted in it, so it now reads
   the accent ramp — `var(--wb-gold)` in an inline style resolves against
   whatever ground the element is standing on, which is exactly the point: photo
   black on the tracklist's paper, near-white inside the player bar's re-pinned
   dark scope. No second mirror of the palette is created.
   THE OTHER FIVE TYPE COLOURS ARE NOT TOUCHED and are listed for Mike: green,
   purple, blue and two browns are a whole pre-2026 colour vocabulary, already
   standing on his own backlog ("variant-pill type colors … awaiting Mike's
   read", STATE). J1 named the gold; retiring its five siblings is a palette
   decision, not a conformance one. */
const TYPE_META = {
  official: { label: "OFFICIAL", color: "var(--wb-gold)" },
  live:     { label: "LIVE",     color: "#4a8a6a" },
  clip:     { label: "CLIP",     color: "#a07840" },
  lyrics:   { label: "LYRICS",   color: "#7a6a9a" },
  cover:    { label: "COVER",    color: "#3a7a9a" },
  audio:    { label: "AUDIO",    color: "#8a6a3a" },
  hr_cover: { label: "COVER",    color: "#3a7a9a" },
  fan_cover:{ label: "COVER",    color: "#3a7a9a" },
};
/* [J1] THE PLACEHOLDER TILE, ONCE. The same gold-tinted-on-black gradient was
   typed out at three call sites (coverflow cover, audio-only overlay, thumb
   fallback) and every one of them carried its own copy of the retired gold as
   the `album.accent` fallback — which is the LIVE value, because every album in
   every wing declares `accent: null`. One builder, so the next surface that
   needs a placeholder cannot fork a fourth copy.
   The fallback is now `--wb-gold-mute` rather than `--wb-gold`: the tile's own
   ground is near-black, and the ramp's photo-black end would tint nothing.
   Alpha is expressed with `color-mix` because a `var()` cannot take a hex alpha
   suffix — the old `${accent}33` only ever worked on a literal. */
function placeholderTile(accent) {
  const a = accent || "var(--wb-gold-mute)";
  return {
    background: `linear-gradient(135deg, color-mix(in srgb, ${a} 20%, transparent) 0%, #0c0c0c 60%, #050505 100%)`,
    borderColor: `color-mix(in srgb, ${a} 33%, transparent)`,
  };
}
function normalizeType(t) { return (t==="hr_cover"||t==="fan_cover") ? "cover" : t; }
function typeLabel(t) { return TYPE_META[t]?.label ?? t.toUpperCase(); }
function typeColor(t) { return TYPE_META[t]?.color ?? "#888"; }

/* ==== [P5 2026-08-02] OPERATOR MARKERS NEVER REACH A VISITOR ================
   MIKE: "HIDE ALL [PAPA] MARKERS and anything else the user isn't meant to
   see, on every page, site-wide. They must never be visible to visitors."
   WHAT [PAPA] IS. It marks the words that are Papa's to write — a note from
   the builders to the operator, sitting in the artist data beside real copy.
   It has been rendering on the live page since the faces were built: at the
   foot of every WAL card, inside the robots wing's entries, in the middle of
   provenance notes a visitor SHOULD read.
   WHY IT IS SCRUBBED AT THE RENDER SEAM AND NOT DELETED FROM THE DATA. The
   markers are load-bearing FOR MIKE — they are the list of what still needs
   his words — and deleting them would destroy that list to fix a display bug.
   So the data keeps its markers and the visitor never sees one: one function,
   applied once where a face is derived, so no wing can forget to call it and
   a marker added tomorrow is hidden the day it is written.
   IT CUTS BY SENTENCE, NOT BY STRING. `face.papa` routinely carries real
   provenance and THEN the marker ("Sources: her own site... [PAPA] — the card
   copy"). Dropping the whole field would take the sourcing down with it;
   truncating at the bracket would leave a half-sentence. The sentence carrying
   the marker is the operator's; the rest is the museum's, and it stays.
   The early return means a string without a marker is never even split, so
   the sentence splitter can never damage ordinary copy ("Vol. 1", "Dr King").
   [M3 2026-08-03] `visitorProse`, `kept` and `PAPA_MARK` NOW LIVE IN
   src/lib/visitor-prose.js, unchanged to the character. The ruling above says
   SITE-WIDE and the function enforcing it was private to this file, reachable
   only by things the exhibit renders — so the first [PAPA] written into a
   room that is not an exhibit (the Information Booth, this round) would have
   printed on the page. That is the defect P5 fixed, arriving through a door P5
   could not see. `scrubFace` stays here: it knows which fields a FACE has, and
   that is genuinely the exhibit's business. */

function scrubFace(face) {
  if (!face) return face;
  const out = { ...face };
  ["title", "subtitle", "blurb", "footer", "papa"].forEach(k => {
    const v = visitorProse(face[k]);
    if (kept(v)) out[k] = v; else delete out[k];
  });
  if (Array.isArray(face.label)) {
    out.label = face.label.map(visitorProse).filter(kept);
  }
  if (Array.isArray(face.lines)) {
    out.lines = face.lines.map(visitorProse).filter(kept);
  }
  if (Array.isArray(face.tombstone)) {
    out.tombstone = face.tombstone
      .map(r => ({ ...r, k: visitorProse(r.k), v: visitorProse(r.v) }))
      .filter(r => kept(r.k) || kept(r.v));
  }
  if (Array.isArray(face.entries)) {
    out.entries = face.entries
      .map(en => ({
        ...en,
        stamp: visitorProse(en.stamp),
        title: visitorProse(en.title),
        line: visitorProse(en.line),
        note: visitorProse(en.note),
      }))
      /* an entry whose title AND body were both the operator's is not an
         entry any more — it is a blank row, which is its own kind of leak. */
      .filter(en => kept(en.title) || kept(en.line));
  }
  /* [A3 2026-08-04] a spread's HEAD is printed on the shelf, so a marker
     written into one would print exactly the way the Portal's five drum
     refusals did (v46/C1). A spread whose head is entirely the operator's
     keeps its tiles and loses its label — the wall is the content. */
  /* [A7 2026-08-04] AND SO IS EVERY TILE'S CAPTION, which A3 left undone and
     the register has carried as C15 since. The reader prints a tile's `label`
     and its `date` under the picture and in the lightbox's caption line, so a
     marker written into either would print exactly the way a spread head's
     would — the same defect, one element further in.
     A TILE WHOSE CAPTION IS ENTIRELY THE OPERATOR'S KEEPS ITS PICTURE and loses
     its words, which is the rule the spread heads already set: the wall is the
     content. Dropping the tile instead would silently change a count the
     tombstone above it states out loud. */
  const scrubTiles = tiles => (tiles || []).map(t => {
    const label = visitorProse(t.label);
    const date = visitorProse(t.date);
    return { ...t, label: kept(label) ? label : null,
                   date: kept(date) ? date : null };
  });
  if (Array.isArray(face.collage)) out.collage = scrubTiles(face.collage);
  if (Array.isArray(face.spreads)) {
    out.spreads = face.spreads.map(s => {
      const head = visitorProse(s.head);
      return { ...s, head: kept(head) ? head : null,
                     tiles: scrubTiles(s.tiles) };
    });
  }
  if (Array.isArray(face.sideboxes)) {
    out.sideboxes = face.sideboxes
      .map(b => ({
        ...b,
        title: visitorProse(b.title),
        lines: (b.lines || []).map(visitorProse).filter(kept),
        note: visitorProse(b.note),
      }))
      .filter(b => b.lines.length > 0 || kept(b.note));
  }
  return out;
}

// ─── QUEUE HELPERS ────────────────────────────────────────────────────────────
function getOrderedVis(track, selSet) {
  if (!selSet || selSet.size === 0) return [];
  const typeToVi = {};
  track.videos.forEach((v, vi) => {
    const n = normalizeType(v.type);
    if (!(n in typeToVi)) typeToVi[n] = vi;
  });
  return TAG_SLOTS.map(s => typeToVi[s]).filter(vi => vi !== undefined && selSet.has(vi));
}

// O9 Shuffle — Fisher–Yates over queue entries; pure. Used at queue build /
// loop refill and on live toggle-on. (Not Array.sort(random) — biased.)
function shuffleEntries(entries) {
  const a = [...entries];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPlayQueue(album, startTi, selVisMap) {
  const n = album.tracks.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    const ti = (startTi + i) % n;
    const track = album.tracks[ti];
    if (!track.videos.length) continue;
    const sel = selVisMap[ti];
    if (sel && sel.size === 0) continue;
    const vis = getOrderedVis(track, sel ?? new Set([0]));
    if (vis.length) result.push({ ti, vis });
  }
  return result;
}

// ─── FACT SCROLLER ────────────────────────────────────────────────────────────
// FACTSCROLLER_REPLUMB-20260707 (Sequencing A): the scroller now reads the
// vaulted-then-released `fact` artifacts (via the facts payload) through the
// shared selector's tag-based CLIMB (song → album → era → artist), keyed to the
// now-playing track. Weight = per-session selection frequency (spec ruling 5),
// owned by the cycler; it persists across track changes so the vault spreads.
// The render path below (fs-* JSX/CSS, .55s bounce, 7.5s cadence, ‹ › nav) is
// UNCHANGED — only the data source swapped. Look/motion untouched (ruling 1).
function FactScroller({ facts, albumTag, songSlug, eraSlugs, exhibit, accent }) {
  const [current, setCurrent]     = useState(null);
  const [direction, setDirection] = useState("up");
  const [phase, setPhase]         = useState("idle");
  const historyRef = useRef([]);
  const posRef     = useRef(-1);
  const timerRef   = useRef(null);
  const cyclerRef  = useRef(null);
  const factsRef   = useRef(null);
  const eraKey = Array.isArray(eraSlugs) ? eraSlugs.join(",") : "";

  useEffect(() => {
    // Build the cycler once per facts array identity; weight (shown-counts)
    // lives inside it and survives track changes.
    if (cyclerRef.current === null || factsRef.current !== facts) {
      cyclerRef.current = makeFactCycler({ facts: facts || [], ctx: null });
      factsRef.current = facts;
    }
    cyclerRef.current.setContext({
      song: songSlug || null,
      album: albumTag || null,
      eraSlugs: eraSlugs || null,
      exhibit: exhibit || null,
    });
    historyRef.current = [];
    posRef.current = -1;
    clearTimeout(timerRef.current);
    schedule(600, "up");
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumTag, songSlug, eraKey, exhibit, facts]);

  function show(fact, dir) {
    setDirection(dir);
    setPhase("entering");
    setCurrent(fact);
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("visible")));
  }

  function schedule(delay = 7500) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = cyclerRef.current ? cyclerRef.current.next() : null;
      if (!next) return;
      historyRef.current.push(next);
      posRef.current = historyRef.current.length - 1;
      show(next, "up");
      schedule(7500);
    }, delay);
  }

  function navBack() {
    if (posRef.current <= 0) return;
    posRef.current--;
    show(historyRef.current[posRef.current], "down");
    schedule(7500);
  }
  function navForward() {
    if (posRef.current >= historyRef.current.length - 1) return;
    posRef.current++;
    show(historyRef.current[posRef.current], "up");
    schedule(7500);
  }

  const canBack    = posRef.current > 0;
  const canForward = posRef.current < historyRef.current.length - 1;

  // Display model (2026-07-07 eyeball): QUOTE in the viewport, BREADCRUMB (the
  // source credit) demoted to the footer, small + light + italic. Motion (the
  // .55s bounce) is UNCHANGED — Mike ruled "fix overflow only, keep bounce" for
  // the player scroller; the overflow fit is the fs-viewport mask in CSS.
  const parts = current ? splitFact(current) : null;

  return (
    <div className="fs-wrap">
      <div className="fs-viewport">
        {parts && (
          <div className={`fs-block fs-${phase} fs-dir-${direction}`}>
            {parts.quote.map((ln, i) => <div className="fs-line" key={i}>{ln}</div>)}
          </div>
        )}
      </div>
      <div className="fs-footer">
        {parts && parts.breadcrumb && <div className="fs-crumb">{parts.breadcrumb}</div>}
        {accent && <div className="fs-rule" style={{ background: accent }} />}
      </div>
    </div>
  );
}

// ─── YOUTUBE PLAYER HOOK ──────────────────────────────────────────────────────
function useYTPlayer({ containerRef, onEnded }) {
  const playerRef  = useRef(null);
  const readyRef   = useRef(false);
  const pendingRef = useRef(null);
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; });

  // Eagerly construct the player on mount (fixes mobile first-click playback).
  // Builds with no videoId + autoplay:0 so nothing plays on load. The guard in
  // initPlayer (playerRef.current) keeps this from colliding with loadVideo's
  // legacy build path; onReady's pendingRef replay still honors an early click.
  useEffect(() => { ensureApi(() => initPlayer()); }, []);

  function initPlayer() {
    if (!containerRef.current || playerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      width: "100%", height: "100%",
      playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, playsinline: 1 },
      events: {
        onReady() {
          readyRef.current = true;
          if (pendingRef.current) {
            playerRef.current.loadVideoById(pendingRef.current);
            pendingRef.current = null;
          }
        },
        onStateChange(e) {
          if (e.data === window.YT.PlayerState.ENDED) onEndedRef.current?.();
        },
      },
    });
  }

  function ensureApi(cb) {
    if (window.YT?.Player) { cb(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); cb(); };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }

  const loadVideo = useCallback((ytId) => {
    if (playerRef.current && readyRef.current) {
      playerRef.current.loadVideoById(ytId);
    } else if (playerRef.current) {
      pendingRef.current = ytId;
    } else {
      pendingRef.current = ytId;
      ensureApi(() => initPlayer(ytId));
    }
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) p.pauseVideo();
    else p.playVideo();
  }, []);

  const pause = useCallback(() => {
    const p = playerRef.current;
    if (p && readyRef.current) p.pauseVideo();
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    if (p.isMuted()) p.unMute(); else p.mute();
  }, []);

  const setVolume = useCallback((v) => {
    const p = playerRef.current;
    if (p && readyRef.current) p.setVolume(v);
  }, []);

  const getState = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return { playing: false, muted: false, volume: 100 };
    return {
      playing: p.getPlayerState() === window.YT.PlayerState.PLAYING,
      muted: p.isMuted(),
      volume: p.getVolume(),
    };
  }, []);

  return { loadVideo, pause, togglePlay, toggleMute, setVolume, getState };
}

// ─── AUDIO PLAYER HOOK ────────────────────────────────────────────────────────
// Mirrors useYTPlayer's surface for foundation audio tracks ({ audioUrl }).
// Same queue, same controls — the play effect branches on ytId vs audioUrl.
function useAudioPlayer({ onEnded }) {
  const audioRef   = useRef(null);
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; });

  function ensureAudio() {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "auto";
      a.addEventListener("ended", () => onEndedRef.current?.());
      audioRef.current = a;
    }
    return audioRef.current;
  }

  const loadAudio = useCallback((url) => {
    const a = ensureAudio();
    a.src = url;
    a.currentTime = 0;
    a.play().catch(() => {});
  }, []);

  const pause = useCallback(() => { audioRef.current?.pause(); }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.src) return;
    if (a.paused) a.play().catch(() => {}); else a.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (a) a.muted = !a.muted;
  }, []);

  const setVolume = useCallback((v) => {
    const a = audioRef.current;
    if (a) a.volume = Math.max(0, Math.min(100, v)) / 100;
  }, []);

  const getState = useCallback(() => {
    const a = audioRef.current;
    if (!a) return { playing: false, muted: false, volume: 100 };
    return { playing: !a.paused && !a.ended, muted: a.muted, volume: Math.round(a.volume * 100) };
  }, []);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return { loadAudio, pause, togglePlay, toggleMute, setVolume, getState };
}

// ─── SPLIT PERSISTENCE ────────────────────────────────────────────────────────
/* [S8 2026-07-30] HORIZONTAL WHITESPACE YIELDS TO THE VIEWER. The tracklist
   was floored at 25% of the width — on /robots that is a three-row list
   holding a quarter of the screen while the viewer, which owns everything
   now (S7), is squeezed. The floor drops to 10%: enough for the numbers and
   a truncated title, which is all a three-track list needs. The ceiling
   rises too, for the rare case where the list IS the content. */
/* [G3 2026-07-31] AND S8 DID NOT ACTUALLY WORK. The number moved to 10 and the
   column still stopped near a quarter of the width, because the floor was
   never this constant: `.ex-main-inner` is a GRID, and a grid track sized in
   `fr` will not shrink past its item's min-content width — `auto` is the
   default minimum. So the tracklist bottomed out wherever its longest
   unbreakable row happened to land, which on /robots is about 24%. Lowering a
   constant that was not binding is exactly the class of fix that reports
   success and changes nothing; the track sizing had to change with it (see
   the `minmax(0, ...)` at the grid, below).
   THE GUEST ADJUSTS THEIR OWN CHAIR. Both directions are now generous and the
   only hard limits left are the ones physics asks for: nothing negative, and
   nothing fully vanished — 4% still shows the numbers column, so the list
   thins to a rule rather than disappearing without a handle back. */
const SPLIT_MIN = 4; const SPLIT_MAX = 92;
function tidyDesc(title, v) {
  let d = (v && (v.label || typeLabel(v.type))) || "";
  if (title && d.indexOf(title) === 0) d = d.slice(title.length).replace(/^[\s\u2014\u2013-]+/, "");
  d = d.toUpperCase().replace("AUDIO RECORDING", "AUDIO").replace("OFFICIAL MUSIC VIDEO", "OFFICIAL VIDEO");
  return d;
}

const CF_MIN    = 160; const CF_MAX    = 440;
/* [X2 2026-07-30] THE BODY HEIGHT DRAG — same-only-different to the carousel's.
   `.ex-main` is `flex:1` inside `.ex-root`, so the tracklist/viewer block has
   always taken whatever height the viewport had left: the page FORCED it and
   the visitor could not argue. The carousel has had a height handle since /hr,
   so the mechanism did not need inventing, only pointing at a second target —
   identical drag, identical persistence, identical snap-to-default, identical
   handle furniture.
   OPT-IN BY CONFIG: only an artist declaring `bodyKey` grows the handle, so
   /hr and /wb render exactly as they did today. Turning it on for them is one
   line each in their config and no component change at all. */
/* [M6 2026-08-01] THE FRAME OPENS LONG. 460px was sized so the drag handle
   cleared the fixed player bar, which solved a collision and left the viewer
   short: a face with a register, an index and a record had to be scrolled
   before it could be read at all. Mike's ruling is a generous default -
   plenty of space, plenty to scroll - so the default roughly doubles and the
   ceiling rises with it. MIN is untouched; a visitor's stored height is still
   never overridden. */
const BODY_MIN  = 260; const BODY_MAX  = 1600; const BODY_DEF = 880;

/* [F3 2026-08-02] A SETTING CAN BE SESSION-SCOPED. Wings that fit themselves
   on entry (WAL) keep the visitor's adjustments for THE SESSION and re-fit
   fresh next visit — a sticky-forever localStorage number would quietly
   overrule tomorrow's better fit on a different window size. Wings that
   declare nothing keep localStorage exactly as before. */
function usePersist(key, def, scope) {
  /* a primitive, not a helper closure: a per-render function in the deps
     defeats the compiler's memoization (it flagged exactly that). */
  const inSession = scope === "session";
  const [v, setV] = useState(() => {
    try { return parseFloat((inSession ? sessionStorage : localStorage).getItem(key)) || def; }
    catch { return def; }
  });
  const set = useCallback(val => {
    setV(val);
    try { (inSession ? sessionStorage : localStorage).setItem(key, val); }
    catch { /* storage may be unavailable in private mode; ignore */ }
  }, [key, inSession]);
  return [v, set];
}

// ─── COVERFLOW ────────────────────────────────────────────────────────────────
/* [F4 2026-08-03] THE CAROUSEL HAD A HARD EDGE, AND IT WAS HIDING AN ALBUM.
   MIKE: "at full-left scroll Mikey Mike's album cannot be seen — the cut is too
   abrupt and limiting."
   HE IS DESCRIBING A `return null`, NOT A LAYOUT PROBLEM. The render culled
   `Math.abs(off) > 3`, and the WAL spine is FIVE albums — the house card, then
   Carsie, Hunter Root, Jesse, Mikey Mike. The wing LANDS at active=0, which
   puts Mikey Mike at off=4. He was not faint at the edge and he was not cut in
   half: he was not in the document. Every wing whose spine passes five albums
   has the same hole at both ends, and /hr's does.
   AND THE FOURTH RING WAS A DEAD END BY CONSTRUCTION. The old tail — a bare
   `return` for every offset past 2 — gave off=3, off=4 and off=5 THE SAME slot,
   so rendering them without changing this function would have stacked three
   covers on one spot. The cull was covering for the ramp, which is why raising
   the cull alone would have looked broken.
   THE RAMP NOW RUNS SIX DEEP AND IT CLOSES UP AS IT GOES. The x-deltas were
   240 / 210 / 170 and continue 120 / 85 — a settling series, not a repeat — so
   the far covers deck up against the edge the way a real rack of records does
   instead of marching off the page.
   MEASURED ON THE BUILT PAGE, AT THE SIZE THE ROOM ACTUALLY OPENS AT. F3's
   `fitOnEntry` computes the carousel's height on arrival and overrides the
   persisted one, so the honest number is the one the fit produces rather than
   the stored default: in a true 1706x900 viewport it sets cfH=160, and at full-
   left scroll the five covers land at 64 / 166 / 254 / 319 / 363px from centre
   against 839px of half-width. The fifth album — Mikey Mike, the one Mike could
   not see — is FULLY ON SCREEN with room to spare. That is his "better if
   repositioning solves it outright", solved outright rather than hazed over.
   The haze is the insurance for the sizes the fit does not choose: a carousel
   dragged tall, or a phone, where the rack genuinely is wider than the window.
   Ring 5 is deliberately allowed to run past the edge: that is what the haze on
   `.cf-wrap` is for (see Exhibit.css), and a sixth album dissolving at the
   margin is the honest signal that there is more rack than window. */
function getSlot(off) {
  const a = Math.abs(off), s = off < 0 ? -1 : 1;
  if (a===0) return { x:0,       z:0,    ry:0,      sc:1,    op:1,    zi:10 };
  if (a===1) return { x:s*240,   z:-80,  ry:s*-45,  sc:.85,  op:.9,   zi:9  };
  if (a===2) return { x:s*450,   z:-150, ry:s*-58,  sc:.74,  op:.75,  zi:8  };
  if (a===3) return { x:s*620,   z:-210, ry:s*-68,  sc:.62,  op:.55,  zi:7  };
  if (a===4) return { x:s*740,   z:-255, ry:s*-73,  sc:.54,  op:.38,  zi:6  };
  return           { x:s*825,   z:-290, ry:s*-76,  sc:.47,  op:.24,  zi:5  };
}
/* how many rings deep the rack is drawn. Named because it is the number the
   cull and the ramp above have to agree on, and they disagreed for five
   albums. */
const CF_RINGS = 5;

function AlbumCover({ album }) {
  if (album.art) {
    return <img src={album.art} alt={album.title} loading="lazy" />;
  }
  return (
    <div className="cf-placeholder" style={placeholderTile(album.accent)}>
      <div className="cf-ph-title">{album.title}</div>
      <div className="cf-ph-year">{album.year}</div>
    </div>
  );
}

function Coverflow({ spine, active, cfH, onSelect, onSelectClick }) {
  const [did, setDid] = useState(false);
  const drag = useRef(null);
  const ts   = useRef(null);

  function onPD(e) { drag.current = e.clientX; setDid(false); }
  function onPU(e) {
    if (!drag.current) return;
    const d = e.clientX - drag.current;
    if (Math.abs(d) > 40) { d > 0 ? onSelect(Math.max(active-1,0)) : onSelect(Math.min(active+1,spine.length-1)); setDid(true); }
    drag.current = null;
  }
  function onTS(e) { ts.current = e.touches[0].clientX; setDid(false); }
  function onTE(e) {
    if (ts.current === null) return;
    const d = e.changedTouches[0].clientX - ts.current;
    if (Math.abs(d) > 40) { d > 0 ? onSelect(Math.max(active-1,0)) : onSelect(Math.min(active+1,spine.length-1)); setDid(true); }
    ts.current = null;
  }

  // Album size scales with the panel height. 240px at the persisted
  // default cfH=300 (240/300 = 0.8). Clamp so the carousel stays usable
  // when the panel is dragged very small or very tall. Slot offsets in
  // getSlot() were authored at 240px; multiply by `scale` so spacing
  // tracks the new size.
  const albumSize = Math.max(120, Math.min(400, cfH * 0.8));
  const scale = albumSize / 240;

  return (
    <div className="cf-wrap" style={{ height: cfH }}
      onPointerDown={onPD} onPointerUp={onPU} onTouchStart={onTS} onTouchEnd={onTE}>
      <button className={`cf-arrow cf-l${active===0?" cf-dis":""}`} onClick={()=>onSelect(Math.max(0,active-1))}>{"<"}</button>
      <button className={`cf-arrow cf-r${active===spine.length-1?" cf-dis":""}`} onClick={()=>onSelect(Math.min(spine.length-1,active+1))}>{">"}</button>
      {/* [F4 2026-08-03] THE RACK IS ITS OWN BOX, AND THE ONE REASON IS THE MASK.
          The haze that dissolves a cover at the margin (Mike: "at minimum a
          slight FADE on the last visible item indicating more beyond the haze")
          is a `mask-image`, and a mask applies to EVERY descendant of the
          element carrying it — including the two `‹ ›` arrows, which live at
          left:8px / right:8px, i.e. inside the fade. Masking `.cf-wrap` would
          have hazed away the controls along with the covers.
          So the covers get a box of their own and the arrows stay outside it.
          `perspective` MOVES WITH THEM: perspective applies to an element's
          DIRECT children only, so leaving it on `.cf-wrap` would have flattened
          the whole carousel the moment the covers became grandchildren. It is
          the same declaration on the same rectangle (`inset:0`), so the 3D is
          identical — that is the acceptance test, and it is met by construction.
          Pointer events are unaffected: the drag listeners are on `.cf-wrap` and
          events from the covers bubble to them exactly as before. */}
      <div className="cf-rack">
      {spine.map((a,i) => {
        const off = i - active;
        if (Math.abs(off) > CF_RINGS) return null;
        const sl = getSlot(off);
        const isActive = off === 0;
        return (
          <div key={a.id} className={`cf-album${isActive?" cf-active":""}`}
            style={{
              width: albumSize, height: albumSize,
              transform:`translateX(${sl.x*scale}px) translateZ(${sl.z*scale}px) rotateY(${sl.ry}deg) scale(${sl.sc})`,
              opacity:sl.op, zIndex:sl.zi,
              /* [J1] the active album's hairline ring reads the ramp. */
              boxShadow:isActive?"0 24px 64px rgba(0,0,0,0.8),0 0 0 1px color-mix(in srgb, var(--wb-gold) 27%, transparent)":"none",
            }}
            onClick={()=>{ if(!did){ isActive ? onSelectClick(i) : onSelect(i); } }}
          >
            <AlbumCover album={a} />
            <div className="cf-overlay" />
            <div className="cf-year">{a.year}</div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ─── TRACKLIST ────────────────────────────────────────────────────────────────
function TrackList({ album, playingTrackIdx, activeTrack, selectedVis, onSelect, onTagClick }) {
  function getSelSet(ti) { return selectedVis[ti] ?? new Set([0]); }
  function isSkipped(ti) {
    if (!album.tracks[ti].videos.length) return false;
    const s = selectedVis[ti]; return s && s.size === 0;
  }

  /* [M-d 2026-08-02] THE NUMBERS COUNT MARKERS, NOT ARRAY SLOTS.
     A row's number was `ti + 1` — its index in the array — which was correct
     only while every row was a numbered thing. Sub-rows (a song's museum card,
     R-a) are deliberately UNNUMBERED, so index-as-number would have counted
     them anyway and made every song after the first one carry the wrong number
     while displaying nothing at the slot that ate it.
     The map is built once, in order, and only advances on a row that actually
     shows a number. A wing with no sub-rows gets exactly the numbers it had. */
  const numberOf = [];
  let n = 0;
  /* [W10 2026-08-02] header rows are section labels and `unnumbered` rows
     are categories, not tracks — neither consumes a number. Only the songs
     count, which is what makes the numbers mean "song" again. */
  album.tracks.forEach((t, i) => { numberOf[i] = (t.sub || t.header || t.unnumbered) ? null : (n += 1); });

  return (
    <ol className="tl-tracks">
      {album.tracks.map((track, ti) => {
        /* [W10 2026-08-02] A HEADER ROW IS A SECTION LABEL, NOT A TRACK.
           It is data (`track.header`), so a wing that declares none renders
           none and /hr, /wb and /robots are byte-identical. Inert: no click,
           no number, no hover state. */
        if (track.header) {
          return <li key={ti} className="tl-header">{track.title}</li>;
        }
        const hasVids  = track.videos.length > 0;
        /* [X3 2026-07-30] A FACE MAKES A ROW SELECTABLE. There were TWO gates
           on a video-less row, not one: Exhibit's handleTrackSelect bailed
           before recording the selection, AND the row itself refused to call
           onSelect at all. Fixing either alone changes nothing, which is why
           the first fix looked like it had not built. A row with a face has
           somewhere to go, so it may be clicked; a row with neither videos nor
           a face is still inert, exactly as before. */
        const selectable = hasVids || !!track.face;
        const isActive = activeTrack === ti;
        const playing  = playingTrackIdx === ti;
        const skipped  = isSkipped(ti);
        const selSet   = getSelSet(ti);

        const typeToVi = {};
        track.videos.forEach((v, vi) => {
          const n = normalizeType(v.type);
          if (!(n in typeToVi)) typeToVi[n] = vi;
        });

        return (
          <li key={ti}
            className={[
              "tl-track",
              isActive  ? "tl-active"   : "",
              /* [X3] `.tl-novid` means DEAD (cursor:default, 32% opacity, no
                 hover). A face-bearing row is alive, so it must not wear the
                 dead class — it was reading as greyed-out and unclickable
                 while being the whole point of the exhibit. */
              !selectable ? "tl-novid" : "",
              skipped   ? "tl-skipped"  : "",
              /* [M-c 2026-08-02] THE PLAYING ROW SAYS SO. It carried no class
                 at all - the only tell was the number swapping for bars, and
                 whatever bolding fell out of other rules, which read as an
                 unexplained emphasis rather than as "this is the one
                 playing". Now it is a named state with a rule of its own. */
              playing   ? "tl-playing"  : "",
              /* [M-d 2026-08-02] A SUB-ROW BELONGS TO THE ROW ABOVE IT.
                 Per the trail-marker law a numbered row is a MARKER, and
                 doubling the markers halves the odds the visitor keeps the one
                 that matters. So a song's museum card indents under its song
                 and draws a rule where its number would be: the song is the
                 marker, the card is one of the trees. */
              track.sub ? "tl-sub" : "",
            ].filter(Boolean).join(" ")}
            /* [V3 2026-08-03] THE ARMED ROW'S RULE MOVES INTO THE STYLESHEET.
               This was an inline `borderLeftColor:var(--wb-gold)` — the same
               loud gold `.tl-playing` draws — so a selected row and a playing
               row wore the identical 2px rule, and under V3 those are DIFFERENT
               ROWS most of the time. It could not simply be re-coloured in
               place either: an inline value outranks every stylesheet rule that
               is not `!important`, which quietly killed the stacked-width rule
               written to make the selected row loud on a phone.
               So the mark is now `.tl-active`'s own declaration in Exhibit.css,
               where the cascade can rank the three statements about this border
               properly: armed (quiet), armed-on-a-phone, running (`!important`,
               and it wins). No behaviour is added here; a class that was already
               on the element does the work the inline style was doing. */
            onClick={() => selectable && !skipped && onSelect(ti)}
          >
            <span className="tl-num">
              {playing
                ? <NpBars color="var(--wb-gold)" />
                : (numberOf[ti] === null
                    ? <i className="tl-subrule" aria-hidden="true" />
                    : String(numberOf[ti]).padStart(2, "0"))}
            </span>
            {/* 2026-07-06 Mike: number/title click PLAYS (bubbles to the row).
                The variant dropdown is a VISIBLE styled select sitting where
                the type text is, so the popup anchors there — not the title.
                It ALWAYS drops, even with one option — a type that sometimes
                does nothing is disorienting (Mike). */}
            {hasVids ? (
              <span className="tl-selwrap">
                <b className="tl-tt">{track.title}</b>
                <span className="tl-typewrap" onClick={e => e.stopPropagation()}>
                  <select className="tl-typesel" value={[...selSet][0] ?? 0}
                    onClick={e => e.stopPropagation()}
                    onChange={e => { e.stopPropagation(); onTagClick(ti, Number(e.target.value)); }}>
                    {track.videos.map((v, vi) => (
                      <option key={vi} value={vi}>{tidyDesc(track.title, v)}</option>
                    ))}
                  </select>
                </span>
              </span>
            ) : (
              <span className="tl-title">{track.title}</span>
            )}
            {/* [M-d 2026-08-02] EVERY ROW SAYS WHAT KIND OF THING IT IS.
                Before this, a tracklist row was legible only by guessing:
                "Link" and "About" read as titles, a song read as a title, and
                the only way to know which of them would start a player was to
                click one and find out. R-a's naming law made the TITLES honest
                nouns; this makes the KIND explicit beside them, so the title
                never has to carry "(card)" to be readable.
                It is DATA — `track.kind` — so a wing that declares none renders
                none, and /hr, /wb and /robots are byte-identical. */}
            {track.kind && <span className="tl-kind">{track.kind}</span>}
            {skipped && <span className="tl-skip-mark">skip</span>}
          </li>
        );
      })}
    </ol>
  );
}

// ─── NP BARS ──────────────────────────────────────────────────────────────────
function NpBars({ color }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"flex-end", gap:2, height:12 }}>
      {[0.6,1,0.7].map((h,i) => (
        <span key={i} style={{
          display:"block", width:2, height:`${h*100}%`,
          background:color, borderRadius:1,
          animation:"npb .7s ease-in-out infinite alternate",
          animationDelay:`${i*0.15}s`,
        }}/>
      ))}
    </span>
  );
}

// ─── PLAYER BAR ───────────────────────────────────────────────────────────────
function PlayerBar({ video, track, album, live, onIdlePlay, onSkipBack, onSkipForward, canSkipBack, canSkipForward, onTogglePlay, onToggleMute, onSetVolume, getState }) {
  const [, forceRender] = useState(0);
  // Phase 2a: the bar is always mounted (never returns null). Only an
  // *actually playing* source (`live`) drives the 500ms progress repaint — an
  // idle bar showing the cued-next preview must not poll or animate.
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => forceRender(n => n + 1), 500);
    return () => clearInterval(id);
  }, [live]);

  // Idle (nothing playing): render the cued-next preview, paused with play
  // armed. Transport state is read from the live player only when playing;
  // idle is statically paused so we never poke an unready YT/audio element.
  const st = live
    ? (getState?.() || { playing: false, muted: false, volume: 100 })
    : { playing: false, muted: false, volume: 100 };

  return (
    <div className="pb">
      {album?.art
        ? <img className="pb-art" src={album.art} alt="" />
        : <div className="pb-art pb-art-ph" style={{ background: album?.accent || "#1a1a1a" }} />}
      <div className="pb-info">
        <div className="pb-track">{track?.title}</div>
        {video && <div className="pb-sub" style={{ color: typeColor(video.type) }}>{typeLabel(video.type)}</div>}
      </div>
      <div className="pb-controls">
        <button className={`pb-skip${canSkipBack?"":" pb-skip-dis"}`} onClick={onSkipBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="2" height="10" rx="1" fill="currentColor"/>
            <path d="M12 2L5 7L12 12V2Z" fill="currentColor"/>
          </svg>
        </button>

        <button className="pb-ctrl" onClick={live ? onTogglePlay : onIdlePlay}>
          {st.playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor"/>
              <rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 2L12 7L3 12V2Z" fill="currentColor"/>
            </svg>
          )}
        </button>

        <button className={`pb-skip${canSkipForward?"":" pb-skip-dis"}`} onClick={onSkipForward}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="11" y="2" width="2" height="10" rx="1" fill="currentColor"/>
            <path d="M2 2L9 7L2 12V2Z" fill="currentColor"/>
          </svg>
        </button>

        <button className="pb-ctrl" onClick={onToggleMute}>
          {st.muted ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 5h2l3-3v10L3 9H1V5z" fill="currentColor"/>
              <line x1="9" y1="4" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="13" y1="4" x2="9" y2="10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 5h2l3-3v10L3 9H1V5z" fill="currentColor"/>
              <path d="M9 4.5c1 .8 1.5 2 1.5 2.5S10 9 9 9.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <path d="M10.5 3c1.5 1.2 2.3 3 2.3 4s-.8 2.8-2.3 4" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            </svg>
          )}
        </button>

        <input type="range" className="pb-vol" min="0" max="100"
          value={st.volume} onChange={e => onSetVolume?.(Number(e.target.value))} />

        <button className="pb-ctrl" title="Closed Captions">
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <rect x="0.5" y="0.5" width="15" height="13" rx="2" stroke="currentColor"/>
            <text x="4" y="10" fill="currentColor" fontSize="7" fontFamily="sans-serif" fontWeight="600">CC</text>
          </svg>
        </button>

        {/* Generic extension slot — an artist's ExhibitFlow may portal its own
            bar-docked controls in here (HR flow injects Filter + Presets). Empty
            and inert for exhibits that don't use it; adds no height. */}
        <div className="pb-ext-slot" id="hr-bar-slot" />
      </div>
    </div>
  );
}

// ─── BANNER TRANSPORT ─────────────────────────────────────────────────────────
/* [M-e 2026-08-02] THE TRANSPORT STOWS INTO THE ARTIST-NAME BAR.
   Mike's shape, built. The fixed 68px `.pb` was furniture at the viewport floor
   whether or not anything was playing: it sat on top of the page, it is the
   standing DECK-SCROLL-OCCLUSION defect, and the census had already measured it
   eating 11% of a phone screen in the robots wing. But a music wing genuinely
   needs a transport — so rather than delete it (robots' answer) or keep it
   (everyone else's), it MOVES into a bar the room already had.

   THE ARTIST-NAME BAR WAS ALREADY THERE AND HALF EMPTY. `.ex-album-banner`
   carries the album title on the left and has carried an empty
   `.ex-album-banner-aux` on the right since it was built. The transport lands
   in the slot that was waiting for it, costs ZERO new vertical space, and
   travels with the thing it controls instead of floating over it.

   THE THREE TIERS, AS ORDERED:
     floor        STOP, from anywhere. Sticky bar + the Escape key.
     plus         play / pause.
     triple-plus  volume, through the YouTube iframe API.
   Volume and play/pause were already wired to the YT API by the old bar; what
   was missing was the floor, which is the one a visitor actually needs.

   OPT-IN BY CONFIG (`transport: "banner"`), never by route sniffing — the same
   discipline as `bodyKey`, `stage` and `playerBar`. /hr, /wb and /robots
   declare nothing and are untouched. */
function BannerTransport({ video, track, live, onStop, onTogglePlay, onSetVolume, getState }) {
  const [, forceRender] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => forceRender(n => n + 1), 500);
    return () => clearInterval(id);
  }, [live]);

  /* NOTHING PLAYING MEANS NO TRANSPORT. The old bar rendered an idle preview of
     what WOULD play, which is a control for a thing that is not happening; in a
     bar that shares a line with the artist's name it would also be permanent
     clutter. Silence gets the artist's name and nothing else. */
  if (!live) return null;
  const st = getState?.() || { playing: false, muted: false, volume: 100 };

  return (
    <div className="bt" role="group" aria-label="player">
      <span className="bt-now">
        <NpBars color="var(--wb-gold)" />
        <span className="bt-title">{track?.title}</span>
        {video && (
          <span className="bt-type" style={{ color: typeColor(video.type) }}>
            {typeLabel(video.type)}
          </span>
        )}
      </span>

      {/* STOP is FIRST and it is the only square in the row. Play and pause are
          the same button and it is a toggle; stop is a different verb and gets
          a different shape, because a control that ends something should not
          look like the control that suspends it. */}
      <button className="bt-btn bt-stop" onClick={onStop}
              title="Stop (Esc)" aria-label="Stop">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="1" y="1" width="10" height="10" rx="1" fill="currentColor" />
        </svg>
      </button>

      <button className="bt-btn" onClick={onTogglePlay}
              title={st.playing ? "Pause" : "Play"}
              aria-label={st.playing ? "Pause" : "Play"}>
        {st.playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 1L11 6L2 11V1Z" fill="currentColor" />
          </svg>
        )}
      </button>

      <input type="range" className="bt-vol" min="0" max="100"
             value={st.volume} aria-label="Volume"
             onChange={e => onSetVolume?.(Number(e.target.value))} />
    </div>
  );
}

/* [F5 2026-08-02] THE FACT POPUP IS RETIRED (Ops-ruled, Mike confirmed).
   C-d's summonable ?-button fact card asked the visitor to THINK to press a
   help button; the ruling is that factoids belong in the PUV scroller during
   playback - ambient, uninvited, part of the show - and the scroller already
   carries the same vault through the same climb. The component, its state,
   the title-bar ? and the .fp/.ex-vaultbtn CSS are all gone together (dead
   machinery is dead); the whole surface is one revert away at 7c3a231. */

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/* ======== [P2 2026-08-02] THE INSTRUMENT PANEL ==========================
   A renderer for `face.panel`, and DELIBERATELY NOTHING MORE. It knows how to
   draw a drum, a bat switch, an incandescent lamp, a rotary dial and a latch;
   it does not know what a portal is, what MGK-VIIIp is, or why maintenance
   would be non-interruptible. Every legend, every position and every arming
   rule arrives as data from the artist config — the same discipline `face`
   itself has carried since E2 — so /hr and /wb, which declare no faces at
   all, cannot notice this exists.

   ARMING IS ONE RULE, EVALUATED IN ONE PLACE. A panel is armed when the drum
   sits on a position that arms, the dial sits on a position that arms, and
   every switch matches its `armsWhen`. Anything else is not armed, and the
   panel says WHICH instrument is refusing and why — a control that declines
   silently is the same defect as a menu that hides what it is not offering.

   THE DRUM IS A REAL CYLINDER, not a list that cross-fades. The positions are
   laid around it in 3D and it rotates to bring one into the window, because
   that is the instrument Mike specified and a fade would be a picture of it
   rather than the thing — the same fault the ASK row carried in FR1.
   Geometry: with N faces of height h, the radius that makes them meet
   edge-to-edge is (h/2) / tan(pi/N).
   IT IS LIT ONLY WHEN ARMED. An unlit drum is still legible: you can read
   what the machine could do and see that it is not doing it. */
/* the detent arc: positions spread across a sweep to the RIGHT of the knob,
   so the labels read left-to-right and never cross the pointer. One position
   sits at the middle of the sweep rather than at its edge. */
const DIAL_SWEEP = 100, DIAL_FROM = 40, DIAL_R = 54;
function dialArc(i, n) {
  const a = n <= 1 ? DIAL_FROM + DIAL_SWEEP / 2
                   : DIAL_FROM + (DIAL_SWEEP * i) / (n - 1);
  const rad = a * Math.PI / 180;
  return {
    position: "absolute",
    left: `calc(50% + ${(DIAL_R * Math.sin(rad)).toFixed(2)}px)`,
    top: `calc(50% - ${(DIAL_R * Math.cos(rad)).toFixed(2)}px)`,
    transform: "translateY(-50%)",
    whiteSpace: "nowrap",
  };
}
function InstrumentPanel({ decl }) {
  const D = decl || {};
  /* [STAGE 2026-08-02] A PANEL IS SCALED TO FIT, NEVER CROPPED.
     The viewer no longer scrolls, so an instrument taller than its frame is
     not "scroll a bit" any more - it is a cropped panel, and a cropped panel
     can hide the latch. Tightening the spacing at narrow widths recovered
     most of it (100px over at 504 wide, down to 27px) but chasing the last
     pixels was starting to cost legibility, and it would have to be chased
     again for every new frame size.
     So the rule is exact instead: measure the panel against the frame and
     scale it down by whatever it is over. A real panel seen from further
     away is smaller and still whole, which is the honest reading of a fixed
     instrument in a fixed stage. Scaling only ever shrinks - a panel with
     room to spare is left at its true size rather than blown up. */
  const fitRef = useRef(null);
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el || !el.parentElement) return;
    function measure() {
      const avail = el.parentElement.clientHeight;
      if (!avail) return;
      const natural = el.scrollHeight;
      /* two pixels of headroom: sub-pixel rounding in the scaled rect left a
         2px residue at the frame's edge, and a hairline of slack costs
         nothing visible while making "nothing is cropped" exactly true. */
      setFit(natural > avail ? Math.max(0.6, (avail - 2) / natural) : 1);
    }
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) { ro.observe(el.parentElement); ro.observe(el); }
    return () => { if (ro) ro.disconnect(); };
  }, []);
  const drumPos = Array.isArray(D.drum && D.drum.positions) ? D.drum.positions : [];
  const dialPos = Array.isArray(D.dial && D.dial.positions) ? D.dial.positions : [];
  const swDecl  = Array.isArray(D.switches) ? D.switches : [];

  const [drumIdx, setDrumIdx] = useState(0);
  const [dialIdx, setDialIdx] = useState(0);
  const [swOn, setSwOn] = useState(() => swDecl.map(w => !!w.on));

  /* [N1 2026-08-02] THE POINTER POINTS AT THE LEGEND IT HAS CHOSEN.
     The knob rotated by `idx * 90 - 45`, which is a number that happens to
     move rather than an angle that means anything: at LIVE the mark aimed up
     and to the LEFT, away from both legends, and at SEEDED it aimed up and to
     the right at nothing in particular. On a real instrument the pointer is
     how you read the setting, so it has to aim AT the reading.
     MEASURED, NOT TABULATED. The angle is computed from where the legends
     actually land - knob centre to legend centre - rather than written down
     as a constant per position. A table would be right until someone adds a
     third source, restyles the column or wraps a label, and then it would be
     confidently wrong; this cannot drift because it reads the layout it is
     pointing into. */
  const knobRef = useRef(null);
  const marksRef = useRef(null);
  const [angles, setAngles] = useState([]);
  useLayoutEffect(() => {
    const k = knobRef.current, m = marksRef.current;
    if (!k || !m) return;
    function measure() {
      const kb = k.getBoundingClientRect();
      const cx = kb.left + kb.width / 2, cy = kb.top + kb.height / 2;
      const out = [];
      for (const el of m.children) {
        const b = el.getBoundingClientRect();
        const dx = (b.left + b.width / 2) - cx;
        const dy = (b.top + b.height / 2) - cy;
        /* CSS rotate(0) puts the mark at 12 o'clock, so 0deg is -Y and the
           angle grows clockwise: atan2(dx, -dy). */
        out.push(Math.atan2(dx, -dy) * 180 / Math.PI);
      }
      setAngles(out);
    }
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) { ro.observe(m); ro.observe(k); }
    return () => { if (ro) ro.disconnect(); };
  }, [dialPos.length]);

  const N = Math.max(drumPos.length, 1);
  const STEP = 360 / N;
  const FACE_H = 34;
  const RADIUS = N > 2 ? (FACE_H / 2) / Math.tan(Math.PI / N) : FACE_H;

  const drum = drumPos[drumIdx] || {};
  const dial = dialPos[dialIdx] || {};
  const swBad = swDecl.findIndex((w, i) => swOn[i] !== !!w.armsWhen);
  const armed = !!drum.arms && !!dial.arms && swBad === -1;

  /* the panel explains its own refusal, most-specific first */
  let refusal = null;
  if (!armed) {
    if (swBad !== -1) refusal = swDecl[swBad].held;
    else if (!drum.arms) refusal = drum.why;
    else if (!dial.arms) refusal = dial.why;
  }

  function roll(d) { setDrumIdx(i => (i + d + N) % N); }

  return (
    <div ref={fitRef} className={"ip" + (armed ? " ip-armed" : "")}
         style={fit < 1 ? { transform: `scale(${fit.toFixed(4)})`,
                            transformOrigin: "top center" } : undefined}>
      {/* [N2 2026-08-02] THE PANEL IS MOUNTED, NOT PRINTED. Four screws in
          the corners, each seated at a DIFFERENT angle - a screw that lines
          up with its neighbours is a logo, not a fastener, and the eye knows
          the difference without being told why. They are furniture, so they
          live in the renderer with the bevels and the wear rather than in the
          artist config: no face should have to declare its own screws. */}
      <i className="ip-screw ip-screw-tl" aria-hidden="true" style={{ "--turn": "18deg" }} />
      <i className="ip-screw ip-screw-tr" aria-hidden="true" style={{ "--turn": "-42deg" }} />
      <i className="ip-screw ip-screw-bl" aria-hidden="true" style={{ "--turn": "71deg" }} />
      <i className="ip-screw ip-screw-br" aria-hidden="true" style={{ "--turn": "-7deg" }} />
      {D.plate && <div className="ip-plate">{D.plate}</div>}

      <div className="ip-deck">
        {/* ---- THE DRUM ---- */}
        <div className="ip-bay ip-bay-drum">
          <div className="ip-legend">{D.drum && D.drum.label}</div>
          <div className="ip-drumwrap">
            <button className="ip-roll" onClick={() => roll(-1)} aria-label="roll up">&#9650;</button>
            <div className="ip-drum">
              <div className="ip-drum-spin" style={{ transform: `rotateX(${drumIdx * STEP}deg)` }}>
                {drumPos.map((p, i) => (
                  <div key={p.id || i} className="ip-drum-face"
                       style={{ transform: `rotateX(${-i * STEP}deg) translateZ(${RADIUS}px)` }}>
                    {p.label}
                  </div>
                ))}
              </div>
              <div className="ip-drum-glass" />
            </div>
            <button className="ip-roll" onClick={() => roll(1)} aria-label="roll down">&#9660;</button>
          </div>
          {D.drum && D.drum.sub && <div className="ip-sub">{D.drum.sub}</div>}
        </div>

        {/* ---- THE BAT SWITCHES ---- */}
        <div className="ip-bay ip-bay-switches">
          {swDecl.map((w, i) => (
            <div key={w.id || i} className="ip-sw">
              <span className={"ip-lamp ip-lamp-" + (w.lamp || "warm") + (swOn[i] ? " ip-lit" : "")} />
              <button className={"ip-bat" + (swOn[i] ? " ip-bat-up" : "")}
                      onClick={() => setSwOn(v => v.map((x, j) => (j === i ? !x : x)))}
                      aria-pressed={swOn[i]} aria-label={w.label}>
                <span className="ip-bat-lever" />
              </button>
              <span className="ip-sw-legend">
                <span className="ip-sw-name">{w.label}</span>
                {w.sub && <span className="ip-sw-sub">{w.sub}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* ---- THE ROTARY DIAL ---- */}
        <div className="ip-bay ip-bay-dial">
          <div className="ip-legend">{D.dial && D.dial.label}</div>
          <div className="ip-dial">
            <button ref={knobRef} className="ip-knob"
                    style={{ transform: `rotate(${angles[dialIdx] ?? 0}deg)` }}
                    onClick={() => setDialIdx(i => (i + 1) % Math.max(dialPos.length, 1))}
                    aria-label={"source: " + (dial.label || "")}>
              <span className="ip-knob-mark" />
            </button>
            {/* [N1 2026-08-02] THE LEGENDS SIT ON AN ARC, AND THAT IS WHAT
                MAKES THE POINTER READABLE. Stacked in a column they measured
                82deg and 98deg from the knob - the pointer aimed at the right
                legend and the SIXTEEN DEGREES between them was invisible, so
                the instrument looked broken while being exactly correct. A
                rotary selector's detents are spread around its dial; laid on
                a 100deg arc the same two positions are a hundred degrees
                apart and the throw is unmistakable.
                The arc is generated from the number of positions, so a third
                source spaces itself, and the pointer angle is still MEASURED
                from where the legends actually land - the layout moved, the
                aiming code did not have to. */}
            <div ref={marksRef} className="ip-dial-marks">
              {dialPos.map((p, i) => (
                <span key={p.id || i}
                      style={dialArc(i, dialPos.length)}
                      className={"ip-dial-mark" + (i === dialIdx ? " ip-on" : "")}>
                  {/* [N1 2026-08-02] THE TIE LINE WAS BUILT, RENDERED AND
                      REJECTED - Mike asked to be told if it was noise, and it
                      was. A rule from the legend back toward the knob touches
                      NEITHER end: the knob is round and the line stops short
                      of its rim, the label has its own letter-spacing and the
                      line stops short of that too. What it actually reads as,
                      at the size this is set, is an em-dash in front of the
                      word - punctuation, not a connection. Tried at 14px and
                      at 27px; the longer one reads as a leader rule pointing
                      at nothing, which is worse.
                      THE POINTER IS ALREADY THE INDICATOR. It is measured to
                      aim at the chosen legend and it sweeps 73deg between the
                      two, so the relationship is stated once, by the
                      instrument, in the way the instrument states things. */}
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- THE LATCH ---- */}
      <div className="ip-latchbay">
        <button className="ip-latch" disabled={!armed}
                onClick={() => {
                  if (!armed) return;
                  window.dispatchEvent(new CustomEvent(
                    (D.latch && D.latch.event) || "wb-robots-open-twin",
                    { detail: { preset: drum.id } }
                  ));
                }}>
          <span className="ip-latch-face">{(D.latch && D.latch.label) || "LATCH"}</span>
        </button>
        <div className="ip-state">
          <span className={"ip-lamp ip-lamp-green" + (armed ? " ip-lit" : "")} />
          <span className="ip-state-txt">
            {armed ? ((D.latch && D.latch.armed) || "ARMED")
                   : ((D.latch && D.latch.idle) || "NOT ARMED")}
          </span>
        </div>
      </div>

      {/* the panel says why it will not arm — never silently */}
      {!armed && refusal && <div className="ip-refusal">{refusal}</div>}
      {armed && drum.line && <div className="ip-readout">{drum.line}</div>}
    </div>
  );
}


/* ======== MOTHBALLED 2026-08-03 (M1) — NOTHING MOUNTS THIS ================
   THE NO-HIDDEN-INFORMATION LAW retired the pager. `stage: true` was declared
   by exactly one wing (/robots) and that wing now declares `faceFlow: "flat"`,
   so `Stage`, `StageChildren`, every `.stg-*` rule and every
   `.ex-root[data-stage="1"]` rule below are unreachable from any route.

   KEPT RATHER THAN DELETED, and the reason is narrow: the law is a ruling about
   what a VISITOR may be shown, not a verdict on the machinery. The packer is
   two rounds of measured work (B5's page-width division, the four STAGE FIXes,
   the greedy column packer) and it solves a problem that will exist again the
   day this museum prints something to a fixed sheet — a real reel, a slideshow,
   the one exception the law itself names. Deleting it would mean re-deriving it
   from the comments.

   REVIVAL IS ONE WORD: an artist declaring `stage: true` instead of
   `faceFlow: "flat"` gets it back exactly as it was; nothing else was touched.
   The L5 sheet-on-mat rules that used to hang off `[data-stage="1"]` have moved
   to `[data-exhibit="robots"]`, because those describe the wing and not the
   machinery — see the note at that rule in Exhibit.css.
   If a future round finds this still unmounted, that is the round that should
   delete it.
   ========================================================================= */
/* ======== [STAGE 2026-08-02] THE VIEWER NEVER SCROLLS ====================
   Mike's ruling, built. The viewer stops being a box with a scrollbar and
   becomes a STAGE: a fixed frame that content is FITTED to and advanced
   through as pages. The trap it replaces was measured before it died - The
   Record hid 182px of itself on a desktop and 533px on a phone, and on a
   phone every single track was trapped, because the panel scrolled inside
   itself while the page behind it still had scroll left.

   HOW IT PAGINATES, AND WHY IT IS HONEST ABOUT IT.
   The caller hands the stage a list of BLOCKS - indivisible things, each of
   which must land whole on some page. The stage renders them all once into a
   measuring layer that is the same width and the same column geometry as the
   real page, reads their true heights off the DOM, and packs greedily. It
   does not estimate from character counts and it does not guess: a block's
   height is whatever the browser says it is at the width it will really have.

   COLUMNS ARE PART OF THE CAPACITY, NOT DECORATION. Mike ruled that width
   buys a COLUMN rather than a longer line, so a wide stage sets two columns -
   and two columns hold twice the block-height. `column-fill:auto` fills the
   first column before the second, which is the only mode that matches the
   packing model; the default (balance) would flow blocks in an order the
   packer did not choose and the two would disagree at the bottom of a page.

   SHORT PAGES ARE ALLOWED, per the ruling. Pages fill naturally, the last
   page ends where the document ends, and the endmark closes it. Nothing is
   stretched to reach the bottom and no page is padded to look full.

   THE ONE CASE THAT CANNOT BE PACKED is a single block taller than the whole
   stage. It gets a page of its own and IS ALLOWED TO EXCEED IT - and says so
   in the console rather than clipping silently, because silently cropping is
   the trap coming back wearing a different hat. The fix for a real one is to
   split it into smaller blocks upstream; the stage refuses to pretend.

   ==== [B5 2026-08-02] A WALL IS NOT A COLUMN. ============================
   MIKE, with a screenshot: "the plates content is clipped and does not
   scroll; pages work but page 2 renders BLANK."
   BOTH SYMPTOMS, ONE CAUSE, MEASURED ON THE LIVE PAGE. The plate wall is a
   `repeat(auto-fill,minmax(200px,1fr))` grid, and in a 582px column that
   auto-fills to TWO tiles across - so nine plates stack into five rows and
   the block measures 1134px against a column that holds 758. The stage did
   exactly what it promises above: gave it a column of its own, warned, and
   overran - and `.stg-col{overflow:hidden}` ate 376px, which is three
   plates, with no scrollbar to reach them. The footer, being the only block
   left over, then took a page to itself: 17px of type on an otherwise empty
   sheet. That is the "blank page 2".
   SPLITTING IT WAS THE WRONG FIX and worth saying so, because it is the fix
   this component's own error message recommends. Split by tile, each tile
   becomes a one-child grid that auto-fills to two tracks and sits in the
   left one - a vertical strip of half-empty rows. The wall stops being a
   wall to satisfy the packer.
   SO THE PACKER LEARNED THE OTHER SHAPE INSTEAD. A block marked
   `data-stage-full` is not packed into a column at all: it takes a PAGE, at
   the page's full width. The same nine plates auto-fill to five across in
   1203px and land in two rows - 342px, comfortably inside the sheet. The
   wall gets the wall, which is what it was always asking for.
   ORDER IS PRESERVED: blocks before it pack into pages, it takes the next
   page, blocks after it pack into the pages that follow. A full block is a
   page break with a picture on it, not a block that jumped the queue.

   AND A WALL TOO BIG FOR ONE PAGE TAKES SEVERAL. Caught by measurement at
   387px before it could ship: on a phone the sheet is only 223px tall (the
   carousel, the tracklist and the transport have already spent the screen),
   and nine plates at two-across are 823px. The full page fixed the desktop
   and left SIX OF NINE PLATES clipped on a phone — the original defect, at a
   width nobody had looked at.
   So a full block is measured AT PAGE WIDTH and, if it overruns, is divided
   into as many full pages as it needs. The division is arithmetic on a
   uniform grid — n children spread over ceil(height/page) pages — which is
   exactly right for a wall of same-shaped tiles and is the only assumption
   this makes. Each page renders a clone of the container holding its own
   run, so every page is a real wall with the container's own layout, not a
   list of orphaned tiles.
   ON A DESKTOP THIS PATH IS INERT BY CONSTRUCTION: the wall measures 423px
   into a 758px sheet, one chunk, the identical single page as before. */
function Stage({ blocks, deps, footer, full, fullMeta }) {
  const wrapRef = useRef(null);
  const measRef = useRef(null);
  /* the second measuring layer, pinned to the PAGE's width rather than a
     column's, because that is the width a full block will really have. */
  const measFullRef = useRef(null);
  /* a page is a LIST OF COLUMNS, each column a [from,to) run of blocks. */
  const [pages, setPages] = useState([[[0, blocks.length]]]);
  const [pg, setPg] = useState(0);
  const [cols, setCols] = useState(1);

  /* one measure, run on layout and on any resize of the stage */
  useLayoutEffect(() => {
    const wrap = wrapRef.current, meas = measRef.current;
    const measFull = measFullRef.current;
    if (!wrap || !meas) return;
    function plan() {
      const box = wrap.getBoundingClientRect();
      /* the measure rule: one comfortable column, and a second only when
         there is genuinely room for two of them side by side. */
      const n = box.width >= 760 ? 2 : 1;
      setCols(n);
      /* ==== [STAGE FIX 2026-08-02] PACK BY COLUMN, NOT BY PAGE ==============
         THE BUG, MEASURED. Capacity was budgeted as `height * n` — the total
         ink a page can hold. That is right only if blocks may straddle a
         column boundary, and a boxed aside may not: `break-inside: avoid` is
         the whole point of a box. So a page could be "full" by arithmetic
         while the browser, unable to split the last block, pushed it into a
         THIRD column of a two-column box — outside the element, under
         `overflow:hidden`. Content silently gone.
         Measured on Carsie Blanton's artist card: page box 1169x613,
         scrollWidth 1773. A 396px sidebox landed at x=1207 with 234px left in
         column two. That is exactly the trap this component was built to
         abolish, arriving sideways.
         THE FIX IS TO PLAN THE UNIT THE BROWSER ACTUALLY BREAKS ON. Runs are
         packed to ONE COLUMN each, then grouped n-at-a-time into pages, so no
         block is ever asked to straddle. And because a greedy browser could
         still fill a column differently from the plan, the last block of each
         planned column carries `break-after: column` — the plan is not a hope,
         it is instructed. */
      const colH = Math.max(80, box.height);

      /* ==== [STAGE FIX 2026-08-02, part two] MEASURE AT THE REAL WIDTH ======
         The comment above this component has always claimed the measuring
         layer is "the same width and the same column geometry as the real
         page". IT WAS NOT. `.stg-measure` is `position:absolute; width:100%`,
         which resolves against the STAGE, while `.stg-page` sits inside it
         with its own padding. Measured: 1229px against 1169px — a 60px lie,
         and with two columns that is 596px of column against 566px.
         Narrower columns make text TALLER, so every block measured short: one
         label block reported 157px and rendered 188px. The packer was solving
         the right problem with the wrong numbers, which is why its pages had
         always run a little over.
         Pinning the width from the page itself makes them identical BY
         CONSTRUCTION rather than by two CSS rules agreeing, which is the only
         version that cannot drift. */
      /* THE GAP COMES FROM A CUSTOM PROPERTY, NOT FROM THE COMPUTED COLUMN-GAP,
         AND THE REASON IS AN ORDERING BUG THAT COST TWO MEASUREMENTS TO FIND.
         `column-gap` only has a value once `.stg-2col` is on the element — and
         that class comes from `cols`, which THIS function sets. So on the first
         plan after a face changes from one-column to two, the class was not on
         yet, the gap read as `normal` (0), and colW came out as the whole page
         width. Blocks measured against a 1169px line instead of a 566px one are
         far too short, the packer over-filled, and the column clipped by 53px.
         Re-measuring later fixed it, which is exactly why it looked
         intermittent.
         `--stg-colgap` is declared on `.stg`, which is always present and never
         conditional, so the packer and the stylesheet read ONE number and the
         plan cannot depend on its own output. */
      const colGap = parseFloat(
        getComputedStyle(wrap).getPropertyValue("--stg-colgap")) || 0;
      const colW = Math.max(80, (wrap.clientWidth - colGap * (n - 1)) / n);
      if (Math.round(meas.clientWidth) !== Math.round(colW)) {
        meas.style.width = Math.round(colW) + "px";
        /* read something back to force the reflow before heights are taken */
        void meas.offsetWidth;
      }
      const kids = Array.from(meas.children);
      /* THE GAP IS PART OF THE HEIGHT. The page is a flex column with a gap,
         so N blocks occupy sum(heights) + (N-1)*gap - and the first version
         packed on heights alone, which under-counted by one gap per block and
         let the LAST page overrun by exactly that much (measured: 30px on a
         3-block page, 82px on a 7-block one). Counted properly now. */
      const gap = parseFloat(getComputedStyle(meas).rowGap || getComputedStyle(meas).gap || 0) || 0;
      /* ---- pass 1: pack COLUMNS, each of which must hold on its own ----
         Packing runs over a RANGE rather than over the whole list, because a
         full-page block splits the document into stretches that pack
         independently. Within a stretch this is the identical greedy packer
         it has always been. */
      function packRange(from, to) {
        const runs = [];
        let start = from, run = 0;
        for (let i = from; i < to; i++) {
          const el = kids[i];
          const h = el.getBoundingClientRect().height +
                    parseFloat(getComputedStyle(el).marginBottom || 0) +
                    (i > start ? gap : 0);
          if (h > colH && run === 0) {
            /* taller than a whole column: its own column, and we say so. The
               stage still refuses to crop silently — it overruns loudly. */
            runs.push([i, i + 1]);
            try {
              console.warn("[stage] block " + i + " is " + Math.round(h) +
                "px and a column holds " + Math.round(colH) +
                "px - it gets a column of its own and will overrun. Split it " +
                "upstream, or mark it data-stage-full if it wants the page.");
            } catch (e) { /* console may be absent */ }
            start = i + 1; run = 0;
            continue;
          }
          if (run + h > colH && i > start) { runs.push([start, i]); start = i; run = h; }
          else { run += h; }
        }
        if (start < to) runs.push([start, to]);
        return runs;
      }

      /* ---- pass 2: n columns make a page, and a FULL block makes its own --
         The document is walked in order and cut at every full block, so the
         reading order out is the authoring order in. A full page is recorded
         as `{full:i}` rather than as a run, which is what lets the renderer
         draw it at the page's width instead of a column's. */
      const out = [];
      function flush(from, to) {
        if (to <= from) return;
        const runs = packRange(from, to);
        for (let c = 0; c < runs.length; c += n) out.push(runs.slice(c, c + n));
      }
      /* HOW MANY TILES A PAGE OF THIS WALL HOLDS, measured at the width it
         will really have — and measured as ROWS, which is the unit a wall is
         actually made of.
         THE OBVIOUS ARITHMETIC IS WRONG AND WAS TRIED FIRST: dividing the
         wall's height by the page's height says nine plates over 823px need
         four pages, so three tiles a page — and three tiles across a
         two-column grid is TWO ROWS, 333px into a 223px sheet. Height does
         not divide linearly across a grid because a grid quantises to rows,
         so the number that matters is how many whole rows fit and how many
         tiles are in a row. Both are read off the layer rather than assumed,
         so a wall with different tiles, a different grid or a different
         breakpoint needs nothing here. */
      const fullH = new Map();
      if (measFull) {
        const pw = Math.round(wrap.clientWidth);
        if (Math.round(measFull.clientWidth) !== pw) {
          measFull.style.width = pw + "px";
          void measFull.offsetWidth;
        }
        Array.from(measFull.children).forEach((el, i) => {
          if (!full || !full.has(i)) return;
          const h = el.getBoundingClientRect().height;
          const tiles = Array.from(el.children);
          let per = tiles.length;
          if (tiles.length > 1) {
            const t0 = tiles[0].getBoundingClientRect().top;
            const across = tiles.filter(
              k => Math.abs(k.getBoundingClientRect().top - t0) < 2).length;
            const nextRow = tiles.find(
              k => k.getBoundingClientRect().top - t0 > 2);
            const rowH = nextRow ? nextRow.getBoundingClientRect().top - t0 : h;
            const rows = Math.max(1, Math.floor(colH / rowH));
            per = Math.max(1, across * rows);
          }
          fullH.set(i, { h, per });
        });
      }
      let seg = 0;
      for (let i = 0; i < kids.length; i++) {
        if (!full || !full.has(i)) continue;
        flush(seg, i);
        const meta = fullMeta && fullMeta.get(i);
        const m = fullH.get(i) || { h: 0, per: 0 };
        const h = m.h;
        /* one page unless it genuinely does not fit; a container we cannot
           divide (no children to split on) keeps the old behaviour and
           overruns loudly rather than silently. */
        const per = m.per;
        const parts = (meta && meta.count > 1 && h > colH && per > 0)
          ? Math.ceil(meta.count / per) : 1;
        if (parts > 1) {
          for (let c = 0; c < parts; c++) {
            const a = c * per, b = Math.min(meta.count, a + per);
            if (b > a) out.push({ full: i, from: a, to: b });
          }
        } else {
          if (h > colH) {
            try {
              console.warn("[stage] full block " + i + " is " + Math.round(h) +
                "px against a " + Math.round(colH) + "px page and cannot be " +
                "divided - it will overrun. Give its container children to " +
                "split on.");
              /* optional catch binding — the sibling warn above uses
                 `catch (e)` and is one of the file's documented pre-existing
                 lint errors; a new one should not add a second. */
            } catch { /* console may be absent */ }
          }
          out.push({ full: i });
        }
        seg = i + 1;
      }
      flush(seg, kids.length);
      setPages(out.length ? out : [[[0, kids.length]]]);
    }
    plan();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(plan) : null;
    if (ro) ro.observe(wrap);
    return () => { if (ro) ro.disconnect(); };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [deps, blocks.length]);

  /* a new document starts at its first page */
  useEffect(() => { setPg(0); }, [deps]);
  const last = pages.length - 1;
  const cur = Math.min(pg, last);
  const page = pages[cur] || [[0, blocks.length]];
  /* a page is either a list of column runs or a single full-width block */
  const fullIdx = Array.isArray(page) ? null : page.full;
  const pageCols = Array.isArray(page) ? page : [];

  /* the transport is the only navigation, and it is absent when there is
     only one page - a single-page document does not need a page control. */
  const many = pages.length > 1;
  useEffect(() => {
    if (!many) return;
    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === "PageDown") setPg(p => Math.min(last, p + 1));
      if (e.key === "ArrowLeft" || e.key === "PageUp") setPg(p => Math.max(0, p - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [many, last]);

  return (
    <div className="stg">
      {/* ==== [STAGE FIX 2026-08-02, part three] THE PACKER OWNS THE COLUMNS ==
          The page was a CSS multi-column box and the packer was trying to
          predict what that box would do. It could not: `column-fill:auto`
          fills greedily, `break-inside:avoid` makes a boxed aside jump rather
          than split, and the two together push content into a column that does
          not exist — clipped away under `overflow:hidden`.
          Two rounds of trying to instruct the browser (a break-after hint, a
          width correction) each fixed a real defect and still left content
          lost, because the disagreement was structural: two algorithms were
          laying out the same page.
          So there is only one now. The packer already computes exactly which
          blocks belong in which column; it renders them there. Each column is
          a plain flex column of its own run, and nothing can overflow into a
          column that was never planned. The multicol rules are gone with the
          bug — `column-fill`, `break-inside`, `break-after` and the width
          reconciliation all existed to referee a negotiation that no longer
          happens. */}
      {/* A SHORT PAGE KEEPS ITS COLUMN WIDTH BUT LOSES ITS RULE.
          The last page of a document — and any document small enough to be one
          page — often fills only the first column. Two things follow, and they
          pull in opposite directions:
            · the empty column must still be THERE, or the surviving column
              stretches to the full width and the line length doubles, which is
              precisely the "width buys a column, not a longer line" ruling
              being broken by its own layout;
            · the divider must NOT be there, because a full-height rule with
              nothing to the right of it reads as a fault rather than as a
              column that ran out.
          So the page is padded to `cols` columns and the rule is dropped. */}
      {/* [B5] A FULL PAGE IS ONE COLUMN THE WIDTH OF THE SHEET. It keeps the
          `.stg-page` element (and so the measurement geometry) and simply
          drops the two-column furniture: no `stg-2col`, no divider rule, one
          `.stg-col` that is the page. */}
      <div ref={wrapRef} className={"stg-page" +
             (fullIdx === null && cols > 1 ? " stg-2col" : "") +
             (fullIdx !== null ? " stg-full" : "") +
             (fullIdx === null && pageCols.length < 2 ? " stg-1up" : "")}>
        {fullIdx !== null ? (
          <div className="stg-col">{(() => {
            /* a divided wall renders a CLONE of its own container holding
               this page's run, so each page is a real wall (its grid, its
               gaps, its tilts) rather than a handful of loose tiles. */
            const meta = fullMeta && fullMeta.get(fullIdx);
            if (meta && page.to !== undefined) {
              return React.cloneElement(meta.el, { key: "f" + page.from },
                meta.kids.slice(page.from, page.to));
            }
            return blocks[fullIdx];
          })()}</div>
        ) : Array.from({ length: Math.max(cols, pageCols.length) }, (_, ci) => {
          const r = pageCols[ci];
          return (
            <div className="stg-col" key={ci}>
              {r ? blocks.slice(r[0], r[1]) : null}
            </div>
          );
        })}
      </div>
      {/* the measuring layer: same width, same columns, never seen, never
          reachable by pointer or by a screen reader. */}
      <div ref={measRef} className={"stg-measure" + (cols > 1 ? " stg-2col" : "")}
           aria-hidden="true">{blocks}</div>
      {/* the page-width layer. Only full blocks are read off it, but it holds
          them all so an index into `blocks` means the same thing in both. */}
      <div ref={measFullRef} className="stg-measure" aria-hidden="true">{blocks}</div>
      {/* ==== [STAGE FIX 2026-08-02, part four] THE TRANSPORT ALWAYS HOLDS ITS
          GROUND, and this is the last of the four and the one that was really
          doing the damage.
          The transport used to render only when there was more than one page.
          So the packer measured a page 667px tall, decided the document needed
          three pages, and THE ACT OF DECIDING added a 42px control that shrank
          the page it had just measured to 613. Planned content 666 against a
          613 box: 53px clipped, every time a single-page face was followed by
          a multi-page one. A plan invalidated by its own output.
          The row is now always in the flow and merely goes invisible when
          there is one page — so nothing is shown that is not needed, which is
          what the ruling actually asks, while the geometry stops moving under
          the measurement. */}
      {(
        <nav className={"stg-tp" + (many ? "" : " stg-tp-idle")}
             aria-hidden={many ? undefined : "true"}>
          <button className="stg-step" disabled={cur === 0}
                  onClick={() => setPg(p => Math.max(0, p - 1))}>&lsaquo; Back</button>
          <span className="stg-cnt">
            {footer ? footer + "  \u00b7  " : ""}Page {cur + 1} of {pages.length}
          </span>
          <button className="stg-step" disabled={cur === last}
                  onClick={() => setPg(p => Math.min(last, p + 1))}>Next &rsaquo;</button>
        </nav>
      )}
    </div>
  );
}


/* THE WRAPPER, and why the face's JSX was not rewritten to use the stage.
   Every block the viewer draws already exists as a top-level child of the
   face body - the head, the register, the entries, the footer, the [PAPA]
   note, the controls. `React.Children.toArray` hands exactly those back, so
   the stage can paginate the face WITHOUT any of that markup moving. A
   rewrite would have churned two hundred lines of working, commented JSX to
   arrive at the same list.

   `data-stage-split` FLATTENS A CONTAINER. A ten-entry index is one DOM node
   and would page as one indivisible slab - which on a phone is exactly the
   trap again, so the stage would have to warn and overrun. A container marked
   for splitting is expanded into one block per child, each re-wrapped in a
   clone of its own container so it keeps its element type and its classes.
   That is what lets a long list break across pages by ROW. */
/* `data-stage-full` IS THE OPPOSITE INSTRUCTION and the two are exclusive by
   nature: split says "this is many things, break it up", full says "this is
   one thing and it wants the whole sheet". A wall of plates is the second. */
function StageChildren({ children, deps, footer }) {
  const blocks = [];
  const full = new Set();
  /* what a full block would need to divide itself: its own element (so a
     page can be a clone of it) and its children (so a page can hold a run).
     Recorded here because this is the only place that still has them. */
  const fullMeta = new Map();
  React.Children.toArray(children).forEach((child, i) => {
    const split = child && child.props && child.props["data-stage-split"];
    if (split && child.props.children) {
      React.Children.toArray(child.props.children).forEach((row, j) => {
        blocks.push(React.cloneElement(child, { key: "s" + i + "-" + j }, row));
      });
    } else {
      if (child && child.props && child.props["data-stage-full"]) {
        const kids = React.Children.toArray(child.props.children);
        fullMeta.set(blocks.length, { el: child, kids, count: kids.length });
        full.add(blocks.length);
      }
      blocks.push(child);
    }
  });
  return <Stage blocks={blocks} deps={deps} footer={footer}
                full={full} fullMeta={fullMeta} />;
}

/* [W7 2026-08-02] THE FLAT ALTERNATIVE TO THE STAGE — one column, full
   length, in the page's own flow. Mike's ruling for WAL: the stacked, paged
   cards were classy but a barrier to exploration; each face is now FLAT with
   the full page length available and NO internal scrolling. The Stage's
   no-scroll LAW survives in its only honest reading — there is still no
   inner scroll trap anywhere; the DOCUMENT is the one thing that scrolls,
   which is ordinary reading, not a trap. The same children render in both
   modes, so a wing switching frames rewrites nothing. */
function FaceFlow({ flat, children, deps, footer }) {
  if (flat) return <div className="vp-flat">{children}</div>;
  return <StageChildren deps={deps} footer={footer}>{children}</StageChildren>;
}

/* ===========================================================================
   [A3/A4 2026-08-04] THE ARCHIVE — W2's collage, stacked in SPREADS
   ---------------------------------------------------------------------------
   MIKE: "images stack in albums BY RECORD NUMBER; the LATEST SPREAD DISPLAYS
   AT TOP (frictionless newest, everything older neatly stowed within reach)."

   THIS IS NOT A SECOND RENDERER. It is W2's collage wall with one thing added
   — the wall may arrive in more than one piece, each piece headed. A face that
   declares no `spreads` is fed its `collage` as a single unheaded spread and
   emits **the same DOM it emitted before**, which is the house's own rule for
   every optional key on a face (F1's `img`, B9's `wire`/`plates`, L6's `docs`,
   v45's `sections`).

   THE ORDER IS THE RECORD NUMBER, DESCENDING, and it degrades honestly. A
   spread declaring `no` sorts above one that does not, highest first; `sort` is
   stable, so spreads with no number keep the order the file authored them in.
   **Today not one spread carries a number** — the museum holds no record
   number for any of these photographs and Ops does not get to invent one
   (Doctrine 12) — so every spread falls to the authored order, which the data
   file states is newest-first. The moment a number is known it is one field,
   and the stack re-orders itself.

   THE LIGHTBOX WALKS THE WHOLE ARCHIVE, NOT ONE SPREAD. B6's contract is that
   a tile hands over the entire wall and its own index into it; `wall` below is
   the spreads flattened IN DISPLAY ORDER, so opening the third plate of the
   second spread and pressing ‹ › walks back into the first. The tilt reads the
   same flat index, so the glued-up angles do not restart at each heading.
   =========================================================================== */
function archiveSpreads(face) {
  const declared = Array.isArray(face?.spreads) && face.spreads.length
    ? face.spreads
    : (Array.isArray(face?.collage) && face.collage.length
        ? [{ head: null, no: null, tiles: face.collage }]
        : []);
  const key = s => (typeof s.no === "number" ? s.no : -1);
  let n = 0;
  const spreads = [...declared].sort((a, b) => key(b) - key(a)).map(s => {
    const tiles = Array.isArray(s.tiles) ? s.tiles : [];
    const base = n;
    n += tiles.length;
    return { head: s.head ?? null, no: key(s) >= 0 ? s.no : null, tiles, base };
  });
  return { spreads, wall: spreads.flatMap(s => s.tiles) };
}

/* [N2 2026-08-04] THE ARCHIVE'S UNIT NOUN, declarable per face.
   The wall is generic and its contents are not: this wing calls its images
   PLATES, and a video archive would call its own contents something else. A
   face may declare `archiveUnit: { one, many }`; the default is the archive's
   own plain name, which is the one word that cannot be wrong for an image
   archive. It is only ever read for the stowed-shelf count. */
const ARCHIVE_UNIT = { one: "image", many: "images" };

function SpreadHead({ sp, unit, count }) {
  return (
    <>
      <span className="vp-spread-head-t">{sp.head}</span>
      <span className="vp-spread-meta">
        {sp.no != null && (
          <span className="vp-spread-no">
            {`Record ${String(sp.no).padStart(3, "0")}`}
          </span>
        )}
        {count && (
          <span className="vp-spread-count">
            {`${sp.tiles.length} ${sp.tiles.length === 1 ? unit.one : unit.many}`}
          </span>
        )}
      </span>
    </>
  );
}

function SpreadTiles({ sp, wall, face, openLink }) {
  return (
    /* [B5] `data-stage-full` — the wall takes the page. Unchanged. */
    <div className="vp-collage" data-stage-full="1">
      {sp.tiles.map((c, ti) => {
        const i = sp.base + ti;
        return (
          <button key={i} className="vp-collage-tile"
            style={{ "--tilt": `${((i * 7) % 9) - 4}deg` }}
            onClick={() => openLink(c.href,
              { set: wall, index: i, setTitle: face.title })}>
            {/* eager, not lazy: the wall IS the page's payoff and a wall
                that fills in as you watch reads as a broken wall. */}
            <img src={c.img} alt="" />
            {/* [A7 2026-08-04] the caption is now conditional on there BEING
                one — `scrubFace` may have taken both halves (C15), and an empty
                caption strip under a plate is a gap that looks like a defect. */}
            {(c.date || c.label) && (
              <span className="vp-collage-cap">
                {c.date && <span className="vp-collage-date">{c.date}</span>}
                {c.label && <span className="vp-collage-title">{c.label}</span>}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ArchiveWall({ face, openLink }) {
  const { spreads, wall } = archiveSpreads(face);
  if (!wall.length) return null;
  const unit = face?.archiveUnit || ARCHIVE_UNIT;
  return spreads.map((sp, si) => {
    /* [N2 2026-08-04] THE NEWEST SPREAD IS OPEN PAPER; EVERYTHING OLDER IS
       STOWED. MIKE: "latest spread at top, older neatly stowed" — the second
       half of the sentence A4 built only the first half of. A4 got the ORDER
       right and then printed every spread at full height, so an archive of a
       dozen albums would have been a dozen walls of equal weight and the
       "frictionless newest" it was built for would have been the shortest part
       of a very long page.
       WHY THIS IS NOT THE NO-HIDDEN-INFORMATION LAW BEING BROKEN, which is a
       standing doctrine and beats a convenience every time. That law's
       complaint is a control whose label says nothing about what is behind it
       — "Next ›" — because "people will not flick to discover whether
       something is interesting". A stowed shelf here carries its own DATE and
       its own COUNT on the closed line: `FEBRUARY 2013 · 3 plates` describes
       its contents completely before it is touched, which is the same test the
       booth's question list passes. Nothing is discovered by opening it that
       was not already stated by it.
       AND THE FIRST SPREAD IS NEVER STOWED, so a one-spread archive and a
       plain `collage` face emit the DOM they emitted before. `<details>` is
       the platform's own disclosure element (Doctrine 8): it opens with a
       keyboard, it is announced to a screen reader, and it works with
       JavaScript having a bad day. An unheaded spread is never stowed either,
       because a shelf with no label on it is the one thing a visitor cannot
       be asked to choose to open. */
    const stow = si > 0 && !!sp.head;
    const tiles = <SpreadTiles sp={sp} wall={wall} face={face} openLink={openLink} />;
    if (!stow) {
      return (
        <Fragment key={si}>
          {sp.head && (
            <div className="vp-spread-head">
              <SpreadHead sp={sp} unit={unit} count={false} />
            </div>
          )}
          {tiles}
        </Fragment>
      );
    }
    return (
      <details className="vp-spread-stow" key={si}>
        <summary className="vp-spread-head">
          <SpreadHead sp={sp} unit={unit} count />
        </summary>
        {tiles}
      </details>
    );
  });
}

export default function Exhibit({ artist }) {
  const SPINE = artist.spine;
  const FACTS = artist.facts;
  const ExhibitFlow = artist.exhibitFlow;

  /* [R2 2026-08-02] `useNavigate` retired from this component. Its only two
     callers were the title bar's wordmark and its Gift Shop exit, both of
     which are now real <Link>s inside <MuseumBar/> — which is the point of
     the merge: three rooms navigating three ways became one anchor. */
  const [visible, setVisible]           = useState(false);
  const defaultActive = artist.defaultActiveIndex;
  const [active, setActive]             = useState(defaultActive);
  const [activeDisplay, setActiveDisplay] = useState(defaultActive);
  const debounceRef = useRef(null);

  const [albumActiveTrack, setAlbumActiveTrack] = useState({});
  const [albumSelectedVis, setAlbumSelectedVis] = useState({});

  const [playingAlbum, setPlayingAlbum] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const playQueueRef   = useRef([]);
  const queueAlbumRef  = useRef(null);
  const lastSkipRef    = useRef(0);

  // O9 (controls spec §9.2) — shuffle / loop are real player semantics, so
  // they are owned HERE (the player's scope) and crossed to the preset deck
  // via prop-widening at the <ExhibitFlow> seam — the same mechanism as
  // playingTrack / onRestorePlayer (presets spec §9). Shuffle randomizes the
  // next-up queue; Loop replays the current selection on end. advanceQueue
  // is a first-render closure (the YT/audio onEnded callbacks freeze it), so
  // it reads these through refs, never through state.
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop]       = useState(false);
  const shuffleRef  = useRef(false);
  const loopRef     = useRef(false);
  const loopSeedRef = useRef([]);   // the built selection, replayed on end when Loop is on
  const playingNowRef = useRef({ ai: null, ti: null, vi: null });
  useEffect(() => { loopRef.current = loop; }, [loop]);
  useEffect(() => {
    shuffleRef.current = shuffle;
    // Toggle-on randomizes the LIVE next-up queue immediately (§9.2
    // "randomizes the player's next-up queue"). Toggle-off keeps the
    // already-shuffled remainder (the original order was consumed); the
    // next queue build is ordered again.
    if (shuffle && playQueueRef.current.length > 1) {
      playQueueRef.current = shuffleEntries(playQueueRef.current);
    }
  }, [shuffle]);

  /* [S8 2026-07-30] THE DEFAULT SPLIT IS THE ARTIST'S. 50/50 is right for a
     music exhibit whose tracklist is twenty rows deep. /robots has THREE
     tracks, so half the screen was a column with nine-tenths of it empty —
     the horizontal half of the dead-space complaint. An artist may now state
     its own opening split; without one, 50 as before. */
  const sizingScope = artist.fitOnEntry ? "session" : undefined;
  const [split, setSplit] = usePersist(artist.splitKey, artist.splitDefault ?? 50, sizingScope);
  const [cfH,   setCfH]   = usePersist(artist.cfKey,    300, sizingScope);
  /* [X2] Hooks cannot be conditional, so the state always exists; the KEY is
     what is conditional. An artist without `bodyKey` gets an inert slot that
     nothing reads and nothing renders. */
  const [bodyH, setBodyH] = usePersist(artist.bodyKey || "wb-body-off", BODY_DEF);
  /* [M5 2026-08-01] ONE RECORD AT A TIME, BY INDEX — not a volume that is
     open or shut. S6's model was a single boolean driving two buttons
     ("EARLIER ENTRIES" / "CLOSE THE VOLUME") that operated on the whole log;
     Mike killed both. A record now opens on its own, fills the frame, and
     closes by the same control that opened it. null = the index is showing. */
  const [openEntry, setOpenEntry] = useState(null);
  /* [L2] which recipe is selected; index, reset when the track changes. */
  const [recipeIdx, setRecipeIdx] = useState(0);
  const bodyResizable = !!artist.bodyKey;
  const mainRef = useRef(null);

  /* [M2 2026-08-03] THE ROOM OPENS AS THE MUSEUM ARRANGED IT — ONCE A SESSION.
     Keyed on the WING, not on the URL: an exhibit's albums are one room, and a
     visitor moving between Carsie Blanton and Hunter Root has not arrived
     anywhere new. The sizes half of Mike's ruling ("optimal sizes") is already
     built and already session-scoped — F3's `fitOnEntry` writes its result to
     sessionStorage and re-fits on a fresh visit — so this supplies the other
     half he named, "scrolled top", on the same clock. See src/lib/use-arrival.js
     for why `window.scrollTo` alone is not enough and why presets cannot be
     overridden by it. */
  useArrival(artist.exhibitSlug || artist.id);

  /* [X2 FIX] THE DEFAULT MUST LEAVE ITS OWN HANDLE GRABBABLE.
     Measured at 1600x1000: the player bar is fixed at the viewport floor
     (y 829..897, z 100) and the 460px default put the drag handle at y
     877..891 — INSIDE THE BAR. elementsFromPoint returned `pb > bd-dh`, so
     the first thing a visitor would try to grab was the one thing they could
     not. Same shape as the E4 deck defect: a fixed bar over a control.
     Only the DEFAULT is fitted, and only when the visitor has not already
     chosen: a stored height is their decision and is never overridden. Drag
     freely past this afterwards — the page scrolls and the handle stays
     reachable (see the .bd-dh bottom margin in Exhibit.css). */
  useEffect(() => {
    if (!bodyResizable) return;
    let stored = null;
    try { stored = localStorage.getItem(artist.bodyKey); } catch { /* private mode */ }
    if (stored) return;
    const el = mainRef.current;
    if (!el) return;
    const top  = el.getBoundingClientRect().top + window.scrollY;
    const bar  = document.querySelector(".pb");
    const barH = bar ? bar.getBoundingClientRect().height : 0;
    const fits = Math.round(window.innerHeight - top - barH - 30);
    /* [M6 2026-08-01] THE FIT MAY GROW THE FRAME, NEVER SHRINK IT.
       This line used to pull the default DOWN to whatever the viewport had
       spare - which quietly cancelled M6: the default became 880 and the
       frame still opened at 489, because `fits` was smaller and won. Same
       shape as the FR3 finding, one round earlier: a default that is never
       reached is not a default.
       The clamp existed so the drag handle could not land inside the fixed
       player bar. A frame TALLER than the viewport does not have that
       problem - the handle is below the fold, the page scrolls, and reaching
       it is ordinary scrolling. So the fit is now allowed to grow a generous
       frame on a tall screen and forbidden from shrinking it on a short one. */
    if (fits > BODY_DEF && fits <= BODY_MAX) setBodyH(fits);
  }, [bodyResizable]);

  /* ── [F3 2026-08-02] OPTIMAL FIT ON ENTRY — measured, not tasted ──────────
     Mike's ruling: on entering the wing, the tracklist, the viewer and the
     PUV scroller should SNAP TO sizes where ALL of them fit on one screen.
     The fit is COMPUTED from the live layout: the frame above the body is
     measured as it stands (nav, carousel, drag strip, banner — whatever they
     actually are on this screen with these fonts), the viewer's height is a
     pure function of its column width (16:9), and the two levers the visitor
     already owns — carousel height, then column split — are turned only as
     far as the arithmetic requires:
       lever 1: the carousel gives up height, down to its floor;
       lever 2: only if that is not enough, the viewer column narrows.
     RUNS ONCE PER SESSION: the visitor's own drags (and this fit's result)
     are session-sticky via sessionStorage, so within a visit the room stays
     where they put it, and a fresh visit re-fits for whatever window it
     finds. A preset can drive the same sizes by writing the session keys —
     they are ordinary state behind ordinary setters, which is the seam.
     Wings that do not declare `fitOnEntry` never run any of this. */
  const fitDoneRef = useRef(false);
  useLayoutEffect(() => {
    if (!artist.fitOnEntry || fitDoneRef.current) return;
    fitDoneRef.current = true;
    const main = mainRef.current, inner = bodyRef.current;
    const rootEl = main ? main.closest(".ex-root") : null;
    if (!main || !inner || !rootEl) return;
    /* a session-restored area cap must be re-applied on every mount — it
       lives in a CSS variable, which does not survive a reload on its own. */
    let storedCap = null, stored = null;
    try {
      storedCap = sessionStorage.getItem(artist.cfKey + "-cap");
      stored = sessionStorage.getItem(artist.cfKey);
    } catch { /* private mode */ }
    if (storedCap) rootEl.style.setProperty("--fit-area-max", storedCap + "px");
    if (stored) return;         /* this session already chose its sizes */
    /* [M0c 2026-08-03] THE SCROLLER'S ROOM IS RESERVED, NOT MEASURED.
       This line used to be `fsEl ? fsEl.getBoundingClientRect().height : 0`,
       and on this wing the `: 0` branch is the one that ALWAYS ran: the fit
       fires on entry, entry lands on album 0 (the house card), a face is stowed
       over the viewer there and P4 renders no scroller under a stowed face. So
       the fit believed the strip cost nothing and gave the picture its share.
       Measured before: /wal document 850px inside a 780px window — 70px over,
       at every desktop size tried, i.e. F3's "all on one screen" was false on
       the screen it had just measured.
       AND MEASURING THE LIVE ELEMENT IS WRONG EVEN WHEN IT EXISTS, because the
       strip breathes with the fact showing in it (48px one line, 77px two) and
       the facts cycle every 7.5s — a fit to the current fact fits now and
       overflows before the visitor has finished the first quote.
       So the number is the strip's CEILING and it comes from the stylesheet
       that decides it (`--fs-strip-reserve`, summed from its own six
       declarations beside the flat-wing scroller rules). The element is no
       longer consulted at all. Wings that declare no reserve get 0px, which is
       what every wing outside this fit already had. */
    const leftEl = rootEl.querySelector(".ex-left");
    const fsH = parseFloat(
      getComputedStyle(rootEl).getPropertyValue("--fs-strip-reserve")
    ) || 0;
    const leftH = leftEl ? leftEl.scrollHeight : 0;
    const padB = parseFloat(getComputedStyle(rootEl).paddingBottom) || 0;
    const topBase = main.getBoundingClientRect().top + window.scrollY - cfH;
    const avail = window.innerHeight - topBase - padB - 8;  /* rounding slack */
    const innerW = inner.getBoundingClientRect().width;
    const areaNatural = ((innerW - 10) * (100 - split) / 100) * (9 / 16);
    const mainNatural = Math.max(areaNatural + fsH, leftH);
    /* lever 1: the carousel gives up height, down to its floor. */
    let ch = Math.min(CF_MAX, Math.max(CF_MIN, avail - mainNatural));
    if (ch + mainNatural > avail) {
      /* lever 2: cap the VIDEO AREA's height and let the player letterbox —
         on the dark stage the bars are black on near-black. This keeps the
         column widths the visitor expects: the earlier draft narrowed the
         viewer column instead, and the arithmetic dutifully produced a
         62%-wide tracklist that was mostly empty paper — a fit that
         technically fit and read as a mistake. The split is not a fit lever;
         it stays where the visitor (or the wing default) put it. */
      ch = CF_MIN;
      const cap = Math.max(160, Math.round(avail - ch - fsH));
      rootEl.style.setProperty("--fit-area-max", cap + "px");
      try { sessionStorage.setItem(artist.cfKey + "-cap", cap); } catch { /* private mode */ }
    }
    if (Math.round(ch) !== Math.round(cfH)) setCfH(Math.round(ch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ytDivRef = useRef(null);
  const yt = useYTPlayer({
    containerRef: ytDivRef,
    onEnded: useCallback(() => advanceQueue(), []),
  });
  const audio = useAudioPlayer({
    onEnded: useCallback(() => advanceQueue(), []),
  });

  /* ── [M9 2026-08-03] THE ROOM ACKNOWLEDGES THE FINGER ─────────────────────
     MIKE: "clicking a track on iPhone produces no obvious visual change
     (robots + WAL) — fix at the point of contact."
     F6 wrote `:active` rules under `@media (pointer:coarse)` and they are
     correct CSS that mostly never runs — the diagnosis is on the rules
     themselves in Exhibit.css. The short version: mobile Safari withholds
     `:active` from an `<li>` that carries no listener of its own (React's are
     all at the root), and where it does grant it, it grants it after the
     scroll/tap decision and takes it back when the finger lifts ~60ms later,
     so there is often no frame in which anything could paint.
     THIS IS THE FLOOR UNDER THAT. One delegated `pointerdown` on the exhibit
     root marks the thing under the finger and holds the mark for at least
     160ms — not a state the visitor has to dismiss, a flash they cannot miss.
     WHY DELEGATED AND NOT A PROP ON EACH ROW: the tappable things are a
     tracklist row, a door, a collage tile and a variant select, authored in
     four different places by three different rules, and half of them are
     rendered from data. A listener per call site is four chances to add the
     fifth surface and forget. The selector is the list, in one place, beside
     the CSS that styles it.
     POINTER EVENTS, NOT TOUCH EVENTS: `pointerdown` fires for mouse, pen and
     touch alike, so the desktop press is acknowledged too — and the paint is
     gated to coarse pointers in CSS, so the mouse sees nothing new.
     `pointercancel` matters as much as `pointerup`: it is what fires when the
     tap turns out to be the start of a scroll, and without clearing on it a
     flicked list would leave a lit row behind it. */
  useEffect(() => {
    const root = mainRef.current ? mainRef.current.closest(".ex-root") : null;
    if (!root) return;
    const SEL = ".tl-track, .vp-trail-go, .vp-trail-quiet-go, .vp-collage-tile," +
                " .vp-qcard, .vp-record-door, .vp-tomb-go, .tl-typewrap";
    const HOLD = 160;
    let el = null, at = 0, timer = 0;
    function clear() {
      if (!el) return;
      const held = Date.now() - at;
      const node = el;
      el = null;
      clearTimeout(timer);
      if (held >= HOLD) node.removeAttribute("data-pressed");
      else timer = setTimeout(() => node.removeAttribute("data-pressed"), HOLD - held);
    }
    function down(e) {
      const hit = e.target.closest ? e.target.closest(SEL) : null;
      if (!hit) return;
      clear();
      el = hit; at = Date.now();
      hit.setAttribute("data-pressed", "");
    }
    root.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", clear, { passive: true });
    window.addEventListener("pointercancel", clear, { passive: true });
    return () => {
      clearTimeout(timer);
      root.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", clear);
      window.removeEventListener("pointercancel", clear);
    };
  }, []);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/visits", { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ page: artist.visitPath, referrer:document.referrer }) }).catch(()=>{});
  }, []);

  // ── Album selection ───────────────────────────────────────────────────────
  function selectAlbum(i, clicked) {
    setActive(i);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setActiveDisplay(i), clicked ? 0 : 600);
  }

  // Arrow keys
  useEffect(() => {
    function onKey(e) {
      if (e.key==="ArrowLeft")  { e.preventDefault(); selectAlbum(Math.max(0,active-1),false); }
      if (e.key==="ArrowRight") { e.preventDefault(); selectAlbum(Math.min(SPINE.length-1,active+1),false); }
      if (e.key==="Enter")      { e.preventDefault(); selectAlbum(active,true); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  /* ── [M-e 2026-08-02] STOP — THE FLOOR OF THE TRANSPORT ───────────────────
     THE ONE CONTROL THE WING DID NOT HAVE. The bar could play, pause, skip and
     mute; it could not STOP. Those are not the same verb. Pause leaves a video
     mounted, holding the frame, one stray click from resuming; stop ends the
     performance and gives the room back.
     THIS IS THE ONLY STOP IN THE FILE. M-b's walk-away path had grown its own
     copy of this sequence inline, and two copies of "how to stop" is exactly
     how one of them ends up missing a line — so that path now calls this, and
     there is one definition of what stopping means.
     IT PAUSES BOTH TRANSPORTS FIRST, and that ordering is load-bearing: the
     YouTube iframe is a PERSISTENT HOST, mounted once and reused, so clearing
     the React state alone would hide the picture and leave it audible behind
     the page. Silence first, then forget. */
  const stopPlayback = useCallback(() => {
    try { yt.pause(); } catch { /* the player may not be mounted yet */ }
    try { audio.pause(); } catch { /* this wing may have no audio transport */ }
    playQueueRef.current = [];
    loopSeedRef.current = [];
    queueAlbumRef.current = null;
    playingNowRef.current = { ai: null, ti: null, vi: null };
    setPlayingAlbum(null); setPlayingTrack(null); setPlayingVideo(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* STOP FROM ANYWHERE, and "anywhere" is meant literally. The banner control
     is sticky so it never scrolls off, and Escape stops from wherever the
     visitor's hands already are — including with focus inside the tracklist,
     which is where they will be. A player you cannot silence without hunting
     for the button is the complaint that produced this. */
  useEffect(() => {
    function onKey(e) {
      if (e.key !== "Escape") return;
      stopPlayback();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stopPlayback]);

  // ── Track selection ───────────────────────────────────────────────────────
  function handleTrackSelect(albumIdx, ti) {
    const track  = SPINE[albumIdx].tracks[ti];
    const selSet = (albumSelectedVis[albumIdx] ?? {})[ti] ?? new Set([0]);
    const vis    = getOrderedVis(track, selSet);
    if (!vis.length) {
      /* [X3 2026-07-30] A TRACK CAN BE CONTENT WITHOUT BEING PLAYBACK.
         This early return was written when every track was a video, and it
         made a video-less track UNSELECTABLE: the click bailed before
         setAlbumActiveTrack, `activeTrack` stayed null, and the viewer kept
         falling back to the FIRST face in the album. Every Robots track
         therefore opened on "Run the machine" no matter which row you hit —
         invisible until the faces stopped being interchangeable.
         Selecting a face-bearing track now registers the selection and simply
         does not start a player. /hr and /wb tracks all carry videos, so this
         branch never runs for them. */
      if (track && track.face) setAlbumActiveTrack(prev => ({ ...prev, [albumIdx]: ti }));
      /* [W1 2026-08-02] THE VIDEO PERSISTS — Mike's ruling, SUPERSEDING M-b.
         M-b (v30) stopped playback when the visitor selected a non-video
         track; Mike overruled it this round: a video plays until STOPPED or
         ENDED. Selecting a face-bearing track lays the face's content OVER
         the running video — the stow is VISUAL-ONLY, the audio continues —
         and returning to the video's own row shows it still running (the
         player state is untouched, so the same-video guard in startPlay's
         effect never reloads it). The stop verbs are the transport's STOP,
         the Escape key, and the end of the queue; navigation is no longer
         one of them. stopPlayback() remains the one definition of stopping
         (M-e), invoked only by controls that mean it. */
      setOpenEntry(null);         /* [M5] a new track opens on its index */
      setRecipeIdx(0);            /* [L2] and its selector at the top entry */
      /* [F6 2026-08-02] ON A PHONE, THE TAP MUST VISIBLY DO SOMETHING.
         At narrow widths the columns stack and the viewer sits BELOW the
         tracklist — selecting a card changed a region the visitor could not
         see, which reads as "nothing happened". The obvious mechanical cure:
         bring the thing that changed to them. Desktop layouts (both columns
         on one screen) are untouched; this fires only where the stack
         exists (the flat wing at stacked widths). */
      if (artist.faceFlow === "flat" && window.innerWidth <= 720) {
        /* a timeout, not a rAF: the scroll must land AFTER React has swapped
           the face in, or it measures the old layout and goes nowhere. The
           offset clears the fixed nav and the sticky console. */
        setTimeout(() => {
          const area = document.querySelector(".vp-area");
          if (!area) return;
          const y = area.getBoundingClientRect().top + window.scrollY - 118;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }, 120);
      }
      return;
    }
    /* [V3 2026-08-03] A CLICK MEANS ONE OF TWO THINGS, AND WHICH ONE DEPENDS
       ON WHETHER ANYTHING IS PLAYING. MIKE'S RULING, IN HIS OWN TERMS:
         · nothing playing        -> a click on a track PLAYS it;
         · something playing      -> the FIRST click on a different track
                                     SELECTS it and does not interrupt;
         · the already-selected   -> a click PLAYS it.
       WHY THIS IS RIGHT AND NOT JUST ASKED FOR. A tracklist beside a running
       player is doing two jobs at once — it is the transport AND it is the
       index you read while listening — and a single-click-plays rule makes the
       second job impossible: every attempt to look at what else is here stops
       the music. The arm-then-fire pattern gives the browsing gesture back
       without taking the playing gesture away, and it costs one extra press
       only in the case where a visitor is already listening.
       IT IS A GATE, NOT A NEW PATH. The selection this branch writes is the
       same `albumActiveTrack` entry the play branch writes, so the viewer, the
       face, the PUV context and the variant dropdown all follow the armed row
       exactly as they follow a played one. The second click falls straight
       through to the line below it and plays, unchanged.
       PER ALBUM, because `albumActiveTrack` is per album: a visitor who walks
       to another artist while a song runs arms that album's first row on the
       first click, which is the same rule read in the same words.
       The mark for the armed row is `.tl-active`; the mark for the running row
       is `.tl-playing`. M-c already made those two different facts — see
       Exhibit.css, where this round separates their left rules so the two are
       legible at a glance now that they are routinely on different rows. */
    const somethingPlaying = playingTrack !== null;
    const alreadySelected  = albumActiveTrack[albumIdx] === ti;
    if (somethingPlaying && !alreadySelected) {
      setAlbumActiveTrack(prev => ({ ...prev, [albumIdx]: ti }));
      setOpenEntry(null);         /* [M5] a newly armed track opens on its index */
      setRecipeIdx(0);            /* [L2] and its selector at the top entry */
      return;
    }
    setAlbumActiveTrack(prev => ({ ...prev, [albumIdx]: ti }));
    startPlay(albumIdx, ti, vis[0]);
  }

  function handleTagClick(albumIdx, ti, vi) {
    const isActive = albumActiveTrack[albumIdx] === ti;
    /* [V3 2026-08-03] AND THE VARIANT PICKER OBEYS THE SAME LAW.
       Picking a variant on the ACTIVE row used to start it playing outright.
       Under V3 a row can be active WITHOUT being the row you are hearing, so
       that shortcut became a way to interrupt the music from a control that
       never said it would — precisely the interruption the ruling exists to
       stop. The picker now starts playback in the two cases where it plainly
       means "play this": nothing is running, or this IS the running row and the
       visitor is swapping which cut of it plays. Otherwise it records the
       choice and waits, and the row's own second click fires it. */
    const armedOnly = playingTrack !== null
      && !(playingAlbum === albumIdx && playingTrack === ti);
    setAlbumSelectedVis(prev => {
      const albumMap = prev[albumIdx] ?? {};
      const current  = albumMap[ti] ?? new Set([0]);
      // Radio behavior: only one variant active per track at a time.
      // Click already-selected -> deselect to empty. Click any other ->
      // replace selection with that vi.
      let next;
      if (current.size === 1 && current.has(vi)) {
        next = new Set();
      } else {
        next = new Set([vi]);
        if (isActive && !armedOnly) startPlay(albumIdx, ti, vi);
      }
      return { ...prev, [albumIdx]: { ...albumMap, [ti]: next } };
    });
  }

  // ── Playback ──────────────────────────────────────────────────────────────
  function startPlay(albumIdx, ti, vi) {
    const album  = SPINE[albumIdx];
    const selVis = albumSelectedVis[albumIdx] ?? {};
    const queue  = buildPlayQueue(album, ti, selVis);
    loopSeedRef.current = queue; // O9 Loop: the selection to replay on end
    const rest = queue.slice(1);
    playQueueRef.current  = shuffleRef.current ? shuffleEntries(rest) : rest;
    queueAlbumRef.current = albumIdx;
    setPlayingAlbum(albumIdx);
    setPlayingTrack(ti);
    setPlayingVideo(vi);
  }

  useEffect(() => {
    if (playingAlbum===null || playingTrack===null || playingVideo===null) return;
    // O9: mirror the live position into a ref so advanceQueue (first-render
    // closure) can detect a loop refill that lands on the same video.
    playingNowRef.current = { ai: playingAlbum, ti: playingTrack, vi: playingVideo };
    const v = SPINE[playingAlbum].tracks[playingTrack].videos[playingVideo];
    if (v?.ytId)          { audio.pause(); yt.loadVideo(v.ytId); }
    else if (v?.audioUrl) { yt.pause(); audio.loadAudio(v.audioUrl); }
  }, [playingAlbum, playingTrack, playingVideo]);

  function advanceQueue() {
    let queue = playQueueRef.current;
    if (!queue.length && loopRef.current && loopSeedRef.current.length) {
      // O9 Loop (§9.2): replay the current selection on end instead of
      // stopping; re-randomized per pass when Shuffle is also on.
      queue = shuffleRef.current
        ? shuffleEntries(loopSeedRef.current)
        : [...loopSeedRef.current];
    }
    if (!queue.length) { setPlayingAlbum(null); setPlayingTrack(null); setPlayingVideo(null); return; }
    const next = queue[0];
    const [firstVi, ...restVis] = next.vis;
    playQueueRef.current = restVis.length
      ? [{ ti:next.ti, vis:restVis }, ...queue.slice(1)]
      : queue.slice(1);
    const ai = queueAlbumRef.current;
    const now = playingNowRef.current;
    if (now.ai === ai && now.ti === next.ti && now.vi === firstVi) {
      // Loop refill landed on the video that just ended — identical state
      // would not re-trigger the load effect. Same null-then-set idiom as
      // the skip-back restart path.
      setPlayingVideo(null);
      setTimeout(() => { setPlayingAlbum(ai); setPlayingTrack(next.ti); setPlayingVideo(firstVi); }, 50);
    } else {
      setPlayingAlbum(ai); setPlayingTrack(next.ti); setPlayingVideo(firstVi);
    }
    setAlbumActiveTrack(prev => ({ ...prev, [ai]: next.ti }));
  }

  function handleSkipForward() { advanceQueue(); }

  function handleSkipBack() {
    if (playingTrack === null) return;
    const now = Date.now();
    const elapsed = now - lastSkipRef.current;
    lastSkipRef.current = now;
    const ai = queueAlbumRef.current;
    if (ai === null) return;

    if (elapsed > 3000) {
      // First press — restart current
      const vi = playingVideo;
      setPlayingVideo(null);
      setTimeout(() => setPlayingVideo(vi), 50);
      return;
    }

    // Second press within 3s — go to previous track
    const album  = SPINE[ai];
    const selVis = albumSelectedVis[ai] ?? {};
    const n = album.tracks.length;
    for (let i = 1; i <= n; i++) {
      const ti = ((playingTrack - i) + n) % n;
      const track = album.tracks[ti];
      if (!track.videos.length) continue;
      const sel = selVis[ti];
      if (sel && sel.size === 0) continue;
      const vis = getOrderedVis(track, sel ?? new Set([0]));
      if (!vis.length) continue;
      const queue = buildPlayQueue(album, ti, selVis);
      loopSeedRef.current = queue; // O9 Loop: new selection start
      const rest = queue.slice(1);
      playQueueRef.current = shuffleRef.current ? shuffleEntries(rest) : rest;
      queueAlbumRef.current = ai;
      setPlayingAlbum(ai); setPlayingTrack(ti); setPlayingVideo(vis[0]);
      setAlbumActiveTrack(prev => ({ ...prev, [ai]: ti }));
      return;
    }
  }

  // ── Preset restore (UX_PRESETS_SPEC §3 "Play") ───────────────────────────
  // Resolve saved STABLE ids back to current spine indices at apply-time
  // (ids are durable; indices are derived) and drive the player. Per controls
  // §8.4 only the Play verb may interrupt active playback, so this is only
  // invoked from Play. A snapshot saved while idle (playingTrack null) leaves
  // current playback untouched.
  function restorePlayerFromPreset({ focusedAlbumId, playingTrack: saved } = {}) {
    if (focusedAlbumId) {
      const fi = SPINE.findIndex(a => a.id === focusedAlbumId);
      if (fi >= 0) selectAlbum(fi, true);
    }
    if (!saved || !saved.albumId) return;
    const ai = SPINE.findIndex(a => a.id === saved.albumId);
    if (ai < 0) return; // album left the spine — nothing to drive
    const ti = SPINE[ai].tracks.findIndex(t => t.id === saved.trackId);
    if (ti < 0) return; // track left the album
    const track = SPINE[ai].tracks[ti];
    let vi = track.videos.findIndex(v => v.id === saved.variantId);
    if (vi < 0) vi = track.videos.length ? 0 : -1; // variant gone → first available
    if (vi < 0) return;
    // Reflect the restore in the tracklist UI (active row + variant radio),
    // then play the exact variant.
    setAlbumActiveTrack(prev => ({ ...prev, [ai]: ti }));
    setAlbumSelectedVis(prev => {
      const albumMap = prev[ai] ?? {};
      return { ...prev, [ai]: { ...albumMap, [ti]: new Set([vi]) } };
    });
    startPlay(ai, ti, vi);
  }

  // ── Derived display state ─────────────────────────────────────────────────
  const album       = SPINE[activeDisplay];
  const activeTrack = albumActiveTrack[activeDisplay] ?? null;
  const selVis      = albumSelectedVis[activeDisplay] ?? {};

  const playingThisAlbum = playingAlbum === activeDisplay;
  const curVideo = playingAlbum !== null && playingTrack !== null && playingVideo !== null
    ? SPINE[playingAlbum].tracks[playingTrack].videos[playingVideo]
    : null;
  const curTrack = curVideo && playingTrack !== null ? SPINE[playingAlbum ?? 0].tracks[playingTrack] : null;
  const curAlbum = playingAlbum !== null ? SPINE[playingAlbum] : null;
  const isAudioSrc = !!curVideo?.audioUrl;

  // ── Idle cued-track preview (Phase 2a) ──────────────────────────────────────
  // READ-ONLY derivation of "what would play first if the user pressed play
  // now" on the active album, for the always-present idle player bar. This is a
  // pure derived value: it NEVER calls advanceQueue and NEVER writes
  // playQueueRef / loopSeedRef / queueAlbumRef, so the real queue build is
  // untouched until an actual play. Loop only governs end-of-queue replay, so
  // it cannot change the *first* track; Shuffle's real (random) order is only
  // committed inside startPlay at play time, so the preview deliberately uses a
  // deterministic eligible pick (the active album's focused-or-first playable
  // track) rather than pre-committing a shuffle order.
  function deriveCuedPreview() {
    const ai = activeDisplay;
    const al = SPINE[ai];
    if (!al) return null;
    const selVisAlbum = albumSelectedVis[ai] ?? {};
    const at = albumActiveTrack[ai] ?? null;
    // Precedence mirrors the idle thumbnail / handleTrackSelect entry point:
    // the focused row first, then the album's natural order.
    const order = [];
    if (at !== null) order.push(at);
    for (let ti = 0; ti < al.tracks.length; ti++) if (ti !== at) order.push(ti);
    for (const ti of order) {
      const track = al.tracks[ti];
      if (!track.videos.length) continue;
      const sel = selVisAlbum[ti];
      if (sel && sel.size === 0) continue;          // explicitly deselected → skip (matches buildPlayQueue)
      const vis = getOrderedVis(track, sel ?? new Set([0]));
      if (!vis.length) continue;
      return { ai, ti, vi: vis[0], track, album: al, video: track.videos[vis[0]] };
    }
    return null;
  }
  const cuedPreview = curVideo ? null : deriveCuedPreview();

  // Preset capture (UX_PRESETS_SPEC 8.2/9): live player identity by STABLE
  // id, never by array index. The spine adapter guarantees album.id
  // (foundation id), track.id (foundation item id) and video.id
  // (ytId ?? slug(audioUrl)), so this object survives spine reorderings.
  // Crossed to the preset host via prop-widening at the existing
  // <ExhibitFlow> seam (spec 9) -- least-invasive option.
  const playingTrackIds = curVideo
    ? {
        albumId: curAlbum?.id ?? null,
        trackId: curTrack?.id ?? null,
        variantId: curVideo?.id ?? null,
      }
    : null;

  /* [M-e / C-d 2026-08-02] the two per-wing switches, read once and named, so
     the render below asks a question rather than restating a condition. */
  const bannerTransport = artist.transport === "banner";

  /* [P11 2026-08-02] THE EXIT NAMES THE EXHIBIT'S OWNER.
     Mike's GIFT SHOP BILLING LAW turns on one question the shop could not
     previously answer: WHOSE exhibit did this visitor just leave? `?from=` has
     always named the WING (hr / wb / robots / wal), which is enough where a
     wing is one artist and useless where it is four. Leaving Carsie Blanton's
     page and leaving Jesse Welles's page produced byte-identical exits, so the
     shop had nothing to give top billing to and fell back to the house — which
     is exactly the "WAL is putting W.B on the gift shop page" Mike reported.
     So a wing whose albums ARE artists declares `shopOwnerFromAlbum` and the
     exit carries the album's own id alongside the wing's. Wings where the wing
     IS the owner (/hr, /wb, /robots) declare nothing and their exits are
     unchanged to the character. */
  const shopHref = `/shop?from=${artist.shopExitParam}` +
    (artist.shopOwnerFromAlbum && album.id ? `&owner=${encodeURIComponent(album.id)}` : "");

  /* [P23 2026-08-02] THE LINK SEAM STOPS BEING NAMED AFTER ONE WING.
     Every door the viewer draws — trail rows, collage tiles, quote cards,
     record doors — dispatched the literal string "wb-wal-open-link", which is
     fine while only WAL has doors and silently fatal the moment another wing
     grows one: /robots mounts no listener for that name, so a collage there
     would have rendered beautifully and done nothing when pressed. That is
     W4a's dead-button defect, pre-built into the next wing.
     The event NAME is now config, defaulting to the existing string so WAL is
     unchanged to the character. A wing that wants doors declares its own verb
     and listens for it — the same discipline as `transport`, `stage` and
     `bodyKey`, and the reason the shared engine still knows nothing about what
     any of these doors open. */
  const linkEvent = artist.linkEvent || "wb-wal-open-link";
  /* [B6 2026-08-02] THE DOOR MAY DESCRIBE WHAT IS BEHIND IT.
     `extra` is merged into the event detail and is OPTIONAL EVERYWHERE: a
     door that says only "here is an href" behaves exactly as it always did,
     which is why WAL needed no change. What it buys is that a wall of plates
     can hand its wing THE WHOLE SET and the tapped index, so the wing can
     open a viewer that pages rather than a tab that does not. The engine
     still knows nothing about viewers — it describes the door and dispatches;
     what opens is the wing's business, exactly as with the twin. */
  const openLink = useCallback((href, extra) => {
    if (!href) return;
    window.dispatchEvent(new CustomEvent(linkEvent, {
      detail: extra ? { href, ...extra } : { href } }));
  }, [linkEvent]);

  const thumbTrack = activeTrack !== null ? album.tracks[activeTrack] : album.tracks.find(t => t.videos.length > 0);
  const thumbVid   = thumbTrack?.videos?.[0];
  const hasVideo   = curVideo !== null;
  /* [W1/W7 2026-08-02] TWO FACE MODES, ONE RENDER PATH.
     `selFace` is the SELECTED track's own face; `fallbackFace` is E2's
     original derivation (selected face, else the album's first face, so a
     staged wing landing on an album shows something rather than a hole).
     STAGED wings (robots) keep E2 exactly: the face shows only when no video
     and no thumb, from the fallback chain.
     FLAT wings (`faceFlow:"flat"` — WAL) show a face only when a face row is
     actually selected — and show it even while a video PLAYS, laid over the
     stowed picture (W1): the frame is the frame, the artist is the color, and
     landing on an album gives the SONG's own poster, not a card. */
  /* [P5] SCRUBBED ONCE, HERE. Every face the viewer can possibly draw passes
     through these two bindings, so this is the one place a marker can be
     stopped for every wing at once. */
  const rawSelFace = activeTrack !== null ? (album.tracks[activeTrack]?.face ?? null) : null;
  const rawFallbackFace = rawSelFace ?? album.tracks.find(t => t.face)?.face ?? null;
  const selFace = useMemo(() => scrubFace(rawSelFace), [rawSelFace]);
  const fallbackFace = useMemo(() => scrubFace(rawFallbackFace), [rawFallbackFace]);
  const flatFaces = artist.faceFlow === "flat";
  /* [F7a 2026-08-02] a flat album with NOTHING TO CUE (no playable song, so
     no poster to land on — the house album) falls back to its first face,
     the same courtesy E2 gives the staged wings: landing shows the room's
     own page rather than a hole. Artist albums have songs, so they still
     land on the song's poster and never hit this branch. */
  const face = flatFaces ? (selFace ?? (!thumbVid ? fallbackFace : null)) : fallbackFace;
  const showFace = flatFaces ? !!face : (!hasVideo && !thumbVid && !!fallbackFace);

  /* [G1 2026-07-31] ONE DOOR, TWO HANDLES. The frozen face IS the standard
     view, so clicking the picture and pressing ENTER must go to the same
     place with the same recipe — one function, not two copies that can
     drift. Held recipes open nothing from either handle. */
  function enterRecipe() {
    const p = face?.presets?.[recipeIdx];
    if (face?.presets && (!p || p.state === "held")) return;
    window.dispatchEvent(new CustomEvent(
      face?.action ? face.action.event : "wb-robots-open-twin",
      { detail: { album: album.id, preset: p ? p.id : null, day: p ? p.day : undefined } }
    ));
  }

  // ── Drag handles ──────────────────────────────────────────────────────────
  /* [V2a 2026-08-03] THE WIDTH DRAG CARRIES THE HEIGHT WITH IT.
     MIKE, THIRD ROUND ON THIS HANDLE: "only WIDTH can be changed; the frame
     does NOT auto-size vertically to hold the video's aspect — dragging width
     must carry height with it (aspect preserved)."
     MEASURED ON THE LIVE PAGE, and the arithmetic is not in doubt. /wal at
     1706x810 with '94 cued: `.vp-area` is 1243.7 x 361 — a 3.4:1 letterbox
     slot, because the `aspect-ratio:16/9` on that box is capped by F3's
     `--fit-area-max` (361px). `.vp-inner` — the actual picture — is fitted to
     that height at 638.6 x 359.2, which leaves **302.6px of dead stage on EACH
     side**, 49% of the column. Drag the split 200px wider and the slot grows
     to 1430.9 while the picture stays 638.6 x 359.2 TO THE PIXEL. Nothing the
     visitor can see answers the one lever they were handed, and the cap is the
     entire reason: a `max-height` in pixels does not move when a width does.
     SO THE HAND TAKES THE ASPECT, which is exactly P1's ruling on the carousel
     handle one lever over ("the fit's cap yields to the hand"). F3's promise is
     about ARRIVAL — the room opens with everything on one screen — and that is
     untouched. From the moment the visitor grabs this handle the frame is a
     true 16:9 of whatever width they chose, in both directions, and the
     document is allowed to be longer than the window because they asked for a
     bigger picture. Same discipline as the other two drags: computed from the
     grab, persisted to the session key the fit already owns.
     +1 AND A CEIL, deliberately: the cap is set just PAST the natural height so
     `aspect-ratio` is what resolves the box and `max-height` never binds. A cap
     rounded short by a pixel would re-letterbox the picture by a pixel, which
     is the defect in miniature.
     WINGS WITHOUT A CAP ARE UNAFFECTED — `.vp-area-flat` with no
     `--fit-area-max` is already plain 16:9, so width already carried height
     there and this block never runs for them. */
  function makeSplitDrag(e, containerRef) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const rootEl = mainRef.current ? mainRef.current.closest(".ex-root") : null;
    const hasCap = !!rootEl && !Number.isNaN(parseFloat(
      getComputedStyle(rootEl).getPropertyValue("--fit-area-max")));
    function onMove(ev) {
      const rect = containerRef.current.getBoundingClientRect();
      let pct = Math.round(((ev.clientX - rect.left) / rect.width) * 100);
      if (Math.abs(pct - 50) < 3) pct = 50;
      pct = Math.max(SPLIT_MIN, Math.min(SPLIT_MAX, pct));
      setSplit(pct);
      if (!hasCap) return;
      /* the viewer column is what the grid leaves after the left column and
         the 10px handle — the same arithmetic F3 uses to size the frame. */
      const areaW = (rect.width - 10) * (100 - pct) / 100;
      const cap = Math.ceil(areaW * 9 / 16) + 1;
      rootEl.style.setProperty("--fit-area-max", cap + "px");
      try { sessionStorage.setItem(artist.cfKey + "-cap", cap); }
      catch { /* private mode */ }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", onMove), { once: true });
  }

  function makeCfDrag(e) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const startY = e.clientY, startH = cfH;

    /* [P1 2026-08-02] THE FIT'S CAP YIELDS TO THE HAND — THE SECOND HALF OF
       "NOTHING RESIZES".
       The first half was mechanical (the console apron sat on this handle;
       see Exhibit.css). Give the handle back and the drag STILL did nothing
       visible, for a second and independent reason: F3's fit writes a hard
       `--fit-area-max` onto the root and NOTHING ever revises it. So the
       carousel could grow and shrink while the viewer beneath it stayed
       frozen at the height the fit chose on entry — the visitor moved a lever
       and the room did not answer.
       THE HANDLE IS A TRADE, AND THE TRADE IS WHAT THE FIT WAS FOR. The fit's
       whole ruling is that the carousel, the viewer and the scroller share one
       screen; so the honest response to "give the carousel 80 more pixels" is
       "the viewer gives up 80". Total height is preserved, the room still
       fits, and the lever is real. Read once at pointerdown so the ceiling
       cannot drift under the visitor's own drag (the same discipline as the
       body drag's measured ceiling). Wings without `fitOnEntry` have no cap
       and this whole block is inert for them. */
    const rootEl = mainRef.current ? mainRef.current.closest(".ex-root") : null;
    const startCap = rootEl
      ? parseFloat(getComputedStyle(rootEl).getPropertyValue("--fit-area-max"))
      : NaN;
    const tradeCap = artist.fitOnEntry && rootEl && !Number.isNaN(startCap);

    function onMove(ev) {
      let h = startH + (ev.clientY - startY);
      if (Math.abs(h - 300) < 12) h = 300;
      const next = Math.max(CF_MIN, Math.min(CF_MAX, Math.round(h)));
      setCfH(next);
      if (tradeCap) {
        const cap = Math.max(160, Math.round(startCap + (startH - next)));
        rootEl.style.setProperty("--fit-area-max", cap + "px");
        try { sessionStorage.setItem(artist.cfKey + "-cap", cap); }
        catch { /* private mode */ }
      }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", onMove), { once: true });
  }

  /* [X2] THE SAME DRAG, A DIFFERENT TARGET. Line for line the carousel's:
     capture the pointer, track the delta from the grab, snap within 12px of
     the default, clamp, persist. Deliberately NOT factored into a shared
     helper — two call sites do not earn an abstraction, and keeping them
     side by side is what makes "same-only-different" checkable by eye. */
  function makeBodyDrag(e) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const startY = e.clientY, startH = bodyH;

    /* [O3b 2026-07-30] THE DRAG STOPS WHERE NOTHING FURTHER IS REVEALED.
       BODY_MAX was a flat 1100px, which let the visitor keep dragging long
       after every column had run out of content — the reward for pulling was
       more empty cream. The useful ceiling is not a constant, it is a
       MEASUREMENT: how much is currently hidden. Each scrollable column
       reports `scrollHeight - clientHeight`; the largest of those is exactly
       how much taller the body can get before the last hidden row appears.
       Measured at pointerdown rather than continuously, so the ceiling cannot
       drift under the visitor's own drag — a moving limit feels like a fault
       even when the arithmetic is right. */
    let hidden = 0;
    try {
      document.querySelectorAll(".ex-left, .vp-face-body, .fs-wrap")
        .forEach(el => {
          hidden = Math.max(hidden, el.scrollHeight - el.clientHeight);
        });
    } catch { /* measurement is an optimisation; the hard clamps still apply */ }
    const ceiling = Math.min(BODY_MAX, Math.max(BODY_DEF, startH + hidden + 8));

    function onMove(ev) {
      let h = startH + (ev.clientY - startY);
      if (Math.abs(h - BODY_DEF) < 12) h = BODY_DEF;
      setBodyH(Math.max(BODY_MIN, Math.min(ceiling, Math.round(h))));
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", onMove), { once: true });
  }

  const bodyRef = useRef(null);
  const canSkipBack    = playingTrack !== null;
  // O9: with Loop on, skip-forward at the end of the queue refills from the
  // selection (advanceQueue handles it), so the control stays live.
  const canSkipForward = playQueueRef.current.length > 0 || (loop && playingTrack !== null);

  // Phase 2a: the bar shows the live source when playing, else the cued-next
  // preview. `pbLive` is the actually-playing gate that drives the repaint loop.
  const pbLive  = curVideo !== null;
  const pbVideo = curVideo ?? cuedPreview?.video ?? null;
  const pbTrack = curTrack ?? cuedPreview?.track ?? null;
  const pbAlbum = curAlbum ?? cuedPreview?.album ?? null;
  // Idle play arms the cued track through the SAME entry point a tracklist
  // click uses (handleTrackSelect → startPlay), so the real queue is built at
  // actual play time — the preview never bypasses the real queue build.
  const onIdlePlay = cuedPreview
    ? () => handleTrackSelect(cuedPreview.ai, cuedPreview.ti)
    : undefined;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* [F3 2026-07-31] THE WING NAMES ITSELF. A data attribute so per-wing
          styling has a hook that is not a hack — the same discipline as
          bodyKey / splitDefault / shopEntryHidden, which are all per-artist
          switches rather than global changes. Used by the tracklist type
          scale below: /robots opens at 24% width with three tracks and wants
          bigger type; /hr and /wb run twenty rows at 50% and do not. */}
      <div className={`ex-root${visible?" visible":""}`} data-exhibit={artist.exhibitSlug || artist.id} data-stage={artist.stage ? "1" : undefined} data-flat={flatFaces ? "1" : undefined}>

        {/* NAV — [R2 2026-08-02] the shared <MuseumBar>. The `.ex-nav-*`
            family is retired; see src/components/MuseumBar.jsx for what the
            three copies disagreed about and which reading won.
            [one-shop ruling, walk-six] the exit stays in the template (present
            in the DOM) and hides for exhibits that must not advertise a shop —
            /robots today. That is now `exitHidden`. */}
        <MuseumBar
          brandTo={shopHref}
          room={artist.name}
          onRoomClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
          exitTo={shopHref}
          exitLabel="Gift Shop"
          exitHidden={artist.shopEntryHidden}
        />

        {/* CAROUSEL */}
        <Coverflow
          spine={SPINE}
          active={active} cfH={cfH}
          onSelect={i => selectAlbum(i,false)}
          onSelectClick={i => selectAlbum(i,true)}
        />

        {/* CAROUSEL HEIGHT DRAG */}
        <div className="cf-dh" onPointerDown={makeCfDrag}>
          <div className="cf-dh-line" />
          <div className="cf-dh-dot" />
          <div className="cf-dh-line" />
        </div>

        {/* MAIN TWO-COLUMN AREA */}
        {/* [M-e 2026-08-02] THE BANNER IS NOW A CONSOLE, WHERE THE ARTIST ASKS
            FOR ONE. `ex-album-banner-aux` has been an empty flex spacer since
            it was built; the transport moves into it, so the wing gains a
            transport and zero pixels of height. Wings that declare no
            `transport` render the identical empty div. [F5] The vault
            ?-button that shared this slot is retired — factoids ride the
            scroller, ambient, not a help control. */}
        <div className={"ex-album-banner" + (bannerTransport ? " ex-banner-console" : "")}>
          <div className="ex-album-banner-title">{album.title}</div>
          <div className="ex-album-banner-aux">
            {bannerTransport && (
              <BannerTransport
                video={curVideo} track={curTrack} live={pbLive}
                onStop={stopPlayback}
                onTogglePlay={isAudioSrc ? audio.togglePlay : yt.togglePlay}
                onSetVolume={isAudioSrc ? audio.setVolume : yt.setVolume}
                getState={isAudioSrc ? audio.getState : yt.getState}
              />
            )}
          </div>
        </div>
        {/* [X2] `flex:1` is what FORCED the height. When the artist opts in,
            an explicit height replaces it and the drag owns the number. */}
        <div className="ex-main" ref={mainRef}
          style={bodyResizable ? { height: bodyH, flex: "0 0 auto" } : undefined}>
          <div className="ex-main-inner" ref={bodyRef}
            /* [G3] minmax(0, Nfr) — without the explicit 0 minimum the track
               refuses to go below its content and the split percentage becomes
               a suggestion. */
            style={{ gridTemplateColumns:
              `minmax(0, ${split}fr) 10px minmax(0, ${100-split}fr)` }}>

            {/* LEFT — tracklist */}
            <div className="ex-left">
              <TrackList
                album={album}
                playingTrackIdx={playingAlbum === activeDisplay ? playingTrack : null}
                activeTrack={activeTrack}
                selectedVis={selVis}
                onSelect={ti => handleTrackSelect(activeDisplay, ti)}
                onTagClick={(ti, vi) => handleTagClick(activeDisplay, ti, vi)}
              />
              {/* [HR 2026-08-04] THE CONTENTS PLATE IS REMOVED, NOT GATED.
                  MIKE: "remove the photo strip at the bottom of tracklists — it
                  became a standard element at some point and I dislike it.
                  Remove it everywhere it appears, all wings."
                  L5 (2026-08-02) put the album's own `viewerPoster` under the
                  contents list to fill the 664px of blank paper the robots
                  wing's 24% column carries. The `contentsPlate` flag, this
                  block and the `.ex-contents-plate` rules in Exhibit.css all
                  went together — leaving a dead flag behind would be the same
                  element one data edit from returning. /robots was the only
                  declarant, so every other wing's DOM is unchanged, and the
                  void L5 measured is reported in the round log rather than
                  refilled with something Mike did not ask for. */}
            </div>

            {/* VERTICAL DRAG HANDLE */}
            <div className="vr-dh" onPointerDown={e => makeSplitDrag(e, bodyRef)}>
              <div className="vr-dh-line" />
            </div>

            {/* RIGHT — permanent video + facts */}
            <div className="ex-right">
              {/* VIDEO AREA */}
              {/* [W1/W7 2026-08-02] IN A FLAT WING THE AREA HAS TWO STATES:
                  a 16:9 picture frame (video playing, or the cued song's own
                  poster), or STOWED under a shown face — the frame's height
                  hands over to the face's full-length flow while the iframe
                  underneath stays MOUNTED AND AUDIBLE, because W1 says a
                  video plays until stopped or ended and the stow is
                  visual-only. Staged and music wings keep their exact DOM. */}
              <div className={"vp-area" +
                    (flatFaces ? " vp-area-flat" : "") +
                    (flatFaces && showFace ? " vp-area-stowed" : "")}>
                <div className="vp-inner">
                  <div ref={ytDivRef} className="yt-player" />

                  {/* Audio-only overlay — hides video when browsing a different
                      album, or when the current source is an audio track (no
                      video frame to show) */}
                  {hasVideo && (!playingThisAlbum || isAudioSrc) && (
                    <div className="vp-audio-only">
                      {album.art ? (
                        <img className="vp-ao-art" src={album.art} alt={album.title} />
                      ) : (
                        <div className="vp-ao-ph" style={placeholderTile(album.accent)}>
                          <div className="vp-ao-ph-title">{album.title}</div>
                          <div className="vp-ao-ph-year">{album.year}</div>
                        </div>
                      )}
                      <div className="vp-ao-label">
                        <NpBars color="var(--wb-gold)" />
                        <span>audio playing</span>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail overlay — visible when no video is playing */}
                  {!hasVideo && thumbVid && !(flatFaces && showFace) && (
                    <div className="vp-thumb"
                      onClick={() => thumbTrack && handleTrackSelect(activeDisplay, album.tracks.indexOf(thumbTrack))}>
                      {/* [W3 2026-08-02] COLOR VIA EMBEDS. A wing declaring
                          `thumbFromVideo` shows the cued VIDEO'S OWN poster
                          frame, full-bleed — the thumbnail is part of the
                          embed's function when displaying that video (Mike's
                          ruling), and the artist's imagery is what carries
                          the page. maxres first, hq when maxres is absent.
                          Wings that declare nothing keep the house cover. */}
                      {artist.thumbFromVideo && thumbVid.ytId ? (
                        <img src={`https://i.ytimg.com/vi/${thumbVid.ytId}/maxresdefault.jpg`} alt=""
                          onError={e => {
                            if (!e.currentTarget.dataset.fb) {
                              e.currentTarget.dataset.fb = "1";
                              e.currentTarget.src = `https://i.ytimg.com/vi/${thumbVid.ytId}/hqdefault.jpg`;
                            }
                          }} />
                      ) : album.art ? (
                        <img className="vp-thumb-album" src={album.art} alt="" />
                      ) : thumbVid.ytId ? (
                        <img src={`https://img.youtube.com/vi/${thumbVid.ytId}/hqdefault.jpg`} alt="" />
                      ) : (
                        <div style={{ width: "100%", height: "100%",
                          ...placeholderTile(album.accent) }} />
                      )}
                      <div className="vp-thumb-hint">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                          <path d="M19 14L35 24L19 34V14Z" fill="rgba(255,255,255,0.5)"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* ---- E2 2026-07-30: THE FACE, AND THE POSTER -----------
                      The template's no-video state was a dark panel with a grey
                      play triangle. For an exhibit whose every track is
                      video-less that WAS the exhibit, and Mike killed it.
                      Two replacements, in priority order:
                        1. the selected track's own `face` — description, still,
                           register lines, and optionally a button;
                        2. failing that, the album's `viewerPoster` — something
                           real to land on.
                      The old empty state is kept as the last resort so /hr and
                      /wb, which declare neither, render exactly as before.
                      THE BUTTON FIRES AN EVENT, it does not know what it opens.
                      That keeps this shared component ignorant of twins; the
                      exhibit flow listens and does the exhibit-specific thing. */}
                  {showFace && (
                    <div className={`vp-face vp-face-${face.kind || "text"}`}>
                      {/* [S7 2026-07-30] NOTHING FLOATS BETWEEN THE PANELS.
                          `.vp-face-still` was a flex SIBLING of the body at
                          38% width, so it read as a large photo hanging in
                          the gap between the tracklist and the viewer rather
                          than as anything the viewer owned. Mike's ruling:
                          THE VIEWER OWNS EVERYTHING — images are track content
                          INSIDE it. The image is now the first block in the
                          body's own flow, scrolls with the rest of the track,
                          and scales with the panel like every other element. */}
                      <div className="vp-face-body">
                        {/* [P2 2026-08-02] A PANEL FACE IS THE WHOLE FACE.
                            It gets no blurb, no register block, no plate and
                            no dropdown above it — the panel IS the page, and
                            anything stacked on top would be the buffet again.
                            Every other kind falls through unchanged. */}
                        {face.panel ? (
                          <InstrumentPanel decl={face.panel} />
                        ) : (
                        /* [STAGE 2026-08-02] THE FACE IS STAGED, BY CONFIG.
                           `artist.stage` opts a wing in. /hr and /wb do not
                           declare it - and could not use it anyway, since
                           they declare no faces at all - so the standard
                           lands on one route and cannot reach the music
                           wings until someone asks it to.
                           [W7 2026-08-02] OR IT IS FLAT, BY CONFIG. A wing
                           declaring `faceFlow:"flat"` (WAL) renders the same
                           blocks in one full-length column in the page's own
                           flow — no pagination, no internal scrolling; the
                           document is the one thing that scrolls. Same
                           children, different frame; the robots wing keeps
                           its stage.
                           [B5 2026-08-02] THE FOOTER RIDES THE TRANSPORT,
                           WHICH IS THE HOME IT WAS BUILT FOR.
                           `footer={face.footer ? null : null}` — a ternary
                           whose two branches are the same value — had
                           neutered the prop, so `Stage`'s footer slot (it
                           renders "<footer> · Page 1 of 2") had been fed
                           nothing since it was written, while the face's
                           footer stayed a body BLOCK. Being the last block,
                           it is the one that gets stranded: on the plates
                           face it took a page to itself, 17px of type on an
                           empty sheet, which is the "blank page 2" Mike
                           screenshotted.
                           A running foot belongs on the page furniture, not
                           in the page body. Flat wings have no transport, so
                           there it stays a block exactly as before. */
                        <FaceFlow flat={flatFaces}
                          deps={String(activeTrack) + ":" + String(openEntry)}
                          footer={face.footer}>
                        {/* [F1 2026-07-31] THE PHOTO IS NOT A BANNER (Mike, doctrine).
                            S7 moved the still INSIDE the viewer, which was right,
                            but it landed as a full-width block across the top —
                            a banner. A banner crops the picture to a letterbox
                            slot it was never composed for, eats the height the
                            words need, and tells you nothing you could not have
                            been told in a caption.
                            So the head is a COMPOSITION: the text column and the
                            picture side by side, the picture SIZED to about a
                            third and shaped to its own aspect rather than to a
                            crop. Faces without a still collapse the grid to one
                            column and are unaffected. */}
                        {/* [L5 2026-08-02] THE LEAD IS ITS OWN BLOCK, AND THE
                            STAGE HAD BEEN SAYING SO IN THE CONSOLE.
                            The head used to hold the title, the subtitle AND the
                            lead paragraph as one indivisible block. On a phone
                            that block is taller than a whole page of the staged
                            wing, and the packer's own diagnostic said it in
                            words, repeatedly, on every load of /robots at 390px:
                            "[stage] block 0 is 244px and a column holds 202px —
                            it gets a column of its own and will overrun. Split
                            it upstream, or mark it data-stage-full if it wants
                            the page."
                            MEASURED CLIPPING at 390px before this: The Firmware
                            lost 83px off page 1, The Manual 39px. B5/D7 fixed
                            the WALL's phone overflow in the last round and these
                            two TEXT faces were still losing their first page.
                            `data-stage-full` is the wrong remedy of the two the
                            message offers — a lead paragraph is not a wall and
                            does not want the whole sheet. Splitting it upstream
                            is the right one, and the seam is already obvious in
                            the data: a `title`/`subtitle` are the page's HEADING
                            and `blurb` is its LEAD. Two things, two blocks, and
                            the packer can page between them when it has to.
                            NOTHING MOVES ON A WIDE PAGE. The lead follows the
                            heading exactly as before; the only difference is the
                            gap it sits on (the column's 12px rather than the
                            head grid's 12–22px), which is why the rule below
                            pins it. Wings that do not page (WAL is flat, /hr and
                            /wb declare no faces) cannot notice. */}
                        <div className="vp-face-head">
                          <div className="vp-face-headtext">
                            {face.title && <div className="vp-face-title">{face.title}</div>}
                            {face.subtitle && (
                              <div className="vp-face-sub">{face.subtitle}</div>
                            )}
                          </div>
                          {/* [G1 2026-07-31] THE LIVE FACE IS RETIRED.
                              Mike ruled the face frozen, so the iframe, its
                              hit layer and the one-machine gate all went with
                              it - dead machinery is dead whether or not it
                              once worked. It is ledgered A+++++++ and lives in
                              git at d43b9db, one revert away, which is a
                              better home than an unused branch in this file. */}
                          {face.still && (
                            <figure className="vp-face-plate">
                              {face.presets ? (
                                /* [G1] the frozen portal is still the door. The
                                   live face was clickable through a transparent
                                   hit layer, because an iframe swallows clicks;
                                   a still does not, so the picture can simply BE
                                   the button and the hit layer retires with the
                                   iframe. Same destination as ENTER. */
                                <button className="vp-face-door" onClick={enterRecipe}
                                        aria-label="Open the portal">
                                  <img className="vp-face-still" src={face.still} alt="" />
                                </button>
                              ) : (
                                <img className="vp-face-still" src={face.still} alt="" />
                              )}
                              {face.stillCaption && (
                                <figcaption className="vp-face-platecap">{face.stillCaption}</figcaption>
                              )}
                            </figure>
                          )}
                        </div>
                        {/* [L5] the LEAD, now a block of its own — see the note
                            above the head. */}
                        {face.blurb && <p className="vp-face-blurb">{face.blurb}</p>}
                        {/* ==== [C-b/C-c 2026-08-02] THE MUSEUM CARD ==========
                            R-a's finding, built. A museum has TWO labels for an
                            object and they are not interchangeable:
                              · the TOMBSTONE — the factual register. Maker,
                                date, medium, credit line. It does not change
                                when the object moves rooms.
                              · the INTERPRETIVE (extended) LABEL — 75–150 words
                                of what it is doing HERE. It does change, because
                                it is written for this exhibition.
                            The shipped face already had both halves and did not
                            know their names: `lines` was the tombstone, `blurb`
                            was the interpretive label. Naming them is what let
                            them be laid out as what they are.

                            MAGAZINE + SIDEBOXES, AND THE STAGE ALREADY DID IT.
                            The Stage sets two columns at >=760px and fills the
                            first before the second. Running text with boxed
                            asides flowing after it IS a magazine page — so the
                            card is authored as SEPARATE TOP-LEVEL BLOCKS rather
                            than as one grid. One grid would have been a single
                            indivisible slab that the stage could only warn about
                            and overrun; separate blocks page properly on a
                            phone. The layout is a consequence of the packing
                            model instead of a fight with it. */}
                        {/* `data-stage-split` ON THE LABEL, and it is not
                            cosmetic. Authored as ONE block, a three-paragraph
                            interpretive label is a single indivisible slab: the
                            packer cannot fit it after the head in column one,
                            so it drops the whole thing into column two and
                            leaves two-thirds of column one empty. Measured on
                            Carsie Blanton's card — a page that was half white.
                            Split by paragraph, the same words flow and fill,
                            which is what a magazine column does. */}
                        {face.label && (
                          <div className="vp-card-label" data-stage-split="row">
                            {(Array.isArray(face.label) ? face.label : [face.label])
                              .map((p, i) => <p key={i}>{p}</p>)}
                          </div>
                        )}
                        {/* ==== [R5b 2026-08-03] THE BILL — a poster for the
                            whole show ==========================================
                            MIKE killed "Its place in the museum" ("never meant
                            literally") and named the replacement: ABOUT OUR
                            CURRENT ARTISTS — "a one-page POSTER for the complete
                            show; functionally a poster, not a literal image: the
                            top-level details that PROMOTE the show. All four
                            artists, what they are, why they're here, the
                            standard. Serious and respectful, energetic,
                            WEIRD.BABY IN FULL COLORS."
                            A POSTER'S NAMES ARE DOORS. The one thing that
                            separates a printed bill from this one is that a
                            visitor can press a name and be standing in front of
                            that artist a moment later — so each act calls
                            `selectAlbum` on the album it names. That is the
                            promotion actually paying off rather than describing
                            itself. It resolves the album by ID against the live
                            spine, so a bill naming an act that is not in the
                            room renders as type and cannot dead-end.
                            IN FULL COLORS, AND THE COLOR IS THEIRS. The panels
                            are the artists' own covers, in color, per W8 — the
                            spotlight doctrine says the artists bring the color
                            and this is the house borrowing it rather than
                            inventing a palette to compete with it. The one house
                            value per act (`hue`) is a DESIGN choice and is
                            declared as one in the data; it is not a fact about
                            anybody. */}
                        {face.bill && Array.isArray(face.bill.acts) && (
                          <div className="vp-bill" data-stage-split="row">
                            {face.bill.standard && (
                              <p className="vp-bill-standard">{face.bill.standard}</p>
                            )}
                            <div className="vp-bill-acts">
                              {face.bill.acts.map((act, i) => {
                                const at = SPINE.findIndex(al => al.id === act.album);
                                const Tag = at >= 0 ? "button" : "div";
                                return (
                                  <Tag className="vp-bill-act" key={i}
                                    style={act.hue ? { "--act": act.hue } : undefined}
                                    onClick={at >= 0 ? () => selectAlbum(at, true) : undefined}>
                                    {act.art && (
                                      <img className="vp-bill-art" src={act.art} alt="" />
                                    )}
                                    <span className="vp-bill-name">{act.name}</span>
                                    {act.what && (
                                      <span className="vp-bill-what">{act.what}</span>
                                    )}
                                    {act.why && (
                                      <span className="vp-bill-why">{act.why}</span>
                                    )}
                                    {at >= 0 && (
                                      <span className="vp-bill-go">Open the room</span>
                                    )}
                                  </Tag>
                                );
                              })}
                            </div>
                            {face.bill.foot && (
                              <p className="vp-bill-foot">{face.bill.foot}</p>
                            )}
                          </div>
                        )}
                        {Array.isArray(face.tombstone) && face.tombstone.length > 0 && (
                          <dl className="vp-tomb" data-stage-split="row">
                            {/* [P20 2026-08-02] THE BACK OF THE BASEBALL CARD
                                GETS ITS DOORS. Mike LOVES this block and asked
                                for one thing: "ADD LINKS wherever possible."
                                The register is the one place on the card where
                                every line is a checkable fact, so a line that
                                can name where it was checked SHOULD — it is the
                                museum's provenance and the visitor's next step
                                in the same gesture. `url` is optional per row:
                                a row whose fact has no readable public source
                                stays plain type rather than borrowing a link
                                that does not prove it. */}
                            {face.tombstone.map((row, i) => (
                              <div className="vp-tomb-row" key={i}>
                                <dt>{row.k}</dt>
                                <dd>
                                  {row.url ? (
                                    <button className="vp-tomb-go"
                                      title={row.src ? "Source: " + row.src : undefined}
                                      onClick={() => openLink(row.url)}>
                                      {row.v}
                                    </button>
                                  ) : row.v}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {/* ==== [R6 2026-08-03] THE RECORD BOARD ==============
                            MIKE: "chart history and comparable metrics are VERY
                            interesting to fans. Add a metrics/achievements
                            surface per artist carrying only VERIFIABLE, DURABLE
                            facts — documented chart entries where they genuinely
                            exist, certifications, festival billings, notable
                            syncs (Mikey Mike's Canon placement is the model),
                            sourced per the ledger discipline. Do NOT write live
                            view counts or anything that goes stale by next week.
                            Nothing invented, nothing estimated."
                            WHY IT IS NOT THE TOMBSTONE. The register answers
                            "what IS this" — born, based, label, records. This
                            answers "what has this artist DONE that a third party
                            wrote down". They are different questions and they
                            have different half-lives: a tombstone row is true
                            forever, a record-board row is true from a date. So
                            every row carries a KIND (chart / award / nomination
                            / billing / sync / credit) and a WHEN, and the kind
                            is what makes the block scannable — a fan looking for
                            chart history should not have to read a biography to
                            find out there is none.
                            THE EMPTY STATE IS THE POINT, and it is P16's own
                            ruling applied one block up: an artist with no
                            documented chart entry gets the block SAYING SO. A
                            missing shelf reads as an oversight; a shelf with a
                            note on it reads as the truth about him. Two of the
                            four artists in this wing are that case and the wing
                            is more honest for showing it.
                            NOTHING HERE REFRESHES. Every row was true when it
                            was written and stays true: a chart peak, an award, a
                            billing, a sync. View counts are deliberately absent
                            — they belong to `feed`, which is dated on its own
                            face, and to the weekly-refresh automation, not to a
                            board of achievements. */}
                        {face.metrics && (face.metrics.rows?.length > 0 || face.metrics.note) && (
                          <div className="vp-metrics" data-stage-split="row">
                            <h4 className="vp-metrics-head">
                              {face.metrics.title || "Chart history and achievements"}
                            </h4>
                            {face.metrics.rows?.length > 0 && (
                              <ul className="vp-metrics-list">
                                {face.metrics.rows.map((m, i) => (
                                  <li className="vp-metric" key={i}>
                                    <span className="vp-metric-kind">{m.kind}</span>
                                    <span className="vp-metric-body">
                                      {/* the same door rule as the register's:
                                          a row that can name where it was
                                          checked SHOULD, and a row whose fact
                                          has no readable public source stays
                                          plain type rather than borrowing a
                                          link that does not prove it. */}
                                      {m.url ? (
                                        <button className="vp-metric-go"
                                          title={m.src ? "Source: " + m.src : undefined}
                                          onClick={() => openLink(m.url)}>
                                          {m.fact}
                                        </button>
                                      ) : (
                                        <span className="vp-metric-fact">{m.fact}</span>
                                      )}
                                      {m.src && !m.url && (
                                        <span className="vp-metric-src">{m.src}</span>
                                      )}
                                    </span>
                                    <span className="vp-metric-when">{m.when}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {face.metrics.note && (
                              <p className="vp-metrics-note">{face.metrics.note}</p>
                            )}
                          </div>
                        )}
                        {/* ==== [P16 2026-08-02] THE RECORDS ARE DOORS =======
                            MIKE: "every record needs LINKS TO THE ALBUM as
                            ICONS (Bandcamp, YouTube, etc. — the platforms that
                            actually carry it, verified)."
                            A record on a museum wall is an OBJECT, and the one
                            thing a visitor wants from it is to go and hear it.
                            Listed as text it was a fact about the past; listed
                            as a door it is an offer.
                            THE MARKS ARE TWO LETTERS, NOT A LOGO. A platform's
                            wordmark is its trademark and this museum does not
                            own it; a two-letter badge with the full name on the
                            control's own label reads at a glance, survives any
                            font stack, and belongs to us. Same reasoning as
                            P6's arrow, arrived at from the other side: what is
                            drawn must be readable, and what is not readable
                            must be written.
                            DATA, like everything else on a face — a wing that
                            declares no records renders none. */}
                        {/* A NOTE WITH NO ITEMS IS STILL A RECORDS BLOCK, and
                            deliberately so: an artist whose catalogue has no
                            door we could verify (Mikey Mike — no Bandcamp, and
                            his own domain is serving injected spam) gets the
                            block SAYING THAT rather than getting no block. A
                            missing shelf reads as an oversight; a shelf with a
                            note on it reads as the truth about him. */}
                        {face.records && (face.records.items?.length > 0 || face.records.note) && (
                          <div className="vp-records" data-stage-split="row">
                            {face.records.title && (
                              <h4 className="vp-records-head">{face.records.title}</h4>
                            )}
                            <ul className="vp-records-list">
                              {(face.records.items || []).map((r, i) => (
                                <li className="vp-record" key={i}>
                                  <span className="vp-record-when">{r.year}</span>
                                  <span className="vp-record-body">
                                    <span className="vp-record-title">{r.title}</span>
                                    {r.why && <span className="vp-record-why">{r.why}</span>}
                                  </span>
                                  <span className="vp-record-doors">
                                    {(r.links || []).map((l, j) => (
                                      <button key={j} className="vp-record-door"
                                        title={l.name} aria-label={r.title + " on " + l.name}
                                        onClick={() => openLink(l.url)}>
                                        {l.mark}
                                      </button>
                                    ))}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {face.records.note && (
                              <p className="vp-records-note">{face.records.note}</p>
                            )}
                          </div>
                        )}
                        {/* ==== [P17/P18/P19 2026-08-02] THE DECKS ============
                            MIKE, on "Said about her": "(a) enable the LINK to
                            the source thing; (b) formatting is poor — runs on,
                            wastes space: rebuild as post-it notes / fancy
                            museum cards / EMBEDS where possible (visuals!).
                            Mike wanted MORE of it — that appetite is the
                            target, don't over-feed."
                            WHAT WAS WRONG: it was a SIDEBOX — a ruled column of
                            mono lines where a quote and its attribution were
                            two adjacent lines of identical weight, so a reader
                            had to work out which was which, and the source was
                            named but dead.
                            WHAT IT IS NOW: cards. A quotation is a physical
                            thing in a museum — a card pinned to the wall beside
                            the object — so it is set as one: paper, a small
                            tilt, a shadow, the quote in the reading face and
                            the attribution as a stamp beneath it. The whole
                            card is the link to its source, so "enable the LINK"
                            is answered by the card being the door rather than
                            by hiding a chevron in a corner.
                            AND WHERE THE SOURCE IS A VIDEO, THE CARD IS THE
                            VIDEO'S OWN POSTER — the embed answer to "visuals!",
                            using the same poster surface the collage already
                            uses (W3), so nothing new is being hotlinked and
                            nothing new had to be invented.
                            ONE RENDERER, THREE DECKS. What the press said, what
                            the artist said, and what else they make are the
                            same object — a short thing, and where it came from
                            — so they share a renderer and differ only in
                            heading. That is what keeps "MORE of it" from
                            becoming three more components. */}
                        {Array.isArray(face.decks) && face.decks.map((deck, di) => (
                          <section className="vp-deck" key={di} data-stage-split="row">
                            <h4 className="vp-deck-head">{deck.title}</h4>
                            <div className="vp-deck-cards">
                              {(deck.cards || []).map((c, ci) => {
                              /* A CARD WITHOUT A URL IS NOT A BUTTON. Some of
                                 the best material on these walls has no public
                                 page behind it — the museum's own vault is the
                                 source for Hunter Root, and two of Mikey
                                 Mike's come from print interviews with no live
                                 link. A control that looks pressable and does
                                 nothing is the exact defect W4a was: so a
                                 sourced-but-unlinked card renders as what it
                                 is, a card, and keeps its attribution. */
                              const Card = c.url ? "button" : "div";
                              return (
                                <Card key={ci}
                                  className={"vp-qcard" + (c.watch ? " vp-qcard-watch" : "") +
                                             (c.url ? "" : " vp-qcard-flat")}
                                  /* [B3 2026-08-02] THE POST-ITS GET THE
                                     COLLAGE'S OWN TILT VOCABULARY (Mike).
                                     What was here was `((ci*5)%5)-2`, and a
                                     multiple of five is never anything but
                                     zero modulo five: EVERY card in every
                                     deck was pinned at exactly -2deg. The
                                     wall it was imitating uses a stride
                                     coprime with its modulus — `(i*7)%9` walks
                                     0,7,5,3,1,8,6,4,2 before it repeats — so
                                     adopting the wall's own numbers is both
                                     the fix and the instruction: one tilt
                                     vocabulary, used by everything pinned to
                                     these walls. */
                                  style={{ "--tilt": `${((ci * 7) % 9) - 4}deg` }}
                                  onClick={c.url ? () => openLink(c.url) : undefined}>
                                  {c.watch && (
                                    <img className="vp-qcard-still" alt=""
                                      src={`https://i.ytimg.com/vi/${c.watch}/hqdefault.jpg`} />
                                  )}
                                  {c.eyebrow && <span className="vp-qcard-eyebrow">{c.eyebrow}</span>}
                                  {c.text && (
                                    <span className="vp-qcard-text">
                                      {deck.kind === "quote" ? "“" + c.text + "”" : c.text}
                                    </span>
                                  )}
                                  <span className="vp-qcard-stamp">
                                    {c.who && <span className="vp-qcard-who">{c.who}</span>}
                                    <span className="vp-qcard-src">
                                      {[c.where, c.when].filter(Boolean).join(" · ")}
                                    </span>
                                  </span>
                                </Card>
                              );})}
                            </div>
                          </section>
                        ))}
                        {Array.isArray(face.sideboxes) && face.sideboxes.map((b, i) => (
                          <aside className="vp-box" key={i}>
                            <h4 className="vp-box-head">{b.title}</h4>
                            <ul className="vp-box-lines">
                              {(b.lines || []).map((l, j) => <li key={j}>{l}</li>)}
                            </ul>
                            {b.note && <p className="vp-box-note">{b.note}</p>}
                          </aside>
                        ))}
                        {Array.isArray(face.lines) && face.lines.length > 0 && (
                          <ul className="vp-face-lines">
                            {face.lines.map((l, i) => <li key={i}>{l}</li>)}
                          </ul>
                        )}
                        {/* ==== [B8 2026-08-02] THE REEL ======================
                            MIKE'S RULING, recorded where the thing lives: the
                            owner's manual must be ACTUAL SCANS/PHOTOGRAPHS of
                            the ACTUAL manual, reached through microfiche-class
                            technology. Not "in the style of" — the immersion
                            is the point, and a typeset pastiche of a 1965 page
                            is a drawing of evidence rather than evidence. The
                            generated PDF and plates become THE SOURCE MIKE
                            PRINTS AND PHOTOGRAPHS; the photograph of that
                            print is the artifact.
                            SO THE CONTAINER IS BUILT AND THE REEL IS EMPTY,
                            and it says which. `reel.plates` is the same shape
                            as a collage tile, which is deliberate: the wing's
                            viewer already pages and zooms a set of plates, so
                            when the scans arrive they are DATA in this file
                            and nothing here changes. An empty reel renders the
                            honest state instead of a promise — the same rule
                            the face itself was written under. */}
                        {face.reel && (() => {
                          const frames = face.reel.plates || [];
                          return (
                            <div className="vp-reel">
                              <div className="vp-reel-head">
                                <span className="vp-reel-label">
                                  {face.reel.label || "MICROFICHE"}
                                </span>
                                <span className="vp-reel-count">
                                  {frames.length
                                    ? frames.length + (frames.length === 1 ? " frame" : " frames")
                                    : "reel empty"}
                                </span>
                              </div>
                              {frames.length > 0 ? (
                                <button className="vp-reel-go"
                                  onClick={() => openLink(frames[0].img,
                                    { set: frames, index: 0, setTitle: face.title })}>
                                  {face.reel.cta || "LOAD REEL"}
                                </button>
                              ) : (
                                face.reel.note && (
                                  <p className="vp-reel-note">{face.reel.note}</p>
                                )
                              )}
                            </div>
                          );
                        })()}
                        {/* [X3 2026-07-30] THE FIRST LAYER. `lines` is a
                            register — a few fixed key/value facts about the
                            object. `entries` is the object's own CONTENTS: the
                            log's dated posts, the manual's sections, the FAQ's
                            questions. Structure real, words minimal-but-true,
                            [PAPA] where they are Mike's. Same discipline as
                            `face` itself: data, never a component, so /hr and
                            /wb cannot notice it exists. */}
                        {/* [S6 2026-07-30] A LOG OPENS AT THE END.
                            `entriesMode:"log"` shows the MOST RECENT entry
                            first and gives the reader a period-true way back
                            through the rest: a ruled index of dates, the way
                            a bound volume carries one. No pager chrome, no
                            "next post" — the index IS the navigation, exactly
                            as the container proposal specified for `journal`.
                            Reversal happens HERE, not in the data: the
                            entries stay in the order they happened. */}
                        {/* [M5 2026-08-01] THE RECORD OPENS ONE PAGE AT A TIME.
                            A `list` face renders every entry as before. A `log`
                            face is a bound volume: the index stands until a
                            record is chosen, then THAT RECORD FILLS THE FRAME
                            and nothing else competes with it. The control that
                            opened it closes it — there is no separate shut
                            button, because the two Mike killed were exactly
                            that and they were operating on the whole volume
                            rather than on the page you were reading.
                            Moving between records happens FROM INSIDE a
                            record, which is the thing a reader actually wants
                            and the old index could not do: it could only put
                            you back at the top. */}
                        {Array.isArray(face.entries) && face.entries.length > 0 && (() => {
                          const isLog = face.entriesMode === "log";
                          /* reversal happens HERE, not in the data: the entries
                             stay in the order they happened. */
                          const list = isLog ? [...face.entries].reverse() : face.entries;
                          if (!isLog) return (
                            <ol className="vp-face-entries" data-stage-split="row">
                              {list.map((en, i) => (
                                <li key={i} className={"vp-fe" + (en.img ? " vp-fe-plated" : "")}>
                                  {en.stamp && <span className="vp-fe-stamp">{en.stamp}</span>}
                                  {/* [F1 2026-08-03] AN ENTRY MAY CARRY A PICTURE.
                                      THE VISUAL HOOK LAW (Mike, this round): land on
                                      words alone and the visitor probably walks out —
                                      every surface needs something visually compelling
                                      besides written words.
                                      "About the Songs" was the wing's worst offender: a
                                      full page of interpretive labels with no image
                                      anywhere on it, sitting one row below a tracklist
                                      of songs that all HAVE a picture. The picture was
                                      never missing; it was just never asked for.
                                      OPTIONAL, SO NOTHING ELSE MOVES. Every entry in
                                      the building that declares no `img` renders the
                                      markup it rendered before — the robots wing's
                                      Record, FAQ, Contact and Firmware faces are all
                                      entry lists and none of them gains a byte. */}
                                  {en.img && (
                                    <img className="vp-fe-plate" src={en.img} alt=""
                                         loading="lazy" />
                                  )}
                                  <span className="vp-fe-body">
                                    {/* [P5] an entry whose title was the operator's
                                        keeps its body and loses the empty heading —
                                        a blank bold line is a leak with the words
                                        taken out. */}
                                    {en.title && <span className="vp-fe-title">{en.title}</span>}
                                    {en.line && <span className="vp-fe-line">{en.line}</span>}
                                    {en.note && <span className="vp-fe-note">{en.note}</span>}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          );
                          const open = openEntry !== null && list[openEntry] ? openEntry : null;
                          /* [L6 2026-08-02] THE INDEX IS BANDED WHEN IT IS LONG
                              ENOUGH TO NEED IT — binge prep, D-BINGE.
                              "A Record of ten entries and a Record of four
                              hundred are the same component, and the one that
                              breaks at four hundred is not finished." Ten rows
                              are a list; four hundred are a wall of dates with
                              no landmarks in it, and a reader walking back
                              through weeks has nothing to walk BY.
                              Bands are MONTHS, derived from each entry's real
                              date — see the arithmetic in record-model.js for
                              why not weeks. They appear only when there are
                              enough entries AND more than one month among them,
                              so today's ten-entry Record is byte-identical to
                              before and the furniture arrives with the volume
                              that needs it. */
                          if (open === null) return (
                            <ol className="vp-face-entries vp-rec-index" data-stage-split="row">
                              {(shouldBand(list) ? groupByPeriod(list) : list.map((entry, index) => ({ entry, index })))
                                .map((row) => row.band !== undefined ? (
                                  <li key={"b" + row.band} className="vp-rec-band" aria-hidden="true">
                                    {row.label}
                                  </li>
                                ) : (() => { const en = row.entry, i = row.index; return (
                                <li key={i} className="vp-fe vp-rec-row">
                                  <button className="vp-rec-open" onClick={() => setOpenEntry(i)}>
                                    {entryStamp(en) && <span className="vp-fe-stamp">{entryStamp(en)}</span>}
                                    <span className="vp-fe-body">
                                      {/* [B9] the class rides the INDEX, which is
                                          the point of classing at all: a reader
                                          scanning the register can see that a
                                          week brought a transmission rather than
                                          another paragraph, before opening it.
                                          IT SHARES THE TITLE'S LINE, and that is
                                          arithmetic rather than taste: measured
                                          on its own row it added ~20px to each of
                                          ten rows and pushed the index onto a
                                          second page — a class badge that costs a
                                          page of navigation is not paying for
                                          itself. Beside the title it costs
                                          nothing and reads as what it is, an
                                          attribute of the entry. */}
                                      <span className="vp-fe-titlerow">
                                        <span className="vp-fe-title">{en.title}</span>
                                        {en.evidence && (
                                          <span className="vp-fe-class">{en.evidence}</span>
                                        )}
                                        {/* [L6] WHAT THE WEEK ACTUALLY BROUGHT,
                                            counted, on the row. B9 put the CLASS
                                            on the index so a reader could see a
                                            week brought a transmission rather
                                            than another paragraph. The count is
                                            the other half: three photographs and
                                            a transmission is a different Tuesday
                                            from one photograph, and at binge
                                            volume that difference is the whole
                                            navigation. Absent entirely on an
                                            entry with no payloads, which is
                                            every entry written so far — the
                                            index does not move until the
                                            evidence does. */}
                                        {evidenceOf(en).map(ev => (
                                          <span key={ev.kind} className="vp-fe-load">
                                            {ev.kind}<i>{ev.count}</i>
                                          </span>
                                        ))}
                                      </span>
                                      {en.line && <span className="vp-fe-line vp-rec-peek">{en.line}</span>}
                                    </span>
                                  </button>
                                </li>
                              ); })())}
                            </ol>
                          );
                          const en = list[open];
                          /* ==== [RC 2026-08-04] THE LONG-FORM RECORD ENTRY ===
                              MIKE'S APPROVED CONTAINER — headline, dateline,
                              lead, four-to-seven sections with inline door
                              icons, tombstone. It is a WHOLE BODY rather than
                              a payload, which is why it is a component and not
                              another block in the run below.
                              THE SWITCH IS THE HOUSE'S OWN AND IT IS THE DATA:
                              an entry that declares `sections` renders it; an
                              entry that does not is byte-identical to before —
                              the same rule as `img` (F1), `wire`/`plates` (B9)
                              and `docs` (L6). No mode flag, no second species
                              of Record, and the ten entries already written did
                              not move a byte.
                              It returns a FRAGMENT, so its parts are still
                              siblings in this container exactly as L6 requires
                              — the flat wing's rhythm ladder and the packer's
                              block list both see the same shape they saw. */
                          if (Array.isArray(en.sections) && en.sections.length > 0) return (
                            <RecordEntry
                              entry={en} list={list} open={open}
                              epoch={face.recordEpoch}
                              openLink={openLink}
                              onOpen={setOpenEntry}
                              onClose={() => setOpenEntry(null)}
                              twinEvent={face.twinEvent} />
                          );
                          return (
                            /* [L6 2026-08-02] AN OPENED RECORD IS A RUN OF
                                BLOCKS, NOT ONE BLOCK.
                                It used to be a single `.vp-rec` div, which the
                                stage sees as one indivisible thing. That was
                                fine while every entry was a paragraph; it stops
                                being fine the moment an entry carries the
                                evidence D-BINGE asks for. MEASURED with a
                                synthetic entry holding three documents and a
                                transmission: **32px off the bottom of the page**,
                                clipped, with no scrollbar — the same shape of
                                defect as D3's wall and F5's head, one level in.
                                So the record's parts are siblings and the packer
                                pages them, and the document list carries
                                `data-stage-split="row"` so a stack of ten
                                documents divides by card rather than as a lump.
                                The `.vp-rec` and `.vp-rec-body` wrappers are
                                gone; the gaps they supplied are now margins on
                                the parts, so the flat wing (whose container has
                                no gap at all) reads identically. */
                            [
                              <button key="head" className="vp-rec-head" onClick={() => setOpenEntry(null)}
                                      title="close this record">
                                {entryStamp(en) && <span className="vp-fe-stamp">{entryStamp(en)}</span>}
                                <span className="vp-rec-title">{en.title}</span>
                                {en.evidence && (
                                  <span className="vp-fe-class">{en.evidence}</span>
                                )}
                              </button>,
                              en.line ? <p key="line" className="vp-rec-line">{en.line}</p> : null,
                              /* ==== [B9 2026-08-02] THE RECORD CARRIES
                                    EVIDENCE, NOT ONLY PARAGRAPHS ============
                                    MIKE: "The Record needs to carry more than
                                    plates: photos, electronic data
                                    transmissions and other evidence classes
                                    arrive long before units do. Extend the
                                    content model to accept those classes
                                    (data-driven, no new species) so the binge
                                    has material."
                                    NO NEW SPECIES, LITERALLY. A class is a
                                    WORD on the entry (`evidence`) — the
                                    renderer prints it and has no list of
                                    permitted values, so a class Mike invents
                                    next month needs no code. A payload is one
                                    of the two vocabularies this face already
                                    speaks: `wire` is the register block the
                                    machine pages already use, and `plates` is
                                    the same set the plate wall and the
                                    microfiche reader take — so a photograph
                                    attached to a Tuesday in 2024 opens in the
                                    identical reader as a plate off the wall.
                                    An entry declaring neither renders exactly
                                    as it did before, which is why the ten
                                 entries already written did not move. */
                              Array.isArray(en.wire) && en.wire.length > 0 ? (
                                <ul key="wire" className="vp-face-lines vp-rec-wire" data-stage-split="row">
                                  {en.wire.map((l, wi) => <li key={wi}>{l}</li>)}
                                </ul>
                              ) : null,
                              Array.isArray(en.plates) && en.plates.length > 0 ? (
                                <div key="plates" className="vp-rec-plates">
                                    {en.plates.map((p, pi) => (
                                      <button key={pi} className="vp-rec-plate"
                                        onClick={() => openLink(p.img,
                                          { set: en.plates, index: pi,
                                            setTitle: en.title })}>
                                        <img src={p.img} alt="" />
                                        {p.label && (
                                          <span className="vp-rec-plate-cap">{p.label}</span>
                                        )}
                                      </button>
                                    ))}
                                </div>
                              ) : null,
                              /* ==== [L6 2026-08-02] DOCUMENTS ==============
                                    The third class Mike named, and the one B9
                                    did not have a shape for. `wire` covers
                                    transmissions and `plates` covers
                                    photographs; a DOCUMENT is neither, because a
                                    document is a thing with a PROVENANCE first —
                                    who wrote it, when, how many pages — and then,
                                    separately and later, an image of it and/or
                                    words taken out of it.
                                    THOSE THREE ARRIVE AT DIFFERENT TIMES, which
                                    is exactly why they are three fields. A
                                    catalogue card can be written the day the
                                    document is found; the scan waits on a camera;
                                    the extract waits on somebody reading it. A
                                    model that demanded all three at once would
                                    mean nothing about the document could be
                                    published until everything about it was, and
                                    the Record is a log of a discovery in
                                    progress.
                                    SO THE STATE IS PART OF THE MODEL, not an
                                    accident of which fields happen to be filled:
                                    `imaged` opens in the reader, `quoted` prints
                                    the extract with its source, `held` prints
                                    the provenance and says plainly that the page
                                    itself is not here. That last one is the
                                    honest half — the same discipline as B8's
                                    reel, which ships empty and says "reel empty"
                                    rather than rendering nothing and hoping.
                                    A SET OF SCANS OPENS AS ITS OWN REEL, the
                                    identical reader as a plate off the wall,
                                 because a document's pages ARE a reel. */
                              Array.isArray(en.docs) && en.docs.length > 0 ? (
                                <ul key="docs" className="vp-rec-docs" data-stage-split="row">
                                    {en.docs.map((doc, di) => {
                                      const state = docState(doc);
                                      const scans = en.docs
                                        .filter(x => x && x.scan)
                                        .map(x => ({ img: x.scan, label: x.title, date: x.date }));
                                      const si = scans.findIndex(x => x.img === doc.scan);
                                      return (
                                        <li key={di} className={"vp-rec-doc vp-rec-doc--" + state}>
                                          <div className="vp-rec-doc-head">
                                            <span className="vp-rec-doc-title">{doc.title}</span>
                                            <span className="vp-rec-doc-state">{state}</span>
                                          </div>
                                          {(doc.source || doc.date || doc.pages) && (
                                            <div className="vp-rec-doc-prov">
                                              {[doc.source, doc.date,
                                                doc.pages ? doc.pages + "pp" : null]
                                                .filter(Boolean).join("  ·  ")}
                                            </div>
                                          )}
                                          {state === "imaged" && (
                                            <button className="vp-rec-plate vp-rec-doc-scan"
                                              onClick={() => openLink(doc.scan,
                                                { set: scans, index: si < 0 ? 0 : si,
                                                  setTitle: doc.title || en.title })}>
                                              <img src={doc.scan} alt="" />
                                            </button>
                                          )}
                                          {state === "quoted" && (
                                            <blockquote className="vp-rec-doc-extract">
                                              {doc.extract}
                                            </blockquote>
                                          )}
                                          {doc.note && (
                                            <p className="vp-rec-doc-note">{doc.note}</p>
                                          )}
                                        </li>
                                      );
                                  })}
                                </ul>
                              ) : null,
                              en.note ? <p key="note" className="vp-fe-note">{en.note}</p> : null,
                              /* THE PAGE ENDS DEFINITIVELY. A reader should never
                                 have to wonder whether there is more below the
                                 fold; the mark says the record is finished, the
                                 way a set proof closes with a tombstone. */
                              <div key="end" className="vp-rec-end" aria-hidden="true"><i /></div>,
                              <nav key="nav" className="vp-rec-nav">
                                <button className="vp-rec-step" disabled={open === 0}
                                        onClick={() => setOpenEntry(open - 1)}>‹ NEWER</button>
                                <span className="vp-rec-count">{open + 1} of {list.length}</span>
                                <button className="vp-rec-step" disabled={open === list.length - 1}
                                        onClick={() => setOpenEntry(open + 1)}>OLDER ›</button>
                              </nav>,
                            ].filter(Boolean)
                          );
                        })()}
                        {/* [TRAIL 2026-08-02] MARKERS, NOT A LINK DUMP.
                            Each row is a destination plus one clause of
                            SCENT - why following it is worth the click. The
                            trail is data on the face like everything else, so
                            a wing that declares none renders none. */}
                        {/* `data-stage-split` because a trail is a LIST, and a
                            list authored as one block is the exact case the
                            stage warns about and overruns. Measured on the
                            Lately face, whose trail is eleven uploads: 63px
                            past the bottom of its column. The stage's own
                            instruction for that is "split it into smaller
                            blocks upstream" — this is upstream. The rules are
                            on the rows rather than the container, so a trail
                            broken across pages looks identical to one that is
                            not. */}
                        {/* [M6 2026-08-03] A DOOR MAY BE QUIET.
                            MIKE, on WAL's booth pointer: "too loud and
                            duplicative — one quiet inline link where it
                            genuinely helps."
                            He is right on both counts. The card it sits on is
                            "Its place in the museum", whose entire body is the
                            house explaining itself; a marquee door underneath
                            it saying "the house's own FAQ — who we are" is the
                            same sentence again, in display caps, on a raised
                            card with a lit rule, at the size P10 sized doors to
                            be. A marquee door is right for a door OUT of the
                            building — an artist's own site, their store — which
                            is what P10 was written for and what the register
                            still means. It is wrong for a pointer down the
                            corridor to another room of this same museum.
                            SO A ROW MAY DECLARE `quiet` AND BECOME A SENTENCE.
                            Same data shape, same `openLink` seam, same
                            `data-stage-split` behaviour — the only difference
                            is which register it is drawn in. That is why this
                            is a flag on the existing trail rather than a new
                            field family for one card: any wing that grows an
                            in-building pointer gets the right voice for free,
                            and any wing that declares no `quiet` renders
                            byte-identically to before. */}
                        {Array.isArray(face.trail) && face.trail.some(t => !t.quiet) && (
                          <ul className="vp-trail" data-stage-split="row">
                            {face.trail.filter(t => !t.quiet).map((t, i) => (
                              <li key={i}>
                                <button className="vp-trail-go"
                                        onClick={() => openLink(t.url)}>
                                  {/* [P15 2026-08-02] NAME + FUNCTION, AS MIKE
                                      READ IT. "The four doors read well as
                                      Name+function pairs (Homepage / Shop and
                                      Tours / Music Library / Video Channel).
                                      Keep the pattern, fill the descriptors
                                      properly." The NAME is whose place it is;
                                      the FUNCTION is what you will find when
                                      you get there, and it is the half a
                                      stranger steers by. `fn` is DATA on the
                                      trail row like `label` and `scent`, so a
                                      door without one renders exactly as
                                      before and no other wing changes. */}
                                  <span className="vp-trail-label">
                                    <span className="vp-trail-name">{t.label}</span>
                                    {t.fn && <span className="vp-trail-fn">{t.fn}</span>}
                                  </span>
                                  {t.scent && <span className="vp-trail-scent">{t.scent}</span>}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {Array.isArray(face.trail) && face.trail.some(t => t.quiet) && (
                          <p className="vp-trail-quiet" data-stage-split="row">
                            {face.trail.filter(t => t.quiet).map((t, i) => (
                              <span key={i}>
                                {i > 0 && "  ·  "}
                                {t.scent ? t.scent + " " : ""}
                                <button className="vp-trail-quiet-go"
                                        onClick={() => openLink(t.url)}>{t.label}</button>
                              </span>
                            ))}
                          </p>
                        )}
                        {/* [W2 2026-08-02] THE COLLAGE — a glued-up wall of
                            the artist's own thumbnails, tilted like posters
                            on a green-room door. Mike's ruling: users click
                            pretty pictures; they do NOT read words to guess
                            at quality — so the picture IS the row and the
                            words ride a small caption strip. Every tile is
                            the video's own poster surface (W3) and opens the
                            video through the wing's own link seam. DATA on
                            the face like everything else: a wing that
                            declares no collage renders none. */}
                        {/* [B5 2026-08-02] `data-stage-full` — THE WALL TAKES
                            THE PAGE. Measured before the mark went on: 1134px
                            of wall into a 758px column, three plates clipped
                            away under `overflow:hidden` with no scrollbar to
                            reach them. At the page's full width the same grid
                            auto-fills five across and lands in two rows. The
                            flat wings (WAL) never enter the stage, so their
                            collage is untouched by this. */}
                        {/* [B6] the tile hands over the WHOLE WALL and which
                            tile was tapped. A wing with a viewer (robots)
                            opens at that plate and pages through the rest; a
                            wing without one (WAL) reads `href` and ignores the
                            extras, which is why nothing over there had to
                            change. [A3/A4 2026-08-04] the wall may now arrive
                            in headed spreads — see `ArchiveWall` above; a face
                            declaring only `collage` emits the same DOM. */}
                        <ArchiveWall face={face} openLink={openLink} />
                        {/* [B5] staged wings put this on the transport (above);
                            flat wings have no transport, so it stays here. */}
                        {face.footer && flatFaces && (
                          <div className="vp-face-footer">{face.footer}</div>
                        )}
                        {/* [O4 2026-07-30] THE PORTAL'S OWN FURNITURE.
                            Presets and cross-references are DATA and stay
                            data: the engine dispatches an id and a track name
                            and learns nothing about twins or machines. A face
                            without them renders exactly as before. */}
                        {/* [L2 2026-07-31] A SELECTOR, NOT A BUTTON SEA.
                            Four doors side by side made the visitor compare
                            before entering. A named selector asks one
                            question — how do you want to arrive — and the
                            answer is one line of type in the machine's own
                            register. Entries marked `held` render disabled
                            with their reason visible, because a menu that
                            hides what it is not offering is lying about the
                            size of the room. */}
                        {Array.isArray(face.presets) && face.presets.length > 0 && (
                          <div className="vp-recipes">
                            <label className="vp-recipes-head" htmlFor="vp-recipe-sel">
                              {face.presetsLabel || "ARRIVE AS"}
                            </label>
                            <div className="vp-recipe-row">
                              <select
                                id="vp-recipe-sel"
                                className="vp-recipe-sel"
                                value={recipeIdx}
                                onChange={e => setRecipeIdx(Number(e.target.value))}
                              >
                                {face.presets.map((p, i) => (
                                  <option key={i} value={i} disabled={p.state === "held"}>
                                    {p.label}{p.state === "held" && p.why ? `  — ${p.why}` : ""}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="vp-recipe-go"
                                disabled={face.presets[recipeIdx]?.state === "held"}
                                onClick={enterRecipe}
                              >ENTER</button>
                            </div>
                            {face.presets[recipeIdx]?.line && (
                              <div className="vp-recipe-line">{face.presets[recipeIdx].line}</div>
                            )}
                          </div>
                        )}
                        {/* [L3 2026-07-31] THE SEE-ALSO RENDERER WENT WITH ITS DATA.
                            F2 removed the Portal's cross-references; no face
                            declares `links` now, so the code that drew them
                            was carrying nothing. "Nothing extra unless it
                            carries more than its own weight" applies to the
                            renderer as much as to the page. */}
                        {face.papa && (
                          <div className="vp-face-papa">{face.papa}</div>
                        )}
                        {/* [S5 2026-07-30] THE STANDALONE LAUNCH LINK IS GONE.
                            It usurped the rack: a door beside four doors, all
                            leading to the same room in different states. The
                            PRESETS ARE THE ENTRIES. A face may still declare
                            `action` — the preset buttons read its event name —
                            but it no longer renders a button of its own. */}
                        {/* [W4a 2026-08-02] THE BUTTON CARRIES ITS OWN HREF —
                            and this was the wing-wide dead-button bug. The
                            dispatch sent `{ album }` and nothing else, while
                            WalExhibitFlow's listener opens `detail.href`; so
                            every action button in the wing fired an event
                            that named no destination and silently did
                            nothing. The trail rows, which do pass href, were
                            the proof the seam itself worked. The action's own
                            href now rides the detail; listeners that ignore
                            it (robots' twin-opener) see one extra field and
                            no change. */}
                        {face.action && !face.presets && (
                          <button
                            className="vp-face-action"
                            onClick={() => window.dispatchEvent(
                              new CustomEvent(face.action.event,
                                { detail: { album: album.id, href: face.action.href } })
                            )}
                          >{face.action.label}</button>
                        )}
                        </FaceFlow>)}
                      </div>
                    </div>
                  )}
                  {!hasVideo && !thumbVid && !fallbackFace && album.viewerPoster && (
                    <div className="vp-poster">
                      <img src={album.viewerPoster} alt="" />
                      {album.viewerPosterCaption && (
                        <div className="vp-poster-cap">{album.viewerPosterCaption}</div>
                      )}
                    </div>
                  )}
                  {!hasVideo && !thumbVid && !fallbackFace && !album.viewerPoster && (
                    <div className="vp-empty-state">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M7 5.5L22 14L7 22.5V5.5Z" fill="#2a2a2a"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* FACTS
                  [O3a 2026-07-30] THE REST OF THE DEAD CREAM. `.fs-wrap` is
                  `flex:1`, so it claimed an EQUAL SHARE of the right column
                  with the viewer — and /robots declares `facts: []`. The
                  result was 236px of empty scroller sitting beside a 151px
                  viewer: the panel Mike was dragging was the smaller half of a
                  column whose larger half had nothing in it.
                  An exhibit with no facts does not get a fact scroller. /hr
                  and /wb declare theirs and are untouched. */}
              {/* [P4 2026-08-02] AND A CARD GETS NO SCROLLER UNDER IT.
                  MIKE: "remove the PUV scroller from the bottom of About the
                  Artist entirely."
                  The scroller is AMBIENT PLAYBACK FURNITURE — factoids that
                  ride under a running picture (F5's ruling, when the summonable
                  fact card was retired). Under a card face there is no picture:
                  the video is stowed, the face runs the full length of the
                  page, and the scroller lands at the FOOT of a two-thousand
                  pixel document as an unexplained band of quotes with nothing
                  above it to be ambient to. It also re-cycles every 7.5s while
                  the visitor is reading something else entirely.
                  SCOPED TO THE STOWED STATE, not to the one card Mike named:
                  the reason applies identically to About the Songs, to What
                  they are up to and to the house album's own pages, and a rule
                  that fired on a title string rather than on the state would be
                  a coincidence waiting to break. Cued songs and playing videos
                  keep their scroller exactly as before; so do /hr and /wb,
                  which are never in this state. */}
              {Array.isArray(FACTS) && FACTS.length > 0 && !(flatFaces && showFace) && (
              <FactScroller
                facts={FACTS}
                albumTag={album.tag}
                songSlug={activeTrack !== null ? album.tracks[activeTrack]?.song : null}
                eraSlugs={artist.eraAlias?.[album.id] ?? []}
                exhibit={artist.exhibitSlug}
                accent={album.accent}
              />
              )}
            </div>

          </div>
        </div>

        {/* [X2] BODY HEIGHT DRAG — the carousel's handle, pointed at the body.
            Rendered only for artists that opted in, so the exhibits that never
            asked for it keep their exact DOM. */}
        {bodyResizable && (
          <div className="bd-dh" onPointerDown={makeBodyDrag}>
            <div className="bd-dh-line" />
            <div className="bd-dh-dot" />
            <div className="bd-dh-line" />
          </div>
        )}

        {/* [STAGE 2026-08-02] THE PLAYER BAR IS NO LONGER A FIXTURE.
            Mike's doctrine: a transport appears only where the setting has
            purpose for it, and its form may differ per setting. /robots has
            no music - its one moving thing is a machine behind a latch - so
            a permanent 68px of fixed furniture there was a control for
            something that never plays, sitting on top of the stage and lying
            about the height available to it. The census measured it at 11%
            of a 624px screen.
            OPT-OUT BY CONFIG, not by route sniffing: an artist declaring
            `playerBar:false` gets none. The music wings declare nothing and
            keep theirs exactly as it was; the per-setting redesign is a
            future pass and is not attempted here. */}
        {/* [M-e 2026-08-02] AND THE FIXED BAR STANDS DOWN WHERE THE BANNER
            TOOK OVER. Rendering both would be two transports disagreeing about
            the same player, and would put the thing that was moved back on top
            of the thing it was moved out of. `playerBar:false` still works on
            its own for a wing with no transport at all (robots). */}
        {artist.playerBar !== false && !bannerTransport && (
        <PlayerBar
          video={pbVideo} track={pbTrack} album={pbAlbum}
          live={pbLive} onIdlePlay={onIdlePlay}
          onSkipBack={handleSkipBack} onSkipForward={handleSkipForward}
          canSkipBack={canSkipBack} canSkipForward={canSkipForward}
          onTogglePlay={isAudioSrc ? audio.togglePlay : yt.togglePlay}
          onToggleMute={isAudioSrc ? audio.toggleMute : yt.toggleMute}
          onSetVolume={isAudioSrc ? audio.setVolume : yt.setVolume}
          getState={isAudioSrc ? audio.getState : yt.getState}
        />)}

        {/* EXHIBIT FLOW — optional, only rendered if artist provides one.
            playingTrack carries the live player identity as stable ids
            (null when idle) so the preset host can snapshot it. */}
        {ExhibitFlow && (
          <ExhibitFlow
            activeAlbumId={album.id}
            playingTrack={playingTrackIds}
            onRestorePlayer={restorePlayerFromPreset}
            shuffle={shuffle} setShuffle={setShuffle}
            loop={loop} setLoop={setLoop}
          />
        )}
      </div>
    </>
  );
}
