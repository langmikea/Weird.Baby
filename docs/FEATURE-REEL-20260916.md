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

## 7. The second story, after Mike's notes (2026-09-16, late)

Mike on the first cut: "This is incredible. You understood exactly." Then
eleven notes, cleaned: boot directly into the monitor and its noise; the menu
is walked by someone who knows where they are going, not shown as a path;
no mouse cursor; each button blinks when it is activated; no slow fade from
the noise to the menu and no other transition the machine does not make;
the zoom-in carries the VIIIp image, split from the monitor by a line like
the ones inside the monitor, the yellow over an unused part of the image at
the top; the zoom-in gets every bit of post-processing the monitor gets;
a signature moment when the payload arrives, audio and a visual pop or
flicker; the ending must satisfy: hard cuts of the action, 2x gameplay that
looks 2x, then the crash slams into slow motion and decelerates to zero,
loop; a small, innocuous indicator at the top of every reel naming the
branch (Museum, Music, Robots); his music will want the same treatment for
the chord he is playing, in time, like captions. Story first, review first,
always.

### The frame, revised

- **Top: the monitor**, as the site draws it, 1080 wide. Over its black
  surround, top left, the branch: `\ROBOTS` in the museum bar's own small
  type, grey, there if you look for it.
- **The split**: one horizontal line in the monitor's own style, the soft
  light rule that divides the front view from the top view inside the
  picture.
- **Bottom: the zoom-in**, which is channel 4 of the Portal: the close-up
  plate of the machine with the live glass drawn into its aperture, cropped
  to the screen the story is on (the front glass during the menu, the top
  window once the machine hands off), the plate's own divider in shot. The
  glass is drawn the way the site draws it: the twin's framebuffer at an
  integer scale with its scanline gap baked into every row (the top window
  progressive, the front interlaced), bloomed, and the whole half under the
  same closed-circuit read the monitor wears: scanlines, a slow roll, a
  breath of flicker, the vignette. The feature's name in yellow, in the
  machine's font, over the dark bezel band at the top of the plate.

### The beats, revised (target 17 to 19 seconds)

| # | what the monitor shows | what the zoom-in shows | sound |
|---|---|---|---|
| 0 | the pop | | its own |
| 1 | noise: the set is on channel 3 and the machine has not answered yet (about 1 s) | the plate, its glass dark | hum, hiss |
| 2 | the twin lands: BIOS on the front glass, POST on the top (1.6 s, the machine's own) | the front glass, BIOS | relays |
| 3 | hard cut: the idle menu. SCROLL, CLICK, CLICK, CLICK: each chyron blinks white as it is pressed, one press every third of a second, the rows change under it (about 2.5 s) | the front glass, row by row | a tick per press |
| 4 | the payload: the front glass says OUTPUT REDIRECTED TO AUX DISPLAY; the name arrives in yellow; the picture pops, one frame white, one frame torn, and settles (the signature moment) | the front glass, then a cut to the top window as the machine hands off | the sting: two notes and a thunk |
| 5 | the action at 1x, 2.4 s | the top window: the road, the car, the score climbing | the machine's blips |
| 6 | hard cut: the action at 2x, 2.5 s, driving that looks better than it is | the same, at 2x | the blips at 2x |
| 7 | the crash: the frame slams into slow motion, each frame held longer than the last, decelerating to a stop; a flicker on the frozen frame | the same | a thud, the hum falls away |
| 8 | the machine's own GAME OVER card, score and best, the picture blinking as the card blinks | the top window | silence |
| 9 | one black beat, then the loop | | |

What is not in it any more: the console, the antenna, the cursor, the fold.
What stays the machine's: every screen, every card, every transition on the
glass. What is the reel's: the cuts, the speed, the slow motion, the blink on
the chyrons, the pop at the payload, the closed-circuit read on the zoom-in.

### For the reel line as a whole

- Every reel of the house gets the branch indicator; the Q&A reel takes it
  next.
- The music reels will carry the chord being played the same way the
  feature reels carry the name: small, in time, ignorable. Logged for the
  music leg.

## 8. The third story, after Mike's notes on the second cut (2026-09-17)

Mike, cleaned: everything displayed comes through the front glass; it is
inaccurate, but not deceitful. The zoom-in is simply a zoom-in of the
monitor, cropped to only the image of the VIIIp: no background, no lines,
no features of the monitor. The split line was only one suggestion for a
transition. On the second cut: the front glass sat too high and left, then
the zoom-in became a close-up of the close-up and things grew misaligned; a
mess. The slow-motion end is boring: race faster and faster until WHAM, a
collision with another car, an immediate drop to slow motion to see the
crash and the explosion grind to a stop, then GAME OVER pops on at full, a
beat, loop.

### The frame, third form

- **Top: the monitor**, unchanged, with `\ROBOTS` small over the black
  band above it.
- **Below it, with no line: the zoom-in.** The monitor's own picture of the
  machine, the front view, cropped to the unit and nothing else, scaled so
  the unit fills the width; the unit runs off the bottom of the frame below
  its lens ring. One picture, one position, from the first frame to the
  last. The front glass is in the lower third of the frame.
- **Everything comes through the front glass.** The framebuffer the story
  is on (the menu; then, once the machine hands off, the game) is drawn into
  the front glass of the zoom-in at the picture's own scale, with the
  screen treatment the site gives the glass. On the monitor above, the
  machine stays accurate: the game plays on its top window there.
- The feature's name, yellow, over the ridged cap at the top of the unit.
- The zoom-in wears the closed-circuit read the monitor wears.

### The beats, third form (target 17 to 19 seconds)

| # | the monitor | the zoom-in | sound |
|---|---|---|---|
| 0 | the pop | | |
| 1 | noise, about 1 s | the unit, its glass dark | hum, hiss |
| 2 | the twin lands: BIOS and POST, 1.6 s | the front glass: BIOS | relays |
| 3 | hard cut: the idle menu; SCROLL, CLICK, CLICK, CLICK, each chyron blinking, a press every third of a second | the front glass, row by row | a tick a press |
| 4 | the payload: OUTPUT REDIRECTED TO AUX DISPLAY; the name arrives; the picture pops (a white frame, two torn frames) | the same, through the front glass | the sting |
| 5 | the race: 2 s at 1x, then faster and faster, the speed climbing without a cut to about three times, the car threading traffic | the game through the front glass, at the same climbing speed | the engine blips climbing with it |
| 6 | WHAM: the collision with another car. A white burst, the picture torn and shaken, and at once slow motion: the crash frames, each held longer than the last, the burst decaying, grinding to a stop on the two cars together | the same | the thud, the hum gone, a low tone dying |
| 7 | GAME OVER pops on, full, no blink: the machine's card, score and best. One beat, about a second | the card through the front glass | a click as it lands |
| 8 | black, a short beat, loop | | |

The run is driven so it ends in a car: weave for the first stretch, then hold
the lane and let the traffic come. If the road ends a run early it is
restarted; the reel uses the last run.

## 9. Zoom levels, quick iteration (2026-09-17)

Mike, with a mock: try the zoom-in with the front glass filling the width,
the name on a slim band of the cap above it; then something between that and
the unit-wide crop; then a version that is only the unit, no monitor, opening
on a full shot and cutting in to varying levels of close-up. Mashups between
the sets may follow, as in the Q&A reel. The artifact reels, when they come,
are presented as 1960s CRT broadcast television.

The levels, all cut from the same capture, all measured from the front glass
canvas on the page:

| level | what the crop holds | scale of the monitor's picture |
|---|---|---|
| unit | the whole unit, cap to lens ring, edge to edge | 2.5x |
| mid | cap, the plate's lettering, the glass, the top of the lens ring | 3.6x |
| glass | the front window filling the width, the cap on a slim band above with the name | 5.7x |

Three variants: **A** monitor over the glass level (Mike's mock); **B** monitor
over the mid level; **C** the unit alone, no monitor: full shot for the noise
and the landing, mid for the walk, glass for the payload, the race, the crash
and the card. The beats, the sound and the ending are the third story's.

## 10. A is it (2026-09-17): four notes

Mike chose A, the monitor over the glass, and gave four notes: a faint grey
line at the bottom of the front glass distracts before the screen is on; when
the machine switches to its top screen, cut to a close-up of the VIIIp and
its top glass; there is clicking where there should be static; and the drive:
around other cars, at five to ten times, long enough to gain on a lot of cars
before one mistake, starting fast and going faster, WHAM.

- The line was the edge of the site's own canvas showing through the photo of
  the glass; the drawn glass now covers it with a feathered edge.
- The zoom-in follows the machine: the front glass close-up until the
  hand-off, then a cut to the top-window close-up, the name band unchanged.
- Under the noise: static, nothing else. The hum arrives with the machine.
  The join after the pop is faded in so it cannot click.
- The car is driven by an autopilot reading the road: it takes the free lane
  ahead of every car for as long as the run is asked to last, then stops
  steering, holds the lane, and the traffic ends it. The reel opens the race
  at five times and climbs to ten with no cut, an engine drone climbing with
  it, then WHAM, the slow motion, the card, the beat, the loop.

## 11. Mike's script (2026-09-17, after the driving landed)

Mike: the driving is excellent; the start has many errors, audio and visual;
review it frame by frame. The pacing and the visuals are off: a lot goes on
and the eyes dart around without satisfaction. **The zoomed screen must
always take centre stage and remain the anchor; we gaze away from it to
observe the bigger view of the machine, but always come back completely
landed. It gives us the comfort to look around.** His script, kept whole:

1. Start with the monitor booted, not noise.
2. Half a beat: noise on the VIIIp in the monitor.
3. Menu selection at a more relaxed pace, deliberate, so a viewer can follow
   in real time even if they need to watch twice.
4. The selection of the payload is a beat point: recognise it. The selected
   row turns on in inverse video.
5. A beat to redirect the output, a beat to land. Not long pauses; pacing
   that satisfies the flow.
6. Kill AUX DISPLAY.
7. The score: readable, bigger, starting high (we are mid-game), big jumps
   for passing others, no dollar sign, ending on NEW HIGH SCORE.
8. The front zoom wrongly showed the top of the unit above the round portal.
9. The top screen and the drawn screen inside it match poorly: look at the
   real photographs and size and blend it properly.
10. The chyron needs four-way, non-exclusive tilt buttons that light to show
    the steering; Up is gas.

### What each becomes

- The reel opens on the monitor with the machine already on it; the front
  glass carries the machine's own boot noise for half a beat; the menu.
- Presses every 0.7 s on the walk. On the click that selects the feature the
  row is held in inverse video for half a second, with a note of its own,
  before the machine's own OUTPUT REDIRECTED card, which holds a beat. Then
  the cut to the top window with the game running, a beat to land, then the
  race. AUX DISPLAY is cut out.
- The score is the reel's overlay on the drawn glass (inaccurate, not
  deceitful): the game's own small figure is erased; a large figure in the
  reveal font starts near three thousand and jumps as each car is passed,
  counted by the autopilot; the game-over card reads NEW HIGH SCORE with
  the figure.
- The front glass level now crops from the plate's top edge through the
  lettering to the window, so what sits above the portal is what sits above
  it on the machine; the name rides the plate's blank top.
- The top window: the real one (top_monitor.png) is a small cyan OLED behind
  a viewfinder glass with reflections, thin strokes, no bloom. The drawn
  screen is now dimmer, thinner, added over the photograph so the glass's
  reflections stay, at the aperture the site measured.
- The site itself gains the tilt chyrons (PortalScreen, the twin): a cross
  beside SHAKE, lit from the machine's own state, Up as gas; the autopilot
  steers through them, so the reel shows them lighting.

## 12. The click choreography (2026-09-17, second round)

Mike: the portal moved, put it back; the clicks do not align with the
visuals. His choreography: arrive at `> Programs <`, beat; the click lights
the chyron and the row goes to reverse video on every screen at once, beat;
`> Games <` the same; `> Tilt Drive <` the same, except the row flashes a
couple of times: it is the payload. Review frame by frame; the reverse video
was misaligned and screens overlapped, obvious at the start of the driving.
The final card: NEW HIGH SCORE at half size, the number stays large.

- The front glass close-up goes back to the window filling the width,
  centred, as in the mock; the name rides the plate strip above the window.
- The reverse video is now the machine's: a demo hook in the twin inverts the
  selected row on its own front glass for the beat, so the monitor's glass,
  the zoom-in and the chyron agree because they are one event. The capture
  runs the choreography in real time: arrive, beat, the flash with the
  chyron lit, the silent click that enters, beat. On the feature's row the
  flash repeats three times.
- The card: the title in the small face, the figure at twice the reveal
  font.

## 13. Four notes (2026-09-17, third round)

Mike: remove "redirected"; SCROLL should light when scrolling; while viewing
`> Programs <` the VIIIp twitches but the drawn screen stays put; the front
view's drawn screen must be cropped at the corners to remove the overlap and
give depth, and its whole perimeter should blend.

- The OUTPUT REDIRECTED card is gone: the payload's flashes cut straight to
  the top window with the game landing, and the name and the pop arrive
  there.
- SCROLL lights for a third of a second on every scroll, as CLICK does.
- The site's picture twitches by a pixel now and then (its own jitter); the
  drawn glass now measures the picture's shift against a reference frame and
  moves with it.
- The drawn front glass is clipped to the round window (a disc a little
  inside the bezel, feathered), so the corners fall away behind the rim and
  the whole edge blends into the glass.

## 14. Ninety percent (2026-09-17, fourth round)

Mike: inside the top view, the blobs are hot glue painted black; fine in the
unit, here they break the immersion between the drawn screen and the VIIIp.
Make our own inside view: the LCD set off the background by its thickness,
or bevelled, inset; texture as a tool; or hide detail in darkness. Clean,
simple; oversize the drawn screen if it helps, it is not a spec. Dampen the
steering view: nobody tilts that fast; average it, throw in no-gas and brake
taps. The real LCDs sit behind lenses that distort, barrel and fringe, worst
at the edges: use that for the text and the top image. And at 25,000 feet:
working SED, shift to another program or game; expect it to go up easily
and reveal problems. Ops' call.

- **The inside view** is drawn, not photographed: the hood's interior in
  darkness with a faint grain, the screen a recessed slab a quarter larger
  than the aperture, a thin bevel catching light on its upper edges and
  shadow on the lower, the face near black with the module's own pixel
  pitch just visible, the lit pixels on it, feathered into the photograph
  around the hood.
- **The lens**: both drawn screens pass through a barrel warp with a soft
  fringe that grows toward the edges, as the glass does to the real LCDs.
- **Damped steering**: the autopilot holds any steering decision for at
  least a quarter second, eases off the gas for half a second every few
  seconds and taps the brake now and then; the chyrons show exactly that,
  and the machine's Down is now a brake (the road slows).
- **25,000 feet**: the second feature is AvoidSteroids, the same shape (a
  score, a crash) with different inputs (a shot on CLICK). The reel is cut
  from the same template with a new row and a new demo script; what breaks
  is the finding.

### The 25,000-foot finding (AvoidSteroids, same template)

It went up in one pass: the row and a demo script were the only new data.
The walk found its row three deep in Games with Tilt Drive and Gobble
passing by (the familiarity the brief asked for), the flashes, the name, the
inside view, the WHAM and the card all held. What broke is exactly the
payload's own drama:

- **The score is Tilt Drive's.** The overlay counts distance and cars
  passed; AvoidSteroids scores hits, so the figure sat at 2800 the whole
  run and the card lied. The score model is per-feature data: what counts,
  how much, from which of the machine's own numbers.
- **The race is Tilt Drive's.** Five to ten times on a field of slow
  asteroids reads as an empty screen with dots. AvoidSteroids wants dodge and
  shoot at one to three times, the hit as the WHAM. Snow Globe has no ending
  at all: it is a toy, and its story is shake, watch, and done.
- **The autopilot is Tilt Drive's.** AvoidSteroids ran on the scripted
  weave and still lasted seventeen seconds; a per-game driver is data too.

So the row grows two fields: `story` (race, survive, toy) and `score` (the
machine's figure and the jumps that count), and the demo script stays the
third. The frame is one template; the payload's drama is three shapes, not
one. Ops' call: build `survive` next on AvoidSteroids, then `toy` on Snow
Globe, before the row count grows.
