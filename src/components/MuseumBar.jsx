// src/components/MuseumBar.jsx — THE TITLE BAR, ONCE.
//
// [R2 2026-08-02] B7 found the museum's room convention — brand left / room
// name centre / exit right — implemented THREE times: `.ex-nav-*` in
// Exhibit.css, `.gift-shop__nav-*` in GiftShop.css (whose own comment reads
// "Mirrors Exhibit.css .ex-nav … re-pinned to paper tones"), and `.booth-nav-*`
// inline in InfoBooth.jsx. Three class families, three stylesheets, one bar.
//
// IT HAD ALREADY FORKED ONCE and B7 closed that half: the exhibit's wordmark
// read `var(--wb-brand, …)` while the shop's and the booth's read the literal,
// so a live brand trial only applied to a third of the rooms. B7 pointed all
// three at the token and said plainly that the fork was closed while the three
// copies remained. This is the copies.
//
// WHAT THE THREE COPIES ACTUALLY DISAGREED ABOUT, measured before merging —
// because "identical except for the class names" is a claim, not an assumption:
//
//   · the exhibit's bar had NO narrow-width rule for the room name. The shop
//     dropped it to 0.95rem at ≤720px and the booth at ≤680px; the exhibit kept
//     1.1rem at every width. That is not a cosmetic difference: measured at
//     390px on /hr, "HUNTER ROOT" and "GIFT SHOP" OVERLAP — the centred room
//     name is absolutely positioned and runs straight under the exit. The
//     merged bar takes the shrink, so the exhibit gains a fix it should have
//     had when the shop got one.
//   · the booth's breakpoint was 680px, the shop's 720px, for the same rule.
//     720 wins because it is the museum's own stacking breakpoint everywhere
//     else in the building.
//   · the exhibit drove navigation with `<button onClick={navigate}>`; the shop
//     and the booth used `<Link>`. The merged bar is `<Link>` everywhere: a
//     real anchor middle-clicks, opens in a new tab, and shows its destination
//     in the status bar, and there is no reason the exhibit's bar should be the
//     one that cannot.
//   · the room name was a `<div>` on the exhibit and an `<h1>` in the other
//     two. It is `<h1>` here: the room's name IS the page's heading, no other
//     `<h1>` exists on any of these routes (checked), and the exhibit was the
//     odd one out.
//
// WHAT DOES NOT MERGE, and is left as props rather than guessed: WHERE the
// pieces point. The exhibit's wordmark goes to the GIFT SHOP; the shop's and
// the booth's go to the LOBBY. That looked like a fourth fork and is not
// obviously one — the exhibit's exit and its wordmark deliberately land in the
// same room. Flagged for Mike in the round log rather than unified here.
//
// The room name is also clickable on the exhibit (scroll to top) and inert in
// the other two, so `onRoomClick` is optional and the cursor follows it.

import React from "react";
import { Link } from "react-router-dom";
import "./MuseumBar.css";

export default function MuseumBar({
  brandTo = "/",          // where the wordmark leads
  room,                   // the room's name — the page's heading
  onRoomClick,            // optional; makes the name a control
  exitTo = "/",           // where the right-hand exit leads
  exitLabel = "Lobby",
  exitHidden = false,     // the one-shop ruling: present in the DOM, not shown
}) {
  return (
    <div className="wb-bar">
      <Link to={brandTo} className="wb-bar-brand">Weird.Baby</Link>
      <h1
        className={"wb-bar-room" + (onRoomClick ? " wb-bar-room--live" : "")}
        onClick={onRoomClick}
      >
        {room}
      </h1>
      <Link
        to={exitTo}
        className="wb-bar-exit"
        style={exitHidden ? { display: "none" } : undefined}
      >
        {exitLabel}
      </Link>
    </div>
  );
}
