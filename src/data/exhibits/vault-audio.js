// src/data/exhibits/vault-audio.js — THE RULE, WRITTEN ONCE.
//
// [R5 2026-08-06] Mike ruled that this museum does not have Hunter Root's
// permission and must stop serving his material from its own vault. That rule
// has to hold in two places that cannot share an import graph — the BUILD (so
// the addresses never reach a bundle) and the RUNTIME (so a dev server and any
// future consumer obey it too) — and Doctrine 17 says a rule in two places is a
// rule that will disagree with itself.
//
// So the rule is HERE, and it is a pure function of the export with no imports
// of its own: `vite.config.js` can load it in node, and
// `hunter-root-served.js` can load it in the browser bundle. Neither restates
// it.
//
// The match is on the vault's own audio PATH, not on a file extension — a
// future export using a different container is caught by the same rule — and on
// the host as well, so a link to somebody else's audio is never touched.

export const VAULT_AUDIO = /^https?:\/\/assets\.weird\.baby\/audio\//i;

export const isVaultAudio = (u) =>
  typeof u === "string" && VAULT_AUDIO.test(u);

function servedTrack(t) {
  return {
    ...t,
    videos: (t.videos || []).filter((v) => !isVaultAudio(v.audioUrl)),
    primary_url: isVaultAudio(t.primary_url) ? null : t.primary_url,
  };
}

function servedArtifact(a) {
  const out = {
    ...a,
    primary_url: isVaultAudio(a.primary_url) ? null : a.primary_url,
  };
  if (Array.isArray(a.tracks)) out.tracks = a.tracks.map(servedTrack);
  return out;
}

/* Idempotent by construction: run it on its own output and nothing changes.
   That is what lets the build pass and the runtime pass both stand without one
   of them being decorative. */
export function stripVaultAudio(exhibit) {
  return {
    ...exhibit,
    artifacts: (exhibit?.artifacts || []).map(servedArtifact),
  };
}
