# JOB 0 — THE LOBBY PACKET, FINISHED
2026-08-11/12 · **WRITE** · not committed, not pushed, not deployed
HEAD `6897b5c`. The packet is the four files already uncommitted plus this round.

---

## WHAT IS ON THE GLASS NOW

Capture: `C:\AI\_manual-samples-20260811\_FOR_CLAUDE\01_LOBBY_after-the-three-rulings.jpg`
(real desktop viewport, 1920×841, no zoom, no stretch)

The left column is the wordmark, **WEIRD.BABY MUSEUM**, and the directory.
The right column is two sentences and the guest book.

> The museum is open.
> A new <u>Record</u> every day for ninety days.

---

## 0a — THE TAGLINE IS GONE

**Struck:** `something is being built here` — `WbHome.jsx:627`, a blinking
Courier line under the wordmark.

It was the second not-open-yet claim on the screen, about 200px from *"The
museum is open."* A room cannot be open on the right and under construction on
the left.

**What went with it, because nothing else used them:** the `.wb-tagline` rule and
the `@keyframes blink` it was the only user of. The `.wb-subtitle` comment above
it described itself as *"one step up from the tagline"* — a sentence about a
thing that no longer exists — and was rewritten.

**The gap it left closed itself.** The subtitle now sits under the wordmark and
the directory follows. Nothing shifted sideways; nothing else was moved to
compensate.

---

## 0b — THE GUEST BOOK CONFIRMATION

**Was:** `You're in the book. Welcome, Founding Visitor.`
**Now:** `You're in the book.`

**What replaced the struck clause is nothing, and that is the decision rather
than an omission.**

"Founding Visitor" paid a visitor for arriving *before* the doors opened. The
doors are open Monday, so the line is now either untrue or it makes every
visitor for ninety days a founder — which is the same as making none of them one.

The obvious alternative was a second sentence giving them a reason to come back.
I did not write one, for two reasons: it would be **a new sentence in your voice
that you did not say**, and the reason to come back is already 200px above it —
with a door in it now.

**If you want a second sentence there, that is one line and I will land it.**

**Not photographed, and I am saying so:** the confirmation only renders after a
signature, and signing writes a real row to the guest book. I read it in source
and in the built bundle instead of writing a fake entry to your book.

---

## 0c — ONE WORD, ONE LINK

The word **Record** in your second sentence is now a link to `/robots/record`.

**Verified by clicking it, not by reading it.** The click landed on
`/robots/record` with the Record open — Records 001 and 002 present in the index.

- Same face, same size, same colour as the sentence around it. Only an underline.
- No banner, no button, no board row. **The directory is untouched — six rooms,
  same six.** L1 struck a *directory row*; this is not one.
- Your sentence is unchanged to the character.

**One defect found by looking, that reading would not have caught.** The first
draft made the hover state `--wb-gold`. On this page `--wb-gold` computes to
`#211f1c` against body text at `#2b2924` — a ten-unit shift **nobody can see**.
The token is named for the old gold palette and no longer says what it paints.
The underline now rests in mid-grey and darkens and thickens on hover, and the
word itself never changes colour.

---

## GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build | green |
| launch build | green |
| provenance:gate | **PASS** |
| reveal:check | PASS |
| parity:gate | PASS |
| instory:gate | PASS |
| assets:orphans | 0 rows |
| reveal:day | nothing to move |

**Provenance:** 2 stale rows pruned (`something is being built here`, the old
confirmation). **Inbound `r:` chains checked on both before pruning — neither is
referenced by any other row.** 4 rows added. Your second sentence is three rows
instead of one now, because the sweep reads each JSX text fragment separately
and the linked word is its own fragment; all three are filed MIKE against the
same ruling, and the sentence on the glass is unchanged.

---

## WHAT I COULD NOT DETERMINE

- **Whether the guest-book confirmation should say anything more.** I struck the
  false half and did not invent a replacement. That is a content call.
- **How the confirmation looks in place.** Rendering it requires signing the
  book, which writes a real row. Verified in source and in the built bundle only.
- **The 1216/390px lap.** One Chrome tab lost its viewport to a docked panel
  mid-session (reported 433×84). I moved to a clean tab for the capture above
  rather than stretch a window to fake a full page. The lobby was measured at a
  real 1920×841; the two-width lap has not been run on this change.

## WHAT NEEDS MIKE

1. **Nothing blocks the packet.** All gates green. It is ready to commit.
2. **Optional:** a second sentence for the guest-book confirmation, if
   `"You're in the book."` alone reads too bare to you. One line from you and it
   lands.
