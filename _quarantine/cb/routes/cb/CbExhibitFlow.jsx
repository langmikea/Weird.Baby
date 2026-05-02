import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CB_ARCHIVE } from "../../data/cb_archive.js";
import { CB_ARTIFACTS } from "../../data/cb_artifacts.js";
import { CB_JOURNAL_PROMPTS } from "../../data/cb_journal_prompts.js";
import { CB_EXIT_FLOW, P4_TYPES } from "../../data/cb_exit_flow.js";

// ─── ALBUM → ERA MAP ─────────────────────────────────────────────────────────
const ALBUM_ERA = {
  "aint-so-green": "early", "buoy": "early", "idiot-heart": "early",
  "rude-remarks": "middle", "not-old-not-new": "middle",
  "so-ferocious": "middle", "buck-up": "middle",
  "love-and-rage": "fire", "body-of-work": "fire",
  "after-the-revolution": "fire", "singles": "fire",
};

// ─── TAG LABELS ──────────────────────────────────────────────────────────────
function tagLabel(tag) {
  const labels = {
    early: "Early", middle: "Independent", fire: "Fire Era",
    // Panel 2 types
    historical: "Historical", interview: "Interview", rarity: "Rarity",
    // Panel 3 types
    poster: "Poster", setlist: "Setlist", photo: "Photo",
    "fan-art": "Fan Art", handwritten: "Handwritten", video: "Video", ticket: "Ticket",
    // Panel 4 types
    quick: "Quick Hit", deep: "Deep Cut", highlight: "Highlight",
    // Sources
    social: "Social", press: "Press", archive: "Archive",
    donated: "Donated", stage: "Stage",
  };
  return labels[tag] || tag;
}

// ─── FILTER — era only (type handled per-section) ───────────────────────────
function matchesEra(item, eraSet) {
  if (eraSet.size === 0) return true;
  return eraSet.has(item.era);
}
function matchesType(item, typeSet) {
  if (typeSet.size === 0) return true;
  return typeSet.has(item.type);
}

// ─── TYPE PILLS — above nav arrows, always at least one selected ────────────
function TypePills({ tags, activeTypes, onToggle, items, allTags }) {
  const available = useMemo(() => {
    const vals = new Set();
    for (const item of items) vals.add(item.type);
    return vals;
  }, [items]);

  const allSelected = activeTypes.size === allTags.length;

  return (
    <div className="ef-pills">
      {tags.map(tag => {
        const isActive = activeTypes.has(tag);
        const hasItems = available.has(tag);
        return (
          <button
            key={tag}
            className={`ef-pill${isActive ? " ef-pill-sel" : ""}${!allSelected && !isActive ? " ef-pill-dim" : ""}${!hasItems ? " ef-pill-dead" : ""}`}
            onClick={() => hasItems && onToggle(tag)}
            disabled={!hasItems}
          >
            {tagLabel(tag)}
          </button>
        );
      })}
    </div>
  );
}

// ─── EXHIBIT SCROLLER — unified for all sections ───────────────────────────
function ExhibitScroller({ items, activeAlbumId, children }) {
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

  // Soft anchor: when album changes, jump to first matching era
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

  // Auto-advance pauses on hover AND when a YouTube embed is showing
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (count <= 0) return;
    timerRef.current = setInterval(() => {
      if (hoverRef.current) return;
      const cur = sorted[idx % count];
      if (cur && cur.ytId) return;
      setIdx(prev => (prev + 1) % count);
    }, 7500);
  }, [count, idx, sorted]);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);
  useEffect(() => { if (idx >= count && count > 0) setIdx(0); }, [count, idx]);

  if (count === 0) {
    return <div className="ef-scroller-empty">No artifacts match these filters.</div>;
  }

  const current = sorted[idx % count];
  const prevItem = sorted[(idx - 1 + count) % count];
  const nextItem = sorted[(idx + 1) % count];

  function goPrev() { setIdx((idx - 1 + count) % count); startTimer(); }
  function goNext() { setIdx((idx + 1) % count); startTimer(); }

  return (
    <div
      className="ef-scroller"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* Content card */}
      <div className="ef-strip">
        <div className="ef-bleed ef-bleed-l" onClick={goPrev}>
          {prevItem.ytId ? (
            <div className="ef-bleed-card" style={{
              background: `url(https://img.youtube.com/vi/${prevItem.ytId}/mqdefault.jpg) center/cover`,
            }} />
          ) : (
            <div className="ef-bleed-card" style={{ background: prevItem.color }}>
              <span className="ef-bleed-ico">{prevItem.icon}</span>
            </div>
          )}
        </div>
        <div className="ef-center" onClick={() => !current.ytId && setLightbox(current)}>
          {current.ytId ? (
            <div className="ef-card ef-card-yt" style={{ background: "#000" }}>
              <iframe
                className="ef-yt-iframe"
                src={`https://www.youtube-nocookie.com/embed/${current.ytId}?rel=0&modestbranding=1`}
                title={current.fact1}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="ef-card ef-card-text" style={{ background: current.color }}
              onClick={(e) => { e.stopPropagation(); setLightbox(current); }}>
              <div className="ef-card-body">
                <span className="ef-card-ico-sm">{current.icon}</span>
                <div className="ef-card-fact">{current.fact1}</div>
              </div>
              <div className="ef-card-foot">
                <span className="ef-card-type">{tagLabel(current.type)}</span>
                <span className="ef-card-date">{current.date}</span>
                {current.credit && <span className="ef-card-credit">via {current.credit}</span>}
              </div>
            </div>
          )}
        </div>
        <div className="ef-bleed ef-bleed-r" onClick={goNext}>
          {nextItem.ytId ? (
            <div className="ef-bleed-card" style={{
              background: `url(https://img.youtube.com/vi/${nextItem.ytId}/mqdefault.jpg) center/cover`,
            }} />
          ) : (
            <div className="ef-bleed-card" style={{ background: nextItem.color }}>
              <span className="ef-bleed-ico">{nextItem.icon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Slot for pills — tucked under the image */}
      {children}

      {/* Caption + meta below */}
      <div className="ef-caption">{current.fact1}</div>
      <div className="ef-meta">
        <span className="ef-meta-type">{tagLabel(current.type)}</span>
        <span className="ef-meta-date">{current.date}</span>
        {current.credit && <span className="ef-meta-credit">via {current.credit}</span>}
      </div>

      {/* Lightbox — non-video items only (video items play inline) */}
      {lightbox && (
        <div className="ef-lightbox" onClick={() => setLightbox(null)}>
          <div className="ef-lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="ef-lightbox-vis" style={{ background: lightbox.color }}>
              <span className="ef-lightbox-ico">{lightbox.icon}</span>
            </div>
            <div className="ef-lightbox-meta">
              <span className="ef-lightbox-type">{tagLabel(lightbox.type)}</span>
              <span className="ef-lightbox-date">{lightbox.date}</span>
              <span className="ef-lightbox-src">{tagLabel(lightbox.src)}</span>
            </div>
            <div className="ef-lightbox-f1">{lightbox.fact1}</div>
            {lightbox.fact2 && <div className="ef-lightbox-f2">{lightbox.fact2}</div>}
            {lightbox.credit && <div className="ef-lightbox-credit">Contributed by {lightbox.credit}</div>}
            <button className="ef-lightbox-close" onClick={() => setLightbox(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JOURNAL (single instance, shared across exhibit) ───────────────────────
const SEED_ENTRIES = [
  { id: 1, date: "2025-10-15", handle: "rageandlove_", ctx: "'Be Good'", era: "fire",
    fact1: "Heard this at a friend's wedding. The DJ didn't play it — the bride's sister sang it during the ceremony. I've never recovered.",
    up: 8, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 2, date: "2025-11-20", handle: "folkpunkliz", ctx: "'Ugly Nasty Commie Bitch'", era: "fire",
    fact1: "My mom sent me this song. My MOM. Said 'this is how I feel.' We've never agreed on politics before. This song did something.",
    up: 12, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 3, date: "2026-01-05", handle: "headbitchfan", ctx: "'Rich People'", era: "fire",
    fact1: "The Natalie Portman version is how I found her. Then I found the original and realized it was better. Then I found the Red Rocks one and gave up ranking them.",
    up: 7, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 4, date: "2025-08-22", handle: "jazzcatsally", ctx: "'Sweet Lorraine'", era: "middle",
    fact1: "I didn't know she had a jazz record until I was three albums deep. Not Old, Not New stopped me in my tracks. Who does this?",
    up: 6, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 5, date: "2025-12-01", handle: "prinefan4ever", ctx: "'Fishin' With You'", era: "fire",
    fact1: "The John Prine tribute. 227K views. I cried in my car in a Trader Joe's parking lot. No shame.",
    up: 9, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 6, date: "2026-02-14", handle: "ferocious_one", ctx: "'Hot Night'", era: "middle",
    fact1: "So Ferocious changed how I think about her. The first three records are good. That one is dangerous.",
    up: 5, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 7, date: "2025-09-30", handle: "sailingwest", ctx: "Gaza flotilla", era: "fire",
    fact1: "Watching her film Little Flame on the deck of that boat. The political work and the music becoming the same thing. That's the whole point.",
    up: 10, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 8, date: "2026-03-05", handle: "buckup_band", ctx: "'Buck Up'", era: "middle",
    fact1: "The quarantine edition of Buck Up got me through April 2020. Just her in the kitchen. That was enough.",
    up: 6, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 9, date: "2026-01-25", handle: "fai_attendee", ctx: "Artist of the Year", era: "fire",
    fact1: "I was in the room for the acceptance speech. Twenty years independent. She earned every word of it.",
    up: 8, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 10, date: "2025-07-10", handle: "tellus_regular", ctx: "Live show", era: "middle",
    fact1: "Saw her at Tellus360. Maybe 60 people in the room. She played Bed like it was the last song she'd ever sing. I still think about it.",
    up: 7, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 11, date: "2026-02-28", handle: "elonhater2026", ctx: "'Elon Musk'", era: "fire",
    fact1: "The kitchen clips were already perfect. Then the official video dropped and somehow topped them. She knows exactly what she's doing.",
    up: 5, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 12, date: "2025-11-01", handle: "idiot_heart_og", ctx: "'Backbone'", era: "early",
    fact1: "I've been listening since Idiot Heart. That's twelve years. The fact that she's still independent and still this good — that's the story.",
    up: 4, dn: 0, voted: null, mine: false, undoTimer: null },
];

function Journal({ prompts, eraFilter }) {
  const [entries, setEntries]       = useState(SEED_ENTRIES);
  const [handle, setHandle]         = useState("");
  const [text, setText]             = useState("");
  const [promptIdx, setPromptIdx]   = useState(0);
  const [feedIdx, setFeedIdx]       = useState(0);
  const promptTimerRef = useRef(null);
  const feedTimerRef   = useRef(null);
  const hoverRef       = useRef(false);
  const nextIdRef      = useRef(100);

  const filtered = useMemo(
    () => entries.filter(e => eraFilter.size === 0 || eraFilter.has(e.era)),
    [entries, eraFilter]
  );

  const weighted = useRef([]);
  useEffect(() => {
    const pool = [];
    filtered.forEach((e, i) => {
      const w = Math.max(1, e.up * 2 - e.dn + 1);
      for (let j = 0; j < w; j++) pool.push(i);
    });
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const seen = new Set();
    weighted.current = pool.filter(idx => {
      if (seen.has(idx)) return false;
      seen.add(idx);
      return true;
    });
    setFeedIdx(0);
  }, [filtered.length, eraFilter]);

  useEffect(() => {
    clearInterval(promptTimerRef.current);
    promptTimerRef.current = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % prompts.length);
    }, 9500);
    return () => clearInterval(promptTimerRef.current);
  }, [prompts.length]);

  useEffect(() => {
    clearInterval(feedTimerRef.current);
    feedTimerRef.current = setInterval(() => {
      if (!hoverRef.current && weighted.current.length > 0) {
        setFeedIdx(prev => (prev + 1) % weighted.current.length);
      }
    }, 8500);
    return () => clearInterval(feedTimerRef.current);
  }, []);

  function submitEntry() {
    if (!text.trim()) return;
    const h = handle.trim() || "anonymous";
    const newEntry = {
      id: nextIdRef.current++, date: new Date().toISOString().slice(0, 10),
      handle: h, ctx: null, era: "fire",
      fact1: text.trim(), up: 0, dn: 0, voted: null, mine: true, undoTimer: 10,
    };
    setEntries(prev => [newEntry, ...prev]);
    setText("");
    const countdownId = setInterval(() => {
      setEntries(prev => prev.map(e => {
        if (e.id !== newEntry.id || e.undoTimer === null) return e;
        return e.undoTimer <= 1 ? { ...e, undoTimer: null } : { ...e, undoTimer: e.undoTimer - 1 };
      }));
    }, 1000);
    setTimeout(() => clearInterval(countdownId), 11000);
  }

  function undoEntry(id) { setEntries(prev => prev.filter(e => e.id !== id)); }
  function deleteEntry(id) {
    if (!window.confirm("Delete this entry?")) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function vote(id, dir) {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e;
      if (e.voted === dir) {
        return { ...e, voted: null,
          up: dir === "up" ? e.up - 1 : e.up,
          dn: dir === "dn" ? e.dn - 1 : e.dn,
        };
      }
      const prevUp = e.voted === "up" ? e.up - 1 : e.up;
      const prevDn = e.voted === "dn" ? e.dn - 1 : e.dn;
      const newUp = dir === "up" ? prevUp + 1 : prevUp;
      const newDn = dir === "dn" ? prevDn + 1 : prevDn;
      return { ...e, voted: dir, up: newUp, dn: newDn };
    }));
  }

  const prompt = prompts[promptIdx % prompts.length];
  const feedOrder = weighted.current;
  const feedEntry = feedOrder.length > 0 ? filtered[feedOrder[feedIdx % feedOrder.length]] : null;

  return (
    <div
      className="jnl"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      <div className="jnl-prompt">
        {prompt?.line1}<br />{prompt?.line2}
      </div>

      <div className="jnl-compose">
        <input className="jnl-handle" type="text" placeholder="your handle"
          value={handle} onChange={e => setHandle(e.target.value)} maxLength={24} />
        <textarea className="jnl-text" placeholder="Leave your mark..."
          value={text} onChange={e => setText(e.target.value)} maxLength={500} />
        <button className="jnl-submit" onClick={submitEntry}>Leave it</button>
      </div>

      <div className="jnl-feed">
        {entries.filter(e => e.undoTimer !== null).map(e => (
          <div key={e.id} className="jnl-entry jnl-entry-new">
            <div className="jnl-entry-head">
              <span className="jnl-entry-who">{e.handle}</span>
              <span className="jnl-entry-when">{e.date}</span>
            </div>
            <div className="jnl-entry-body">{e.fact1}</div>
            <button className="jnl-undo" onClick={() => undoEntry(e.id)}>Undo ({e.undoTimer}s)</button>
          </div>
        ))}

        {feedEntry && feedEntry.undoTimer === null && (
          <div className="jnl-entry">
            <div className="jnl-entry-head">
              <span className="jnl-entry-who">{feedEntry.handle}</span>
              {feedEntry.ctx && <span className="jnl-entry-ctx">{feedEntry.ctx}</span>}
              <span className="jnl-entry-when">{feedEntry.date}</span>
            </div>
            <div className="jnl-entry-body">{feedEntry.fact1}</div>
            <div className="jnl-entry-actions">
              <button className={`jnl-vote${feedEntry.voted === "up" ? " jnl-vote-on" : ""}`}
                onClick={() => vote(feedEntry.id, "up")}>&#9650; {feedEntry.up}</button>
              <button className={`jnl-vote${feedEntry.voted === "dn" ? " jnl-vote-on" : ""}`}
                onClick={() => vote(feedEntry.id, "dn")}>&#9660; {feedEntry.dn}</button>
              {feedEntry.mine && (
                <button className="jnl-delete" onClick={() => deleteEntry(feedEntry.id)}>delete</button>
              )}
            </div>
          </div>
        )}

        {feedOrder.length > 1 && (
          <div className="jnl-feed-nav">
            <button className="ef-btn"
              onClick={() => setFeedIdx(prev => (prev - 1 + feedOrder.length) % feedOrder.length)}>‹</button>
            <span className="ef-counter">
              {(feedIdx % feedOrder.length) + 1} / {feedOrder.length}
            </span>
            <button className="ef-btn"
              onClick={() => setFeedIdx(prev => (prev + 1) % feedOrder.length)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EXHIBIT FLOW ROOT ──────────────────────────────────────────────────────
const P2_TYPES = ["historical", "interview", "rarity"];
const P3_TYPES = ["poster", "setlist", "photo", "fan-art", "handwritten", "video", "ticket"];

export default function CbExhibitFlow({ activeAlbumId }) {
  const [eraFilter, setEraFilter] = useState(new Set());
  const [p2Types, setP2Types]     = useState(new Set(P2_TYPES));
  const [p3Types, setP3Types]     = useState(new Set(P3_TYPES));
  const [p4Types, setP4Types]     = useState(new Set(P4_TYPES));
  const prevAlbumRef = useRef(activeAlbumId);

  useEffect(() => {
    if (activeAlbumId && activeAlbumId !== prevAlbumRef.current) {
      prevAlbumRef.current = activeAlbumId;
      const era = ALBUM_ERA[activeAlbumId] || null;
      if (era) setEraFilter(new Set([era]));
    }
  }, [activeAlbumId]);

  function toggleType(setter, allTags) {
    return (tag) => setter(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        if (next.size <= 1) return prev;
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  const p2Items = useMemo(
    () => CB_ARCHIVE.filter(i => matchesEra(i, eraFilter) && matchesType(i, p2Types)),
    [eraFilter, p2Types]
  );
  const p3Items = useMemo(
    () => CB_ARTIFACTS.filter(i => matchesEra(i, eraFilter) && matchesType(i, p3Types)),
    [eraFilter, p3Types]
  );
  const p4Items = useMemo(
    () => CB_EXIT_FLOW.filter(i => matchesType(i, p4Types)),
    [p4Types]
  );
  const p2EraItems = useMemo(
    () => CB_ARCHIVE.filter(i => matchesEra(i, eraFilter)),
    [eraFilter]
  );
  const p3EraItems = useMemo(
    () => CB_ARTIFACTS.filter(i => matchesEra(i, eraFilter)),
    [eraFilter]
  );

  return (
    <>
      {/* CSS is shared from HrExhibitFlow — same class names, same styles.
          The styles are injected by whichever ExhibitFlow renders first.
          If CB is the first exhibit a visitor sees, we need the styles here too. */}
      <style>{`
        /* ── EXHIBIT FLOW ────────────────────────────────────────── */
        .ef-root{border-top:1px solid #181818;padding:0 10px}
        .ef-grid{display:grid;grid-template-columns:60% 40%}
        .ef-left{display:flex;flex-direction:column}
        .ef-right{
          position:-webkit-sticky;position:sticky;top:24px;align-self:start;
          max-height:calc(100vh - 48px);overflow-y:auto;border-left:1px solid #141414;
          scrollbar-width:none;padding-top:24px;
        }
        .ef-right::-webkit-scrollbar{display:none}
        .ef-section{padding:24px 0;scroll-snap-align:center;
          min-height:calc(100vh - 64px);display:flex;flex-direction:column;justify-content:center}
        .ef-section + .ef-section{border-top:1px solid #141414}
        .ef-section-head{display:flex;align-items:baseline;gap:12px;padding:0 20px 8px}
        .ef-label{font-family:'Syne',sans-serif;font-weight:700;font-size:.58rem;
          letter-spacing:.18em;text-transform:uppercase;color:#555;white-space:nowrap}
        .ef-pills{display:flex;gap:3px;flex-wrap:wrap;padding:2px 0 0}
        .ef-pill{font-family:'Syne',sans-serif;font-weight:600;font-size:.42rem;
          letter-spacing:.1em;padding:2px 6px;background:transparent;
          border:1px solid transparent;cursor:pointer;border-radius:1px;
          transition:color .15s,border-color .15s;text-align:center;
          text-transform:uppercase;min-width:48px;white-space:nowrap;color:#555}
        .ef-pill-sel{color:#888;border-color:#333}
        .ef-pill-dim{color:#2a2a2a !important;border-color:transparent !important}
        .ef-pill:hover:not(:disabled){color:#999 !important;border-color:#444 !important}
        .ef-pill-dead{color:#1a1a1a !important;cursor:default;pointer-events:none}
        .ef-scroller{padding:0 20px;display:flex;flex-direction:column;gap:10px}
        .ef-scroller-empty{font-family:'Courier Prime',monospace;font-size:.72rem;color:#333;
          padding:40px 20px;text-align:center}
        .ef-strip{display:flex;align-items:stretch;overflow:hidden}
        .ef-center{flex:1;min-width:0;cursor:pointer;transition:opacity .2s}
        .ef-center:hover{opacity:.85}
        .ef-card{width:100%;aspect-ratio:16/9;border-radius:2px;display:flex;
          align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.04);
          overflow:hidden;position:relative}
        .ef-card-yt{cursor:default}
        .ef-yt-iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
        .ef-card-text{flex-direction:column;padding:28px 32px;
          cursor:pointer;justify-content:center;align-items:flex-start;gap:16px}
        .ef-card-body{display:flex;flex-direction:column;gap:10px}
        .ef-card-ico-sm{font-size:1.6rem;opacity:.3}
        .ef-card-fact{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:1.1rem;color:#b8a88a;line-height:1.6;max-width:80%}
        .ef-card-foot{display:flex;gap:10px;font-family:'Courier Prime',monospace;
          font-size:.5rem;color:#3a3a3a;letter-spacing:.08em;text-transform:uppercase;
          width:100%;align-items:center;margin-top:auto}
        .ef-card-credit{color:#b8974a;margin-left:auto}
        .ef-card-ico{font-size:2.5rem;opacity:.45}
        .ef-bleed{width:44px;flex-shrink:0;cursor:pointer;position:relative;opacity:.25;transition:opacity .2s}
        .ef-bleed:hover{opacity:.45}
        .ef-bleed-l{margin-right:10px}
        .ef-bleed-r{margin-left:10px}
        .ef-bleed-card{width:100%;height:100%;border-radius:2px;display:flex;align-items:center;justify-content:center}
        .ef-bleed-ico{font-size:1.2rem;opacity:.45}
        .ef-bleed-l::after{content:'';position:absolute;top:0;right:0;bottom:0;width:20px;
          background:linear-gradient(to left,#0a0a0a,transparent);pointer-events:none}
        .ef-bleed-r::before{content:'';position:absolute;top:0;left:0;bottom:0;width:20px;
          background:linear-gradient(to right,#0a0a0a,transparent);pointer-events:none}
        .ef-caption{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:.82rem;color:#b8a88a;line-height:1.5}
        .ef-meta{display:flex;gap:10px;font-family:'Courier Prime',monospace;
          font-size:.52rem;color:#3a3a3a;letter-spacing:.08em}
        .ef-meta-type{text-transform:uppercase}
        .ef-meta-credit{color:#b8974a;margin-left:auto}
        .ef-controls{display:flex;align-items:center;justify-content:center;gap:12px}
        .ef-btn{background:#0e0e0e;border:1px solid #1e1e1e;color:#3a3a3a;cursor:pointer;
          font-size:.9rem;width:26px;height:26px;display:flex;align-items:center;justify-content:center;
          border-radius:2px;transition:color .15s,border-color .15s;font-family:'Courier Prime',monospace}
        .ef-btn:hover{color:#b8974a;border-color:#b8974a}
        .ef-counter{font-family:'Courier Prime',monospace;font-size:.55rem;color:#333;
          letter-spacing:.12em;min-width:36px;text-align:center}
        .ef-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:200;
          display:flex;align-items:center;justify-content:center;padding:24px}
        .ef-lightbox-inner{background:#0c0c0c;border:1px solid #1e1e1e;border-radius:3px;
          max-width:480px;width:100%;padding:24px;display:flex;flex-direction:column;gap:12px}
        .ef-lightbox-vis{width:100%;aspect-ratio:16/10;border-radius:2px;
          display:flex;align-items:center;justify-content:center}
        .ef-lightbox-ico{font-size:2.5rem;opacity:.45}
        .ef-lightbox-meta{display:flex;gap:12px;font-family:'Courier Prime',monospace;
          font-size:.55rem;color:#555;letter-spacing:.1em}
        .ef-lightbox-type{text-transform:uppercase}
        .ef-lightbox-src{text-transform:uppercase;margin-left:auto}
        .ef-lightbox-f1{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:.95rem;color:#c4bcb4;line-height:1.5}
        .ef-lightbox-f2{font-family:'Courier Prime',monospace;font-size:.68rem;color:#555;line-height:1.5}
        .ef-lightbox-credit{font-family:'Courier Prime',monospace;font-size:.58rem;color:#b8974a;letter-spacing:.08em}
        .ef-lightbox-close{align-self:flex-end;background:none;border:1px solid #2a2a2a;color:#444;
          font-family:'Courier Prime',monospace;font-size:.55rem;letter-spacing:.15em;
          padding:4px 14px;cursor:pointer;border-radius:2px;transition:color .15s,border-color .15s}
        .ef-lightbox-close:hover{color:#b8974a;border-color:#b8974a}
        .jnl{padding:16px 20px;display:flex;flex-direction:column;gap:12px}
        .jnl-label{font-family:'Syne',sans-serif;font-weight:700;font-size:.58rem;
          letter-spacing:.18em;text-transform:uppercase;color:#555;padding:0 20px 8px}
        .jnl-prompt{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:.85rem;color:#8a7a6a;line-height:1.6;min-height:48px;display:flex;align-items:center}
        .jnl-compose{display:flex;flex-direction:column;gap:5px}
        .jnl-handle{font-family:'Courier Prime',monospace;font-size:.68rem;color:#b8974a;
          background:#080808;border:1px solid #1a1a1a;padding:5px 10px;border-radius:2px;
          outline:none;transition:border-color .15s}
        .jnl-handle:focus{border-color:#2a2a2a}
        .jnl-handle::placeholder{color:#222}
        .jnl-text{font-family:'Courier Prime',monospace;font-size:.72rem;color:#c4bcb4;
          background:#080808;border:1px solid #1a1a1a;padding:10px 12px;border-radius:2px;
          outline:none;resize:vertical;height:120px;line-height:1.6;transition:border-color .15s}
        .jnl-text:focus{border-color:#2a2a2a}
        .jnl-text::placeholder{color:#222}
        .jnl-submit{align-self:flex-end;background:none;border:1px solid #2a2a2a;color:#555;
          font-family:'Syne',sans-serif;font-weight:600;font-size:.42rem;letter-spacing:.18em;
          text-transform:uppercase;padding:5px 14px;cursor:pointer;border-radius:2px;
          transition:color .15s,border-color .15s}
        .jnl-submit:hover{color:#b8974a;border-color:#b8974a}
        .jnl-feed{display:flex;flex-direction:column;gap:8px;margin-top:4px}
        .jnl-entry{background:#080808;border:1px solid #161616;border-radius:2px;
          padding:10px 12px;display:flex;flex-direction:column;gap:5px}
        .jnl-entry-new{border-color:#0F6E56}
        .jnl-entry-head{display:flex;align-items:center;gap:8px;
          font-family:'Courier Prime',monospace;font-size:.52rem;color:#444;letter-spacing:.08em}
        .jnl-entry-who{color:#b8974a}
        .jnl-entry-ctx{color:#555;font-style:italic}
        .jnl-entry-when{margin-left:auto;color:#2a2a2a}
        .jnl-entry-body{font-family:'Courier Prime',monospace;font-size:.68rem;color:#b8a88a;line-height:1.5}
        .jnl-entry-actions{display:flex;gap:8px;align-items:center}
        .jnl-vote{background:none;border:none;font-family:'Courier Prime',monospace;font-size:.55rem;
          color:#2a2a2a;cursor:pointer;padding:2px 4px;transition:color .15s}
        .jnl-vote:hover{color:#777}
        .jnl-vote-on{color:#b8974a}
        .jnl-undo{background:none;border:1px solid #0F6E56;color:#0F6E56;
          font-family:'Courier Prime',monospace;font-size:.5rem;letter-spacing:.1em;
          padding:3px 10px;cursor:pointer;border-radius:2px;align-self:flex-start;transition:opacity .15s}
        .jnl-undo:hover{opacity:.7}
        .jnl-delete{background:none;border:none;font-family:'Courier Prime',monospace;
          font-size:.5rem;color:#333;cursor:pointer;margin-left:auto;transition:color .15s}
        .jnl-delete:hover{color:#993C1D}
        .jnl-feed-nav{display:flex;align-items:center;justify-content:center;gap:12px;padding-top:2px}
        @media(max-width:720px){
          .ef-grid{grid-template-columns:1fr}
          .ef-root{padding:0 6px}
          .ef-right{position:static;max-height:none;overflow:visible;border-left:none;border-top:1px solid #141414}
          .ef-section-head{padding:10px 16px 0}
          .ef-scroller{padding:8px 16px 0}
          .ef-pills{padding:4px 16px 0}
          .ef-bleed{width:28px}
          .ef-caption{font-size:.75rem}
          .jnl{padding:12px 16px}
          .jnl-text{height:90px}
          .jnl-prompt{font-size:.78rem}
        }
      `}</style>

      <div className="ef-root">
        <div className="ef-grid">
          <div className="ef-left">
            {/* Panel 2 — As It Happened */}
            <div className="ef-section">
              <div className="ef-section-head">
                <span className="ef-label">As It Happened</span>
              </div>
              <ExhibitScroller items={p2Items} activeAlbumId={activeAlbumId}>
                <TypePills tags={P2_TYPES} activeTypes={p2Types} allTags={P2_TYPES}
                  onToggle={toggleType(setP2Types, P2_TYPES)} items={p2EraItems} />
              </ExhibitScroller>
            </div>

            {/* Panel 3 — The Artifacts */}
            <div className="ef-section">
              <div className="ef-section-head">
                <span className="ef-label">The Artifacts</span>
              </div>
              <ExhibitScroller items={p3Items} activeAlbumId={activeAlbumId}>
                <TypePills tags={P3_TYPES} activeTypes={p3Types} allTags={P3_TYPES}
                  onToggle={toggleType(setP3Types, P3_TYPES)} items={p3EraItems} />
              </ExhibitScroller>
            </div>

            {/* Panel 4 — That's a Wrap */}
            <div className="ef-section">
              <div className="ef-section-head">
                <span className="ef-label">That's a Wrap</span>
              </div>
              <ExhibitScroller items={p4Items} activeAlbumId={activeAlbumId}>
                <TypePills tags={P4_TYPES} activeTypes={p4Types} allTags={P4_TYPES}
                  onToggle={toggleType(setP4Types, P4_TYPES)} items={CB_EXIT_FLOW} />
              </ExhibitScroller>
            </div>
          </div>

          <div className="ef-right">
            <div className="jnl-label">The Journal</div>
            <Journal prompts={CB_JOURNAL_PROMPTS} eraFilter={eraFilter} />
          </div>
        </div>
      </div>
    </>
  );
}
