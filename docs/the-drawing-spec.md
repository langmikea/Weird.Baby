# THE DRAWING — Anonymous Raffle System for the Weird Baby Museum

**Status:** Spec v1.1 — ready for implementation
**Owner:** Mike
**Target:** weird.baby (Vite + React Router, Cloudflare Worker; KV/D1/Durable Objects available)
**Context:** The museum is fully online. Prizes are physical and shipped free of charge.
**Date:** June 2026

---

## 1. Concept

The museum is free and keeps no visitor records. The raffle must honor that. The mechanism is a **bearer-token raffle**: the ticket itself is the identity. No accounts, no emails, no sign-up. Knowledge of a secret code is the only proof of winning.

End to end:

1. A visitor at weird.baby pulls a ticket — one click. The site issues the next number in the series (e.g., `Nº 047`) plus a **secret code** (e.g., `MX9-TRBL-K2F`), rendered as a designed digital ticket they download or screenshot. **It is shown once.** The museum keeps no copy of the secret — only a hash.
2. On the announced drawing date, one issued number is drawn and posted: *"Nº 047 wins."*
3. Whoever holds Ticket 047 proves it by submitting the secret through the claim form. Only the real holder can know it — the museum itself can't reproduce it.
4. The verified winner enters a shipping address — the only moment identity ever enters the system — the prize ships free, and the address is deleted after delivery.

The public number is the announcement. The secret is the verification. The ticket remembers so the museum doesn't have to.

---

## 2. The Ticket (Digital Artifact)

The ticket is a souvenir first and a raffle entry second. Most tickets never win; every ticket is a piece of the museum someone takes home — onto their camera roll instead of their pocket, but the ritual holds. Design it like an object, not a code dump.

### 2.1 Pulling a ticket

On `/drawing`, a single action: **PULL A TICKET**. On click:

1. Worker atomically issues the next sequential number and a freshly generated secret (see §3).
2. The page renders the ticket — a full vintage roll-ticket graphic (SVG/canvas) with the number and code set into it.
3. Two affordances, nothing else: **Download ticket** (PNG, suitably large) and **Copy code**.
4. A blunt warning, in museum voice: *"This is the only time you will ever see this code. We don't have a copy. Save the ticket or lose the entry."*
5. Once the visitor navigates away, the secret is unrecoverable — by them *and* by the museum.

The download filename should be anonymous-friendly: `weird-baby-drawing-S1-047.png`.

### 2.2 Ticket design

Vintage carnival roll-ticket DNA, subverted — this ticket admits you to nothing, because the museum is free and always open:

- 2:5-ish landscape proportion, heavy border rules, perforation tick-marks drawn along one edge, big `Nº`.
- Where `ADMIT ONE` would go: **KEEP THIS TICKET**.
- One ink color per series on an off-white "stock" field (S1 oxblood, S2 ink-blue…) — series become collectible by color. Two-tone, like letterpress.
- Front carries: museum name, `THE DRAWING`, `Nº 047 · S1`, the secret code in monospace, drawing date, `weird.baby/drawing`.
- Subtle paper-grain texture is allowed; skeuomorphic drop shadows are not. It should look like a scan of a beautiful object, not a 3D render of one.

### 2.3 Proposed ticket copy

```
        THE WEIRD BABY MUSEUM
              presents
           THE DRAWING

            Nº 047 · S1

   ─────────  KEEP THIS TICKET  ─────────

          MX9 · TRBL · K2F

      Drawn [DATE] · weird.baby/drawing
   The winner is announced, not notified.
```

Copy is a draft — Mike has final voice authority. Load-bearing facts: the code is shown once, drawing date, claim window, *announced not notified*.

---

## 3. Code System & Issuance

### 3.1 Public number

Sequential integer per series, zero-padded (`001`+). Purely an announcement handle. Issued atomically — use a **Durable Object counter** (or D1 with a transaction); plain KV is not safe for concurrent increments.

### 3.2 Secret code

- **Length:** 9 characters, displayed as 3 groups of 3.
- **Alphabet:** Crockford-style — uppercase letters and digits, **excluding** `0 O 1 I L U` (kills transcription ambiguity; dropping `U` avoids accidental profanity).
- **Entropy:** 30 usable characters → 30⁹ ≈ 1.9 × 10¹³ combinations. Unguessable at any feasible scale, short enough to retype from a screenshot without error.
- **Generation:** `crypto.getRandomValues` in the Worker at issuance time. Never `Math.random()`.

### 3.3 Storage model — hash-only, by design

At issuance the Worker:

1. Generates the secret.
2. Stores `{series, number, sha256(secret), issued_at}` — **the plaintext is never persisted anywhere.** It exists only in the HTTP response that renders the ticket.
3. Returns the ticket.

Consequences, all good ones:

- A compromised server leaks nothing claimable.
- The museum literally cannot identify or contact a winner, look up anyone's code, or "help" with a lost ticket. The system's privacy promise is enforced by architecture, not policy.
- The hash table **is** the ledger. Back it up (D1 export or KV dump) after each series opens and closes; it contains nothing sensitive.

### 3.4 Easter-egg codes (optional, very on-brand)

A small curated pool (≤5% of expected issuance) of hand-written codes containing buried readable fragments — a word from the museum's vocabulary hiding in the noise. Implementation: seed them as a pre-generated pool in D1; the issuance routine occasionally draws from the pool instead of generating randomly (e.g., every Nth ticket, or random 1-in-20). Pool entries store plaintext until issued, hash-and-purge on issuance. They win nothing extra. They mean nothing. Someone will notice one day and wonder, which is exactly the museum's relationship to its visitors.

### 3.5 Abuse: one human, many pulls

Anonymity means you can't perfectly enforce one-per-person. Don't try to fully solve it — surveillance breaks the premise. Layered soft limits:

- **Rate limit:** 1 pull per IP per 24h (Worker + KV counter). The over-limit message stays in voice: *"One ticket per visit. Come back tomorrow."*
- **Cloudflare Turnstile** on the pull action — invisible/anonymous bot check, free on the existing stack, no user data collected. Stops scripted draining of a series.
- **Series cap:** each series has a fixed maximum (suggest 500). When it's gone, the pull button becomes *"Series closed. Drawing [DATE]."* Scarcity is also flavor.
- Accept the residue: a determined human with a VPN gets a few extra tickets. Known cost of the premise. The prize economics (one free-shipped object) make industrial abuse pointless.

---

## 4. Web: `/drawing`

One route, three phases, two Worker endpoints (`POST /api/drawing/pull`, `POST /api/drawing/claim`).

### 4.1 Phase: OPEN (tickets available)

The board shows the series, count remaining (optional — scarcity vs. quiet, Mike's call), the drawing date, and the **PULL A TICKET** action. Pulling renders the ticket inline (§2.1).

### 4.2 Phase: DRAWN (winner announced, claim window open)

The winning number is the hero — set enormous, rendered as a giant ticket graphic. Below it, the claim form:

- Ticket number (pre-filled with the winning number, read-only)
- Secret code (single input; auto-uppercase; hyphens/dots/spaces stripped; inline note that `0 O 1 I L U` never appear in valid codes)

No name. No email. It verifies or it doesn't.

**Verification:** hash the normalized submission, compare to the stored hash for the winning number. Match → success state + a `claimed` flag and timestamp. No match → *"That code doesn't match this ticket."* Never reveal partial correctness. Rate-limit claims (5/IP/hour) — belt-and-suspenders given the keyspace, keeps logs quiet.

**Already claimed:** subsequent valid submissions see *"This ticket has already been claimed."* First verified claim wins (Rule 7).

### 4.3 Phase: CLOSED (claimed or rolled forward)

The board becomes an archive line: `S1 · Nº 047 · claimed` or `S2 · Nº 113 · unclaimed → redrawn Nº 008`. Past series accumulate below as a quiet history of the drawing.

### 4.4 Fulfillment (physical prize, shipped free)

On verified claim, the success state reveals a minimal shipping form — name (or "whatever the carrier needs to deliver"), address, country. Plus:

- Stored encrypted (or simply in D1 with the row deleted on fulfillment — state which in the code).
- A visible promise on the form itself: *"Used once, to ship your prize. Deleted after delivery. We go back to not knowing you."*
- After Mike marks the prize delivered (a tiny admin action — a flag flip behind the existing Mike-only unlock convention, no auth theater needed), the address row is hard-deleted.
- International shipping: Mike's call per series; state on the rules page which regions a series ships to *before* the drawing, not after.

### 4.5 Page design direction

The page should look like the ticket grew a room. Direction, not mockup — implementer has latitude:

- **Palette:** ticket-stock off-white field, one deep ink per series (matches the ticket ink). Two-tone, letterpress logic.
- **Type:** wood-type/condensed display for `THE DRAWING` and the winning number; monospace for codes and archive lines; quiet body face elsewhere.
- **Signature element:** the ticket itself — the same SVG component renders the pulled ticket, the winning announcement, and (tiny) the archive lines. One drawn object, three sizes.
- **Motion:** one moment maximum — the ticket could tear in along the perforation on pull, or the winning number could stamp in on reveal. Pick one. Otherwise still. The museum doesn't beckon.
- **States have copy, not mood.** Errors explain, never apologize. Empty states invite.
- Mobile-first per museum doctrine: the pull action, the ticket render, and the claim form must all be one-thumb operable; the ticket PNG must save cleanly from a phone long-press.

---

## 5. Rules of the Drawing (canonical)

1. One ticket per visitor per day, pulled freely at weird.baby/drawing. No purchase necessary; the museum is free.
2. Each series has a fixed ticket cap and a published drawing date. One number is drawn at random from issued numbers via CSPRNG; method stated on the rules page.
3. The winning number is posted at weird.baby/drawing on the drawing date. **The winner is announced, not notified** — checking is on you.
4. Claim window: **30 days** from announcement. A verified claim is a matching secret code.
5. Unclaimed after 30 days → redraw, announced the same way, with its own 30-day window. Maximum two redraws per series; then the prize rolls into the next series.
6. Lost codes are lost. The code is shown once and the museum keeps no copy; there is no recovery, because there is no record of you.
7. If a code leaks (screenshot shared, etc.), the first verified claim wins. Guarding the code is the holder's job.
8. The museum collects no personal information except a shipping address from a verified winner, used once and deleted after delivery. Prizes ship free of charge to regions stated per series.

**Legal note for Mike:** free-entry online drawings with no purchase necessary avoid most lottery/gambling statutes, but rules vary by state (and prizes shipped internationally pull in the recipient's jurisdiction too — another reason to declare eligible regions per series). Some states reserve the word "raffle" for registered nonprofits — **"drawing"** is both more accurate and cleaner. Before the first series: ten minutes on the operating state's AG sweepstakes page, and keep prize value modest for v1 (many registration thresholds start around $500–$5,000). Not legal advice; a sanity check.

---

## 6. Edge Cases & Failure Modes

| Case | Handling |
|---|---|
| Visitor closes the tab without saving | Code is gone for everyone, forever. Rule 6. The pre-pull warning exists for this. |
| Code typo on claim | Generic failure; rate limit allows retries; excluded-character note inline. |
| Two valid claims, same code | First verified claim wins. Second sees "already claimed." |
| Server compromise | Hashes + issuance metadata only — nothing claimable leaks. Rotate and continue. |
| Winner never appears | Two redraws, then the prize rolls forward (Rule 5). Archive line records it. |
| Scripted ticket-draining | Turnstile + IP rate limit + series cap (§3.5). Residual leakage accepted. |
| Address row lingers | Fulfillment flag-flip hard-deletes it; a scheduled Worker cron can sweep any row older than 90 days as a failsafe. |
| Winner in a non-shipped region | Prevented by declaring eligible regions per series before the drawing (Rule 8). |

---

## 7. Implementation Checklist

- [ ] `/drawing` route: OPEN / DRAWN / CLOSED phases, archive lines
- [ ] Ticket SVG component (one component, three render sizes) + PNG export
- [ ] `POST /api/drawing/pull`: Durable Object counter, CSPRNG secret, hash-only storage, Turnstile, IP rate limit, series cap
- [ ] `POST /api/drawing/claim`: normalize → hash → compare, claimed flag, rate limit
- [ ] Shipping form + encrypted/ephemeral storage + Mike's fulfillment flag + cron sweep
- [ ] Easter-egg code pool (optional, §3.4)
- [ ] Drawing procedure script (CSPRNG over issued numbers) + announcement update
- [ ] Rules page copy; eligible-regions line per series
- [ ] State-law sanity check before first announcement
- [ ] Hash-table backup on series open/close

---

## 8. What This Is Not

No accounts. No mailing list. No notification emails. No "enter your email to be notified." No recovery flow. The moment any of those appear, the system has failed its premise. The drawing works because the museum refuses to know its visitors — and with hash-only storage, that refusal is built into the architecture itself. The ticket remembers so the museum doesn't have to.
