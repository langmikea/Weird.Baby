# THE CULL — round log, 2026-08-08

**Scope, said first because it is the honest part: C1 and C2 are done completely.
C3 (rebuild the artifact tracker as a light table) and C4 (the preamble audit)
are NOT done and are not half-done — see §5.**

Gates: lint **11/9 = baseline** · build **green** · `provenance:gate` **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate` **PASS** ·
`assets:orphans` **0** · `reveal:day` **nothing to move**.

---

## §1 — C1: WHAT DIED

**Eleven files. 725 KB.** Deleted from `C:\AI\Projects\weird-baby-robots`.

**The six burp frames** — `content/burps/derived/`
`IMG_9766__first.jpg` · `IMG_9766__mid.jpg` · `IMG_9767__first.jpg` ·
`IMG_9767__mid.jpg` · `IMG_9768__first.jpg` · `IMG_9768__mid.jpg`

**The five 2021 plates** — `robots/mgk-viii/plates/2021-03-19/`
`MAGIC8-2021-P02-the-shoulder.jpg` · `MAGIC8-2021-P04-the-hand-on-control.jpg` ·
`MAGIC8-2021-P06-the-core.jpg` · `MAGIC8-2021-P07-the-output-row.jpg` ·
`MAGIC8-2021-P08-the-meltdown.jpg`

**This is the only place they are named.** Under C2 they are gone from the asset
table, from `PLATES.md`, from the contact sheet and from every tracker.

### How each was determined, mechanically

**Video-derived** was provable two ways and only two ways:
- **stem match to a video in the same tree** — every burp frame is `IMG_97xx__*`
  beside `content/burps/processed/IMG_97xx.MP4`.
- **the directory's own provenance file** — `PLATES.md` states the six 2021
  plates were *"harvested from `IMG_1526.MOV`, the 2021 build video"*, and
  separately that they are *"not wired into the exhibit."*

**Not in use** was determined by reading, not by trusting a field: every
basename was grepped across **both repositories** — 691 source, data, ledger and
document files — and classified by what referenced it.

## §2 — WHAT SURVIVED, AND WHY

| kept | why |
|---|---|
| `MAGIC8-2021-P01-the-eye.jpg` | **assigned to an egg** — referenced by `reveal/ledger-declare.mjs` and `reveal/ledger.json`. Mike's own KEEP clause. |
| the three `IMG_97xx.wav` and the three `IMG_97xx.MP4` | sources, not stills pulled from video |
| the 61 manual pages, the build audio, every cover, plate and face image | not video-derived at all |

**THE GLOVE VIDEOS ARE NOT IN EITHER REPOSITORY.** Mike's KEEP clause names them
first. A search of both trees finds **no file whose name contains "glove" and no
`.MOV` at all** — the only videos anywhere are the three burp `.MP4`s. Nothing
was kept or killed on that clause because there was nothing to apply it to; if
the glove material exists it is somewhere neither repo can see.

## §3 — WHAT WAS NOT DELETED, AND IS LISTED FOR HIM

**The 27 calibration frames** — `content/burps/derived/_cal/IMG_97xx__s0…s8.jpg`,
nine per video.

They are provably video-derived. They are referenced by exactly one thing:
**`_cal/cal.json`, their own sidecar manifest, which nothing in either repository
reads.** So on one reading they are referenced and stay; on the other the
reference is a list *of* them and they go.

**C1 says: if a file's origin cannot be determined mechanically, do not delete
it.** The origin here is certain; what is not mechanical is whether a manifest
that nothing reads counts as use — and that is a judgement, on 27 files, in one
direction only. **One word takes them** (they are 9 frames × 3 videos of the same
three seconds, plus `cal.json` and the `_cal` folder). Register row `C-a`.

**AND THE `usedBy` FIELD WOULD HAVE GOT THIS WRONG.** The asset table's `usedBy`
is **empty on every one of the 139 robots-repo rows** — including the 61 manual
pages, which are in use and which `reveal:check` counts on every packet. A cull
keyed on `usedBy`, which is the obvious mechanical reading of "no asset-table row
references it", **would have deleted the manual.** That is why the reference scan
was done from source rather than from the table, and it is the finding of the
round.

## §4 — C2: THE STANDING RULE, AND IT WAS APPLIED TO THE REGISTER

> **Once he says get rid of something, HE NEVER WANTS TO SEE IT AGAIN. Anything
> ruled crap or irrelevant is removed from his view for good — not archived where
> it resurfaces, not listed in a tracker, not carried in a register as a closed
> row he has to scroll past.**

`OPERATIONS.md` §7 **Doctrine 24**. Applied the same day, to the register itself:

| | before | after |
|---|---|---|
| `docs/OPEN_ACTIONS.md` | **801 lines** | **386 lines** |
| closed / done / answered rows in his view | 59 | **0** |
| struck-through short-list rows | 14 | **0** |
| whole `## … CLOSED IN <round>` sections | 8 | **0** |

**More than half of the one page he was told is the ONE place he looks was
finished business.** It is in `docs/OPEN_ACTIONS_CLOSED.md`, which is **Ops'
history and is deliberately not on the Ops desk** — the answer to *did we already
rule on this*, one grep away, and on no page he opens. If it ever acquires a link
from a page he opens, the rule has been broken.

**67 dead intra-file links were flattened to plain text** rather than left
pointing at anchors that had moved — the register's own prune hazard (§9's
CHECK ANCHORS → REPOINT → PRUNE → RE-GATE), applied inside one file.

**One stale row went with them:** `M36` carried the status `OPEN` and a body
reading *CLOSED P2 BY DELETION*. It has been finished since P2.

## §5 — C3 AND C4 ARE NOT DONE, AND THAT IS A SCOPE CALL RATHER THAN AN OVERSIGHT

**C3 — rebuild the artifact tracker as a light table** — is a build: a thumbnail
for every artifact, a viewer behind each one, the metadata demoted under the
picture, the preamble cut. **C4** is the same test applied to seven other Ops
pages.

They are not started. The reason is capacity in this session, and the choice
between them and C1 was not close: **C1 is irreversible and C3 is not.** A cull
done carelessly cannot be undone; a tracker rebuilt next round is a tracker
rebuilt next round. Half a light table — thumbnails with no viewer, or a viewer
over a page that still opens with three paragraphs — would have been worse than
none, and it would have made the next round's job harder rather than easier.

**What the next round inherits, already done:** the cull is complete, so the
tracker it rebuilds is over the right set of files; and Doctrine 24 is recorded,
so the rebuild starts from *cut it* rather than from *should we cut it*.
