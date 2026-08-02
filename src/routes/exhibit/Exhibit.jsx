import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeFactCycler, splitFact } from "../../lib/fact-select.js";
import "./Exhibit.css";

// ─── TYPE CONFIG ──────────────────────────────────────────────────────────────
const TAG_SLOTS = ["official", "live", "lyrics", "clip", "cover", "audio"];
const TYPE_META = {
  official: { label: "OFFICIAL", color: "#b8974a" },
  live:     { label: "LIVE",     color: "#4a8a6a" },
  clip:     { label: "CLIP",     color: "#a07840" },
  lyrics:   { label: "LYRICS",   color: "#7a6a9a" },
  cover:    { label: "COVER",    color: "#3a7a9a" },
  audio:    { label: "AUDIO",    color: "#8a6a3a" },
  hr_cover: { label: "COVER",    color: "#3a7a9a" },
  fan_cover:{ label: "COVER",    color: "#3a7a9a" },
};
function normalizeType(t) { return (t==="hr_cover"||t==="fan_cover") ? "cover" : t; }
function typeLabel(t) { return TYPE_META[t]?.label ?? t.toUpperCase(); }
function typeColor(t) { return TYPE_META[t]?.color ?? "#888"; }

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

function usePersist(key, def) {
  const [v, setV] = useState(() => { try { return parseFloat(localStorage.getItem(key)) || def; } catch { return def; } });
  const set = useCallback(val => { setV(val); try { localStorage.setItem(key, val); } catch { /* localStorage may be unavailable in private mode; ignore */ } }, [key]);
  return [v, set];
}

// ─── COVERFLOW ────────────────────────────────────────────────────────────────
function getSlot(off) {
  const a = Math.abs(off), s = off < 0 ? -1 : 1;
  if (a===0) return { x:0,       z:0,    ry:0,      sc:1,    op:1,    zi:10 };
  if (a===1) return { x:s*240,   z:-80,  ry:s*-45,  sc:.85,  op:.9,   zi:9  };
  if (a===2) return { x:s*450,   z:-150, ry:s*-58,  sc:.74,  op:.75,  zi:8  };
  return           { x:s*620,   z:-210, ry:s*-68,  sc:.62,  op:.55,  zi:7  };
}

function AlbumCover({ album }) {
  if (album.art) {
    return <img src={album.art} alt={album.title} loading="lazy" />;
  }
  const accent = album.accent || "#b8974a";
  return (
    <div className="cf-placeholder" style={{
      background: `linear-gradient(135deg, ${accent}33 0%, #0c0c0c 60%, #050505 100%)`,
      borderColor: `${accent}55`,
    }}>
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
      {spine.map((a,i) => {
        const off = i - active;
        if (Math.abs(off) > 3) return null;
        const sl = getSlot(off);
        const isActive = off === 0;
        return (
          <div key={a.id} className={`cf-album${isActive?" cf-active":""}`}
            style={{
              width: albumSize, height: albumSize,
              transform:`translateX(${sl.x*scale}px) translateZ(${sl.z*scale}px) rotateY(${sl.ry}deg) scale(${sl.sc})`,
              opacity:sl.op, zIndex:sl.zi,
              boxShadow:isActive?"0 24px 64px rgba(0,0,0,0.8),0 0 0 1px #b8974a44":"none",
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
  );
}

// ─── TRACKLIST ────────────────────────────────────────────────────────────────
function TrackList({ album, playingTrackIdx, activeTrack, selectedVis, onSelect, onTagClick }) {
  function getSelSet(ti) { return selectedVis[ti] ?? new Set([0]); }
  function isSkipped(ti) {
    if (!album.tracks[ti].videos.length) return false;
    const s = selectedVis[ti]; return s && s.size === 0;
  }

  return (
    <ol className="tl-tracks">
      {album.tracks.map((track, ti) => {
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
            ].filter(Boolean).join(" ")}
            style={isActive ? { borderLeftColor: "#b8974a" } : {}}
            onClick={() => selectable && !skipped && onSelect(ti)}
          >
            <span className="tl-num">
              {playing ? <NpBars color="#b8974a" /> : String(ti+1).padStart(2,"0")}
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
   split it into smaller blocks upstream; the stage refuses to pretend. */
function Stage({ blocks, deps, footer }) {
  const wrapRef = useRef(null);
  const measRef = useRef(null);
  const [pages, setPages] = useState([[0, blocks.length]]);
  const [pg, setPg] = useState(0);
  const [cols, setCols] = useState(1);

  /* one measure, run on layout and on any resize of the stage */
  useLayoutEffect(() => {
    const wrap = wrapRef.current, meas = measRef.current;
    if (!wrap || !meas) return;
    function plan() {
      const box = wrap.getBoundingClientRect();
      /* the measure rule: one comfortable column, and a second only when
         there is genuinely room for two of them side by side. */
      const n = box.width >= 760 ? 2 : 1;
      setCols(n);
      const avail = Math.max(80, box.height) * n;
      const kids = Array.from(meas.children);
      /* THE GAP IS PART OF THE HEIGHT. The page is a flex column with a gap,
         so N blocks occupy sum(heights) + (N-1)*gap - and the first version
         packed on heights alone, which under-counted by one gap per block and
         let the LAST page overrun by exactly that much (measured: 30px on a
         3-block page, 82px on a 7-block one). Counted properly now. */
      const gap = parseFloat(getComputedStyle(meas).rowGap || getComputedStyle(meas).gap || 0) || 0;
      const out = [];
      let start = 0, run = 0;
      kids.forEach((el, i) => {
        const h = el.getBoundingClientRect().height +
                  parseFloat(getComputedStyle(el).marginBottom || 0) +
                  (i > start ? gap : 0);
        if (h > avail && run === 0) {
          /* taller than the whole stage: its own page, and we say so */
          out.push([i, i + 1]);
          try {
            console.warn("[stage] block " + i + " is " + Math.round(h) +
              "px and the stage holds " + Math.round(avail) +
              "px - it gets a page of its own and will overrun. Split it upstream.");
          } catch (e) { /* console may be absent */ }
          start = i + 1; run = 0;
          return;
        }
        if (run + h > avail && i > start) { out.push([start, i]); start = i; run = h; }
        else { run += h; }
      });
      if (start < kids.length) out.push([start, kids.length]);
      setPages(out.length ? out : [[0, kids.length]]);
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
  const [from, to] = pages[cur] || [0, blocks.length];

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
      <div ref={wrapRef} className={"stg-page" + (cols > 1 ? " stg-2col" : "")}>
        {blocks.slice(from, to)}
      </div>
      {/* the measuring layer: same width, same columns, never seen, never
          reachable by pointer or by a screen reader. */}
      <div ref={measRef} className={"stg-measure" + (cols > 1 ? " stg-2col" : "")}
           aria-hidden="true">{blocks}</div>
      {many && (
        <nav className="stg-tp">
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
function StageChildren({ children, deps, footer }) {
  const blocks = [];
  React.Children.toArray(children).forEach((child, i) => {
    const split = child && child.props && child.props["data-stage-split"];
    if (split && child.props.children) {
      React.Children.toArray(child.props.children).forEach((row, j) => {
        blocks.push(React.cloneElement(child, { key: "s" + i + "-" + j }, row));
      });
    } else {
      blocks.push(child);
    }
  });
  return <Stage blocks={blocks} deps={deps} footer={footer} />;
}

export default function Exhibit({ artist }) {
  const SPINE = artist.spine;
  const FACTS = artist.facts;
  const ExhibitFlow = artist.exhibitFlow;

  const navigate = useNavigate();
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
  const [split, setSplit] = usePersist(artist.splitKey, artist.splitDefault ?? 50);
  const [cfH,   setCfH]   = usePersist(artist.cfKey,    300);
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

  const ytDivRef = useRef(null);
  const yt = useYTPlayer({
    containerRef: ytDivRef,
    onEnded: useCallback(() => advanceQueue(), []),
  });
  const audio = useAudioPlayer({
    onEnded: useCallback(() => advanceQueue(), []),
  });

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
      /* [M-b 2026-08-02] THE VIDEO YIELDS WHEN THE VISITOR WALKS AWAY.
         Selecting a face-bearing track registered the selection and left the
         player mounted - so a video that was playing stayed on screen, on
         top of the page the visitor had just asked for, still making noise.
         The viewer had two things in it and only one had been asked for.
         Navigating to a track that is NOT playback is an instruction to stop
         playing: the queue is dropped and the player unmounts. It is not a
         pause - there is nothing on screen left to resume from, and a hidden
         paused player is the same bug wearing a quieter coat. */
      /* AND THE PLAYER IS ACTUALLY STOPPED, not merely forgotten. Clearing
         the state hides the picture, but the YouTube iframe is a PERSISTENT
         HOST - it is mounted once and reused - so dropping the state left it
         alive and audible behind the page the visitor had just opened.
         Measured: after navigating away the face rendered correctly and the
         iframe was still there. Pausing both transports is what makes
         "walked away" mean "stopped". */
      try { yt.pause(); } catch { /* not mounted yet */ }
      try { audio.pause(); } catch { /* no audio transport */ }
      setPlayingAlbum(null); setPlayingTrack(null); setPlayingVideo(null);
      playQueueRef.current = [];
      setOpenEntry(null);         /* [M5] a new track opens on its index */
      setRecipeIdx(0);            /* [L2] and its selector at the top entry */
      return;
    }
    setAlbumActiveTrack(prev => ({ ...prev, [albumIdx]: ti }));
    startPlay(albumIdx, ti, vis[0]);
  }

  function handleTagClick(albumIdx, ti, vi) {
    const isActive = albumActiveTrack[albumIdx] === ti;
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
        if (isActive) startPlay(albumIdx, ti, vi);
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

  const thumbTrack = activeTrack !== null ? album.tracks[activeTrack] : album.tracks.find(t => t.videos.length > 0);
  const thumbVid   = thumbTrack?.videos?.[0];
  const hasVideo   = curVideo !== null;
  /* [E2] the selected track's face, if it declares one. Falls back to the
     album's FIRST track that has a face, so landing on the album (before any
     track is clicked) still shows something rather than a hole. */
  const activeFace = (activeTrack !== null ? album.tracks[activeTrack]?.face : null)
                     ?? album.tracks.find(t => t.face)?.face
                     ?? null;

  /* [G1 2026-07-31] ONE DOOR, TWO HANDLES. The frozen face IS the standard
     view, so clicking the picture and pressing ENTER must go to the same
     place with the same recipe — one function, not two copies that can
     drift. Held recipes open nothing from either handle. */
  function enterRecipe() {
    const p = activeFace?.presets?.[recipeIdx];
    if (activeFace?.presets && (!p || p.state === "held")) return;
    window.dispatchEvent(new CustomEvent(
      activeFace?.action ? activeFace.action.event : "wb-robots-open-twin",
      { detail: { album: album.id, preset: p ? p.id : null, day: p ? p.day : undefined } }
    ));
  }

  // ── Drag handles ──────────────────────────────────────────────────────────
  function makeSplitDrag(e, containerRef) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    function onMove(ev) {
      const rect = containerRef.current.getBoundingClientRect();
      let pct = Math.round(((ev.clientX - rect.left) / rect.width) * 100);
      if (Math.abs(pct - 50) < 3) pct = 50;
      setSplit(Math.max(SPLIT_MIN, Math.min(SPLIT_MAX, pct)));
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", onMove), { once: true });
  }

  function makeCfDrag(e) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const startY = e.clientY, startH = cfH;
    function onMove(ev) {
      let h = startH + (ev.clientY - startY);
      if (Math.abs(h - 300) < 12) h = 300;
      setCfH(Math.max(CF_MIN, Math.min(CF_MAX, Math.round(h))));
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
      <div className={`ex-root${visible?" visible":""}`} data-exhibit={artist.exhibitSlug || artist.id} data-stage={artist.stage ? "1" : undefined}>

        {/* NAV */}
        <div className="ex-nav">
          <button className="ex-nav-logo" onClick={() => navigate(`/shop?from=${artist.shopExitParam}`)}>Weird.Baby</button>
          <div className="ex-nav-sub" onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}>{artist.name}</div>
          {/* [one-shop ruling, walk-six] config-driven: the entry stays in the
              template (present in the DOM) but hides for exhibits that must
              not advertise a shop — /robots today. */}
          <button className="ex-nav-return" style={artist.shopEntryHidden ? { display: "none" } : undefined} onClick={() => navigate(`/shop?from=${artist.shopExitParam}`)}>Gift Shop</button>
        </div>

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
        <div className="ex-album-banner">
          <div className="ex-album-banner-title">{album.title}</div>
          <div className="ex-album-banner-aux" />
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
            </div>

            {/* VERTICAL DRAG HANDLE */}
            <div className="vr-dh" onPointerDown={e => makeSplitDrag(e, bodyRef)}>
              <div className="vr-dh-line" />
            </div>

            {/* RIGHT — permanent video + facts */}
            <div className="ex-right">
              {/* VIDEO AREA */}
              <div className="vp-area">
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
                        <div className="vp-ao-ph" style={{
                          background: `linear-gradient(135deg, ${(album.accent||'#b8974a')}33 0%, #0c0c0c 60%, #050505 100%)`,
                          borderColor: `${(album.accent||'#b8974a')}55`,
                        }}>
                          <div className="vp-ao-ph-title">{album.title}</div>
                          <div className="vp-ao-ph-year">{album.year}</div>
                        </div>
                      )}
                      <div className="vp-ao-label">
                        <NpBars color="#b8974a" />
                        <span>audio playing</span>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail overlay — visible when no video is playing */}
                  {!hasVideo && thumbVid && (
                    <div className="vp-thumb"
                      onClick={() => thumbTrack && handleTrackSelect(activeDisplay, album.tracks.indexOf(thumbTrack))}>
                      {album.art ? (
                        <img className="vp-thumb-album" src={album.art} alt="" />
                      ) : thumbVid.ytId ? (
                        <img src={`https://img.youtube.com/vi/${thumbVid.ytId}/hqdefault.jpg`} alt="" />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: `linear-gradient(135deg, ${(album.accent||'#b8974a')}33 0%, #0c0c0c 60%, #050505 100%)`,
                        }} />
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
                  {!hasVideo && !thumbVid && activeFace && (
                    <div className={`vp-face vp-face-${activeFace.kind || "text"}`}>
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
                        {activeFace.panel ? (
                          <InstrumentPanel decl={activeFace.panel} />
                        ) : (
                        /* [STAGE 2026-08-02] THE FACE IS STAGED, BY CONFIG.
                           `artist.stage` opts a wing in. /hr and /wb do not
                           declare it - and could not use it anyway, since
                           they declare no faces at all - so the standard
                           lands on one route and cannot reach the music
                           wings until someone asks it to. */
                        <StageChildren
                          deps={String(activeTrack) + ":" + String(openEntry)}
                          footer={activeFace.footer ? null : null}>
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
                        <div className="vp-face-head">
                          <div className="vp-face-headtext">
                            {activeFace.title && <div className="vp-face-title">{activeFace.title}</div>}
                            {activeFace.subtitle && (
                              <div className="vp-face-sub">{activeFace.subtitle}</div>
                            )}
                            {activeFace.blurb && <p className="vp-face-blurb">{activeFace.blurb}</p>}
                          </div>
                          {/* [G1 2026-07-31] THE LIVE FACE IS RETIRED.
                              Mike ruled the face frozen, so the iframe, its
                              hit layer and the one-machine gate all went with
                              it - dead machinery is dead whether or not it
                              once worked. It is ledgered A+++++++ and lives in
                              git at d43b9db, one revert away, which is a
                              better home than an unused branch in this file. */}
                          {activeFace.still && (
                            <figure className="vp-face-plate">
                              {activeFace.presets ? (
                                /* [G1] the frozen portal is still the door. The
                                   live face was clickable through a transparent
                                   hit layer, because an iframe swallows clicks;
                                   a still does not, so the picture can simply BE
                                   the button and the hit layer retires with the
                                   iframe. Same destination as ENTER. */
                                <button className="vp-face-door" onClick={enterRecipe}
                                        aria-label="Open the portal">
                                  <img className="vp-face-still" src={activeFace.still} alt="" />
                                </button>
                              ) : (
                                <img className="vp-face-still" src={activeFace.still} alt="" />
                              )}
                              {activeFace.stillCaption && (
                                <figcaption className="vp-face-platecap">{activeFace.stillCaption}</figcaption>
                              )}
                            </figure>
                          )}
                        </div>
                        {Array.isArray(activeFace.lines) && activeFace.lines.length > 0 && (
                          <ul className="vp-face-lines">
                            {activeFace.lines.map((l, i) => <li key={i}>{l}</li>)}
                          </ul>
                        )}
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
                        {Array.isArray(activeFace.entries) && activeFace.entries.length > 0 && (() => {
                          const isLog = activeFace.entriesMode === "log";
                          /* reversal happens HERE, not in the data: the entries
                             stay in the order they happened. */
                          const list = isLog ? [...activeFace.entries].reverse() : activeFace.entries;
                          if (!isLog) return (
                            <ol className="vp-face-entries" data-stage-split="row">
                              {list.map((en, i) => (
                                <li key={i} className="vp-fe">
                                  {en.stamp && <span className="vp-fe-stamp">{en.stamp}</span>}
                                  <span className="vp-fe-body">
                                    <span className="vp-fe-title">{en.title}</span>
                                    {en.line && <span className="vp-fe-line">{en.line}</span>}
                                    {en.note && <span className="vp-fe-note">{en.note}</span>}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          );
                          const open = openEntry !== null && list[openEntry] ? openEntry : null;
                          if (open === null) return (
                            <ol className="vp-face-entries vp-rec-index" data-stage-split="row">
                              {list.map((en, i) => (
                                <li key={i} className="vp-fe vp-rec-row">
                                  <button className="vp-rec-open" onClick={() => setOpenEntry(i)}>
                                    {en.stamp && <span className="vp-fe-stamp">{en.stamp}</span>}
                                    <span className="vp-fe-body">
                                      <span className="vp-fe-title">{en.title}</span>
                                      {en.line && <span className="vp-fe-line vp-rec-peek">{en.line}</span>}
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ol>
                          );
                          const en = list[open];
                          return (
                            <div className="vp-rec">
                              <button className="vp-rec-head" onClick={() => setOpenEntry(null)}
                                      title="close this record">
                                {en.stamp && <span className="vp-fe-stamp">{en.stamp}</span>}
                                <span className="vp-rec-title">{en.title}</span>
                              </button>
                              <div className="vp-rec-body">
                                {en.line && <p className="vp-rec-line">{en.line}</p>}
                                {en.note && <p className="vp-fe-note">{en.note}</p>}
                              </div>
                              {/* THE PAGE ENDS DEFINITIVELY. A reader should never
                                  have to wonder whether there is more below the
                                  fold; the mark says the record is finished, the
                                  way a set proof closes with a tombstone. */}
                              <div className="vp-rec-end" aria-hidden="true"><i /></div>
                              <nav className="vp-rec-nav">
                                <button className="vp-rec-step" disabled={open === 0}
                                        onClick={() => setOpenEntry(open - 1)}>‹ NEWER</button>
                                <span className="vp-rec-count">{open + 1} of {list.length}</span>
                                <button className="vp-rec-step" disabled={open === list.length - 1}
                                        onClick={() => setOpenEntry(open + 1)}>OLDER ›</button>
                              </nav>
                            </div>
                          );
                        })()}
                        {/* [TRAIL 2026-08-02] MARKERS, NOT A LINK DUMP.
                            Each row is a destination plus one clause of
                            SCENT - why following it is worth the click. The
                            trail is data on the face like everything else, so
                            a wing that declares none renders none. */}
                        {Array.isArray(activeFace.trail) && activeFace.trail.length > 0 && (
                          <ul className="vp-trail">
                            {activeFace.trail.map((t, i) => (
                              <li key={i}>
                                <button className="vp-trail-go"
                                        onClick={() => window.dispatchEvent(new CustomEvent(
                                          "wb-wal-open-link", { detail: { href: t.url } }))}>
                                  <span className="vp-trail-label">{t.label}</span>
                                  {t.scent && <span className="vp-trail-scent">{t.scent}</span>}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {activeFace.footer && (
                          <div className="vp-face-footer">{activeFace.footer}</div>
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
                        {Array.isArray(activeFace.presets) && activeFace.presets.length > 0 && (
                          <div className="vp-recipes">
                            <label className="vp-recipes-head" htmlFor="vp-recipe-sel">
                              {activeFace.presetsLabel || "ARRIVE AS"}
                            </label>
                            <div className="vp-recipe-row">
                              <select
                                id="vp-recipe-sel"
                                className="vp-recipe-sel"
                                value={recipeIdx}
                                onChange={e => setRecipeIdx(Number(e.target.value))}
                              >
                                {activeFace.presets.map((p, i) => (
                                  <option key={i} value={i} disabled={p.state === "held"}>
                                    {p.label}{p.state === "held" && p.why ? `  — ${p.why}` : ""}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="vp-recipe-go"
                                disabled={activeFace.presets[recipeIdx]?.state === "held"}
                                onClick={enterRecipe}
                              >ENTER</button>
                            </div>
                            {activeFace.presets[recipeIdx]?.line && (
                              <div className="vp-recipe-line">{activeFace.presets[recipeIdx].line}</div>
                            )}
                          </div>
                        )}
                        {/* [L3 2026-07-31] THE SEE-ALSO RENDERER WENT WITH ITS DATA.
                            F2 removed the Portal's cross-references; no face
                            declares `links` now, so the code that drew them
                            was carrying nothing. "Nothing extra unless it
                            carries more than its own weight" applies to the
                            renderer as much as to the page. */}
                        {activeFace.papa && (
                          <div className="vp-face-papa">{activeFace.papa}</div>
                        )}
                        {/* [S5 2026-07-30] THE STANDALONE LAUNCH LINK IS GONE.
                            It usurped the rack: a door beside four doors, all
                            leading to the same room in different states. The
                            PRESETS ARE THE ENTRIES. A face may still declare
                            `action` — the preset buttons read its event name —
                            but it no longer renders a button of its own. */}
                        {activeFace.action && !activeFace.presets && (
                          <button
                            className="vp-face-action"
                            onClick={() => window.dispatchEvent(
                              new CustomEvent(activeFace.action.event, { detail: { album: album.id } })
                            )}
                          >{activeFace.action.label}</button>
                        )}
                        </StageChildren>)}
                      </div>
                    </div>
                  )}
                  {!hasVideo && !thumbVid && !activeFace && album.viewerPoster && (
                    <div className="vp-poster">
                      <img src={album.viewerPoster} alt="" />
                      {album.viewerPosterCaption && (
                        <div className="vp-poster-cap">{album.viewerPosterCaption}</div>
                      )}
                    </div>
                  )}
                  {!hasVideo && !thumbVid && !activeFace && !album.viewerPoster && (
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
              {Array.isArray(FACTS) && FACTS.length > 0 && (
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
        {artist.playerBar !== false && (
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
