# THE BOOT'S REASON — a range to point at (2026-09-18)

Follows `docs/OLD-RULINGS-SWEEP-20260918.md` section 3 and his 09-18 words:
the machine arrives awake; the boot is reserved for somebody who chooses it,
with a reason in the manual and an Easter egg, maybe how you make the unit
your own. Rough, on stand-in words. Nothing here is built.

The page he looks at: `docs/desk/boot-reason-range/RANGE.html` (each example
as the manual's sentence and the glasses a visitor would see; `npm run mock`
serves it, or open the file).

## What a visitor can already do (robots `tools/viiip_twin.html`)

- POWER off and on: `Boot_Level_3`, short, ends on SYSTEM OK.
- The Welcome message's link: `Sandbox_Replay()`, the install re-run with
  SANDBOX on the glass, nothing written. Ruled 07-26 an egg-hosting surface
  ("add them to the replay, not to the boot").
- Settings, User, Name; Settings, User, Record (five pages, shake to purge).
- The `first-run` recipe reaches `Boot_Offer()`: EXTRA CONTENT IS AVAILABLE,
  DOWNLOAD NOW / DOWNLOAD LATER. Nothing may skip it (08-21).
- No reason for any of it is written anywhere; the manual is offline (M61).

## The three reasons

| | the reason | what comes back | Ops builds | makes it yours |
|---|---|---|---|---|
| **A** the remedy | "switch it off at the rear, count ten, switch it on; it will examine itself and report" | the show; one boot in a few, a line nobody else has seen | almost nothing: egg lines and one manual page | no |
| **B** the delivery | "new material reaches the instrument by line; restart to receive it" | the day's program, seen arriving (the Downloads Fiction as payload) | small: the browser remembers the last day it saw | a little |
| **C** making it yours | "the instrument reaches you with no personality on file; perform the personality download; it restarts and asks you one question" | the machine answers as that character, and still does next visit | the most: a Personality row, each character's answers as it appears, the choice remembered | yes; it is the canon's own SOP |

B's catch: a stranger from a reel must find the day's program already there
(no dead ends), so the delivery only plays for a returning visitor and gates
nothing.

C stands on rulings already made (09-02, 24·F1, F3, F4): the first run is
longer and shows things once; the download is whenever the owner likes; a
numbered unit's code ceremony is at the download. Canon: units ship generic,
the customer performs the personality download, a persona's bias activates
when its personality downloads.

Not either-or. A can stand on day 2 (`twin.boot`) with nothing else built.

## Where unit 0.4 could hide

Ruled 09-18: "a great mini easter-egg"; nothing announces it.

1. **In what the chosen boot gives back.** One self-check line for one beat:
   UNIT 0.4 / REGISTRY OK. Only somebody who boots sees it.
2. **In a line of the manual**, paired with one new row on the record page:
   "Instruments are numbered 01 to 31. If yours reports any other number,
   keep it." and YOUR RECORD, UNIT 0.4.
3. **In the unit before it is yours.** No personality chosen, or the record
   purged: NO PERSONALITY ON FILE, then UNIT 0.4. The Prototype is the
   machine with nobody in it. Needs reason C.

All glass words and manual sentences above that are new are stand-ins for
his pen.

## For Mike, one pointing

Which reason goes in the manual first: A, B or C? More than one is allowed.
The hiding place is a second pointing.

## Pointed at, 2026-09-18

Mike: **C**, in his own shape (his words are in `docs/desk/BOARD-DECISIONS.md`).
He asked first whether the question was about the twin or actual units: the
twin. A shipped unit is not a launch question, and its download is already
ruled (09-02, 24·F3 and F4).

- The twin arrives awake in a **limited guest account left over from
  testing**, and says so.
- The **BIST** (built-in self test) notices, and asks **REMAIN IN TEST MODE**,
  maybe quite quickly.
- The machine may **pester** over time until the visitor takes the plunge and
  reboots.
- The reboot loads **the Prototype**, which only loads into the prototype, and
  the visitor is told it is the whole thing.
- **Another reboot returns to the guest account.** Nothing is risked.
- **UNIT 0.4 is the moniker**, on the twin as an embossed label-maker strip of
  the period. This settles the hiding place: the number is on the machine;
  no label says the word Prototype.

Open, his to say: what the guest account lacks. Every released program must
still run for a stranger from a reel (no dead ends), so "limited" cannot
mean a program is missing.

**Answered 09-18: "Yes"** to: the guest account runs everything and keeps
nothing (no name, no score, no messages, generic answers); the full account
keeps them and answers as the Prototype.

## Built rough, 2026-09-18 (evening)

Robots `tools/viiip_twin.html` is master; the museum's `public/robots/twin.html`
is its copy. Seen on the dev server, `/robots/twin.html?preset=arrive&at=twin.game.blackjack`:

1. Arrives awake on Blackjack, as a guest. The inbox is empty.
2. After a minute (or two asks) the front glass reads REMAIN IN TEST MODE?
   with YES - STAY A GUEST / NO - RESTART.
3. NO: the machine goes dark, boots, dials, reads UNIT 0.4 / PROTOTYPE RECORD,
   then EVERYTHING LOADED / NOTHING HELD BACK, then UNIT 0.4 / FULL ACCOUNT.
   Back on Blackjack; two messages have arrived.
4. POWER off and on: the boot ends on LOAD WHICH ACCOUNT, UNIT 0.4 or
   GUEST - TEST MODE. Choosing the guest: the full account's score stays in
   the browser, and the guest sees none of it.

How it works: everything the twin holds about a person goes through
`Kept_Get / Kept_Set / Kept_Del`; in the guest account a read finds nothing
and a write goes nowhere. `wbr_account` is empty, "full" or "guest". A purge
also forgets the account. The self test's notes (6, 15, 40 asks) are the only
mail a guest gets; click restarts. `bist=off` in the address shuts the menu
question and the notes; `tools/reels-feature.py` sends it.

Every word on the glass is a stand-in for his pen. Not built: the Prototype's
own answers (none exist); the inbox is not rebuilt when the account changes
mid-visit; the UNIT 0.4 label strip on the plate.
