# SUNDAY — SOCIAL SET-UP

Work down the page. Tick as you go. **Nothing here asks you to decide anything**
except one posting hour at the very end.

Everything has a first choice and two fallbacks. If the first is taken, take the
next. Do not stop to think about it.

**Time: about 90 minutes.** If it runs long, stop after PART 3 — that is
everything the site needs.

---

## ⚠️ BEFORE YOU START — DO THIS FIRST OR SUNDAY STALLS

**You need three email addresses. Instagram will not let two accounts share
one.**

- [ ] Cloudflare dashboard → **weird.baby** → **Email** → **Email Routing**
- [ ] Enable it if it is not on (it adds MX records for you)
- [ ] Create **`robots@weird.baby`** → forward to your real inbox
- [ ] Create **`music@weird.baby`** → forward to your real inbox
- [ ] Send yourself a test to each. **Do not continue until both arrive.**

*`papa@weird.baby` already exists and is already on the site. Leave it alone.*

**If the test mails have not arrived in 15 minutes**, MX records are still
propagating. Go make coffee. Come back. Do not proceed without them.

---

## THINGS YOU WILL NEED OPEN

- [ ] Cloudflare dashboard (the one that serves weird.baby)
- [ ] Your phone, for SMS codes
- [ ] `public/WeirdBaby_PhotoID.png` from the repo — **the profile picture for
      all three brands**
- [ ] This page

**Bio link for everything: `https://weird.baby`**

---

# PART 1 — BLUESKY (do this first)

**Why first: your handles here cannot be taken by anyone, ever, because they are
your domain. This is the only platform where that is true.** Doing it first also
gets DNS propagating while you do everything else.

## 1.1 — The house account

- [ ] Go to **bsky.app** → Create account
- [ ] Email: **`papa@weird.baby`**
- [ ] It will assign a temporary handle like `something.bsky.social` — **ignore
      it, you are replacing it**
- [ ] Display name: **`Weird.Baby`**
- [ ] Avatar: `WeirdBaby_PhotoID.png`
- [ ] Bio: one line, your words. Link: `https://weird.baby`

### Set the real handle

- [ ] **Settings → Account → Handle → "I have my own domain"**
- [ ] Type **`weird.baby`** (no `https://`, no `www`)
- [ ] It shows you a long value starting `did=`. **Copy it.**
- [ ] Cloudflare → weird.baby → **DNS** → Add record:
      - Type: **TXT**
      - Name: **`_atproto`**
      - Content: **the value you copied**
      - TTL: Auto
- [ ] Back in Bluesky → **Verify DNS Record**

*If it does not verify immediately, leave it. Come back at the end of Part 3.*

## 1.2 — Robots

- [ ] Bluesky → Add account → Create account
- [ ] Email: **`robots@weird.baby`**
- [ ] Display name: **`Weird.Baby Robots`**
- [ ] Settings → Account → Handle → I have my own domain →
      **`robots.weird.baby`**
- [ ] Cloudflare DNS → TXT → Name: **`_atproto.robots`** → the new value
- [ ] Verify

## 1.3 — Music

- [ ] Bluesky → Add account → Create account
- [ ] Email: **`music@weird.baby`**
- [ ] Display name: **`Weird.Baby Music`**
- [ ] Settings → Account → Handle → I have my own domain →
      **`music.weird.baby`**
- [ ] Cloudflare DNS → TXT → Name: **`_atproto.music`** → the new value
- [ ] Verify

**When all three are done you own `@weird.baby`, `@robots.weird.baby` and
`@music.weird.baby` permanently.**

---

# PART 2 — INSTAGRAM

**⚠️ Read this box before you touch it.**

> Instagram requires a **phone number** on every new account, and one number
> starts getting refused after a few. You are making three.
>
> **Make them one at a time**, using **Add account** from inside the app once
> you are logged into the first — not three cold signups.
>
> **If it refuses your number, STOP. Do the rest of the page and come back
> tomorrow.** Do not go looking for a virtual number. Losing a handle to a day's
> delay is recoverable; losing the account to a spam flag is not.

## 2.1 — Robots (do this one FIRST — it is the one the site promises)

Handle, in order of preference:

1. **`weirdbabyrobots`**
2. `weird.baby.robots`
3. `weirdbaby.robots`

- [ ] Sign up · Email **`robots@weird.baby`** · phone verify
- [ ] Handle: from the list above
- [ ] Name: **`Weird.Baby Robots`**
- [ ] Avatar: `WeirdBaby_PhotoID.png`
- [ ] Link: `https://weird.baby`
- [ ] **Settings → switch to a Professional account → Creator**
      *(gives you scheduling and stats; free; no downside)*
- [ ] **Settings → Threads → allow cross-posting.** Turn it on and forget it.
      This is not a platform you are taking on; it is a free mirror.

**SKIP:** Facebook page linking · contact buttons · shop · adding a category if
none fits · everything else it nags you about.

## 2.2 — Music

1. **`weirdbabymusic`**
2. `weird.baby.music`
3. `weirdbabymusic.official`

- [ ] Add account · Email **`music@weird.baby`**
- [ ] Name: **`Weird.Baby Music`** · avatar · link `https://weird.baby`
- [ ] Professional → Creator
- [ ] **This account holds the name. You are not starting a feed here.**

## 2.3 — House

1. **`weird.baby`**
2. `weirdbaby`
3. `weirddotbaby`

- [ ] Add account · Email **`papa@weird.baby`**
- [ ] Name: **`Weird.Baby`** · avatar · link `https://weird.baby`
- [ ] Bio: one line, your words
- [ ] **Post nothing here. Ever. It is a nameplate.**

*If the phone refuses on this third one — this is the one to skip. Come back
another day.*

---

# PART 3 — YOUTUBE (Music's home)

- [ ] Sign in with the Google account you want to own this. **If that is a new
      Google account, make it now with `music@weird.baby` as the recovery
      address.**
- [ ] youtube.com → your avatar → **Create a channel**
- [ ] Name: **`Weird.Baby Music`**

Handle, in order:

1. **`@weirdbabymusic`**
2. `@weird.baby.music`
3. `@weirdbabymsc`

> **Get it right first time.** YouTube limits handle changes to a small number
> per 14 days.

- [ ] Set the handle
- [ ] Avatar: `WeirdBaby_PhotoID.png`
- [ ] Channel description: one line, your words
- [ ] Links → **weird.baby**
- [ ] **Create a playlist called `Worth A Listen`.** Public. Leave it empty for
      now — it is the container, and it costs nothing to have ready.

**SKIP:** banner art · trailer · sections · monetisation · everything under
"grow your channel".

---

# PART 4 — HANDLES TO HOLD (5 minutes, no setup)

Register the name, upload the avatar, put `weird.baby` in the bio, **leave**.

## TikTok — three holds

- [ ] **`weirdbabyrobots`** *(fallbacks: `weird.baby.robots`, `wbrobots`)*
- [ ] **`weirdbabymusic`** *(fallbacks: `weird.baby.music`, `wbmusic`)*
- [ ] **`weirdbaby`** *(fallbacks: `weird.baby`, `weirddotbaby`)*

**You are not starting TikTok today.** It comes alive in week three, once the
Instagram rhythm is holding. Today it is a name you are stopping someone else
from taking.

## X / Twitter — only if it is easy

- [ ] **`weirdbaby`** *(fallbacks: `weirddotbaby`, `weirdbabyhq`)*

**Give it two minutes.** If it demands a phone number you have already spent, or
puts you in any kind of hold, **close the tab and never come back to it.** It is
not a channel for this; it is a name.

## Do not bother with

Facebook · Threads as its own thing (it comes with Instagram) · Pinterest ·
LinkedIn · Tumblr · Snapchat · Mastodon · Discord · Reddit.

*Reddit is genuinely the right audience for Robots and genuinely cannot be
broadcast to — it needs you there as a person, in their communities, by their
rules. That is a week-six conversation, not a Sunday task.*

---

# PART 5 — CLOSE OUT

- [ ] Go back to Bluesky and **verify any of the three domain handles that had
      not propagated.** All three should now show "Domain verified".
- [ ] **Write down every handle you actually got** at the bottom of this page.
      Ops needs the exact strings Monday.

## The one decision Sunday asks of you

**What hour do Robots posts go out?**

Tuesday / Thursday / Saturday, same time each day, for ninety days.

> **My hour is: ______________**

Pick it, write it, stop thinking about it.

---

# WHAT YOU ACTUALLY GOT

Fill this in. Ops reads it Monday.

```
BLUESKY
  house    @ _______________________
  robots   @ _______________________
  music    @ _______________________

INSTAGRAM
  robots   @ _______________________
  music    @ _______________________
  house    @ _______________________

YOUTUBE
  music    @ _______________________

TIKTOK  (held, not active)
  robots   @ _______________________
  music    @ _______________________
  house    @ _______________________

X  (held, or skipped)
  house    @ _______________________

POSTING HOUR: _______________
```

---

# WHAT HAPPENS NEXT — not Sunday, for information

- **Monday 17 Aug** — Record 001 posts, the Robots wing opens, and the FAQ line
  *"Follow us on social media"* goes live. **The handle needs to exist by then,
  which is what today was for.** Ops closes register row M60 and adds
  `twitter:site` to the share card.
- **Tuesday 18 Aug** — first real post. Robots. Instagram + Bluesky.
- **Then** — Tue / Thu / Sat, three a week, ninety days.
- **Week three** — TikTok wakes up, if the rhythm is holding.

**Nothing on this page tells you what to say.** That is yours.
