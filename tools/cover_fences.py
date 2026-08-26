#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""THE COVER FENCES — one set, read by every tool that writes an album cover.

    THIS FILE WRITES NOTHING. It is a guard, imported by five generators.

═══ WHY THERE IS ONE SET AND NOT FIVE ═══════════════════════════════════════
`make_unit_covers.py` carried this fence alone from 2026-08-10 to 2026-08-26,
and its own argument for listing a file it does not write is the argument for
moving the list out of it:

    "a fence that only lists what a tool happens to write today stops being a
     fence the first time somebody adds a row to UNITS."

The same sentence read the other way says a fence that lives inside ONE tool
stops being a fence the first time somebody reaches for a DIFFERENT tool — and
on 2026-08-26 a survey found that was already true of three of them. Five copies
of a frozenset is five things that drift. There is one, and it is here.

═══ IT MATCHES ON THE BASENAME, ON PURPOSE ══════════════════════════════════
`OPERATIONS.md` §8: **A GOVERNED PICTURE HAS TWO ADDRESSES, AND ANYTHING THAT
MATCHES ON ONE OF THEM IS WRONG.** `mgk-niac-cover.png` lives at
`public/held/robots/art/` and is declared at `/robots/art/`; the stage decides
which. A fence keyed on a full path protects one address and leaves the other
open, so this one is keyed on the filename and covers both by construction.

═══ IT REFUSES RATHER THAN SKIPS ════════════════════════════════════════════
Carried verbatim from `make_unit_covers.py`, because it is the reason the
mechanism has the shape it has:

    "A skip prints a line nobody reads and exits 0, so a run looks like it
     worked and the hand-authored art is still on disk by luck. A raise stops
     the run and names the ruling, so the next person to reach for this tool
     finds out WHY before they find out THAT."

═══ AND IT REFUSES BEFORE THE FIRST WRITE, NOT AT THE OFFENDING ROW ═════════
`guard()` takes the WHOLE set a run intends to write and checks it before any
of it is rendered. A tool that writes four covers and raises on the fifth has
half-finished its job and left a tree nobody asked for. **Refusing a run is a
state; refusing a run halfway is a mess.**

`--dry-run` is guarded too. A dry run that prints `would write vol1-cover.png`
is the exact misleading line this file exists to prevent.

═══ AND THE REFUSAL IS PRINTED, NOT TRACEBACKED ═════════════════════════════
`run_main()` turns a fence exception into a clean message on stderr and
`exit 1`. The raise is still the mechanism — nothing is caught anywhere else,
and no other exception is touched — but a ruling printed under nine lines of
Python stack is a ruling the reader scrolls past to find out THAT before WHY,
which is the order this fence exists to reverse. **The exit code is 1 either
way; only the reading changes.**
"""
import sys

# ═══ 1 · HAND-AUTHORED ART — NO GENERATOR MAY WRITE THESE, EVER ═════════════
#
# MIKE'S RULING, 2026-08-10: "all four wing covers are now hand-authored.
# make_unit_covers.py is retired for these paths."
#
# THE TOOLS ARE NOT DELETED, ON THE SAME RULING. Their geometry, their
# silhouette cuts, their tracking solves are the record of how each series was
# built and are the only written form of it. What is retired is their AUTHORITY
# over these files, not their account of them.
#
# THE FIFTH NAME IS `vol1-cover.png` AND IT WAS NEVER IN THE 2026-08-10 SET
# because the art that makes it hand-authored did not arrive until two days
# later. It is here on the same ruling's reasoning rather than on a new one.
HAND_AUTHORED = {
    "wbr-cover-logo.png":
        "Mike's own art. His `NEW Robots.png`, installed 2026-08-09 at 27a9200 "
        "-- \"L6 - the album art. His NEW Robots.png is installed.\" It is NOT "
        "make_robots_cover.py's output and has not been since that day: the "
        "generator's rule falls at rows 992-995 and this file's at 1061-1064, "
        "which is the landmark make_template_covers.py records as measured off "
        "NEW Robots.png. 303,783 pixels differ by more than 16 of 255.",
    "mgk-niac-cover.png":
        "Mikey's art, 2026-08-10 at dd367c7. A colour photograph of the NIAC "
        "cabinet on the house paper. make_template_covers.py's own header "
        "carries Mike's instruction DO NOT ADD A PHOTOGRAPH, so what that tool "
        "would write is not a re-render of this file -- it is a different "
        "cover.",
    "mgk-viiip-cover.png":
        "Mikey's art, 2026-08-10 at dd367c7. A photograph of the VIIIp unit on "
        "the house paper. Same reasoning as mgk-niac-cover.png.",
    "portal-cover.png":
        "Mikey's art, 2026-08-10 at dd367c7. A photograph of the VIIIp in a "
        "monitor bezel. Its strapline is set at rows 1080-1099 where the other "
        "two sit at 1089-1110 -- a hand-set line, not a template's.",
    "vol1-cover.png":
        "Mike's own vinyl master, supplied 2026-08-12 at e998d03 and resampled "
        "from a 4506x4506 original. 1,375,277 bytes, RGBA, red lettering, no "
        "house mark. make_house_covers.py would replace it with a ~200 KB grey "
        "sleeve reading THE MAKING / OF BOWB V1 -- a title Mike retired on "
        "2026-08-13.",
}


# ═══ 2 · SUPERSEDED TOOLS — RETIRED FOR THEIR OWN OUTPUT ════════════════════
#
# A DIFFERENT REASON AND THEREFORE A DIFFERENT EXCEPTION. Nothing below is
# hand-authored; what is wrong is the TOOL. `make_foundation_covers.py` says so
# in its own docstring -- make_house_covers.py "supersedes" it -- and a tool
# that is superseded in prose and live in package.json is superseded in prose
# only.
SUPERSEDED = {
    "make_foundation_covers.py": (
        "SUPERSEDED BY make_house_covers.py, 2026-08-06, on Mike's A3 ruling: "
        "\"THE ROBOTS GRAY ALBUM ART IS THE STANDARD ... Make it the "
        "Weird.Baby gray album standard and replace every equivalent.\" This "
        "tool draws the MARKLESS typographic covers that ruling reversed; "
        "running it re-introduces the fade at the carousel's edges that the "
        "ruling was about. Its third output, faq-cover.png, was culled as an "
        "orphan on 2026-08-09 and src/ references it nowhere, so writing it "
        "would manufacture the orphan again.",
        frozenset({"ledger-cover.png", "faq-cover.png", "contribute-cover.png"}),
    ),
}


class HandAuthoredCover(RuntimeError):
    """A generator may not write a cover a person authored by hand."""


class SupersededTool(RuntimeError):
    """A generator may not write output a later tool took authority over."""


# ASCII only in every message below, deliberately: these are read in a Windows
# console at cp1252, where a middot prints as `?`.
_TAIL = (
    "  Nothing was written. If a cover genuinely needs re-generating, that is a\n"
    "  ruling to get first, not a line to delete."
)


def guard(tool, out_names):
    """Refuse the whole run if any name in it is fenced. Call BEFORE any write.

    `tool`   the calling script's basename, e.g. "make_house_covers.py"
    `out_names` every filename this run intends to write, in any form -- a
                basename, a relative path or an absolute one. Only the
                basename is compared; see the two-addresses note above.

    Returns None on a clean set. Raises SupersededTool or HandAuthoredCover
    otherwise, naming the file, the ruling and the whole fenced set.
    """
    names = [str(n).replace("\\", "/").rsplit("/", 1)[-1] for n in out_names]

    # The tool-level fence first: if the TOOL is retired, which file it was
    # asked for is not the interesting fact.
    if tool in SUPERSEDED:
        reason, owned = SUPERSEDED[tool]
        hit = [n for n in names if n in owned]
        if hit:
            raise SupersededTool(
                "REFUSED: %s is retired for %s.\n"
                "  %s\n"
                "  Retired for: %s\n"
                "%s" % (tool, ", ".join(sorted(set(hit))), reason,
                        ", ".join(sorted(owned)), _TAIL))

    hit = [n for n in names if n in HAND_AUTHORED]
    if hit:
        first = sorted(set(hit))[0]
        raise HandAuthoredCover(
            "REFUSED: %s is hand-authored and %s may not write it.\n"
            "  Mike's ruling, 2026-08-10: \"all four wing covers are now "
            "hand-authored.\n"
            "  make_unit_covers.py is retired for these paths.\"\n"
            "  %s\n"
            "  This run also asked for: %s\n"
            "  Fenced, every tool: %s\n"
            "%s" % (first, tool, HAND_AUTHORED[first],
                    ", ".join(sorted(set(hit))),
                    ", ".join(sorted(HAND_AUTHORED)), _TAIL))


def run_main(fn):
    """Call a tool's `main()` and print a fence refusal instead of a traceback.

    ONLY the two fence exceptions are caught. Anything else — a missing font, a
    missing source file, a bug — still raises with its full stack, because a
    tool that swallows its own defects is the thing this file is written
    against. Exit is 1 on a refusal, which is what a caller and a shell both
    read as a stop.
    """
    try:
        fn()
    except (HandAuthoredCover, SupersededTool) as exc:
        sys.stderr.write("\n%s\n\n" % exc)
        raise SystemExit(1) from None
