// src/lib/record-read.js — WHAT THIS VISITOR HAS ALREADY READ.
//
// [P4 2026-08-05] Built for the Record's fast-access UNREAD button. Mike:
// "FAST-ACCESS BUTTONS — OLDEST / NEWEST / UNREAD (first unread)."
//
// ─── WHY THIS IS THE ONE SETTING THAT IS NOT SESSION-SCOPED ──────────────────
// P5, given in the same breath, is that the first view of a page in a session
// is the DEFAULT view and a visitor's changes stick FOR THAT SESSION. That rule
// is about the VIEW — where the page is scrolled, how wide a panel was dragged,
// how tall a carousel sits. This is not a view setting. It is a record of what
// the visitor has read, and an unread marker that forgets overnight is not an
// unread marker: it would say "unread" about the entry they finished yesterday,
// which is worse than having no marker at all.
//
// So it sits in `localStorage`, and it is named in the booth's privacy answer
// with the rest of what this site keeps in the visitor's own browser. Nothing
// is transmitted; there is no `fetch` in this file and there never will be.
//
// ─── WHAT A RECORD IS KEYED BY ───────────────────────────────────────────────
// The entry's own NUMBER where it has one, its DATE where it has not, and its
// title as the last resort. Never the index: the Record reads newest-first, so
// an index is a position in a list that reorders itself the day an entry is
// inserted — the same reasoning RecordEntry's newspaper door is built on.

const PREFIX = "wb-read-";

export const readKeyFor = slug => PREFIX + slug;

/** An entry's stable identity, as a string. Null if it has none. */
export function entryKey(en) {
  if (!en) return null;
  if (en.no !== undefined && en.no !== null) return "n" + en.no;
  if (en.date) return "d" + en.date;
  if (en.title) return "t" + en.title;
  return null;
}

/** The set of keys this visitor has opened. Never throws — private mode, a
    disabled store and a corrupted value all mean the same thing here: nothing
    is known about what they have read, which is the honest starting state. */
export function readSet(key) {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}

/** Add one entry to the register and return the new set (a new object, so a
    React state setter sees a change). A no-op for an entry with no identity. */
export function markRead(key, en, current) {
  const id = entryKey(en);
  const next = new Set(current);
  if (!id || next.has(id)) return current;
  next.add(id);
  try { localStorage.setItem(key, JSON.stringify([...next])); }
  catch { /* private mode: the register is in memory for this visit only */ }
  return next;
}

/** The index of the FIRST UNREAD record, in reading order.
 *
 *  `list` arrives NEWEST-FIRST, because that is how a Record presents itself.
 *  Reading order is the other way round — the front desk's own first answer is
 *  "finish the FAQ, then follow The Record", and you follow a record forwards.
 *  So the first unread is the OLDEST one not yet opened, which is the HIGHEST
 *  index. It is where a visitor catching up left off, not the newest thing they
 *  have not seen.
 *
 *  Null when every record has been read — the caller disables the control
 *  rather than sending the visitor somewhere arbitrary. */
export function firstUnread(list, read) {
  for (let i = list.length - 1; i >= 0; i--) {
    const id = entryKey(list[i]);
    if (id && !read.has(id)) return i;
  }
  return null;
}

/** Is this one unread? Used by the index to mark rows. */
export const isUnread = (en, read) => {
  const id = entryKey(en);
  return !!id && !read.has(id);
};
