/* ═══════════════════════════════════════════════════════════════════════════
   THE YOUTUBE PLAYER HOOK — one implementation, in its own file. [2026-08-21]
   ---------------------------------------------------------------------------
   IT LIVED IN `Exhibit.jsx` UNTIL THE PORTAL NEEDED IT TOO, and it moved for a
   reason the linter states better than a comment could: *"Fast refresh only
   works when a file only exports components. Use a new file to share constants
   or functions between components."* Exporting it from `Exhibit.jsx` — which
   default-exports a component — cost one new lint error, and the baseline is a
   tripwire that only works while it is exact. The rule named the fix; this is
   the fix.

   NOTHING IN IT CHANGED IN THE MOVE. Same body, same comments, same defaults.
   The two callers are `Exhibit.jsx` (the player bar, five wings) and
   `routes/robots/Television.jsx` (the Portal's channels), and both get the
   same nocookie `host`, the same single `iframe_api` request and the same
   dedupe guard — which is the whole point of there being one of these.
   ═══════════════════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback } from "react";

// ─── YOUTUBE PLAYER HOOK ──────────────────────────────────────────────────────
/* ═══ [2026-08-21] THE HOOK IS PARAMETERISED, AND IT IS EXPORTED ═══════════
   MIKE: *"Same/data… Small invest, pays back HUGE. That is why the thing is
   even there to be reparameterized."*

   ONE PLAYER IMPLEMENTATION IN THE BUILDING. /hr and /wal play every song
   through this hook and the Portal's television plays through it too — same
   nocookie `host`, same one `iframe_api` request, same dedupe guard, same
   pending/ready contract. The alternative that was built first and thrown away
   was a plain `<iframe>`, and it was worse in a way that is worth recording:
   **an iframe written by hand carries no `allow` attribute, so the autoplay
   permission is never delegated to the cross-origin frame and the video draws a
   poster instead of playing.** The API writes its own iframe with
   `allow="…autoplay…"` on it. The parameterisation is not only tidier; it is
   the thing that makes television actually play.

   NOTHING DEFAULTS DIFFERENTLY. `playerVars` is spread OVER the existing five,
   so a caller that passes none gets byte-for-byte what /hr and /wal have always
   had: `autoplay: 0, controls: 1`. Ruling A's "no autoplay flag" is a property
   of the DEFAULT and stays one. */
export function useYTPlayer({ containerRef, onEnded, hasVideo, playerVars }) {
  const playerRef  = useRef(null);
  const readyRef   = useRef(false);
  const pendingRef = useRef(null);
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; });

  /* ═══ [CH8 2026-08-12] NO VIDEO IN THE WING, NO PLAYER ═════════════════════
     MIKE'S RULING. The eager build below was unconditional, so EVERY wing that
     renders this component built a YouTube player — including `/foundation` and
     `/wb`, which have `videos: []` on every track. A player with no videoId is
     still a real `youtube.com/embed/` IFRAME, and YouTube's own script inside it
     calls `googleads.g.doubleclick.net/pagead/id`. That is how a museum whose
     Information Booth says it carries no advertising came to call Google's
     ad-identity endpoint from a page about a charitable foundation.

     `hasVideo` IS COMPUTED FROM THE SPINE, NOT PASSED BY HAND, so a wing cannot
     acquire a video and forget to turn its player on: the day a track gets a
     `ytId`, the player returns by itself.

     WHAT IS LOST, AND WHY IT DOES NOT MATTER HERE: the comment below records
     that the eager build fixes mobile first-click playback. That fix is kept
     wherever there is anything to play — the condition is "this wing has a
     video", not "the visitor pressed something" — and on a wing with no video
     there is no first click to lose. */
  useEffect(() => {
    if (!hasVideo) return;
    ensureApi(() => initPlayer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo]);

  /* ═══ [2026-08-15] THE EMBED IS `youtube-nocookie.com` ══════════════════════
     MIKE: "switch to youtube-nocookie.com in Exhibit.jsx… Risk abatement begins
     with risk elimination: do not caveat a third-party cookie you can simply
     not set."
     `host` IS THE WHOLE MECHANISM. The IFrame API builds its own iframe, so the
     origin cannot be set on an element we write — it is a player option, and it
     is the ONLY supported way to move the embed. Measured before this: playing
     a song on /wal created one iframe on `www.youtube.com`.
     IT MAKES THE MUSEUM AGREE WITH ITSELF. `HrExhibitFlow.jsx`'s lightbox has
     used the nocookie host since 2026-05-31, so this was one building serving
     two different embed origins depending which room you were in.
     WHAT IT DOES AND DOES NOT DO, STATED SO NOBODY OVERSELLS IT LATER: the
     nocookie host does not set its cookies until playback begins, which is why
     it is the stricter of the two available hosts and why it is the right
     default. It is NOT a claim that nothing is set once a visitor presses play.
     The booth's answer does not make that claim either. */
  function initPlayer() {
    if (!containerRef.current || playerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      width: "100%", height: "100%",
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        autoplay: 0, controls: 1, modestbranding: 1, rel: 0,
        iv_load_policy: 3, playsinline: 1,
        ...(playerVars || {}),
      },
      events: {
        onReady() {
          readyRef.current = true;
          if (pendingRef.current) {
            /* [2026-08-20] A PENDING REQUEST CARRIES ITS VERB. `pendingRef`
               held a bare id and `onReady` always LOADED it, which plays. A cue
               that arrived before the player was ready would therefore have
               started playing the moment it became ready - the exact autoplay
               Mike's ruling A forbids, on the one path nobody would have
               tested. It carries `{id, cue}` now and the verb survives the
               wait. */
            const p = pendingRef.current;
            pendingRef.current = null;
            if (p.cue) playerRef.current.cueVideoById(p.id);
            /* [2026-08-21] A PENDING REQUEST MAY ALSO CARRY A START TIME, and
               it has to survive the wait for the same reason the verb does: the
               Portal's television is joined mid-broadcast off a wall clock, and
               a request that arrived before the player was ready would
               otherwise land at 0:00 — the one frame of the reel that reads as
               a playlist starting rather than a broadcast being rejoined. */
            else if (p.startSeconds != null) {
              playerRef.current.loadVideoById(
                { videoId: p.id, startSeconds: p.startSeconds });
            } else playerRef.current.loadVideoById(p.id);
          }
        },
        onStateChange(e) {
          if (e.data === window.YT.PlayerState.ENDED) onEndedRef.current?.();
        },
      },
    });
  }

  /* ═══ [2026-08-15] THE API SCRIPT STAYS ON `www.youtube.com`, AND IT IS
         MEASURED RATHER THAN CHOSEN ══════════════════════════════════════════
     The first cut of this ruling moved the script to the nocookie host as well.
     **`https://www.youtube-nocookie.com/iframe_api` RETURNS 503** — that host
     serves embeds, not the API — so `window.YT` never arrived, no player was
     ever built, and every video in the museum silently did nothing. Caught on
     the wire; the page threw no error, because a `<script>` that 503s is not an
     exception, it is just a script that never runs.
     SO THE SPLIT IS: the API comes from `www.youtube.com` (the only host that
     serves it) and the PLAYER it builds is pointed at the nocookie host by the
     `host` option above. **The embed a visitor loads is nocookie; loading the
     API costs one request to `www.youtube.com` on the first play of a visit.**
     That residual is real, it is stated in the round log, and it is not
     something this code can remove — the API is Google's and there is no other
     origin for it. What it is NOT is the thing the ruling was about: the embed
     that hosts the video, and its cookies, moved.
     THE DEDUPE GUARD MATCHES `/iframe_api` AND NOT THE HOST. It read
     `src*="youtube.com/iframe_api"`, which is host-coupled; matching the path
     alone means a future change of origin cannot silently stop the guard
     matching and append a second copy of the API on every call. */
  function ensureApi(cb) {
    if (window.YT?.Player) { cb(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); cb(); };
    if (!document.querySelector('script[src*="/iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }

  /* ═══ [2026-08-20] LOAD AND CUE ARE ONE FUNCTION AND A VERB ════════════════
     They differ by which YouTube method fires and by nothing else, and writing
     them out twice cost a SECOND copy of the `initPlayer` exhaustive-deps
     warning this hook already carries - a new lint warning for no new
     behaviour, which is a baseline moved for a copy-paste. One body, one
     `useCallback` carrying the existing debt, two named verbs over it. */
  /* ═══ [2026-08-20] EVERY LOAD MEETS THE SAME PLAYER STATE ══════════════════
     THE FAULT, AND IT IS POSITIONAL. There is ONE player and it is reused, so
     the FIRST track a visitor plays is loaded into a player that has never
     played anything, and EVERY track after it is loaded into a player that is
     mid-playback of the previous one — W1 keeps the old video running while
     focus moves. Measured on /wal, Carsie Blanton's album: at the moment
     `Shit List` is clicked, `playing` still reads `Be Good`. Track 01 can never
     be in that state; nothing after track 01 can avoid it. Mike sees YouTube's
     unavailable graphic on exactly the tracks that take the second path.

     `stopVideo()` AND NOT `pauseVideo()`, ON THE PRINCIPLE RATHER THAN ON A
     MEASUREMENT. The state track 01 meets is *no video loaded and nothing
     playing*. `stopVideo()` unloads and stops, which is that state;
     `pauseVideo()` leaves the previous video loaded and merely halted, which is
     a THIRD state and would make the two paths differ in a new way instead of
     the same way. The rule being applied is Mike's — make every track meet the
     same state — and stop is the only one of the three that does it.

     WHAT IS NOT CLAIMED: that `loadVideoById` alone was measured to fail.
     Embeds do not paint on the machine this was written on, so the refusal was
     never reproduced here. The asymmetry above IS measured; the link from it to
     the grey box is Mike's observation plus the positional pattern, and it is
     inference. If this does not fix it, that inference is where to look first —
     not at the videos, which are healthy on every probe. */
  const requestVideo = useCallback((ytId, cue) => {
    if (playerRef.current && readyRef.current) {
      if (cue) playerRef.current.cueVideoById(ytId);
      else {
        try { playerRef.current.stopVideo(); } catch { /* an idle player has nothing to stop */ }
        playerRef.current.loadVideoById(ytId);
      }
    } else if (playerRef.current) {
      pendingRef.current = { id: ytId, cue };
    } else {
      pendingRef.current = { id: ytId, cue };
      /* [2026-08-20] `initPlayer()` TAKES NO PARAMETER AND THE CALL WAS WRONG,
         NOT THE FUNCTION. It was called `initPlayer(ytId)` here and declared
         bare, so the argument was silently dropped. **The empty build is
         deliberate** — the eager build above calls it bare on purpose, and the
         player is designed to receive its video by METHOD, through `pendingRef`
         and `onReady`. Adding a `videoId` parameter to match this call would
         have changed the behaviour to fit the mistake. The argument goes. */
      ensureApi(() => initPlayer());
    }
  }, []);
  const loadVideo = useCallback((ytId) => requestVideo(ytId, false), [requestVideo]);

  /* ═══ [2026-08-20] CUE IS LOAD'S PAIRED VERB, AND THAT IS WHY IT IS SAFE ════
     MIKE RULED A: on focus the viewer LOADS the track's video and shows its
     poster frame, ready - it does not play, it makes no sound, it does not
     move. `cueVideoById` is YouTube's own method for exactly that; `loadVideoById`
     is the one beside it that plays. **Nothing here is a workaround** - no
     autoplay flag, no muted start, no play-then-pause, all of which would make
     sound or motion for a frame and are the reason he chose A over B.
     IT IS THE SAME PENDING PATH AS LOAD so a cue that arrives before the player
     is ready is honoured as a CUE when it lands (see `onReady`). */
  const cueVideo = useCallback((ytId) => requestVideo(ytId, true), [requestVideo]);

  /* ═══ [2026-08-21] THE TELEVISION VERBS ═══════════════════════════════════
     Four, and each exists because the Portal needs something the tracklist
     never did.

     `playVideoAt` — LOAD AND PLAY FROM A GIVEN SECOND. `loadVideo` starts at
     0:00, which is right for a track and wrong for a broadcast: the whole
     effect is that the reel was already running before you turned the set on.
     It takes the same `stopVideo()` first as `loadVideo` does, for the
     2026-08-20 reason — every load must meet the same player state.

     `setMuted` — EXPLICIT, WHERE `toggleMute` IS RELATIVE. A retry path has to
     be able to say *muted* without first asking whether it already is.

     `play` — PLAY, WHERE `togglePlay` WOULD PAUSE A PLAYING SET.

     `destroy` — TEARDOWN, AND ONLY THE PORTAL CALLS IT. **A television has ONE
     output** (Mike): rolling the drum to another channel switches what comes
     out, it does not layer — the exact inverse of the tracklist rule, which
     deliberately lets a song keep playing while you read another track.
     Removing the node stops the sound; destroying the player is what stops it
     from being half-alive behind the next one. */
  const playVideoAt = useCallback((ytId, startSeconds) => {
    const p = playerRef.current;
    if (p && readyRef.current) {
      try { p.stopVideo(); } catch { /* an idle player has nothing to stop */ }
      p.loadVideoById({ videoId: ytId, startSeconds: startSeconds || 0 });
      return;
    }
    pendingRef.current = { id: ytId, cue: false, startSeconds: startSeconds || 0 };
    if (!p) ensureApi(() => initPlayer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMuted = useCallback((m) => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    try { if (m) p.mute(); else p.unMute(); } catch { /* not ready after all */ }
  }, []);

  const play = useCallback(() => {
    const p = playerRef.current;
    if (p && readyRef.current) { try { p.playVideo(); } catch { /* idem */ } }
  }, []);

  const destroy = useCallback(() => {
    const p = playerRef.current;
    playerRef.current = null;
    readyRef.current = false;
    pendingRef.current = null;
    if (p) { try { p.destroy(); } catch { /* already gone with its node */ } }
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) p.pauseVideo();
    else p.playVideo();
  }, []);

  const pause = useCallback(() => {
    const p = playerRef.current;
    if (p && readyRef.current) p.pauseVideo();
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    if (p.isMuted()) p.unMute(); else p.mute();
  }, []);

  const setVolume = useCallback((v) => {
    const p = playerRef.current;
    if (p && readyRef.current) p.setVolume(v);
  }, []);

  const getState = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return { playing: false, muted: false, volume: 100 };
    return {
      playing: p.getPlayerState() === window.YT.PlayerState.PLAYING,
      muted: p.isMuted(),
      volume: p.getVolume(),
    };
  }, []);

  /* [2026-08-26] A THIN PASSTHROUGH TO THE PLAYER'S OWN MODULE API, ADDED FOR
     ONE CALLER AND DEFAULTING TO NOTHING. Mike ruled closed captions off on the
     Portal's television. `cc_load_policy` cannot carry that on its own — YouTube
     documents `1` as *force on* and treats everything else as *the viewer's own
     preference*, so a visitor who has captions switched on in their account gets
     them regardless of the parameter. `unloadModule("captions")` is the API's
     own answer and is the only one that does not depend on the viewer.
     IT IS A PASSTHROUGH AND NOT A POLICY: /hr and /wal never call it, so their
     behaviour is unchanged to the character. The guard is the same one every
     other control here uses. */
  const unloadModule = useCallback((name) => {
    const p = playerRef.current;
    if (!p || !readyRef.current || typeof p.unloadModule !== "function") return;
    try { p.unloadModule(name); } catch { /* module absent is not an error */ }
  }, []);

  return { loadVideo, cueVideo, playVideoAt, play, pause, togglePlay,
           toggleMute, setMuted, setVolume, getState, unloadModule, destroy };
}
