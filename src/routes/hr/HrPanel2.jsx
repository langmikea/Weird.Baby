import { useState, useEffect, useRef, useCallback } from "react";
import { HR_ARCHIVE } from "../../data/hr_archive.js";
import { HR_JOURNAL_PROMPTS } from "../../data/hr_journal_prompts.js";

// ─── ALBUM → ERA MAP ─────────────────────────────────────────────────────────
const ALBUM_ERA = {
  cracked: "solo", wheel: "solo", dandelions: "solo",
  skipping: "solo", arkansas: "solo", crooked: "solo",
};

// ─── TAG DEFINITIONS ─────────────────────────────────────────────────────────
const ERA_TAGS  = ["seeds", "medusas", "solo"];
const TYPE_TAGS = ["historical", "interview", "rarity"];
const SRC_TAGS  = ["fb", "insta", "press", "archive"];

// Colors match Panel 1 tag system — border + text when active, dim when not
const TAG_COLORS = {
  era:  "#534AB7",
  type: "#0F6E56",
  src:  "#993C1D",
};

function tagLabel(tag) {
  const labels = {
    seeds: "Seeds", medusas: "Medusa's Disco", solo: "Solo",
    historical: "Historical", interview: "Interview", rarity: "Rarity",
    fb: "FB", insta: "Insta", press: "Press", archive: "Archive",
  };
  return labels[tag] || tag;
}

// ─── FILTER HELPER ───────────────────────────────────────────────────────────
// activeTags = { era: Set, type: Set, src: Set }
// Empty set = no filter for that group. Non-empty = item must match one.
function matchesTags(item, activeTags) {
  if (activeTags.era.size  > 0 && !activeTags.era.has(item.era))   return false;
  if (activeTags.type.size > 0 && !activeTags.type.has(item.type)) return false;
  if (activeTags.src.size  > 0 && !activeTags.src.has(item.src))   return false;
  return true;
}

// ─── SEED JOURNAL ENTRIES ────────────────────────────────────────────────────
const SEED_ENTRIES = [
  // ── SOLO ERA ──────────────────────────────────────────────────────────────
  {
    id: 1, date: "2025-11-02", handle: "velvetcassette",
    ctx: "'Town Rat Heathen'", era: "solo", type: "historical", src: "archive",
    fact1: "I heard this in a coffee shop in Philly and made the barista tell me what was playing. Went home and listened to the whole catalog that night.",
    fact2: null, weight: 7, up: 7, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 2, date: "2025-12-14", handle: "rootsfan_pa",
    ctx: "Live at Tellus360", era: "solo", type: "historical", src: "archive",
    fact1: "Third time seeing him live. The room was maybe 40 people and it felt like he was playing for each one individually.",
    fact2: null, weight: 5, up: 5, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 3, date: "2026-01-08", handle: "lampshade_kid",
    ctx: "'Homestead'", era: "solo", type: "historical", src: "archive",
    fact1: "My partner and I listened to this driving through Lancaster County last fall. Now we can't hear it without seeing those fields.",
    fact2: null, weight: 9, up: 9, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 5, date: "2025-09-18", handle: "quiethighway",
    ctx: "'Reverend'", era: "solo", type: "historical", src: "archive",
    fact1: "The video for Reverend is the most cinematic thing I've seen from an independent artist. I keep showing it to people who don't believe me when I say this guy is unsigned.",
    fact2: null, weight: 8, up: 8, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 6, date: "2025-10-03", handle: "nick_would_know",
    ctx: "'My Brother's Bones'", era: "solo", type: "historical", src: "archive",
    fact1: "I lost my brother two years ago. This song found me at exactly the right time. I don't have words for what it did.",
    fact2: null, weight: 11, up: 11, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 7, date: "2026-01-22", handle: "porchlight_kid",
    ctx: "'Silver Lining'", era: "solo", type: "historical", src: "archive",
    fact1: "The reprise at the end of Arkansas hits different after you've been through the whole album. It earns it.",
    fact2: null, weight: 6, up: 6, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 8, date: "2025-06-15", handle: "analog_ears",
    ctx: "'Nothin' Wrong'", era: "solo", type: "historical", src: "archive",
    fact1: "Played this for my therapist. She asked me to play it again. That's all I need to say about it.",
    fact2: null, weight: 10, up: 10, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 9, date: "2026-03-01", handle: "crookedhome25",
    ctx: "'94'", era: "solo", type: "historical", src: "archive",
    fact1: "Opening Crooked Home with a year as a title — that's a statement. You know right away this one is going to cost him something.",
    fact2: null, weight: 5, up: 5, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 10, date: "2025-07-20", handle: "violet_lemke_fan",
    ctx: "Violet Lemke cover", era: "solo", type: "historical", src: "archive",
    fact1: "Found Hunter Root through Violet Lemke's cover. Then I found the original and it ruined me. Now I listen to both.",
    fact2: null, weight: 7, up: 7, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  // ── MEDUSA'S DISCO ERA ────────────────────────────────────────────────────
  {
    id: 4, date: "2026-02-20", handle: "medusa_og",
    ctx: "Medusa's Disco", era: "medusas", type: "historical", src: "archive",
    fact1: "I was at the last Medusa's Disco show. Nobody knew it was the last one until it was. Different energy when you find out later.",
    fact2: null, weight: 6, up: 6, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 11, date: "2025-08-05", handle: "chameleon_regular",
    ctx: "Chameleon Club", era: "medusas", type: "historical", src: "archive",
    fact1: "Used to see Medusa's Disco at the Chameleon all the time. I didn't realize what I was watching until it was already over.",
    fact2: null, weight: 4, up: 4, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  {
    id: 12, date: "2026-03-10", handle: "sleepwalking_md",
    ctx: "Medusa's Disco", era: "medusas", type: "historical", src: "archive",
    fact1: "The energy at those early shows was something else. Nobody was on their phone. Everyone was just there.",
    fact2: null, weight: 5, up: 5, dn: 0, voted: null, mine: false, undoTimer: null,
  },
  // ── SEEDS ERA ─────────────────────────────────────────────────────────────
  {
    id: 13, date: "2025-12-28", handle: "firstlight",
    ctx: "Pre-Hunter Root", era: "seeds", type: "historical", src: "archive",
    fact1: "I knew him before the name. Different songs, same thing in his voice. You could always hear it.",
    fact2: null, weight: 3, up: 3, dn: 0, voted: null, mine: false, undoTimer: null,
  },
];

// ─── UNIFIED TAG BAR ─────────────────────────────────────────────────────────
// Tags are independent toggles — multiple per group allowed.
// Styled to match Panel 1 tracklist tags (tl-tag).
function TagBar({ activeTags, onToggle }) {
  const groups = [
    { key: "era",  tags: ERA_TAGS },
    { key: "type", tags: TYPE_TAGS },
    { key: "src",  tags: SRC_TAGS },
  ];

  return (
    <div className="p2-tagbar">
      {groups.map((g, gi) => (
        <div key={g.key} className="p2-tagbar-group">
          {gi > 0 && <div className="p2-tagbar-divider" />}
          {g.tags.map(tag => {
            const isActive = activeTags[g.key].has(tag);
            const color = TAG_COLORS[g.key];
            return (
              <button
                key={tag}
                className={`p2-tag${isActive ? " p2-tag-sel" : " p2-tag-dim"}`}
                style={isActive ? { borderColor: color, color: color } : {}}
                onClick={() => onToggle(g.key, tag)}
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

// ─── ARCHIVE SCROLLER ────────────────────────────────────────────────────────
function ArchiveScroller({ items }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const timerRef = useRef(null);
  const hoverRef = useRef(false);

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  const count = sorted.length;

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
      <div className="p2-archive">
        <div className="p2-archive-empty">No artifacts match these filters.</div>
      </div>
    );
  }

  const item = sorted[idx % count];

  // Wrapping navigation — never disabled, always loops
  function prev() { setIdx((idx - 1 + count) % count); startTimer(); }
  function next() { setIdx((idx + 1) % count); startTimer(); }

  return (
    <div
      className="p2-archive"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* Visual card — click opens lightbox */}
      <div className="p2-archive-card" onClick={() => setLightbox(item)}>
        <div className="p2-archive-placeholder" style={{ background: item.color }}>
          <span className="p2-archive-icon">{item.icon}</span>
        </div>
      </div>

      {/* Caption + controls below content */}
      <div className="p2-archive-caption">{item.fact1}</div>

      {/* Controls — always visible, wraps at ends */}
      <div className="p2-archive-controls">
        <button className="p2-archive-btn" onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
        <span className="p2-archive-counter">{idx + 1} / {count}</span>
        <button className="p2-archive-btn" onClick={e => { e.stopPropagation(); next(); }}>›</button>
      </div>

      {/* Progress bar */}
      <div className="p2-archive-progress">
        <div className="p2-archive-progress-fill" style={{ width: `${((idx + 1) / count) * 100}%` }} />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="p2-lightbox" onClick={() => setLightbox(null)}>
          <div className="p2-lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="p2-lightbox-placeholder" style={{ background: lightbox.color }}>
              <span className="p2-lightbox-icon">{lightbox.icon}</span>
            </div>
            <div className="p2-lightbox-meta">
              <span className="p2-lightbox-type">{tagLabel(lightbox.type)}</span>
              <span className="p2-lightbox-date">{lightbox.date}</span>
              <span className="p2-lightbox-src">{tagLabel(lightbox.src)}</span>
            </div>
            <div className="p2-lightbox-fact1">{lightbox.fact1}</div>
            {lightbox.fact2 && <div className="p2-lightbox-fact2">{lightbox.fact2}</div>}
            <button className="p2-lightbox-close" onClick={() => setLightbox(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JOURNAL ─────────────────────────────────────────────────────────────────
export function Journal({ prompts, activeTags }) {
  const [entries, setEntries]       = useState(SEED_ENTRIES);
  const [handle, setHandle]         = useState("");
  const [text, setText]             = useState("");
  const [promptIdx, setPromptIdx]   = useState(0);
  const [feedIdx, setFeedIdx]       = useState(0);
  const promptTimerRef = useRef(null);
  const feedTimerRef   = useRef(null);
  const hoverRef       = useRef(false);
  const nextIdRef      = useRef(100);

  // Filter entries by active tags (Set-based: empty = no filter)
  const filtered = entries.filter(e => matchesTags(e, activeTags));

  // Weighted random order
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
  }, [filtered.length, activeTags]);

  // Prompt rotation
  useEffect(() => {
    clearInterval(promptTimerRef.current);
    promptTimerRef.current = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % prompts.length);
    }, 9500);
    return () => clearInterval(promptTimerRef.current);
  }, [prompts.length]);

  // Feed auto-advance
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
      id: nextIdRef.current++,
      date: new Date().toISOString().slice(0, 10),
      handle: h, ctx: null, era: "solo", type: "historical", src: "archive",
      fact1: text.trim(), fact2: null,
      weight: 1, up: 0, dn: 0, voted: null, mine: true, undoTimer: 10,
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
          weight: Math.max(1, (dir === "up" ? e.up - 1 : e.up) * 2 - (dir === "dn" ? e.dn - 1 : e.dn) + 1),
        };
      }
      const prevUp = e.voted === "up" ? e.up - 1 : e.up;
      const prevDn = e.voted === "dn" ? e.dn - 1 : e.dn;
      const newUp = dir === "up" ? prevUp + 1 : prevUp;
      const newDn = dir === "dn" ? prevDn + 1 : prevDn;
      return { ...e, voted: dir, up: newUp, dn: newDn,
        weight: Math.max(1, newUp * 2 - newDn + 1),
      };
    }));
  }

  const prompt = prompts[promptIdx % prompts.length];
  const feedOrder = weighted.current;
  const feedEntry = feedOrder.length > 0 ? filtered[feedOrder[feedIdx % feedOrder.length]] : null;

  return (
    <div
      className="p2-journal"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* Prompt scroller — always two lines, sentence per line */}
      <div className="p2-journal-prompt">
        <div className="p2-journal-prompt-text">
          {prompt?.line1}<br />
          {prompt?.line2}
        </div>
      </div>

      {/* Entry composition — large textarea fills available space */}
      <div className="p2-journal-compose">
        <input
          className="p2-journal-handle"
          type="text"
          placeholder="your handle"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          maxLength={24}
        />
        <textarea
          className="p2-journal-textarea"
          placeholder="Leave your mark..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
        />
        <button className="p2-journal-submit" onClick={submitEntry}>Leave it</button>
      </div>

      {/* Feed */}
      <div className="p2-journal-feed">
        {entries.filter(e => e.undoTimer !== null).map(e => (
          <div key={e.id} className="p2-journal-entry p2-journal-entry-new">
            <div className="p2-journal-entry-header">
              <span className="p2-journal-entry-handle">{e.handle}</span>
              <span className="p2-journal-entry-date">{e.date}</span>
            </div>
            <div className="p2-journal-entry-text">{e.fact1}</div>
            <button className="p2-journal-undo" onClick={() => undoEntry(e.id)}>
              Undo ({e.undoTimer}s)
            </button>
          </div>
        ))}

        {feedEntry && feedEntry.undoTimer === null && (
          <div className="p2-journal-entry">
            <div className="p2-journal-entry-header">
              <span className="p2-journal-entry-handle">{feedEntry.handle}</span>
              {feedEntry.ctx && <span className="p2-journal-entry-ctx">{feedEntry.ctx}</span>}
              <span className="p2-journal-entry-date">{feedEntry.date}</span>
            </div>
            <div className="p2-journal-entry-text">{feedEntry.fact1}</div>
            <div className="p2-journal-entry-actions">
              <button
                className={`p2-vote${feedEntry.voted === "up" ? " p2-vote-active" : ""}`}
                onClick={() => vote(feedEntry.id, "up")}
              >&#9650; {feedEntry.up}</button>
              <button
                className={`p2-vote${feedEntry.voted === "dn" ? " p2-vote-active" : ""}`}
                onClick={() => vote(feedEntry.id, "dn")}
              >&#9660; {feedEntry.dn}</button>
              {feedEntry.mine && (
                <button className="p2-journal-delete" onClick={() => deleteEntry(feedEntry.id)}>delete</button>
              )}
            </div>
          </div>
        )}

        {feedOrder.length > 1 && (
          <div className="p2-journal-feed-controls">
            <button className="p2-archive-btn"
              onClick={() => setFeedIdx(prev => (prev - 1 + feedOrder.length) % feedOrder.length)}
            >‹</button>
            <span className="p2-archive-counter">
              {(feedIdx % feedOrder.length) + 1} / {feedOrder.length}
            </span>
            <button className="p2-archive-btn"
              onClick={() => setFeedIdx(prev => (prev + 1) % feedOrder.length)}
            >›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PANEL 2 ROOT ────────────────────────────────────────────────────────────
export default function HrPanel2({ activeAlbumId }) {
  // Set-based multi-select: empty Set = no filter
  const [activeTags, setActiveTags] = useState({
    era: new Set(), type: new Set(), src: new Set(),
  });
  const prevAlbumRef = useRef(activeAlbumId);

  // When active album changes, auto-set era (additive, not exclusive)
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

  const filteredArchive = HR_ARCHIVE.filter(item => matchesTags(item, activeTags));

  return (
    <>
      <style>{`
        /* ── PANEL 2 ─────────────────────────────────────────────── */
        .p2-root{border-top:1px solid #181818;padding:0 0 24px}

        /* TAG BAR — matches Panel 1 tl-tag style */
        .p2-tagbar{display:flex;align-items:center;gap:3px;padding:14px 20px 10px;flex-wrap:wrap}
        .p2-tagbar-group{display:grid;grid-auto-flow:column;grid-auto-columns:auto;gap:3px}
        .p2-tagbar-divider{width:1px;height:16px;background:#1a1a1a;margin:0 6px;flex-shrink:0}
        .p2-tag{font-family:'Syne',sans-serif;font-weight:600;font-size:.42rem;letter-spacing:.1em;
          padding:2px 8px;background:transparent;border:1px solid transparent;
          cursor:pointer;border-radius:1px;transition:color .15s,border-color .15s;
          text-align:center;white-space:nowrap}
        .p2-tag-sel{opacity:1}
        .p2-tag-dim{color:#363636 !important;border-color:transparent !important}
        .p2-tag:hover{color:#999 !important;border-color:#444 !important}

        /* COLUMNS */
        .p2-columns{display:grid;grid-template-columns:60% 40%;min-height:360px;border-top:1px solid #141414}
        .p2-col{display:flex;flex-direction:column}
        .p2-section-label{font-family:'Syne',sans-serif;font-weight:600;font-size:.4rem;
          letter-spacing:.18em;text-transform:uppercase;color:#2a2a2a;padding:14px 20px 0}

        /* ARCHIVE */
        .p2-archive{padding:16px 20px;display:flex;flex-direction:column;gap:12px;border-right:1px solid #141414}
        .p2-archive-empty{font-family:'Courier Prime',monospace;font-size:.75rem;color:#333;padding:40px 0;text-align:center}
        .p2-archive-card{cursor:pointer;transition:opacity .2s}
        .p2-archive-card:hover{opacity:.85}
        .p2-archive-placeholder{width:100%;aspect-ratio:16/10;border-radius:2px;display:flex;
          align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.04)}
        .p2-archive-icon{font-size:2.5rem;opacity:.5}
        .p2-archive-caption{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:.85rem;color:#b8a88a;line-height:1.5;margin-top:8px}

        /* Archive controls — always visible, always wrap */
        .p2-archive-controls{display:flex;align-items:center;justify-content:center;gap:12px}
        .p2-archive-btn{background:#0e0e0e;border:1px solid #252525;color:#505050;cursor:pointer;
          font-size:1rem;width:28px;height:28px;display:flex;align-items:center;justify-content:center;
          border-radius:2px;transition:color .15s,border-color .15s;font-family:'Courier Prime',monospace}
        .p2-archive-btn:hover{color:#b8974a;border-color:#b8974a}
        .p2-archive-counter{font-family:'Courier Prime',monospace;font-size:.6rem;color:#444;
          letter-spacing:.12em;min-width:40px;text-align:center}
        .p2-archive-progress{height:2px;background:#141414;border-radius:1px;overflow:hidden}
        .p2-archive-progress-fill{height:100%;background:#b8974a33;transition:width .3s ease}

        /* LIGHTBOX */
        .p2-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;
          display:flex;align-items:center;justify-content:center;padding:24px}
        .p2-lightbox-inner{background:#0e0e0e;border:1px solid #222;border-radius:4px;
          max-width:520px;width:100%;padding:24px;display:flex;flex-direction:column;gap:12px}
        .p2-lightbox-placeholder{width:100%;aspect-ratio:16/10;border-radius:2px;
          display:flex;align-items:center;justify-content:center}
        .p2-lightbox-icon{font-size:3rem;opacity:.5}
        .p2-lightbox-meta{display:flex;gap:12px;font-family:'Courier Prime',monospace;
          font-size:.6rem;color:#666;letter-spacing:.1em}
        .p2-lightbox-type{text-transform:uppercase}
        .p2-lightbox-src{text-transform:uppercase;margin-left:auto}
        .p2-lightbox-fact1{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:1rem;color:#c4bcb4;line-height:1.5}
        .p2-lightbox-fact2{font-family:'Courier Prime',monospace;font-size:.72rem;color:#666;line-height:1.5}
        .p2-lightbox-close{align-self:flex-end;background:none;border:1px solid #333;color:#555;
          font-family:'Courier Prime',monospace;font-size:.6rem;letter-spacing:.15em;
          padding:4px 14px;cursor:pointer;border-radius:2px;transition:color .15s,border-color .15s}
        .p2-lightbox-close:hover{color:#b8974a;border-color:#b8974a}

        /* JOURNAL */
        .p2-journal{padding:16px 20px;display:flex;flex-direction:column;gap:12px}

        /* Prompt — forced two-line rhythm */
        .p2-journal-prompt{min-height:56px;display:flex;align-items:center}
        .p2-journal-prompt-text{font-family:'DM Serif Display',Georgia,serif;font-style:italic;
          font-size:.9rem;color:#8a7a6a;line-height:1.6}

        /* Compose — fixed size, user can resize vertically */
        .p2-journal-compose{display:flex;flex-direction:column;gap:6px}
        .p2-journal-handle{font-family:'Courier Prime',monospace;font-size:.7rem;color:#b8974a;
          background:#0a0a0a;border:1px solid #1e1e1e;padding:6px 10px;border-radius:2px;
          outline:none;transition:border-color .15s}
        .p2-journal-handle:focus{border-color:#333}
        .p2-journal-handle::placeholder{color:#2a2a2a}
        .p2-journal-textarea{font-family:'Courier Prime',monospace;font-size:.78rem;color:#c4bcb4;
          background:#0a0a0a;border:1px solid #1e1e1e;padding:10px 12px;border-radius:2px;
          outline:none;resize:vertical;height:140px;line-height:1.6;transition:border-color .15s}
        .p2-journal-textarea:focus{border-color:#333}
        .p2-journal-textarea::placeholder{color:#2a2a2a}
        .p2-journal-submit{align-self:flex-end;background:none;border:1px solid #333;color:#666;
          font-family:'Syne',sans-serif;font-weight:600;font-size:.5rem;letter-spacing:.18em;
          text-transform:uppercase;padding:6px 16px;cursor:pointer;border-radius:2px;
          transition:color .15s,border-color .15s}
        .p2-journal-submit:hover{color:#b8974a;border-color:#b8974a}

        /* JOURNAL FEED */
        .p2-journal-feed{display:flex;flex-direction:column;gap:8px;margin-top:8px}
        .p2-journal-entry{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:2px;
          padding:10px 12px;display:flex;flex-direction:column;gap:6px}
        .p2-journal-entry-new{border-color:#0F6E56}
        .p2-journal-entry-header{display:flex;align-items:center;gap:8px;
          font-family:'Courier Prime',monospace;font-size:.58rem;color:#555;letter-spacing:.08em}
        .p2-journal-entry-handle{color:#b8974a}
        .p2-journal-entry-ctx{color:#666;font-style:italic}
        .p2-journal-entry-date{margin-left:auto;color:#333}
        .p2-journal-entry-text{font-family:'Courier Prime',monospace;font-size:.72rem;
          color:#c4bcb4;line-height:1.5}
        .p2-journal-entry-actions{display:flex;gap:8px;align-items:center}
        .p2-vote{background:none;border:none;font-family:'Courier Prime',monospace;font-size:.6rem;
          color:#333;cursor:pointer;padding:2px 4px;transition:color .15s}
        .p2-vote:hover{color:#888}
        .p2-vote-active{color:#b8974a}
        .p2-journal-undo{background:none;border:1px solid #0F6E56;color:#0F6E56;
          font-family:'Courier Prime',monospace;font-size:.55rem;letter-spacing:.1em;
          padding:3px 10px;cursor:pointer;border-radius:2px;align-self:flex-start;transition:opacity .15s}
        .p2-journal-undo:hover{opacity:.7}
        .p2-journal-delete{background:none;border:none;font-family:'Courier Prime',monospace;
          font-size:.55rem;color:#444;cursor:pointer;margin-left:auto;transition:color .15s}
        .p2-journal-delete:hover{color:#993C1D}
        .p2-journal-feed-controls{display:flex;align-items:center;justify-content:center;gap:12px;padding-top:4px}

        @media(max-width:720px){
          .p2-columns{grid-template-columns:1fr}
          .p2-archive{border-right:none;border-bottom:1px solid #141414}
          .p2-section-label{padding:10px 16px 0}
          .p2-tagbar{padding:10px 16px 8px}
          .p2-archive,.p2-journal{padding:12px 16px}
          .p2-journal-textarea{height:100px}
          .p2-journal-prompt-text{font-size:.82rem}
        }
      `}</style>

      <div className="p2-root">
        <TagBar activeTags={activeTags} onToggle={toggleTag} />
        <div className="p2-columns">
          <div className="p2-col">
            <div className="p2-section-label">As It Happened</div>
            <ArchiveScroller items={filteredArchive} />
          </div>
          <div className="p2-col">
            <div className="p2-section-label">The Journal</div>
            <Journal prompts={HR_JOURNAL_PROMPTS} activeTags={activeTags} />
          </div>
        </div>
      </div>
    </>
  );
}
