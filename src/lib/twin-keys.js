/* src/lib/twin-keys.js — SCHEDULE IDS → THE TWIN'S OWN PARCEL WORDS.
   [2026-09-02] Read off public/robots/twin.html:6553-6606 today, not guessed.
   The twin decides every menu row in Parcel_Sync_Menu() from three inputs:
   `parcel.stage` (0 NIAC only · 1 adds MGK-v2.0 and Mail Run · 2 adds MGK-65),
   `parcel.keys` (gamepack · apps · detectors · tools · pool_excuses_2), and
   `parcel.personas` (one boolean that shows ELIZ, Brain Training, Inkblots,
   Radio, Phone Tap, Sniper and the Spy Detector together). The Casino is its
   own code (2121) and is not a parcel.

   THE GRAIN DOES NOT MATCH THE CHOREOGRAPHY, AND THAT IS THE FIRST THING PART
   ONE HAS TO FIX IN THE TWIN. The schedule delivers games two at a time over
   three days; the twin has one `gamepack` key for three of them. The schedule
   delivers the Bullshit detector alone, then three more; the twin has one
   `detectors` key. The schedule delivers one persona a week; the twin has one
   `personas` boolean for all four. Until the twin gains per-row keys, the
   museum can only send what the twin can hear, and this map says which.

   So the map has two columns: what the twin can grant TODAY (coarse), and the
   per-row key the twin should grow (fine). Part one adds the fine keys to
   Parcel_Sync_Menu and this file drops its coarse column. */
export const TWIN_KEYS = {
  /* engines — stage is the Evolution Law's own counter */
  "twin.app.answers":       { stage: 0 },
  "engine.v2":              { stage: 1 },
  "engine.65":              { stage: 2 },
  /* games */
  "twin.game.snowglobe":    { coarse: null,        fine: "game:snowglobe" },   /* day-one game; visible without a parcel today */
  "twin.game.tictactoe":    { coarse: null,        fine: "game:tictactoe" },
  "twin.game.tilt-drive":   { coarse: "gamepack",  fine: "game:tilt-drive" },
  "twin.game.gobble":       { coarse: "gamepack",  fine: "game:gobble" },
  "twin.game.avoidsteroids":{ coarse: "gamepack",  fine: "game:avoidsteroids" },
  "twin.game.mailrun":      { stage: 1,            fine: "game:mailrun" },      /* the twin ties it to stage 1 today */
  "twin.game.sniper":       { coarse: "personas",  fine: "persona:informer" },
  "twin.game.stopnum":      { coarse: null,        fine: "game:stopnum" },
  "twin.game.slots":        { code: "2121" },  "twin.game.craps": { code: "2121" },
  "twin.game.blackjack":    { code: "2121" },  "twin.game.roulette": { code: "2121" },
  /* apps */
  "twin.app.detectors":     { coarse: "detectors", fine: "det:bullshit" },      /* later: det:stud · det:trustworthy · det:attractiveness */
  "twin.app.appp":          { coarse: "apps",      fine: "apps" },
  "twin.app.calc":          { coarse: "tools",     fine: "tools" },
  "twin.app.note":          { coarse: "tools",     fine: "tools" },
  "twin.app.eliza":         { coarse: "personas",  fine: "persona:everyday" },
  "twin.app.brain":         { coarse: "personas",  fine: "persona:everyday" },
  "twin.app.ink":           { coarse: "personas",  fine: "persona:everyday" },
  "twin.app.radio":         { coarse: "personas",  fine: "persona:informer" },
  "twin.app.tap":           { coarse: "personas",  fine: "persona:informer" },
  /* not parcels in the twin today: always visible or governed elsewhere */
  "twin.app.probabilities": { always: true },
  "twin.app.messages":      { always: true },
  "twin.app.fortune":       { always: true },
  "twin.app.polarity":      { always: true },
  "twin.app.clarity":       { always: true },
  "twin.app.voice":         { always: true },
  "twin.app.user.name":     { always: true },
  "twin.userrecord":        { always: true },
  "twin.app.maint":         { always: true },
  "twin.boot":              { always: true },
  "twin.monitor":           { always: true },
  "twin.app.advice.panel":  { always: true },
};

/* what the museum can send the twin for a set of delivered schedule ids,
   in the twin's current vocabulary: { stage, keys[], personas } */
export function twinGrantFor(deliveredIds) {
  let stage = 0; const keys = new Set(); let personas = false;
  for (const id of deliveredIds) {
    const k = TWIN_KEYS[id]; if (!k) continue;
    if (typeof k.stage === "number") stage = Math.max(stage, k.stage);
    if (k.coarse === "personas") personas = true;
    else if (k.coarse) keys.add(k.coarse);
  }
  return { stage, keys: [...keys], personas };
}
