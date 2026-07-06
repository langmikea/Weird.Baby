# weird.baby — 50,000-Foot Infrastructure & Product Strategy Review
**Date:** 2026-04-14  
**Scope:** Backend infrastructure, user identity, community features, commerce — thinking broadly before any single feature gets built

---

## What We're Really Building

weird.baby is not a music streaming app. It is not a fan forum. It is not an e-commerce store.

It is a **living digital museum** — a curatorial entity with a voice, a growing roster of artists, and a community of people who care enough to contribute. The HR exhibit is exhibit one. Jesse Welles is exhibit two in the wings. The museum will grow.

That framing matters because it changes the infrastructure question entirely. A streaming app needs a CDN and a playlist API. A museum needs an **identity layer, a contribution layer, and a commerce layer** — and those three things need to be designed together, not bolted on one at a time.

---

## The Features That Require a Backend

Right now weird.baby is fully static. That's clean and fast. But here is every feature on the current or foreseeable roadmap that **requires server-side persistence**:

| Feature | Requires |
|---|---|
| Fan playlists | Write (create), Read (browse), soft delete |
| Fan journal / guestbook | Write, Read, optional delete |
| Upvotes / downvotes on anything | Write (vote), Read (count), dedup by identity |
| User accounts (optional) | Auth, profile, session |
| Saved/hearted playlists | Write per user, Read |
| Store (merch, downloads, future) | Payments, orders, fulfillment |
| Stem archive (locked content) | Auth-gated file access |
| Submission moderation queue | Write (flag), Read (admin view) |
| Artist Time Capsule (future) | Gated video access |

Every single one of these shares **one underlying need**: a place to write data that persists, and optionally a concept of who is writing it.

---

## The Identity Question — Answer It Once

The biggest architectural decision on the horizon is **user identity**. Get this right once, don't solve it five different ways.

### The spectrum:

**Option A — No identity, ever**  
Anonymous writes everywhere. Hearts stored in localStorage. Playlists attributed by name string only. Simple. Fast. Fragile at scale. No way to let someone "own" their submissions, edit them, or build a history.

**Option B — Optional lightweight identity**  
"Continue as guest" or "Create an account." No-account path always exists (zero friction preserved). Accounts unlock: editing your own submissions, cross-device heart sync, upvote dedup, future store history. This is the right model for weird.baby.

**Option C — Required accounts**  
Wrong for this audience and this brand. Never do this.

**Recommendation: Option B.**  
Build the system so anonymous works everywhere, always. But offer an account as an upgrade — "claim your playlist," "save your history," "get notified when someone hearts your journal entry." The account is a reward, not a toll.

---

## What Backend Stack Makes Sense

weird.baby is currently a Cloudflare Worker + static site. That's the right foundation. Here's how to extend it without overbuilding:

### Recommended: Cloudflare stack, all the way down

| Layer | Tool | Why |
|---|---|---|
| Database | **Cloudflare D1** (SQLite at the edge) | Already in the CF ecosystem; free tier is generous; SQL is familiar; works perfectly with Workers |
| Auth | **Clerk** or **Cloudflare Access** | Clerk is the fastest path to "optional login with email/social"; integrates with Workers; generous free tier |
| File storage (stems, future) | **Cloudflare R2** | S3-compatible; zero egress fees; already in ecosystem |
| Payments (store) | **Stripe** | Standard. When you're ready. |
| Email (notifications) | **Resend** or **Postmark** | Simple transactional email; easy Worker integration |

**Why stay in the Cloudflare ecosystem?**  
You're already there. Workers are already routing weird.baby traffic. D1 + R2 live in the same dashboard. Latency is at the edge globally. The free tiers are real. There's no separate server to manage or pay for. When volume grows, you scale within the same system.

**What to avoid:**  
- Firebase/Supabase: more powerful than needed, adds vendor complexity outside your existing stack  
- Vercel/Next.js rewrite: unnecessary; the site isn't a React app  
- Rolling a custom auth system: never do this  

---

## The Data Model That Ties It Together

Design the schema now so features don't collide later.

```sql
-- Core identity
users (id, email, display_name, created_at, is_admin)

-- Fan contributions (polymorphic)
contributions (
  id, user_id (nullable — anonymous OK),
  type ENUM('playlist','journal_entry'),
  title, body, submitted_at, is_visible, flagged
)

-- Playlist tracks (child of contributions where type='playlist')
playlist_tracks (contribution_id, track_id, position)

-- Reactions (hearts, upvotes, downvotes)
reactions (
  id, contribution_id, user_id (nullable),
  fingerprint (anonymous dedup — IP+UA hash),
  type ENUM('heart','upvote','downvote'), created_at
)

-- Store (when ready)
orders (id, user_id (nullable), items_json, total, stripe_id, created_at)
```

This schema handles: fan playlists, journal entries, hearts, up/downvotes, anonymous and authenticated users, and future store orders — all from one coherent foundation.

---

## The Journal

The journal wasn't part of today's conversation but it belongs in this picture. It is the same infrastructure as playlists: a fan writes something, it gets a name, it goes live, others can react to it. The only difference is the content type.

If we design the contributions table as polymorphic (one table, multiple types), journal and playlists share 90% of their backend. Build them together or at least design them together.

---

## Upvotes and Downvotes

Reddit-style voting on fan contributions (playlists, journal entries, eventually anything). The schema above supports this. The key design decision is **dedup strategy for anonymous voters**:

- Logged-in users: one vote per user per item, stored by user_id
- Anonymous users: one vote per fingerprint (IP + user agent hash), stored server-side — not localStorage (too easy to clear)
- If a user logs in after voting anonymously, migrate their fingerprint votes to their account

---

## The Store

Not now. But design nothing that makes it harder. Stripe is the only right answer. When the time comes: merch, digital downloads (stems, live recordings), maybe ticketing. The `users` table and `orders` table above are placeholders that cost nothing to define now.

---

## The Moderation Reality

With zero-friction anonymous submissions, you will eventually get something you need to remove. The mitigation is lightweight:

1. Every contribution has `is_visible` (default true) and `flagged` fields
2. A hidden admin route (not linked anywhere, just a URL you know) shows flagged or recent items with a one-click hide button
3. Optionally, a webhook or email fires when a new submission comes in — so you see it within hours, not days

This is 2 hours of work. It's worth doing at launch, not after the first bad submission.

---

## Phased Build Plan

### Phase 0 — Now (no backend)
- Fan playlists: stored in a static JSON file, committed to the repo
- Submission form: posts to a Cloudflare Worker that appends to the JSON and commits via GitHub API
- Hearts: localStorage only
- This is the fastest path to shipped. It breaks at scale but fine for launch.

### Phase 1 — First real backend (when submissions start flowing)
- Spin up Cloudflare D1
- Migrate playlists and hearts to D1
- Add journal entries on the same schema
- Anonymous fingerprint-based dedup for hearts/votes
- Admin moderation route

### Phase 2 — Optional accounts
- Add Clerk for auth
- "Claim your playlist" flow for existing anonymous submissions
- Cross-device heart sync
- User profile page (all your contributions in one place)

### Phase 3 — Store
- Stripe integration
- Product catalog (R2-backed for digital goods)
- Order history tied to user accounts

---

## The Right Question to Ask Before Any Feature

> "Does this require a write that needs to persist beyond one browser session?"

If yes → it needs a backend. Design it in D1. If no → ship it statically and migrate later.

---

## Summary Recommendation

**Don't build a backend for fan playlists alone. Build it for the museum.**

The schema above is one afternoon of SQL. The Cloudflare D1 setup is one afternoon of Workers code. Do it once, right, and every feature from here — playlists, journal, votes, accounts, store — drops into the same foundation instead of being bolted on as separate systems that don't talk to each other.

The museum is the product. The backend is the museum's infrastructure. Design it like a museum, not like a feature list.
