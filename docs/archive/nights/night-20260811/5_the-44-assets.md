# JOB 5 — THE 44 ASSETS, IN ONE PILE
2026-08-11/12 · **the page is built. I judged nothing.**

---

## THE PAGE

# `C:\AI\_night-20260811\assets.html`

**Double-click it.** No server, no build step, nothing to install. 3.8 MB, one
file, everything embedded.

---

## WHAT IS ON IT

**All 44** — every row in `provenance/asset-table.json` with `role: shipped` and
no `verdict`. I counted them the same way you did: 251 rows in the table, 206
sources, 1 unreferenced, **44 shipped and unjudged.**

Each one carries:

- **the picture**, up to 1000px on the long edge
- **its name** and its full repo path
- **where it is used** — the real `usedBy` list, or *"nothing in the tree names
  it"* when there is nothing
- **its size**, dimensions and format
- **what Ops already wrote about it** — the `what` and the `qualityNote` fields,
  verbatim, or *"nothing noted"*

**Pictures come first, the six recordings last.** They were in table order at
first, which put six audio players at the top and pushed every picture below the
fold — the first screen showed you nothing you could judge by looking.

## THE CONTROLS

**KEEP** and **DELETE** on every card, plus a small **clear** if you change your
mind. A kept card goes green down the left edge; a deleted one goes red and
dims, so you can see at a glance what is left.

**SHOW MY CHOICES AS TEXT** at the top. It writes a plain list into the box at
the bottom of the page — DELETE first, then KEEP, then anything you have not
judged — and selects it for you. **Ctrl+C.** No clipboard call anywhere on the
page; you asked for text you can select, and that is all it does.

**Your choices survive a reload.** They save in the browser as you click, so you
can stop halfway and come back. **start over** wipes them.

## WHAT IT DOES NOT DO

**It writes nothing.** The asset table is read once at build time and never
written. `verdict` is yours; nothing I built can set it.

---

## HOW I CHECKED IT

I could not open it in the browser at `file://` — the extension refuses local
files — so I served the folder on localhost and used the real page in a real
browser. **What that proves and what it does not:**

**Proved by using it:** 44 cards render · all 38 images load and display · KEEP
and DELETE mark the right card · the counter reads 2 of 44 / 1 keep / 1 delete
after two clicks · SHOW MY CHOICES produced a correct 1,122-character list with
DELETE, KEEP and NOT JUDGED sections · the state persisted across a reload · no
horizontal overflow.

**Not proved:** whether Chrome will play the six MP3s when you open the page from
`file://`. The audio elements point at the files on your disk by absolute path.
Over localhost they showed 0:00 as expected — a different origin cannot reach
them. **From `file://` they may well play; if they do not, the full path is on
the card and you can open the file directly.** I have said so on the page rather
than let a silent player look like a broken track.

**Two previews needed a second approach and got one.** `favicon.ico` and one SVG
are formats sharp will not rasterise. Rather than show you a placeholder, the
page embeds those two files whole and lets the browser draw them — the card says
so. **Zero cards show a "could not render" box.**

---

## IF YOU WANT IT REBUILT

`C:\AI\_night-20260811\rebuild-assets-page.mjs` — run it from the museum repo
root (`node C:\AI\_night-20260811\rebuild-assets-page.mjs`) and it regenerates
the page from the current table. It needs `sharp`, which the museum repo already
has.

---

## WHAT I COULD NOT DETERMINE

- **Whether the MP3s play from `file://`.** Untested; the extension cannot open
  local files. The path is on every audio card either way.
- **Whether any of the 44 is actually good.** I did not judge one. `verdict` is
  yours, and I did not write a quality note either — six of the rows already say
  *"not assessed — Ops has not listened to it"*, and I did not improve on that
  by guessing.
- **Whether the 206 `source` rows should also be in front of you.** The packet
  said 44, and 44 is what the table says are shipped and unjudged.

## WHAT NEEDS MIKE

1. **Double-click `C:\AI\_night-20260811\assets.html` and go through the pile.**
2. **Press SHOW MY CHOICES, select the text, Ctrl+C, and paste it back.** I will
   land the deletions.
3. **Tell me if the audio does not play** and I will change how those six are
   presented.
