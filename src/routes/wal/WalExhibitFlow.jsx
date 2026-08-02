import { useEffect } from "react";

/* WalExhibitFlow — the one wing-specific behaviour WORTH A LISTEN needs.
   A face fires `wb-wal-open-link` with an href; this opens it. That is the
   whole extension.

   WHY IT IS A SEAM AND NOT A LINK IN THE FACE. `face.action` is DATA - a
   label and an event name - and the engine's job is to dispatch the event,
   not to know what it means. Putting an <a> in the face would make the shared
   renderer learn about outbound artist links, which is exactly the coupling
   the seam exists to prevent. Same mechanism the robots wing uses to open a
   twin; different verb.

   OUTBOUND LINKS LEAVE IN A NEW TAB and carry noopener/noreferrer: the
   exhibit is a pointer at someone else's home, and it should not replace
   itself with theirs, nor hand them a referrer for the privilege. An INTERNAL
   href (Hunter Root's own wing) navigates in place instead - it is the same
   building. */
export default function WalExhibitFlow() {
  useEffect(() => {
    function open(e) {
      const href = e && e.detail && e.detail.href;
      if (!href) return;
      if (href.startsWith("/")) { window.location.assign(href); return; }
      try { window.open(href, "_blank", "noopener,noreferrer"); }
      catch { window.location.assign(href); }
    }
    window.addEventListener("wb-wal-open-link", open);
    return () => window.removeEventListener("wb-wal-open-link", open);
  }, []);
  return null;
}
