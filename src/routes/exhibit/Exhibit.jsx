import { useState, useEffect, useRef, useCallback } from "react";
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
const SPLIT_MIN = 25; const SPLIT_MAX = 75;
function tidyDesc(title, v) {
  let d = (v && (v.label || typeLabel(v.type))) || "";
  if (title && d.indexOf(title) === 0) d = d.slice(title.length).replace(/^[\s\u2014\u2013-]+/, "");
  d = d.toUpperCase().replace("AUDIO RECORDING", "AUDIO").replace("OFFICIAL MUSIC VIDEO", "OFFICIAL VIDEO");
  return d;
}

const CF_MIN    = 160; const CF_MAX    = 440;

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
              !hasVids  ? "tl-novid"    : "",
              skipped   ? "tl-skipped"  : "",
            ].filter(Boolean).join(" ")}
            style={isActive ? { borderLeftColor: "#b8974a" } : {}}
            onClick={() => hasVids && !skipped && onSelect(ti)}
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

  const [split, setSplit] = usePersist(artist.splitKey, 50);
  const [cfH,   setCfH]   = usePersist(artist.cfKey,    300);

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
    if (!vis.length) return;
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
      <div className={`ex-root${visible?" visible":""}`}>

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
        <div className="ex-main ex-snap">
          <div className="ex-main-inner" ref={bodyRef}
            style={{ gridTemplateColumns: `${split}fr 10px ${100-split}fr` }}>

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
                  {!hasVideo && !thumbVid && (
                    <div className="vp-empty-state">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M7 5.5L22 14L7 22.5V5.5Z" fill="#2a2a2a"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* FACTS */}
              <FactScroller
                facts={FACTS}
                albumTag={album.tag}
                songSlug={activeTrack !== null ? album.tracks[activeTrack]?.song : null}
                eraSlugs={artist.eraAlias?.[album.id] ?? []}
                exhibit={artist.exhibitSlug}
                accent={album.accent}
              />
            </div>

          </div>
        </div>

        <PlayerBar
          video={pbVideo} track={pbTrack} album={pbAlbum}
          live={pbLive} onIdlePlay={onIdlePlay}
          onSkipBack={handleSkipBack} onSkipForward={handleSkipForward}
          canSkipBack={canSkipBack} canSkipForward={canSkipForward}
          onTogglePlay={isAudioSrc ? audio.togglePlay : yt.togglePlay}
          onToggleMute={isAudioSrc ? audio.toggleMute : yt.toggleMute}
          onSetVolume={isAudioSrc ? audio.setVolume : yt.setVolume}
          getState={isAudioSrc ? audio.getState : yt.getState}
        />

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
