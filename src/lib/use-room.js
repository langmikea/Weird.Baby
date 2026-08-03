// src/lib/use-room.js — which room the document is standing in.
//
// [R5 2026-08-02] The Lobby, the Information Booth and the operator's Admin
// each carried a complete stylesheet inside an inline `<style>` tag, and each
// of those stylesheets set `html, body` — the page's own ground. That worked
// because a `<style>` element is scoped BY MOUNT: it paints while the route is
// on screen and stops when React unmounts it.
//
// Moving those rules into a .css file loses that lifetime. A stylesheet is
// global and permanent, so `html, body { background: #050505 }` from the
// operator's room would black out the whole museum.
//
// This is the lifetime, said declaratively. The component names its room; the
// attribute lands on `<html>` for as long as the room is mounted; the room's
// stylesheet scopes its ground rules to `html[data-room="…"]`. Same behaviour,
// in a file a linter can read.
//
// It sits on the ROOT element rather than on `<body>` because the canvas takes
// its background from `<html>` when `<html>` has one — and it does, from
// Exhibit.css. Scoping to body alone would paint the body box and leave the
// overscroll area the wrong colour.

import { useEffect } from "react";

export function useRoom(name) {
  useEffect(() => {
    if (!name) return undefined;
    const el = document.documentElement;
    const prev = el.getAttribute("data-room");
    el.setAttribute("data-room", name);
    return () => {
      if (prev === null) el.removeAttribute("data-room");
      else el.setAttribute("data-room", prev);
    };
  }, [name]);
}

export default useRoom;
