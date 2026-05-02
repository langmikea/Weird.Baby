import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { HR_ARTIFACTS } from "../../data/hr_artifacts.js";
import { HR_JOURNAL_PROMPTS } from "../../data/hr_journal_prompts.js";
import { Journal } from "./HrPanel2.jsx";

// ─── ALBUM → ERA MAP ─────────────────────────────────────────────────────────
const ALBUM_ERA = {
  cracked: "solo", wheel: "solo", dandelions: "solo",
  skipping: "solo", arkansas: "solo", crooked: "solo",
};

// ─── TAG DEFINITIONS ─────────────────────────────────────────────────────────
const ERA_TAGS  = ["seeds", "medusas", "solo"];
const TYPE_TAGS = ["poster", "setlist", "photo", "fan-art", "handwritten", "video", "ticket"];
const SRC_TAGS  = ["donated", "archive", "stage"];

const TAG_COLORS = {
  era:  "#534AB7",
  type: "#0F6E56",
  src:  "#993C1D",
};

function tagLabel(tag) {
  const labels = {
    seeds: "Seeds", medusas: "Medusa's Disco", solo: "Solo",
    poster: "Poster", setlist: "Setlist", photo: "Photo",
    "fan-art": "Fan Art", handwritten: "Handwritten", video: "Video", ticket: "Ticket",
    donated: "Donated", archive: "Archive", stage: "Stage",
  };
  return labels[tag] || tag;
}

// ─── FILTER HELPER ───────────────────────────────────────────────────────────
function matchesTags(item, activeTags) {
  if (activeTags.era.size  > 0 && !activeTags.era.has(item.era))   return false;
  if (activeTags.type.size > 0 && !activeTags.type.has(item.type)) return false;
  if (activeTags.src.size  > 0 && !activeTags.src.has(item.src))   return false;
  return true;
}

// ─── AVAILABLE TAGS — dim tags with no matching artifacts ────────────────────
function availableTagValues(items, group) {
  const vals = new Set();
  for (const item of items) {
    if (group === "era")  vals.add(item.era);
    if (group === "type") vals.add(item.type);
    if (group === "src")  vals.add(item.src);
  }
  return vals;
}

// ─── TAG BAR ─────────────────────────────────────────────────────────────────
function TagBar({ activeTags, onToggle, items }) {
  const groups = [
    { key: "era",  tags: ERA_TAGS },
    { key: "type", tags: TYPE_TAGS },
    { key: "src",  tags: SRC_TAGS },
  ];

  const availableByGroup = useMemo(() => {
    const result = {};
    for (const g of groups) {
      const otherFiltered = items.filter(item => {
        for (const og of groups) {
          if (og.key === g.key) continue;
          if (activeTags[og.key].size > 0) {
            const val = og.key === "era" ? item.era : og.key === "type" ? item.type : item.src;
            if (!activeTags[og.key].has(val)) return false;
          }
        }
        return true;
      });
      result[g.key] = availableTagValues(otherFiltered, g.key);
    }
    return result;
  }, [items, activeTags]);

  return (
    <div className="p3-tagbar">
      {groups.map((g, gi) => (
        <div key={g.key} className="p3-tagbar-group">
          {gi > 0 && <div className="p3-tagbar-divider" />}
          {g.tags.map(tag => {
            const isActive = activeTags[g.key].has(tag);
            const hasItems = availableByGroup[g.key]?.has(tag);
            const color = TAG_COLORS[g.key];
            return (
              <button
                key={tag}
                className={`p3-tag${isActive ? " p3-tag-sel" : " p3-tag-dim"}${!hasItems ? " p3-tag-dead" : ""}`}
                style={isActive ? { borderColor: color, color: color } : {}}
                onClick={() => hasItems && onToggle(g.key, tag)}
                disabled={!hasItems}
              >
                {tagLabel(tag)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── ARTIFACTS RAIL ──────────────────────────────────────────────────────────
function ArtifactsRail({ items, activeAlbumId }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const timerRef = useRef(null);
  const hoverRef = useRef(false);
  const prevAlbumRef = useRef(activeAlbumId);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.date.localeCompare(b.date)),
    [items]
  );
  const count = sorted.length;

  // Soft anchor: when album changes, jump to first artifact matching that era
  useEffect(() => {
    if (activeAlbumId && activeAlbumId !== prevAlbumRef.current) {
      prevAlbumRef.current = activeAlbumId;
      const era = ALBUM_ERA[activeAlbumId] || null;
      if (era && sorted.length > 0) {
        const anchorIdx = sorted.findIndex(a => a.era === era);
        if (anchorIdx >= 0) setIdx(anchorIdx);
      }
    }
  }, [activeAlbumId, sorted]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (count <= 0) return;
    timerRef.current = setInterval(() => {
      if (!hoverRef.current) setIdx(prev => (prev + 1) % count);
    }, 7500);
  }, [count]);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);
  useEffect(() => { if (idx >= count && count > 0) setIdx(0); }, [count, idx]);

  if (count === 0) {
    return (
      <div className="p3-rail">
        <div className="p3-rail-empty">No artifacts match these filters.</div>
      </div>
    );
  }

  const current = sorted[idx % count];
  const prevItem = sorted[(idx - 1 + count) % count];
  const nextItem = sorted[(idx + 1) % count];

  function goPrev() { setIdx((idx - 1 + count) % count); startTimer(); }
  function goNext() { setIdx((idx + 1) % count); startTimer(); }

  return (
    <div
      className="p3-rail"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* Bleed strip — prev / current / next */}
      <div className="p3-rail-strip">
        {count > 1 && (
          <div className="p3-rail-bleed p3-rail-bleed-left" onClick={goPrev}>
            <div className="p3-rail-bleed-card" style={{ background: prevItem.color }}>
              <span className="p3-rail-bleed-icon">{prevItem.icon}</span>
            </div>
          </div>
        )}

        <div className="p3-rail-center" onClick={() => setLightbox(current)}>
          <div className="p3-rail-card" style={{ background: current.color }}>
            <span className="p3-rail-card-icon">{current.icon}</span>
          </div>
        </div>

        {count > 1 && (
          <div className="p3-rail-bleed p3-rail-bleed-right" onClick={goNext}>
            <div className="p3-rail-bleed-card" style={{ background: nextItem.color }}>
              <span className="p3-rail-bleed-icon">{nextItem.icon}</span>
            </div>
          </div>
        )}
      </div>

      {/* Caption + meta below content */}
      <div className="p3-rail-caption">{current.fact1}</div>
      <div className="p3-rail-meta">
        <span className="p3-rail-meta-type">{tagLabel(current.type)}</span>
        <span className="p3-rail-meta-date">{current.date}</span>
        {current.credit && <span className="p3-rail-meta-credit">via {current.credit}</span>}
      </div>

      {/* Controls */}
      <div className="p3-rail-controls">
        <button className="p3-rail-btn" onClick={e => { e.stopPropagation(); goPrev(); }}>‹</button>
        <span className="p3-rail-counter">{idx + 1} / {count}</span>
        <button className="p3-rail-btn" onClick={e => { e.stopPropagation(); goNext(); }}>›</button>
      </div>

      {/* Progress bar */}
      <div className="p3-rail-progress">
        <div className="p3-rail-progress-fill" style={{ width: `${((idx + 1) / count) * 100}%` }} />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="p3-lightbox" onClick={() => setLightbox(null)}>
          <div className="p3-lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="p3-lightbox-placeholder" style={{ background: lightbox.color }}>
              <span className="p3-lightbox-icon">{lightbox.icon}</span>
            </div>
            <div className="p3-lightbox-meta">
              <span className="p3-lightbox-type">{tagLabel(lightbox.type)}</span>
              <span className="p3-lightbox-date">{lightbox.date}</span>
              <span className="p3-lightbox-src">{tagLabel(lightbox.src)}</span>
            </div>
            <div className="p3-lightbox-fact1">{lightbox.fact1}</div>
            {lightbox.fact2 && <div className="p3-lightbox-fact2">{lightbox.fact2}</div>}
            {lightbox.credit && <div className="p3-lightbox-credit">Contributed by {lightbox.credit}</div>}
            <button className="p3-lightbox-close" onClick={() => setLightbox(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PANEL 3 ROOT ────────────────────────────────────────────────────────────
export default function HrPanel3({ activeAlbumId }) {
  const [activeTags, setActiveTags] = useState({
    era: new Set(), type: new Set(), src: new Set(),
  });
  const prevAlbumRef = useRef(activeAlbumId);

  // When active album changes, auto-set era
  useEffect(() => {
    if (activeAlbumId && activeAlbumId !== prevAlbumRef.current) {
      prevAlbumRef.current = activeAlbumId;
      const era = ALBUM_ERA[activeAlbumId] || null;
      if (era) {
        setActiveTags(prev => ({ ...prev, era: new Set([era]) }));
      }
    }
  }, [activeAlbumId]);

  function toggleTag(group, tag) {
    setActiveTags(prev => {
      const next = new Set(prev[group]);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return { ...prev, [group]: next };
    });
  }

  const filtered = HR_ARTIFACTS.filter(item => matchesTags(item, activeTags));

  // Journal gets era filter only — type/src tags are artifact-specific
  const journalTags = useMemo(() => ({
    era: activeTags.era, type: new Set(), src: new Set(),
  }), [activeTags.era]);

  return (
    <>
      <style>{`
        /* ── PANEL 3 — THE ARTIFACTS ─────────────────────────────── */
        .p3-root{border-top:1px solid #181818;padding:0 0 24px}
        .p3-section-label{font-family:'Syne',sans-serif;font-weight:600;font-size:.4rem;
          letter-spacing:.18em;text-transform:uppercase;color:#2a2a2a;padding:14px 20px 0}

        /* TAG BAR */
        .p3-tagbar{display:flex;align-items:center;gap:3px;padding:10px 20px 10px;flex-wrap:wrap}
        .p3-tagbar-group{display:grid;grid-auto-flow:column;grid-auto-columns:auto;gap:3px}
        .p3-tagbar-divider{width:1px;height:16px;background:#1a1a1a;margin:0 6px;flex-shrink:0}
        .p3-tag{font-family:'Syne',sans-serif;font-weight:600;font-size:.42rem;letter-spacing:.1em;
          padding:2px 8px;background:transparent;border:1px solid transparent;
          cursor:pointer;border-radius:1px;transition:color .15s,border-color .15s;
          text-align:center;white-space:nowrap}
        .p3-tag-sel{opacity:1}
        .p3-tag-dim{color:#4a4a4a !important;border-color:transparent !important}
        .p3-tag:hover:not(:disabled){color:#999 !important;border-color:#444 !important}
        .p3-tag-dead{color:#1e1e1e !important;cursor:default;pointer-events:none}

        /* COLUMNS — matches Panel 2 60/40 */
        .p3-columns{display:grid;grid-template-columns:60% 40%;min-height:360px;border-top:1px solid #141414}
        .p3-col{display:flex;flex-direction:column}

        /* RAIL — left column */
        .p3-rail{padding:16px 20px;display:flex;flex-direction:column;gap:12px;border-right:1px solid #141414}
        .p3-rail-empty{font-family:'Courier Prime',monospace;font-size:.75rem;color:#333;
          padding:40px 0;text-align:center}

        /* Strip: bleed-left | center | bleed-right */
        .p3-rail-strip{display:flex;align-items:stretch;gap:0;overflow:hidden;position:relative}
        .p3-rail-center{flex:1;min-width:0;cursor:pointer;transition:opacity .2s}
        .p3-rail-center:hover{opacity:.85}

        /* Main card */
        .p3-rail-card{width:100%;aspect-ratio:16/10;border-radius:2px;display:flex;
          align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.04)}
        .p3-rail-card-icon{font-size:2.5rem;opacity:.5}
        .p3-rail-caption{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:.85rem;color:#b8a88a;line-height:1.5}
        .p3-rail-meta{display:flex;gap:10px;font-family:'Courier Prime',monospace;
          font-size:.55rem;color:#444;letter-spacing:.08em}
        .p3-rail-meta-type{text-transform:uppercase;color:#555}
        .p3-rail-meta-credit{color:#b8974a;margin-left:auto}

        /* Bleed neighbors */
        .p3-rail-bleed{width:48px;flex-shrink:0;cursor:pointer;position:relative;
          opacity:.3;transition:opacity .2s}
        .p3-rail-bleed:hover{opacity:.5}
        .p3-rail-bleed-left{margin-right:12px}
        .p3-rail-bleed-right{margin-left:12px}
        .p3-rail-bleed-card{width:100%;height:100%;border-radius:2px;display:flex;
          align-items:center;justify-content:center}
        .p3-rail-bleed-icon{font-size:1.4rem;opacity:.5}

        /* Gradient fade over bleed edges */
        .p3-rail-bleed-left::after{content:'';position:absolute;top:0;right:0;bottom:0;width:24px;
          background:linear-gradient(to left,#0a0a0a,transparent);pointer-events:none}
        .p3-rail-bleed-right::before{content:'';position:absolute;top:0;left:0;bottom:0;width:24px;
          background:linear-gradient(to right,#0a0a0a,transparent);pointer-events:none}

        /* Controls */
        .p3-rail-controls{display:flex;align-items:center;justify-content:center;gap:12px}
        .p3-rail-btn{background:#0e0e0e;border:1px solid #252525;color:#505050;cursor:pointer;
          font-size:1rem;width:28px;height:28px;display:flex;align-items:center;justify-content:center;
          border-radius:2px;transition:color .15s,border-color .15s;font-family:'Courier Prime',monospace}
        .p3-rail-btn:hover{color:#b8974a;border-color:#b8974a}
        .p3-rail-counter{font-family:'Courier Prime',monospace;font-size:.6rem;color:#444;
          letter-spacing:.12em;min-width:40px;text-align:center}
        .p3-rail-progress{height:2px;background:#141414;border-radius:1px;overflow:hidden}
        .p3-rail-progress-fill{height:100%;background:#b8974a33;transition:width .3s ease}

        /* LIGHTBOX */
        .p3-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;
          display:flex;align-items:center;justify-content:center;padding:24px}
        .p3-lightbox-inner{background:#0e0e0e;border:1px solid #222;border-radius:4px;
          max-width:520px;width:100%;padding:24px;display:flex;flex-direction:column;gap:12px}
        .p3-lightbox-placeholder{width:100%;aspect-ratio:16/10;border-radius:2px;
          display:flex;align-items:center;justify-content:center}
        .p3-lightbox-icon{font-size:3rem;opacity:.5}
        .p3-lightbox-meta{display:flex;gap:12px;font-family:'Courier Prime',monospace;
          font-size:.6rem;color:#666;letter-spacing:.1em}
        .p3-lightbox-type{text-transform:uppercase}
        .p3-lightbox-src{text-transform:uppercase;margin-left:auto}
        .p3-lightbox-fact1{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:1rem;color:#c4bcb4;line-height:1.5}
        .p3-lightbox-fact2{font-family:'Courier Prime',monospace;font-size:.72rem;color:#666;line-height:1.5}
        .p3-lightbox-credit{font-family:'Courier Prime',monospace;font-size:.62rem;color:#b8974a;
          letter-spacing:.08em}
        .p3-lightbox-close{align-self:flex-end;background:none;border:1px solid #333;color:#555;
          font-family:'Courier Prime',monospace;font-size:.6rem;letter-spacing:.15em;
          padding:4px 14px;cursor:pointer;border-radius:2px;transition:color .15s,border-color .15s}
        .p3-lightbox-close:hover{color:#b8974a;border-color:#b8974a}

        @media(max-width:720px){
          .p3-columns{grid-template-columns:1fr}
          .p3-rail{border-right:none;border-bottom:1px solid #141414}
          .p3-tagbar{padding:10px 16px 8px}
          .p3-rail{padding:12px 16px}
          .p3-section-label{padding:10px 16px 0}
          .p3-rail-bleed{width:32px}
          .p3-rail-caption{font-size:.78rem}
        }
      `}</style>

      <div className="p3-root">
        <TagBar activeTags={activeTags} onToggle={toggleTag} items={HR_ARTIFACTS} />
        <div className="p3-columns">
          <div className="p3-col">
            <div className="p3-section-label">The Artifacts</div>
            <ArtifactsRail items={filtered} activeAlbumId={activeAlbumId} />
          </div>
          <div className="p3-col">
            <div className="p3-section-label">The Journal</div>
            <Journal prompts={HR_JOURNAL_PROMPTS} activeTags={journalTags} />
          </div>
        </div>
      </div>
    </>
  );
}
