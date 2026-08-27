/* ═══════════════════════════════════════════════════════════════════════════
   TELEVISION — a Portal channel that the antenna has routed to a 1.
   [2026-08-21]
   ---------------------------------------------------------------------------
   MIKE: **"They turned the TV on. Whatever channel it is on is playing.
   It's 1965!"**

   ═══ THE FOCUS-CUE RULING DOES NOT REACH HERE, AND THE DISTINCTION IS THE
       WHOLE REASON THIS FILE MAY DO WHAT `Exhibit.jsx` MAY NOT ═════════════
   Mike's ruling A (2026-08-20) reads: *"No autoplay flag, no muted start, no
   play-then-pause — every one of those makes sound or motion for a frame."*
   **That rule governs a video NOBODY ASKED FOR** — a track the visitor merely
   focused in a tracklist, where the museum would be making sound on its own
   initiative.

   **A LATCH IS AN EXPLICIT REQUEST.** The visitor set a source dial to LIVE,
   stepped an antenna routing, rolled a drum to a channel and threw a switch.
   Four deliberate acts, ending in one that says *open this channel*. Playing
   what the channel carries is answering the request, not taking an initiative.
   **A later round must not read ruling A onto this file**; the two cases differ
   on who asked, which is the only axis that ruling turns on.

   ═══ ONE OUTPUT. A TELEVISION IS NOT A TRACKLIST ═══════════════════════════
   MIKE: *"not like the tracklist you can peruse while another track continues
   playing."* The tracklist deliberately keeps a song running while you read
   another track. **A set has one output**: rolling the drum to another channel
   switches what comes out. That is enforced structurally rather than by a rule
   — this component is mounted by the overlay for exactly one channel, and its
   unmount `destroy()`s the player before the next one is built. There is never
   a second player alive to layer with.

   ═══ WHY THE HOOK AND NOT AN IFRAME — AND IT IS NOT ONLY TIDINESS ══════════
   The first build was a hand-written `<iframe>` and it drew a POSTER instead of
   playing. **A hand-written iframe carries no `allow` attribute, so the
   autoplay permission is never delegated to the cross-origin frame.** The
   IFrame API writes its own iframe with `allow="…autoplay…"` on it, so the top
   frame's activation — the latch press — reaches the player. Mike ruled the
   parameterisation worth paying for; it turned out to be the thing that makes
   television play at all.

   ═══ SOUND, AND WHAT HAPPENS IF THE BROWSER STILL REFUSES ══════════════════
   It asks for sound. If the set is not playing shortly after it was asked to,
   the browser has refused unmuted autoplay, and rather than leave a still frame
   the picture is started MUTED and the first touch anywhere unmutes it. That
   ordering matters and is deliberate: **a silent picture is a television with
   the volume down; a still poster is a broken television.**
   **THE DEAD CHANNEL MUST NEVER BE THE ONLY ONE WITH SOUND** — the test
   signal's hum is the object the mute path is measured against, and any future
   round that considers shipping a permanently muted television has to answer
   that first.
   ═══════════════════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { useYTPlayer } from "../exhibit/use-yt-player.js";
import "./Television.css";

/* The set's own player options. `controls: 0` and `disablekb: 1` remove the
   scrub bar — a visitor who seeks is off the wall clock until the channel is
   reloaded, and a 1965 television has no scrub bar either, so the fix and the
   period register want the same thing.
   `autoplay: 1` IS THE REQUEST, NOT THE TRICK: it is what the API needs to try
   at all. Whether it is granted is the browser's call and is handled below.
   `cc_load_policy: 0` IS HALF OF THE CAPTION RULING AND IT IS THE WEAK HALF.
   MIKE, 2026-08-26: **"I do not want closed captions."** YouTube documents `1`
   as *force on* and reads anything else as *the viewer's own preference*, so
   this parameter alone leaves captions on for any visitor whose account has
   them switched on. The half that binds is `unloadModule("captions")` below. */
const TV_VARS = {
  autoplay: 1, controls: 0, disablekb: 1, rel: 0,
  iv_load_policy: 3, playsinline: 1, modestbranding: 1,
  cc_load_policy: 0,
};

export default function Television({ ytId, startSeconds, title }) {
  const boxRef = useRef(null);
  const ytRef = useRef(null);
  /* silent === the browser refused sound and we fell back to a muted picture */
  const [silent, setSilent] = useState(false);

  /* ═══ THE LOOP IS OURS, NOT `loop=1&playlist=` ══════════════════════════════
     YouTube's single-video loop wants the id in `playlist`, and it does not
     survive a later `loadVideoById` — which is exactly what this component
     does, because the join point is computed from a wall clock rather than
     baked into a URL. So the reel restarts here, on the player's own ENDED.
     IT IS NOT DECORATION. A broadcast joined a few seconds from the end runs
     out almost immediately, and what YouTube draws then is its own end screen —
     related videos, on the Portal's glass. This is the one failure of the
     wall-clock mechanism that will actually happen. */
  const yt = useYTPlayer({
    containerRef: boxRef,
    hasVideo: true,
    playerVars: TV_VARS,
    onEnded: () => { ytRef.current?.playVideoAt(ytId, 0); },
  });
  useEffect(() => { ytRef.current = yt; });

  /* tune in, mid-broadcast */
  useEffect(() => {
    yt.playVideoAt(ytId, startSeconds || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytId, startSeconds]);

  /* ═══ THE REFUSAL PATH, WATCHED RATHER THAN ASSUMED ════════════════════════
     There is no event for "autoplay was blocked" — the player simply does not
     reach PLAYING. So the set is watched for a moment, and if it has not
     started it is asked again with the sound off. Bounded on both ends: it
     stops the moment it is playing, and it gives up rather than polling for
     ever. */
  useEffect(() => {
    let tries = 0;
    const t = setInterval(() => {
      const st = yt.getState();
      if (st.playing) { clearInterval(t); return; }
      tries += 1;
      if (tries === 5) { yt.setMuted(true); yt.play(); setSilent(true); }
      if (tries > 12) clearInterval(t);
    }, 350);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytId]);

  /* ═══ [2026-08-26] NO CLOSED CAPTIONS, AND IT IS A STANDING JOB RATHER THAN
         A ONE-SHOT ═══════════════════════════════════════════════════════════
     MIKE: **"I do not want closed captions."**

     IT IS ITS OWN TIMER AND NOT A LINE IN THE REFUSAL WATCHER ABOVE, because
     the two have different lifetimes and entangling them broke both: that one
     STOPS the moment the set is playing, which is the moment before the caption
     module is loaded.

     IT REPEATS BECAUSE THE MODULE COMES BACK. `unloadModule` only removes what
     is loaded now, and YouTube re-creates captions on every `loadVideoById` —
     which this component does on the wall-clock join AND on every loop, once
     every 1,743 seconds. A single unload on ready would read correctly and be
     gone by the second reel.

     WHY NOT `cc_load_policy` ALONE: it is in `TV_VARS` and it is the weak half.
     YouTube documents `1` as *force on* and reads anything else as the viewer's
     own preference, so a visitor with captions switched on in their account
     keeps them. This is the half that does not depend on the viewer.

     THE COST IS ONE GUARDED CALL EVERY 500ms while a channel is open, and it
     stops with the channel. Both module names are asked for: `captions` is
     current, `cc` is the legacy name, and unloading one that is absent is not
     an error. */
  useEffect(() => {
    const off = () => { yt.unloadModule("captions"); yt.unloadModule("cc"); };
    off();
    const t = setInterval(off, 500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytId]);

  /* ═══ THE SOUND COMES BACK ON THE FIRST TOUCH, AND THE LISTENER CANNOT BE ON
         `window` — THAT WAS BUILT, MEASURED AND WRONG ═════════════════════════
     The first cut listened on `window` for `pointerdown`. **It can never fire.**
     The set fills the overlay, so every click a visitor makes lands INSIDE a
     cross-origin iframe, and a click in a cross-origin iframe raises no event in
     the parent document at all. The path read correctly and was unreachable —
     found by clicking on the picture and watching nothing happen.
     SO THE CATCHER IS A NODE OVER THE PICTURE, and it exists only while the
     sound is off. It swallows exactly one click, which costs nothing: the
     player is built with `controls: 0`, so there is nothing under it to press.
     Keyboard stays on `window` — focus may legitimately be in the parent, and
     Escape is already handled a level up. */
  useEffect(() => {
    if (!silent) return undefined;
    const on = () => { yt.setMuted(false); yt.play(); setSilent(false); };
    window.addEventListener("keydown", on, { once: true });
    return () => window.removeEventListener("keydown", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [silent]);

  const unmute = () => { yt.setMuted(false); yt.play(); setSilent(false); };

  /* ONE OUTPUT — see the header. The player is destroyed with the channel. */
  useEffect(() => () => { ytRef.current?.destroy(); }, []);

  return (
    <div className="tv-root" aria-label={title || "Television"}>
      {/* [2026-08-26] THE FIT WRAPPER. It carries the 16:9 the player needs at
          the box's full HEIGHT, so the frame overflows sideways and `.tv-root`
          clips it. The API replaces the node INSIDE it, so the iframe lands as
          a child of the wrapper and `PortalScreen.css`'s `.ps-feed iframe`
          sizes it to 100% of the wrapper rather than of the box — which is the
          whole reason the wrapper exists rather than a competing rule. See
          `Television.css`. */}
      <div className="tv-fit">
        {/* the API REPLACES this node with its own iframe, which is why it is a
            bare div with nothing in it and nothing under it. */}
        <div ref={boxRef} className="tv-screen" />
      </div>
      {/* the sound catcher — present only while the browser has refused it.
          It carries no lettering: a caption saying CLICK FOR SOUND would be the
          museum explaining its own machine, and the set is already playing. */}
      {silent && (
        <div className="tv-tap" onPointerDown={unmute} aria-hidden="true" />
      )}
    </div>
  );
}
