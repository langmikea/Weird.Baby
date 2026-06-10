# SCOPE — verbatim tab/deck layout extract (left-rail relayout prep)

**Repo HEAD:** `36b2182` · **`origin/main`:** `36b2182` · **Equal? YES** · **`src/` clean? YES** (only dirty paths are `CLAUDE.md`, `docs/SCOPE-token-mirror.md`, and untracked `docs/HANDOFF_relayout_scope.md` — none under `src/`).
**Generated:** 2026-06-09T23:35:26Z · **Mode:** READ-ONLY, zero edits.
**Purpose:** Exact current contents of the tab/deck layout spans, verbatim with line numbers, so a surgical patch plan can be drafted against real anchors. No edits, no recommendations.

**Line-drift check vs. `docs/HANDOFF_relayout_scope.md`:** NONE. Both documents were generated at the same HEAD (`36b2182`), so every anchor the relayout-scope handoff cited matches the live line numbers exactly. The one wording note: the `TABS` block's own comment header (line 173) says "six entries," but the array literal holds **five** (`artist`, `media`, `deep`, `presets`, `journal`); the sixth — the close "▾" tab — is injected only at render time (JSX lines 3587–3598), exactly as the handoff described. Flagged inline below.

---

## `src/routes/hr/HrExhibitFlow.jsx`

### Deck constants — `TAB_PEEK`, `TAB_STRIP_H`, `DECK_MIN_H`, `DECK_MAX_FRAC`, `DECK_DEFAULT_H_SHARED`, `STORAGE_KEY` (`wb-hr-deck-height`) — lines 146–157

```jsx
146	// ─── DECK CONSTANTS — preserved from v28, STORAGE_KEY HR-namespaced ─────────
147	const TAB_PEEK = 30;  // === full strip; previously 14 (1/3 peek) but labels were clipped
148	const TAB_STRIP_H = 30;
149	const DECK_MIN_H = 200;
150	const DECK_MAX_FRAC = 0.75;
151	const DECK_DEFAULT_H_SHARED = 480;
152	const STORAGE_KEY = "wb-hr-deck-height"; // O7 — matches wb-hr-split / wb-hr-cfh
153	// Preset persistence (UX_CONTROLS_SPEC v0.4 §9.5: v1 = localStorage,
154	// exhibit-scoped, no login). HR-namespaced per O7 convention, so the key is
155	// exhibit-scoped by construction. Lifecycle §4.5's MV-artifact promotion is
156	// a later phase; this key/format is the v1 store it would migrate from.
157	const PRESETS_STORAGE_KEY = "wb-hr-presets";
```

> Note: `TAB_PEEK` and `TAB_STRIP_H` are both `30` despite the comment's historical "1/3 peek (14)" reference; `DECK_MAX_FRAC` (0.75) and `DECK_DEFAULT_H_SHARED` (480) sit in the same block and are referenced by the resize clamp and the `deckHeight` initializer — included for completeness.

### Color mirror constants — lines 104–132

```jsx
104	// ─── COLOR / FONT TOKENS ────────────────────────────────────────────────────
105	// Phase 4b: retargeted from the deck's v28 warm-amber palette to the
106	// canonical museum palette in src/styles/museum-tokens.css. These constants
107	// mirror the --hr-* CSS variables so every S.* inline-style builder picks up
108	// the new look automatically.
109	const INK = "#ece9e0";
110	const INK_SOFT = "#e2ded3";
111	const INK_CARD = "#faf8f3";          // solid hex, not rgba (Q3 flattened)
112	const INK_CARD_HI = "#ffffff";       // solid hex, not rgba
113	const BORDER = "#c6c2b7";
114	const BORDER_HI = "#a9a59a";
115	// 2026-06-07 B&W rework PASS 2 (Mike: light "photo album page"): the ink
116	// ladder flips to paper stock, the accent constants go photo-black — names
117	// kept (plumbing), read GOLD as "accent". Single-tone pattern preserved.
118	const GOLD = "#211f1c";
119	const GOLD_HI = "#000000";  // synced to --hr-gold-hi (deepest tier)
120	const GOLD_LO = "#57544d";  // synced to --hr-gold-lo (dim tier)
121	const GOLD_MUTE = "#9b978d";
122	const DIM = "#3b3933";       // synced to --hr-dim (body)
123	// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
124	// Kaleidoscope LED palette — re-tuned to v17's museum gold, not v3's neon.
125	// (Used inline by the mothballed VuMeter, which is never rendered.)
126	const LED_OFF = "#1f1a0e";
127	const LED_GREEN = "#8a9a4a";
128	const LED_YELLOW = "#c8a050";
129	const LED_RED = "#c86040";
130	// Reference these to silence no-unused-vars while keeping them on hand for
131	// the post-launch Kaleidoscope revival.
132	void [LED_OFF, LED_GREEN, LED_YELLOW, LED_RED];
```

### `TABS` definition — lines 173–188

```jsx
173	// ─── TABS — six entries; Journal sits last among functional tabs ────────────
174	// Stage 3 placement: Journal sits AFTER the v28_3 functional tabs in their
175	// v28_3 order (Artist · Formats · Deep Tracks · Presets), then ✕. This is
176	// the "default to last" call from the visitor-consequence brief — v28_3
177	// doesn't include Journal, so there's no more-natural insertion point to
178	// surface; Journal becomes the right-most non-close tab. Was position 4
179	// (between Deep Tracks and Presets) in Stage 2; moved to position 5 here.
180	const TABS = [
181	  { key: "artist",  label: "Artist",      kind: "tier",    tier: 1, width: 120 },
182	  // 2026-06-07 Mike: "Formats" → "Source" — the tab's actual content is the
183	  // Source column (plus content/card kind, re-tiered in vocabulary.json).
184	  { key: "media",   label: "Source",      kind: "tier",    tier: 2, width: 130 },
185	  { key: "deep",    label: "Deep Tracks", kind: "tier",    tier: 3, width: 120 },
186	  { key: "presets", label: "Presets",     kind: "special", special: "presets", width: 110 },
187	  { key: "journal", label: "Journal",     kind: "special", special: "journal", width: 110 },
188	];
```

> ⚠️ Comment says "six entries" (line 173); the array literal holds **five**. No `close`/`kind:"close"` entry exists in `TABS` — the close tab is synthesized at render (lines 3587–3598). Each tab carries an explicit `width` (px) consumed by `S.tab(...)`.

### `S.panelPos` — lines 281–286

```jsx
281	const S = {
282	  // panelPos: positions the artifact-grid pane above the deck. deckPx changes
283	  // as the deck peeks / opens / resizes.
284	  panelPos: (deckPx) => ({
285	    position: "absolute", left: 0, right: 0, top: 0, bottom: deckPx + "px",
286	  }),
```

### `S.deck` — lines 288–311

```jsx
288	  // deck: bottom-anchored. height swings between TAB_PEEK / TAB_STRIP_H /
289	  // resizable open height.
290	  deck: (deckPx) => ({
291	    /* `position: fixed` so the deck pins to the viewport bottom
292	       regardless of the section's scroll-snap-align: center. With
293	       `absolute` it followed the section, which is centered in the
294	       viewport with a 32px gap above and below — that gap pushed the
295	       tabs 32px above viewport bottom. */
296	    position: "fixed", left: 0, right: 0,
297	    height: deckPx + "px",
298	    background: "transparent",
299	    zIndex: 10,
300	    pointerEvents: "none",
301	    /* `bottom` is set by .hr-deck in HrExhibitFlow.css so it can be
302	       conditional on whether the player bar is in the DOM (60 when
303	       playing, 0 when not).
304	       Clip the tab strip's bottom-overhang at the deck's bottom edge.
305	       The strip is 42px tall but the closed-idle deck is only 14px
306	       (TAB_PEEK), so 28px hangs below. Without overflow:hidden the
307	       hangover is visible in any gap between deck and viewport (or
308	       deck and player bar). Original layout relied on the viewport
309	       edge for this clip; explicit clip is more robust. */
310	    overflow: "hidden",
311	  }),
```

### `S.tab` — lines 313–339

```jsx
313	  // tab: per-tab chrome. Active = bright + bold + INK_SOFT fill, no
314	  // bottom rule under tab (cover element below merges with deck-body).
315	  // Inactive = GOLD_LO border + dim text. isClose = small ✕ tab.
316	  tab: (active, deckOpen, width, isClose) => {
317	    const borderColor = active ? GOLD_HI : GOLD_LO;
318	    const textColor   = active ? GOLD_HI : DIM;
319	    return {
320	      position: "relative",  // anchor for the active-tab bottom-cover
321	      cursor: "pointer", fontFamily: sansBody,
322	      fontSize: isClose ? "14px" : "10.5px",
323	      letterSpacing: isClose ? "0" : "0.12em",
324	      textTransform: isClose ? "none" : "uppercase",
325	      fontWeight: active ? 900 : 500,
326	      color: textColor,
327	      background: active ? INK_SOFT : INK,
328	      border: `1px solid ${borderColor}`, borderBottom: "none",
329	      borderTopLeftRadius: "6px", borderTopRightRadius: "6px",
330	      height: TAB_STRIP_H + "px",
331	      width: width + "px", minWidth: width + "px",
332	      display: "flex", alignItems: "center", justifyContent: "center",
333	      gap: "6px",
334	      transition: "border-color 0.12s, color 0.12s, font-weight 0.12s, background 0.12s",
335	      padding: "0 6px", boxSizing: "border-box",
336	      flexShrink: 0, marginRight: "2px",
337	      whiteSpace: "nowrap", overflow: "visible", textOverflow: "ellipsis",
338	    };
339	  },
```

> Note: `deckOpen` is a declared parameter but is not referenced in the body. `borderTopLeftRadius`/`borderTopRightRadius` + `borderBottom:"none"` and `height: TAB_STRIP_H` encode the top-edge-of-a-bottom-dock geometry.

### `S.resizeHandle` — lines 341–350

```jsx
341	  // resizeHandle: ns-resize affordance at top of deckBody.
342	  resizeHandle: (hovered) => ({
343	    position: "absolute", top: "-4px",
344	    left: 0, right: 0, height: "8px",
345	    cursor: "ns-resize", zIndex: 14,
346	    background: hovered
347	      ? `linear-gradient(to bottom, transparent 0%, ${GOLD_LO} 45%, ${GOLD_LO} 55%, transparent 100%)`
348	      : "transparent",
349	    transition: "background 0.15s",
350	  }),
```

### State: `activeTab` / `hoverPeek` / `deckHeight` initializer — lines 3274–3287

```jsx
3274	  const [activeTab, setActiveTab] = useState(null);
3275	  const [hoverPeek, setHoverPeek] = useState(false);
3276	  const [deckHeight, setDeckHeight] = useState(() => {
3277	    try {
3278	      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
3279	      if (raw) {
3280	        const n = parseInt(raw, 10);
3281	        if (!isNaN(n) && n >= DECK_MIN_H) return n;
3282	      }
3283	    } catch { /* ignore */ }
3284	    return DECK_DEFAULT_H_SHARED;
3285	  });
3286	  const [resizing, setResizing] = useState(false);
3287	  const [resizeHover, setResizeHover] = useState(false);
```

### Hover handlers + `open` / `deckPx` derivation + `handleTabClick` + `startResize` + `currentTab` — lines 3404–3463

```jsx
3404	  const scheduleHoverOpen = () => {
3405	    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
3406	    hoverTimerRef.current = setTimeout(() => { setHoverPeek(true); }, HOVER_DELAY_OPEN);
3407	  };
3408	  const scheduleHoverClose = () => {
3409	    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
3410	    hoverTimerRef.current = setTimeout(() => { setHoverPeek(false); }, HOVER_DELAY_CLOSE);
3411	  };
3412	  const cancelHoverTimer = () => {
3413	    if (hoverTimerRef.current) {
3414	      clearTimeout(hoverTimerRef.current);
3415	      hoverTimerRef.current = null;
3416	    }
3417	  };
3418	
3419	  const open = activeTab !== null && activeTab !== "close";
3420	  let deckPx;
3421	  if (open) deckPx = deckHeight;
3422	  else if (hoverPeek) deckPx = TAB_STRIP_H;
3423	  else deckPx = TAB_PEEK;
3424	
3425	  const handleTabClick = (tabKey) => {
3426	    if (tabKey === "close") { setActiveTab(null); setHoverPeek(false); return; }
3427	    if (activeTab === tabKey) { setActiveTab(null); setHoverPeek(false); return; }
3428	    setActiveTab(tabKey);
3429	    setHoverPeek(false);
3430	    if (tabKey === "deep" && !searchAutoFocusedRef.current) {
3431	      setSearchFocusSignal(s => s + 1);
3432	      searchAutoFocusedRef.current = true;
3433	    }
3434	  };
3435	
3436	  const startResize = useCallback((e) => {
3437	    e.preventDefault(); e.stopPropagation();
3438	    setResizing(true);
3439	    const startY = e.clientY, startH = deckHeight, vh = window.innerHeight;
3440	    const onMove = (me) => {
3441	      const dy = me.clientY - startY;
3442	      let next = startH - dy;
3443	      next = Math.max(DECK_MIN_H, Math.min(next, vh * DECK_MAX_FRAC));
3444	      setDeckHeight(next);
3445	    };
3446	    const onUp = () => {
3447	      setResizing(false);
3448	      window.removeEventListener("mousemove", onMove);
3449	      window.removeEventListener("mouseup", onUp);
3450	    };
3451	    window.addEventListener("mousemove", onMove);
3452	    window.addEventListener("mouseup", onUp);
3453	  }, [deckHeight]);
3454	
3455	  const animClass = "animated" + (resizing ? " resizing" : (!open && hoverPeek ? " quick" : ""));
3456	  const panelClickHandler = () => {
3457	    if (open || hoverPeek) {
3458	      setActiveTab(null); setHoverPeek(false); cancelHoverTimer();
3459	    }
3460	  };
3461	  const currentTab = activeTab && activeTab !== "close"
3462	    ? TABS.find(t => t.key === activeTab)
3463	    : null;
```

> Note: `deckPx` is `let`-derived each render (3420–3423), not state. `startResize` reads `e.clientY` and computes `startH - dy` — a pure vertical-axis drag. `handleTabClick` and `panelClickHandler` reference `"close"` though no `TABS` entry has that key (the synthesized close tab calls `setActiveTab(null)` directly at 3593, not via `handleTabClick`). `HOVER_DELAY_OPEN`/`HOVER_DELAY_CLOSE` and `hoverTimerRef` are declared elsewhere (not in the requested spans).

### Deck-host render — grid pane (`S.panelPos`) through tab-strip + deck-body — lines 3518–3644

```jsx
3518	      {/* DECK HOST ΓÇö sized so the deck can sit at its bottom via sticky
3519	          positioning. The grid scrolls inside hr-section-deck-host. */}
3520	      <div className="hr-section-deck-host">
3521	        <div className={"animated " + (resizing ? "resizing " : (!open && hoverPeek ? "quick " : ""))}
3522	             style={{ ...S.panelPos(deckPx), position: "absolute" }}
3523	             onClick={panelClickHandler}>
3524	          <div className="wb-scroll hr-panel-scroll">
3525	            <P3Panel
3526	              matched={finalMatched}
3527	              totalCount={ARTIFACTS.length}
3528	              playingAudioId={playingAudioId}
3529	              setPlayingAudioId={setPlayingAudioId}
3530	              onOpenGallery={setOpenGallery}
3531	              onOpenAlbum={setOpenAlbum}
3532	              onOpenYouTube={setOpenYouTube}
3533	              onOpenFacebook={setOpenFacebook}
3534	              onOpenPhoto={setOpenPhoto}
3535	            />
3536	          </div>
3537	        </div>
3538	
3539	        <div className={"hr-deck " + animClass} style={S.deck(deckPx)} onClick={(e) => e.stopPropagation()}>
3540	          <div
3541	            className="hr-tab-strip"
3542	            onMouseEnter={() => { if (!open) { cancelHoverTimer(); scheduleHoverOpen(); } }}
3543	            onMouseLeave={() => { if (!open) scheduleHoverClose(); }}
3544	          >
3545	            {TABS.filter(t => t.key !== "journal").map(t => {
3546	              const isActive = activeTab === t.key;
3547	              const isClose = t.kind === "close";
3548	              return (
3549	                <div
3550	                  key={t.key}
3551	                  className={isActive ? "" : "tab-hoverable"}
3552	                  style={S.tab(isActive, open, t.width, isClose)}
3553	                  onClick={(e) => { e.stopPropagation(); handleTabClick(t.key); }}
3554	                  role="button"
3555	                  title={t.label}
3556	                >
3557	                  <span>{t.label}</span>
3558	                  {(() => {
3559	                    const has = tabHasSelection(t);
3560	                    return (
3561	                      <span
3562	                        role={has ? "button" : undefined}
3563	                        title={has ? `clear ${t.label.toLowerCase()} selections` : undefined}
3564	                        onClick={has ? (e) => { e.stopPropagation(); clearTab(t.key); } : undefined}
3565	                        style={{
3566	                          position: "absolute", top: 2, right: 4,
3567	                          fontSize: 12, lineHeight: 1, padding: "0 4px",
3568	                          cursor: has ? "pointer" : "default",
3569	                          color: GOLD_HI,
3570	                          opacity: has ? 0.85 : 0.18,
3571	                          transition: "opacity 0.12s",
3572	                        }}
3573	                        onMouseEnter={has ? (e) => { e.currentTarget.style.opacity = "1"; } : undefined}
3574	                        onMouseLeave={has ? (e) => { e.currentTarget.style.opacity = "0.85"; } : undefined}
3575	                      >{"✕"}</span>
3576	                    );
3577	                  })()}
3578	                  {isActive && open && (
3579	                    <span aria-hidden style={{
3580	                      position: "absolute", left: -1, right: -1, bottom: -1,
3581	                      height: 1, background: INK_SOFT, pointerEvents: "none",
3582	                    }} />
3583	                  )}
3584	                </div>
3585	              );
3586	            })}
3587	            {open && (
3588	              <div
3589	                role="button"
3590	                aria-label="Hide panel"
3591	                title="Hide panel"
3592	                className="tab-hoverable"
3593	                onClick={(e) => { e.stopPropagation(); setActiveTab(null); setHoverPeek(false); cancelHoverTimer(); }}
3594	                style={S.tab(false, open, 34, true)}
3595	              >
3596	                <span aria-hidden="true">▾</span>
3597	              </div>
3598	            )}
3599	          </div>
3600	
3601	          {open && currentTab && (
3602	            <div className="hr-deck-body">
3603	              <div
3604	                style={S.resizeHandle(resizeHover || resizing)}
3605	                onMouseDown={startResize}
3606	                onMouseEnter={() => setResizeHover(true)}
3607	                onMouseLeave={() => setResizeHover(false)}
3608	              />
3609	              {currentTab.kind === "tier" && (() => {
3610	                const dims = HR_DIMENSIONS.filter(d => d.tier === currentTab.tier);
3611	                if (currentTab.key === "deep") {
3612	                  return (
3613	                    <DeepTracksContent
3614	                      dims={dims} selected={selected} toggle={toggle}
3615	                      query={query} setQuery={setQuery}
3616	                      focusSignal={searchFocusSignal}
3617	                    />
3618	                  );
3619	                }
3620	                return (
3621	                  <TierContent
3622	                    dims={dims} selected={selected} toggle={toggle}
3623	                  />
3624	                );
3625	              })()}
3626	              {currentTab.kind === "special" && currentTab.special === "journal" && (
3627	                <JournalContent prompts={HR_JOURNAL_PROMPTS} eraFilter={null} />
3628	              )}
3629	              {currentTab.kind === "special" && currentTab.special === "presets" && (
3630	                <PresetsContent
3631	                  userPresets={userPresets} setUserPresets={setUserPresets}
3632	                  selected={selected} setSelected={setSelected}
3633	                  shuffle={shuffle} setShuffle={setShuffle}
3634	                  loop={loop} setLoop={setLoop}
3635	                  playingTrack={playingTrack} spinePosition={spinePosition}
3636	                  onRestorePlayer={onRestorePlayer}
3637	                  peekSelected={peekSelected} setPeekSelected={setPeekSelected}
3638	                  applyFactoryPreset={applyFactoryPreset}
3639	                />
3640	              )}
3641	            </div>
3642	          )}
3643	        </div>
3644	      </div>
```

> Note: lines 3518–3538 (the grid pane that consumes `S.panelPos`) are included for context since `S.panelPos` reserves the deck's space; the brief's `~3539–3642` range begins at the `.hr-deck` div (3539). The strip filters out `journal` (3545) so it renders no Journal tab today, yet the body still has a `special:"journal"` branch (3626). The `tabHasSelection`, `clearTab`, `HR_DIMENSIONS`, and the content components are defined elsewhere (outside the requested spans).

---

## `src/routes/hr/HrExhibitFlow.css`

### `.hr-section-deck-host` + `.hr-panel-scroll` — lines 46–63

```css
46	/* ── Deck host ─────────────────────────────────────────────────────────── */
47	/* Sized so the deck can sit at its bottom via sticky positioning. Inside
48	   this host we place an absolutely-positioned panel (the grid pane) and a
49	   sticky-bottom deck. The panel scrolls; the deck is always reachable. */
50	.hr-section-deck-host {
51	  position: relative;
52	  flex: 1;
53	  min-height: calc(100vh - 64px);
54	  overflow: hidden;
55	}
56	
57	/* ── Panel (artifact grid pane above the deck) ─────────────────────────── */
58	.hr-panel-scroll {
59	  position: absolute;
60	  inset: 0;
61	  overflow-y: auto;
62	  padding: 1.25rem 1.5rem;
63	}
```

### `.hr-deck` + `.hr-tab-strip` + `.hr-strip-clear-btn` + `.tab-hoverable` + `.hr-deck-body` + `.hr-scroll-fade-wrap` — lines 544–609

```css
544	/* ── Deck container ─────────────────────────────────────────────────────
545	   Bottom offset is conditional on whether the player bar (.pb in
546	   Exhibit.css) is in the DOM. PlayerBar returns null when no video is
547	   playing, so .pb is absent and the deck docks at viewport bottom.
548	   When a video plays, .pb is rendered and the :has() rule lifts the
549	   deck by the player bar's height (60px) so the tabs sit above it. */
550	.hr-deck { bottom: 0; transition: bottom 0.18s ease; }
551	body:has(.pb) .hr-deck { bottom: 60px; }
552	
553	/* ── Tab strip ─────────────────────────────────────────────────────────── */
554	.hr-tab-strip {
555	  position: absolute;
556	  top: 0; left: 12px; right: 12px;
557	  height: 30px;
558	  display: flex;
559	  align-items: flex-end;
560	  pointer-events: auto;
561	  z-index: 12;
562	  user-select: none;
563	}
564	.hr-strip-clear-btn {
565	  margin-left: 12px;
566	  align-self: center;
567	  background: transparent;
568	  border: 1px solid var(--hr-gold-lo);
569	  color: var(--hr-gold);
570	  font-family: var(--hr-sans);
571	  font-size: 9.5px;
572	  letter-spacing: 0.22em;
573	  text-transform: uppercase;
574	  font-weight: 500;
575	  padding: 4px 10px;
576	  cursor: pointer;
577	  transition: all 0.15s;
578	  white-space: nowrap;
579	  height: 24px;
580	  box-sizing: border-box;
581	  flex-shrink: 0;
582	}
583	.hr-strip-clear-btn:hover {
584	  border-color: var(--hr-gold);
585	  color: var(--hr-gold-hi);
586	}
587	
588	/* tab-hoverable applies to inactive tab divs */
589	.tab-hoverable:hover { border-color: var(--hr-gold) !important; color: var(--hr-gold-hi) !important; }
590	
591	/* ── Deck body (the panel that opens upward) ───────────────────────────── */
592	.hr-deck-body {
593	  position: absolute;
594	  top: 30px; left: 0; right: 0; bottom: 0;
595	  background: #e7e3d8;
596	  border-top: 1px solid var(--hr-gold-lo);
597	  pointer-events: auto;
598	  display: flex;
599	  flex-direction: column;
600	  overflow: hidden;
601	}
602	
603	/* ── Scroll wrapper / content body ─────────────────────────────────────── */
604	.hr-scroll-fade-wrap {
605	  position: relative;
606	  flex: 1;
607	  min-height: 0;
608	  display: flex;
609	}
```

### Deck open/peek/resize transitions — `.animated` / `.animated.quick` / `.animated.resizing` — lines 805–814

```css
805	.animated {
806	  transition: height 180ms cubic-bezier(0.3, 0.7, 0.2, 1),
807	              bottom 180ms cubic-bezier(0.3, 0.7, 0.2, 1);
808	}
809	.animated.quick {
810	  transition: height 120ms ease-out, bottom 120ms ease-out;
811	}
812	.animated.resizing {
813	  transition: none;
814	}
```

> Note: the `animClass` from the JSX (line 3455) maps here. The animated properties are `height` and `bottom` — both vertical-axis. Included because they are "`.hr-deck`/resize-handle rules in that neighborhood" the deck depends on for its open/peek motion.

### Mobile `@media (max-width: 720px)` — deck-hide + pill reflow — lines 1198–1242

```css
1198	@media (max-width: 720px) {
1199	  .hr-section-deck-host { overflow: visible; min-height: auto; }
1200	  .hr-panel-scroll {
1201	    position: static;
1202	    inset: auto;
1203	    overflow-y: visible;
1204	    padding: 1rem 0.75rem;
1205	  }
1206	  .hr-tab-strip,
1207	  .hr-deck-body {
1208	    display: none;
1209	  }
1210	  /* Hide the absolute deck chrome entirely. */
1211	  .hr-section .animated {
1212	    transition: none;
1213	  }
1214	  .hr-section .hr-section-deck-host > .animated:not(:first-child) {
1215	    display: none;
1216	  }
1217	  /* §8.1 — factory presets as a tappable pill stack above the inline
1218	     pill columns. Matches the pill-stack idiom below. */
1219	  .hr-mobile-presets {
1220	    display: flex;
1221	    flex-direction: column;
1222	    gap: 8px;
1223	    padding: 12px 12px 4px;
1224	    border-bottom: 1px solid var(--hr-border);
1225	  }
1226	  .hr-mobile-preset-pill {
1227	    display: flex;
1228	    flex-direction: column;
1229	    gap: 2px;
1230	    padding: 8px 10px;
1231	    border: 1px solid var(--hr-border);
1232	    border-radius: 4px;
1233	    cursor: pointer;
1234	  }
1235	  /* Show the inline pill stack at the top of the section. */
1236	  .hr-mobile-pills {
1237	    display: flex;
1238	    flex-direction: column;
1239	    gap: 16px;
1240	    padding: 12px 12px 4px;
1241	    border-bottom: 1px solid var(--hr-border);
1242	  }
```

> Note: below 720px the entire absolute deck (`.hr-tab-strip`, `.hr-deck-body`, and the second `.animated` child) is hidden and pill columns reflow inline. Included because any left-rail relayout interacts with this mobile fallback. The `@media` block continues past line 1242 with `.hr-mobile-pills` children (outside the requested deck neighborhood).

---

## Drift summary

| Anchor (relayout-scope handoff) | Live line(s) | Match |
|---|---|---|
| `TABS` ~180–188 | 180–188 | exact |
| color mirror ~109–122 | 109–122 | exact |
| `S.panelPos` ~284–286 | 284–286 | exact |
| `S.deck` ~290–311 | 290–311 | exact |
| `S.tab` ~316–339 | 316–339 | exact |
| `S.resizeHandle` ~342–350 | 342–350 | exact |
| `activeTab` ~3274 | 3274 | exact |
| `scheduleHoverOpen` ~3404 | 3404 | exact |
| `open`/`deckPx` ~3419–3423 | 3419–3423 | exact |
| `handleTabClick` ~3425 | 3425 | exact |
| `currentTab` ~3461 | 3461–3463 | exact |
| strip render ~3540–3599 | 3539–3599 | exact |
| deck body ~3601–3642 | 3601–3642 | exact |
| `TAB_PEEK`/`TAB_STRIP_H`/`STORAGE_KEY` | 147/148/152 | exact |
| `deckHeight` initializer | 3276–3285 | exact |
| `.hr-section-deck-host` ~50 | 50–55 | exact |
| `.hr-deck` ~550–551 | 550–551 | exact |
| `.hr-tab-strip` ~554–563 | 554–563 | exact |
| `.hr-deck-body` ~592–601 | 592–601 | exact |

No line drift detected — both reports are stamped at HEAD `36b2182`.

---

*Read-only extract. No source modified. This file is the deliverable; a stamped copy is in `G:\My Drive\_conduit\`. Durability (commit/push) is Mike's host-side step.*
