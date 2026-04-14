import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FACTS } from "./cb_facts.js";
import { SPINE } from "./cb_discography.js";

// ─── TYPE CONFIG ──────────────────────────────────────────────────────────────
const TAG_SLOTS = ["official", "live", "lyrics", "clip", "cover"];
const TYPE_META = {
  official: { label: "OFFICIAL", color: "#b8974a" },
  live:     { label: "LIVE",     color: "#4a8a6a" },
  clip:     { label: "CLIP",     color: "#a07840" },
  lyrics:   { label: "LYRICS",   color: "#7a6a9a" },
  cover:    { label: "COVER",    color: "#3a7a9a" },
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

// ─── FACT SELECTOR ────────────────────────────────────────────────────────────
function buildFactQueue(albumId, trackTitle, seenIds) {
  const score = f => {
    let b = f.weight ?? 5;
    if (f.type === "intro") b += 20;
    if (f.type === "track" && f.trackId === trackTitle) b += 15;
    if (f.type === "album" && f.albumId === albumId) b += 5;
    if (seenIds.has(f.id)) b = 1;
    return b + Math.random() * 0.9;
  };
  const ok = FACTS.filter(f => {
    if (f.albumId && f.albumId !== albumId) return false;
    if (f.trackId && f.trackId !== trackTitle) return false;
    return true;
  });
  const intros = ok.filter(f => f.type === "intro").sort((a,b) => score(b)-score(a)).slice(0,2);
  const rest   = ok.filter(f => f.type !== "intro").sort((a,b) => score(b)-score(a));
  return [...intros, ...rest];
}

// ─── FACT SCROLLER ────────────────────────────────────────────────────────────
function FactScroller({ albumId, trackTitle, accent }) {
  const [current, setCurrent]     = useState(null);
  const [direction, setDirection] = useState("up");
  const [phase, setPhase]         = useState("idle");
  const seenRef    = useRef(new Set());
  const historyRef = useRef([]);
  const posRef     = useRef(-1);
  const queueRef   = useRef([]);
  const timerRef   = useRef(null);
  const albumRef   = useRef(albumId);
  const trackRef   = useRef(trackTitle);

  useEffect(() => {
    albumRef.current = albumId;
    trackRef.current = trackTitle;
    queueRef.current = buildFactQueue(albumId, trackTitle, seenRef.current);
    historyRef.current = [];
    posRef.current = -1;
    clearTimeout(timerRef.current);
    schedule(600, "up");
    return () => clearTimeout(timerRef.current);
  }, [albumId, trackTitle]);

  function show(fact, dir) {
    setDirection(dir);
    setPhase("entering");
    setCurrent(fact);
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("visible")));
  }

  function schedule(delay = 7500) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!queueRef.current.length)
        queueRef.current = buildFactQueue(albumRef.current, trackRef.current, seenRef.current);
      const next = queueRef.current.shift();
      if (!next) return;
      seenRef.current.add(next.id);
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

  return (
    <div className="fs-wrap">
      <div className="fs-viewport">
        {current && (
          <div className={`fs-block fs-${phase} fs-dir-${direction}`}>
            <div className="fs-line">{current.lines[0]}</div>
            <div className="fs-line">{current.lines[1]}</div>
          </div>
        )}
      </div>
      <div className="fs-footer">
        {accent && <div className="fs-rule" style={{ background: accent }} />}
        <div className="fs-nav">
          <button className={`fs-btn${canBack ? "" : " fs-btn-dis"}`} onClick={navBack}>‹</button>
          <button className={`fs-btn${canForward ? "" : " fs-btn-dis"}`} onClick={navForward}>›</button>
        </div>
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

  function initPlayer(ytId) {
    if (!containerRef.current || playerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      width: "100%", height: "100%",
      videoId: ytId,
      playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, playsinline: 1 },
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

  return { loadVideo, togglePlay, toggleMute, setVolume, getState };
}

// ─── SPLIT PERSISTENCE ────────────────────────────────────────────────────────
const SPLIT_KEY = "wb-cb-split";
const SPLIT_MIN = 25; const SPLIT_MAX = 75;
const CF_KEY    = "wb-cb-cfh";
const CF_MIN    = 160; const CF_MAX    = 440;

function usePersist(key, def) {
  const [v, setV] = useState(() => { try { return parseFloat(localStorage.getItem(key)) || def; } catch { return def; } });
  const set = useCallback(val => { setV(val); try { localStorage.setItem(key, val); } catch {} }, [key]);
  return [v, set];
}

// ─── COVERFLOW ────────────────────────────────────────────────────────────────
function getSlot(off) {
  const a = Math.abs(off), s = off < 0 ? -1 : 1;
  if (a===0) return { x:0,       z:0,    ry:0,      sc:1,    op:1,    zi:10 };
  if (a===1) return { x:s*210,   z:-80,  ry:s*-45,  sc:.85,  op:.85,  zi:9  };
  if (a===2) return { x:s*360,   z:-160, ry:s*-65,  sc:.7,   op:.6,   zi:8  };
  return           { x:s*480,   z:-220, ry:s*-75,  sc:.55,  op:.35,  zi:7  };
}

function AlbumCover({ album }) {
  if (album.art) {
    return <img src={album.art} alt={album.title} loading="lazy" />;
  }
  // Fallback — no Bandcamp art fetched yet. Render a titled placeholder using accent.
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

function Coverflow({ active, cfH, onSelect, onSelectClick }) {
  const [did, setDid] = useState(false);
  const drag = useRef(null);
  const ts   = useRef(null);

  function onPD(e) { drag.current = e.clientX; setDid(false); }
  function onPU(e) {
    if (!drag.current) return;
    const d = e.clientX - drag.current;
    if (Math.abs(d) > 40) { d > 0 ? onSelect(Math.max(active-1,0)) : onSelect(Math.min(active+1,SPINE.length-1)); setDid(true); }
    drag.current = null;
  }
  function onTS(e) { ts.current = e.touches[0].clientX; setDid(false); }
  function onTE(e) {
    if (ts.current === null) return;
    const d = e.changedTouches[0].clientX - ts.current;
    if (Math.abs(d) > 40) { d > 0 ? onSelect(Math.max(active-1,0)) : onSelect(Math.min(active+1,SPINE.length-1)); setDid(true); }
    ts.current = null;
  }

  return (
    <div className="cf-wrap" style={{ height: cfH }}
      onPointerDown={onPD} onPointerUp={onPU} onTouchStart={onTS} onTouchEnd={onTE}>
      <button className={`cf-arrow cf-l${active===0?" cf-dis":""}`} onClick={()=>onSelect(Math.max(0,active-1))}>{"<"}</button>
      <button className={`cf-arrow cf-r${active===SPINE.length-1?" cf-dis":""}`} onClick={()=>onSelect(Math.min(SPINE.length-1,active+1))}>{">"}</button>
      {SPINE.map((a,i) => {
        const off = i - active;
        if (Math.abs(off) > 3) return null;
        const sl = getSlot(off);
        const isActive = off === 0;
        return (
          <div key={a.id} className={`cf-album${isActive?" cf-active":""}`}
            style={{
              transform:`translateX(${sl.x}px) translateZ(${sl.z}px) rotateY(${sl.ry}deg) scale(${sl.sc})`,
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
      <li className="tl-album-label">
        <div className="tl-album-title">{album.title}</div>
      </li>
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
            <span className="tl-title">{track.title}</span>
            {skipped && <span className="tl-skip-mark">skip</span>}
            {hasVids && (
              <div className="tl-tags">
                {TAG_SLOTS.map(slot => {
                  const vi = typeToVi[slot];
                  if (vi === undefined) return <span key={slot} className="tl-tag-ghost" />;
                  const v   = track.videos[vi];
                  const sel = selSet.has(vi);
                  return (
                    <button key={slot}
                      className={`tl-tag${sel?" tl-tag-sel":" tl-tag-dim"}`}
                      style={sel ? { borderColor: typeColor(v.type), color: typeColor(v.type) } : {}}
                      onClick={e => { e.stopPropagation(); onTagClick(ti, vi); }}
                    >{typeLabel(v.type)}</button>
                  );
                })}
              </div>
            )}
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
function PlayerBar({ video, track, album, onSkipBack, onSkipForward, canSkipBack, canSkipForward, onTogglePlay, onToggleMute, onSetVolume, getState }) {
  const [, forceRender] = useState(0);
  useEffect(() => {
    if (!video) return;
    const id = setInterval(() => forceRender(n => n + 1), 500);
    return () => clearInterval(id);
  }, [video]);

  if (!video) return null;
  const st = getState?.() || { playing: false, muted: false, volume: 100 };

  return (
    <div className="pb">
      {album?.art
        ? <img className="pb-art" src={album.art} alt="" />
        : <div className="pb-art pb-art-ph" style={{ background: album?.accent || "#1a1a1a" }} />}
      <div className="pb-info">
        <div className="pb-track">{track?.title}</div>
        <div className="pb-sub" style={{ color: typeColor(video.type) }}>{typeLabel(video.type)}</div>
      </div>
      <div className="pb-controls">
        <button className={`pb-skip${canSkipBack?"":" pb-skip-dis"}`} onClick={onSkipBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="2" height="10" rx="1" fill="currentColor"/>
            <path d="M12 2L5 7L12 12V2Z" fill="currentColor"/>
          </svg>
        </button>

        <button className="pb-ctrl" onClick={onTogglePlay}>
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
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function CbSpine() {
  const navigate = useNavigate();
  const [visible, setVisible]           = useState(false);
  // Default to the most recent full album (After the Revolution = index 9)
  const defaultActive = Math.min(9, SPINE.length - 1);
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

  const [split, setSplit] = usePersist(SPLIT_KEY, 50);
  const [cfH,   setCfH]   = usePersist(CF_KEY,    300);

  const ytDivRef = useRef(null);
  const yt = useYTPlayer({
    containerRef: ytDivRef,
    onEnded: useCallback(() => advanceQueue(), []),
  });

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/visits", { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ page:"/cb", referrer:document.referrer }) }).catch(()=>{});
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key==="ArrowLeft")  { e.preventDefault(); selectAlbum(Math.max(0,active-1),false); }
      if (e.key==="ArrowRight") { e.preventDefault(); selectAlbum(Math.min(SPINE.length-1,active+1),false); }
      if (e.key==="Enter")      { e.preventDefault(); selectAlbum(active,true); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  function selectAlbum(i, clicked) {
    setActive(i);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setActiveDisplay(i), clicked ? 0 : 600);
  }

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
      const next     = new Set(current);
      if (next.has(vi)) { next.delete(vi); }
      else              { next.add(vi); if (isActive) startPlay(albumIdx, ti, vi); }
      return { ...prev, [albumIdx]: { ...albumMap, [ti]: next } };
    });
  }

  function startPlay(albumIdx, ti, vi) {
    const album  = SPINE[albumIdx];
    const selVis = albumSelectedVis[albumIdx] ?? {};
    const queue  = buildPlayQueue(album, ti, selVis);
    playQueueRef.current  = queue.slice(1);
    queueAlbumRef.current = albumIdx;
    setPlayingAlbum(albumIdx);
    setPlayingTrack(ti);
    setPlayingVideo(vi);
  }

  useEffect(() => {
    if (playingAlbum===null || playingTrack===null || playingVideo===null) return;
    const v = SPINE[playingAlbum].tracks[playingTrack].videos[playingVideo];
    if (v?.ytId) yt.loadVideo(v.ytId);
  }, [playingAlbum, playingTrack, playingVideo]);

  function advanceQueue() {
    const queue = playQueueRef.current;
    if (!queue.length) { setPlayingAlbum(null); setPlayingTrack(null); setPlayingVideo(null); return; }
    const next = queue[0];
    const [firstVi, ...restVis] = next.vis;
    playQueueRef.current = restVis.length
      ? [{ ti:next.ti, vis:restVis }, ...queue.slice(1)]
      : queue.slice(1);
    const ai = queueAlbumRef.current;
    setPlayingAlbum(ai); setPlayingTrack(next.ti); setPlayingVideo(firstVi);
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
      const vi = playingVideo;
      setPlayingVideo(null);
      setTimeout(() => setPlayingVideo(vi), 50);
      return;
    }

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
      playQueueRef.current = queue.slice(1);
      queueAlbumRef.current = ai;
      setPlayingAlbum(ai); setPlayingTrack(ti); setPlayingVideo(vis[0]);
      setAlbumActiveTrack(prev => ({ ...prev, [ai]: ti }));
      return;
    }
  }

  const album       = SPINE[activeDisplay];
  const activeTrack = albumActiveTrack[activeDisplay] ?? null;
  const selVis      = albumSelectedVis[activeDisplay] ?? {};

  const playingThisAlbum = playingAlbum === activeDisplay;
  const curVideo = playingAlbum !== null && playingTrack !== null && playingVideo !== null
    ? SPINE[playingAlbum].tracks[playingTrack].videos[playingVideo]
    : null;
  const curTrack = curVideo && playingTrack !== null ? SPINE[playingAlbum ?? 0].tracks[playingTrack] : null;
  const curAlbum = playingAlbum !== null ? SPINE[playingAlbum] : null;

  const thumbTrack = activeTrack !== null ? album.tracks[activeTrack] : album.tracks.find(t => t.videos.length > 0);
  const thumbVid   = thumbTrack?.videos?.[0];
  const hasVideo   = curVideo !== null;

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
  const canSkipForward = playQueueRef.current.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;800&family=Courier+Prime:wght@400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#080808;color:#f0ece4;min-height:100vh;overflow-x:clip;scroll-snap-type:y mandatory;scroll-behavior:smooth}

        .hr-root{opacity:0;transition:opacity .8s ease;display:flex;flex-direction:column;min-height:100vh;padding:0 8px 64px}
        .hr-snap{scroll-snap-align:center}
        .hr-root.visible{opacity:1}

        .hr-nav{display:flex;align-items:center;justify-content:space-between;padding:20px 32px 0;flex-shrink:0;scroll-snap-align:start}
        .hr-nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:#b8974a;background:none;border:none;cursor:pointer;transition:opacity .2s}
        .hr-nav-logo:hover{opacity:.7}
        .hr-nav-sub{font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:.12em;text-transform:uppercase;color:#d4c49a}
        .hr-nav-return{font-family:'Syne',sans-serif;font-weight:800;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:#b8974a;background:none;border:none;cursor:pointer;transition:opacity .2s}
        .hr-nav-return:hover{opacity:.7}

        .cf-wrap{display:flex;align-items:center;justify-content:center;position:relative;perspective:900px;perspective-origin:50% 50%;user-select:none;cursor:grab;overflow:hidden;touch-action:pan-y;flex-shrink:0}
        .cf-wrap:active{cursor:grabbing}
        .cf-album{position:absolute;width:240px;height:240px;border-radius:2px;overflow:hidden;cursor:pointer;transition:transform .5s cubic-bezier(.25,.46,.45,.94),opacity .5s,box-shadow .5s;transform-style:preserve-3d}
        .cf-album img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
        .cf-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;border:1px solid;gap:12px}
        .cf-ph-title{font-family:'DM Serif Display',Georgia,serif;font-size:1rem;line-height:1.25;color:#e8dfcd;letter-spacing:.01em}
        .cf-ph-year{font-family:'Courier Prime',monospace;font-size:.65rem;letter-spacing:.18em;color:#a89770;opacity:.7}
        .cf-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 50%);opacity:0;transition:opacity .3s}
        .cf-active .cf-overlay{opacity:1}
        .cf-year{position:absolute;bottom:10px;left:12px;font-family:'Courier Prime',monospace;font-size:.65rem;letter-spacing:.12em;color:rgba(255,255,255,.8);opacity:0;transition:opacity .3s}
        .cf-active .cf-year{opacity:1}
        .cf-arrow{position:absolute;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#555;font-size:2rem;cursor:pointer;padding:12px;transition:color .2s,opacity .2s;z-index:20;line-height:1;font-family:monospace}
        .cf-arrow:hover{color:#b8974a}
        .cf-l{left:8px}.cf-r{right:8px}
        .cf-dis{opacity:.15;pointer-events:none}

        .cf-dh{height:14px;cursor:row-resize;display:flex;align-items:center;justify-content:center;gap:6px;flex-shrink:0;padding:0 32px}
        .cf-dh-line{flex:1;height:1px;background:#1a1a1a;border-radius:1px;transition:background .2s}
        .cf-dh-dot{width:4px;height:4px;border-radius:50%;background:#252525;flex-shrink:0;transition:background .2s}
        .cf-dh:hover .cf-dh-line,.cf-dh:hover .cf-dh-dot{background:#b8974a55}

        .hr-main{display:grid;flex:1;border-top:1px solid #181818;position:relative;overflow:hidden}
        .hr-main-inner{display:grid;height:100%}

        .hr-left{overflow-y:auto;overflow-x:hidden;border-right:1px solid #1a1a1a;scrollbar-width:thin;scrollbar-color:#1e1e1e transparent}
        .hr-left::-webkit-scrollbar{width:3px}
        .hr-left::-webkit-scrollbar-track{background:transparent}
        .hr-left::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:2px}

        .vr-dh{width:10px;cursor:col-resize;display:flex;align-items:stretch;justify-content:center;position:relative;z-index:10}
        .vr-dh-line{width:1px;background:#1a1a1a;transition:background .2s;margin:auto}
        .vr-dh:hover .vr-dh-line{background:#b8974a55}

        .hr-right{display:flex;flex-direction:column;background:#060606;overflow:hidden}

        .tl-tracks{list-style:none;padding:0 0 24px}
        .tl-album-label{padding:20px 20px 14px;border-bottom:1px solid #111;margin-bottom:4px}
        .tl-album-title{font-family:'DM Serif Display',Georgia,serif;font-size:clamp(.95rem,1.6vw,1.2rem);color:#f0ece4;line-height:1.2}
        .tl-track{display:flex;align-items:center;padding:9px 20px;border-left:2px solid transparent;cursor:pointer;transition:background .15s,border-left-color .2s;user-select:none}
        .tl-track:hover{background:#0d0d0d}
        .tl-active{background:#0d0d0d}
        .tl-novid{cursor:default;opacity:.32}
        .tl-novid:hover{background:transparent}
        .tl-skipped .tl-title{text-decoration:line-through;text-decoration-color:#333}
        .tl-skipped{opacity:.38}
        .tl-skip-mark{font-family:'Courier Prime',monospace;font-size:.5rem;color:#333;margin-left:6px;flex-shrink:0;letter-spacing:.08em}
        .tl-num{font-family:'Courier Prime',monospace;font-size:.65rem;color:#555;min-width:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .tl-title{font-family:'Courier Prime',monospace;font-size:.88rem;color:#d4c49a;flex:1;padding:0 10px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

        .tl-tags{display:grid;grid-template-columns:repeat(5,48px);gap:3px;flex-shrink:0}
        .tl-tag{font-family:'Syne',sans-serif;font-weight:600;font-size:.42rem;letter-spacing:.1em;padding:2px 0;background:transparent;border:1px solid transparent;cursor:pointer;border-radius:1px;transition:color .15s,border-color .15s;text-align:center;width:100%}
        .tl-tag-sel{opacity:1}
        .tl-tag-dim{color:#4a4a4a !important;border-color:transparent !important}
        .tl-tag:hover{color:#999 !important;border-color:#444 !important}
        .tl-tag-ghost{display:block;width:48px;height:18px;pointer-events:none}

        .vp-area{position:relative;width:100%;background:#0a0a0a;border:1px solid #1e1e1e;flex-shrink:0}
        .vp-area::before{content:"";display:block;padding-top:56.25%}
        .vp-inner{position:absolute;inset:0}
        .yt-player{width:100%;height:100%;display:block}
        .vp-thumb{position:absolute;inset:0;cursor:pointer;z-index:1}
        .vp-thumb img{width:100%;height:100%;object-fit:cover;display:block;opacity:.6;transition:opacity .2s}
        .vp-thumb:hover img{opacity:.8}
        .vp-thumb-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
        .vp-empty-state{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#2a2a2a}

        .vp-audio-only{position:absolute;inset:0;z-index:3;background:#080808;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
        .vp-ao-art{width:min(88%,340px);height:min(88%,340px);object-fit:cover;display:block;border-radius:2px;box-shadow:0 12px 48px rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.08)}
        .vp-ao-ph{width:min(88%,340px);height:min(88%,340px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;gap:14px;border-radius:2px;box-shadow:0 12px 48px rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.08)}
        .vp-ao-ph-title{font-family:'DM Serif Display',Georgia,serif;font-size:1.3rem;line-height:1.25;color:#e8dfcd}
        .vp-ao-ph-year{font-family:'Courier Prime',monospace;font-size:.75rem;letter-spacing:.2em;color:#a89770;opacity:.7}
        .vp-ao-label{display:flex;align-items:center;gap:7px;font-family:'Courier Prime',monospace;font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:#444;white-space:nowrap}

        .fs-wrap{flex:1;display:flex;flex-direction:column;padding:18px 20px 14px;border-top:1px solid #111;position:relative;overflow:hidden}
        .fs-viewport{flex:1;overflow:hidden;min-height:72px}
        .fs-block{text-align:center;padding:0 8px}
        @keyframes fs-in-up{0%{opacity:0;transform:translateY(18px)}60%{opacity:1;transform:translateY(-4px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes fs-in-down{0%{opacity:0;transform:translateY(-18px)}60%{opacity:1;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}
        .fs-block.fs-entering.fs-dir-up{opacity:0;transform:translateY(18px)}
        .fs-block.fs-visible.fs-dir-up{animation:fs-in-up .55s cubic-bezier(.34,1.56,.64,1) both}
        .fs-block.fs-entering.fs-dir-down{opacity:0;transform:translateY(-18px)}
        .fs-block.fs-visible.fs-dir-down{animation:fs-in-down .55s cubic-bezier(.34,1.56,.64,1) both}
        .fs-block.fs-idle{opacity:0}
        .fs-line{font-family:'DM Serif Display',Georgia,serif;font-style:italic;font-size:1.18rem;color:#c4bcb4;line-height:1.6}
        .fs-footer{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
        .fs-rule{height:1px;width:28px;opacity:.4;border-radius:1px;flex-shrink:0}
        .fs-nav{display:flex;gap:0}
        .fs-btn{background:#0e0e0e;border:1px solid #252525;color:#505050;cursor:pointer;font-size:.85rem;width:26px;height:26px;display:flex;align-items:center;justify-content:center;transition:color .15s,border-color .15s;font-family:'Courier Prime',monospace}
        .fs-btn:first-child{border-right:none;border-radius:2px 0 0 2px}
        .fs-btn:last-child{border-radius:0 2px 2px 0}
        .fs-btn:hover{color:#b8974a;border-color:#b8974a}
        .fs-btn-dis{opacity:.18;pointer-events:none}

        .pb{position:fixed;bottom:0;left:0;right:0;height:60px;background:#0c0c0c;border-top:1px solid #1a1a1a;display:flex;align-items:center;gap:12px;padding:0 20px;z-index:100}
        .pb-art{width:36px;height:36px;object-fit:cover;border-radius:1px;flex-shrink:0}
        .pb-art-ph{display:block}
        .pb-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
        .pb-track{font-family:'Courier Prime',monospace;font-size:.8rem;color:#d4c49a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pb-sub{font-family:'Syne',sans-serif;font-weight:600;font-size:.5rem;letter-spacing:.15em}
        .pb-controls{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .pb-skip{background:none;border:none;color:#666;cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .15s}
        .pb-skip:hover{color:#d4c49a}
        .pb-skip-dis{opacity:.2;pointer-events:none}
        .pb-ctrl{background:none;border:none;color:#666;cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .15s}
        .pb-ctrl:hover{color:#d4c49a}
        .pb-vol{width:60px;height:3px;accent-color:#b8974a;cursor:pointer;opacity:.5;transition:opacity .15s}
        .pb-vol:hover{opacity:1}

        @keyframes npb{from{transform:scaleY(.35)}to{transform:scaleY(1)}}

        @media(max-width:720px){
          .hr-nav{padding:16px 16px 0}
          .cf-dh{padding:0 16px}
          .hr-main-inner{grid-template-columns:1fr !important}
          .vr-dh{display:none}
          .hr-right{border-top:1px solid #1a1a1a}
          .pb{padding:0 12px}
          .cf-wrap .cf-album{width:180px;height:180px}
          .tl-track{padding:9px 16px}
          .tl-tags{grid-template-columns:repeat(5,40px)}
          .tl-tag-ghost{width:40px}
        }
      `}</style>

      <div className={`hr-root${visible?" visible":""}`}>

        {/* NAV */}
        <div className="hr-nav">
          <button className="hr-nav-logo" onClick={() => navigate("/shop?from=cb")}>Weird.Baby</button>
          <div className="hr-nav-sub">Carsie Blanton</div>
          <button className="hr-nav-return" onClick={() => navigate("/shop?from=cb")}>Gift Shop</button>
        </div>

        {/* CAROUSEL */}
        <Coverflow
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
        <div className="hr-main hr-snap">
          <div className="hr-main-inner" ref={bodyRef}
            style={{ gridTemplateColumns: `${split}fr 10px ${100-split}fr` }}>

            {/* LEFT — tracklist */}
            <div className="hr-left">
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
            <div className="hr-right">
              {/* VIDEO AREA */}
              <div className="vp-area">
                <div className="vp-inner">
                  <div ref={ytDivRef} className="yt-player" />

                  {/* Audio-only overlay — hides video when browsing a different album */}
                  {hasVideo && !playingThisAlbum && (
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
                      <img src={`https://img.youtube.com/vi/${thumbVid.ytId}/hqdefault.jpg`} alt="" />
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
                albumId={album.id}
                trackTitle={activeTrack !== null ? album.tracks[activeTrack]?.title : null}
                accent={album.accent}
              />
            </div>

          </div>
        </div>

        <PlayerBar
          video={curVideo} track={curTrack} album={curAlbum}
          onSkipBack={handleSkipBack} onSkipForward={handleSkipForward}
          canSkipBack={canSkipBack} canSkipForward={canSkipForward}
          onTogglePlay={yt.togglePlay} onToggleMute={yt.toggleMute}
          onSetVolume={yt.setVolume} getState={yt.getState}
        />
      </div>
    </>
  );
}
