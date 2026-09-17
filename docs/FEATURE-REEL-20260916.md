# THE FEATURE OF THE DAY REEL — the story first (2026-09-16, evening)

Mike's brief, verbatim in shape, cleaned:

> Monitor appears on screen. Channel 3 selected by mouse cursor. Twin appears
> on monitor. Maybe show the MONITOR in the top half of the reel and a close-up
> below. Unseen forces scroll and click through the menu, arriving at the
> target. This builds familiarity, exposes other folders. The play or execution
> demo is performed. Game cuts will be required (not a real-time demo). The
> transitions must make sense and not feel rushed: not lollygagging, not
> racing. Script a story first. Review the output before presenting.

## 1. What the reel is

One feature of the machine a day, shown the way a visitor meets it on the
site: on the Portal's monitor, through the machine's own menu, by the only two
controls it has. Same except data: the template is the Portal, the monitor,
the cursor and the two chyrons; the data is the feature (its menu path and
what is done once there). The visitor who watches it can do exactly this on
weird.baby/robots the same day.

## 2. The frame

9:16, 1080 x 1920, greyscale like every reel of the house, the pop first.

- **Top half: the monitor.** The Portal's CRT as the site draws it, cropped to
  the bezel: 1080 wide, about 800 tall, sat in the upper half with dark
  around it. Everything on it is the site's own rendering, captured from a
  headless browser at 30 fps. The cursor is a drawn arrow that lives inside
  the page, so it is always in the picture and always in sync.
- **Bottom half: the close-up.** The glass the story is on, drawn from the
  twin's own framebuffer (its canvas pixels, nearest-neighbour, 128 x 64 at
  eight times), not zoomed out of the video. During the menu it is the front
  glass (the menu lives there); once the feature hands off to the top screen
  (games, the reveal) it is the top glass. It changes when the machine's own
  "OUTPUT: MONITOR" card says so, with a cut, not a slide.
- Between them, one line of type, the machine's bitmap font, yellow, as the
  Q&A reel's question: the feature's name, arriving when the menu arrives.

## 3. The story, in beats (target 28 to 32 seconds)

| # | s from | what the top half shows | what the bottom half shows | sound |
|---|---|---|---|---|
| 0 | 0.0 | the pop | | the pop's own |
| 1 | 1.3 | black; the CRT wakes: TERMINAL.EXE, UNIX-6x Emulator, Loading (the site's real boot, cut from ~3 s to 1.6 s) | black | hum fades in |
| 2 | 2.9 | the console: FEED PATCHED, ANTENNA 1 1 1 1, SOURCE LIVE, RUN READY. The arrow glides in from the lower right, settles on the third digit, clicks: 1 1 0 1 | black | the click |
| 3 | 4.6 | the arrow taps SCROLL twice (the live row walks ANTENNA to SOURCE to RUN), then CLICK on RUN | black | two ticks, a click |
| 4 | 6.2 | the twin lands: the unit's two views, BIOS on the front glass, POST on the top. Held 2.4 s, then a dissolve over the 45-second boot to the idle menu | the front glass: BIOS, then (dissolve) "Please Select: > Answers <" | the relays under the boot, settling |
| 5 | 9.4 | the menu walk. The arrow taps SCROLL: > Programs <. CLICK. The folder opens (Games, Codes pass by as the walk goes on). SCROLL and CLICK until the feature's row is between the arrows. One press every 0.8 s, so the visitor reads each row that passes | the front glass row by row, in step | one tick per press |
| 6 | ~15 | the feature's card: its name on the front glass, "OUTPUT: MONITOR"; the machine hands off to the top screen | cut to the top glass | the redirect chime |
| 7 | ~16.5 | the demo: the feature doing what it does. Three moments of 2.5 to 3 s, hard cuts between them, chosen from a longer real run (a game is not played in real time on camera; the cuts carry it) | the top glass, the same three moments | the machine's blips, kept sparse |
| 8 | ~25.5 | the last moment holds (a score, a result, the end card) 2 s; the feature's name line stays | | the thunk |
| 9 | ~27.5 | one black beat | black | silence |

Rules of pace, from the brief: nothing under 0.8 s that the eye has to read;
nothing over 3 s that does not change; a transition is a cut unless time is
being folded (the boot, the walk between moments), and then it is a dissolve
of 0.4 s so the fold is visible and honest.

## 4. Same except data

`reels/features.json`, one row a day from a start date Mike sets:

```
{ "date": "2026-11-01", "feature": "Tilt Drive",
  "path": ["Programs", "Games", "Tilt Drive"],
  "play": "tilt-drive",            // a named demo script in the tool
  "seed": 0 }
```

The tool (`tools/reels-feature.py`) opens the site headless, walks the path
by pressing the Portal's own SCROLL and CLICK, runs the named demo script
(tilt, shake, click, wait — the same inputs the unit has), records the monitor
and both glasses with a shared clock, and cuts the reel from the story's beat
table. A new feature is a new row and, if it needs one, a new demo script; the
template never changes. The menu walk exposes whatever folders lie on the
path, which is the familiarity the brief asks for, for free.

## 5. What was found while scripting

- The Portal's console is driven by the same two chyrons as the machine
  (SCROLL walks the live row, CLICK acts), so "unseen forces scroll and click"
  is literally the site's own grammar from the first frame to the last.
- Channel 3 is the third ANTENNA digit; switching it to 0 (CAB) and pressing
  RUN opens the twin. Channel 4 is the same twin zoomed; the reel's close-up
  is drawn from the framebuffer instead, which is the zoom with no loss.
- The twin's idle menu is the flattened leaf list (Answers, Programs,
  Messages, ...), not the firmware's Root; the walk follows what the glass
  shows.
- The game pack is a parcel that arrives after ten asks; the tool unlocks it
  on the demo machine (the site's own `parcel=all` path) so the row is there
  to reach. On a visitor's machine it arrives the way the fiction says.
- The twin's own sounds are not in the capture; the reel's bed is the house
  kit (hum, ticks, relays, chime, thunk) from the Q&A reel, and the pop.

## 6. Review before Mike sees it

The first cut is reviewed on a contact sheet (one frame per beat) and by
playing it once at speed, against the beat table: every beat present, every
press readable, the close-up on the right glass, nothing rushed, nothing
idle. Only then does it go on the desk.
