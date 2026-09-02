# JOB 0 · HYDRATE, THEN STOP

Run: 2026-08-10, overnight packet. Read-only. Nothing created, modified, moved,
deleted or renamed in either repo or in any source folder. The only write this
job made anywhere is this report.

## WHAT I COULD NOT DETERMINE

Nothing. All three files hydrated on the first attempt and no retry loop was
needed.

## WHAT NEEDS MIKE

Nothing. Job 3 may proceed with the zip present.

---

## RESULT

**All three landed.** Job 3 does not need the "proceed without the zip" fallback.

| File | Bytes | Read | Secs | Attr before | Attr after |
|---|---:|---|---:|---:|---:|
| `_mal\MASTER FILES\Logos - Weird.Baby.zip` | 204,791,031 | OK, full | 13.3 | 4199968 | 1056 |
| `PHVDC Front Label.psd` | 434,275 | OK, full | 1.1 | 5248544 | 1056 |
| `PHVDC Label Test Sheet.psd` | 2,216,325 | OK, full | 0.5 | 5248544 | 1568 |

Root:
`C:\Users\macun\OneDrive\OneDrive MAJEL_04 (Archived Other)\Mike's Stuff\_ROBOTS\Weird.Baby\PROJECT CLOSING - GOOGLE DRIVE COPY\Graphics`

Order was largest-first as instructed. Each file was read end-to-end through a
4 MiB streaming buffer and the bytes discarded; `bytes_read` equals the
directory-reported length in all three cases, so each file hydrated in full
rather than partially.

## METHOD, AND WHY IT IS NON-MUTATING

Hydration was triggered by **reading** the files, not by pinning them
(`attrib +P` / "Always keep on this device"). Pinning writes a OneDrive pin
state and changes a file attribute; a read changes nothing a user or a hash can
see. Files were opened `Read` with `ReadWrite` sharing so nothing was locked
against OneDrive or against another process while the read ran.

## ATTRIBUTE DECODE — HOW "CLOUD-ONLY" WAS CONFIRMED AND CLEARED

The listing showed these three files with numeric attribute values where every
other file in Graphics showed `Archive, ReparsePoint`. PowerShell prints the raw
integer when the value contains bits it has no friendly name for, which is
itself the tell.

Before:

- `4199968` (the zip) = Archive `0x20` + SparseFile `0x200` + ReparsePoint
  `0x400` + **Offline `0x1000`** + **RecallOnDataAccess `0x400000`**
- `5248544` (both PSDs) = the same, plus **RecallOnOpen `0x100000`**

After:

- `1056` = Archive + ReparsePoint — Offline and both Recall bits gone
- `1568` (Label Test Sheet) = Archive + SparseFile + ReparsePoint — Offline and
  both Recall bits gone; the SparseFile bit is residual and does not indicate
  dehydration

The absence of `Offline` and of either Recall bit is the hydration test. All
three pass it.

## NOTE FOR THE JOBS THAT FOLLOW — THE REST OF GRAPHICS WAS ALREADY LOCAL

Graphics holds **36 files**, matching the brief. The other 33 were already
`Archive, ReparsePoint` — hydrated placeholders on disk — before this job ran.
`ReparsePoint` on every file in the tree is normal for a OneDrive folder and is
not a dehydration signal on its own.

Two things Job 3 will want, observed while listing and recorded here so that job
does not have to re-derive them:

1. **`PHVDC Asset Tag.psd` exists and is local** — 398,085 bytes, at the top
   level of Graphics, already hydrated. That is the file Mike's note points at.
2. **Graphics contains two separate `_mal` shapes.** `Graphics\_mal\` (top level,
   loose PSDs) and `Graphics\_mal\MASTER FILES\` (the subtree Job 3c is asked to
   compare against the separate top-level `_MAL` folder). Several filenames
   appear at more than one path with identical byte counts — for example
   `ABEAL - BAR LOGO (rev 2023_12_20).psd` at 448,693 in two places, and
   `Weird.Baby - BAR LOGO (2023 12 20).psd` / `Weird.Baby Bar Logo.psd` both at
   354,127,797. Equal length is not equal content; Job 3c hashes them.

## FENCE

This job did not touch, enumerate or read anything under `CUT VIDEO - NIAC` or
`RAW VIDEO - NIAC`. Nothing was copied or proposed anywhere. The zip was
hydrated and **not extracted**.
