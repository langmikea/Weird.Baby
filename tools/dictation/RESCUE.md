# RESCUE — get everything out of the browser and onto disk, now

**Run this before anything else touches your writing.** It reads. It writes
nothing, deletes nothing and changes nothing on the page.

> **[E1 2026-08-09] The worksheet is retired and this snippet is not.** It takes
> EVERY key in the browser store without filtering — which is the whole point of
> a rescue — so it lifts the retired worksheet's answers (`wb.worksheet.…`), the
> Record editor's own working copy (`wb.record.…`) and the twelve-week table's
> (`wb.arc12.…`) in one press. Run it from **any** page in
> `docs/dictation-20260807/`: on a `file://` page every local file shares one
> storage origin, so they all see the same store.
> **The ordinary road is now `Save to the repo` on the Record page**, which
> writes `record-draft.json` directly. This is the road for when that fails.

## What to do

1. Open **`docs/dictation-20260807/record.html`** — the same window you have
   been writing in, on the same machine and the same browser.
2. Press **F12**, click **Console**.
3. Paste the block below and press Enter.
4. A file called **`wb-rescue-<date>.json`** lands in your Downloads. Move it to
   `C:\AI\Projects\weird-baby-museum\docs\dictation-20260807\` and tell Ops.

It also prints a summary in the console — how many keys it found and how many
characters are in each — so you can see it worked without opening the file.

**Do it once for every browser or machine you have written in.** Browser storage
does not travel; if you wrote on the laptop and the desktop, each holds its own
half and neither knows about the other.

## The snippet

```js
(() => {
  const out = { rescued: new Date().toISOString(), href: location.href, keys: {} };
  let n = 0, chars = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    const v = localStorage.getItem(k);
    out.keys[k] = v;                      // raw string, exactly as stored
    n++; chars += (v || "").length;
    let parsed = null, fields = 0, filled = 0;
    try { parsed = JSON.parse(v); } catch (e) { /* not JSON — kept raw above */ }
    if (parsed && typeof parsed === "object") {
      fields = Object.keys(parsed).length;
      filled = Object.values(parsed).filter(x => String(x ?? "").trim()).length;
    }
    console.log(`${k}  —  ${(v || "").length} chars` +
      (fields ? `, ${fields} fields, ${filled} of them non-empty` : ", not JSON"));
  }
  console.log(`\n${n} key(s), ${chars} characters total.`);
  const blob = new Blob([JSON.stringify(out, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wb-rescue-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  console.log("Downloaded " + a.download + ". If no download appeared, the whole");
  console.log("thing is also in the object below — right-click it and Copy object.");
  return out;
})()
```

## If the download is blocked

The last line returns the whole object into the console. Right-click it →
**Copy object** → paste into any file and save it. Or run this instead and the
text is on your clipboard:

```js
copy(JSON.stringify(Object.fromEntries(
  Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])), null, 1))
```

## What Ops does with the file

`node tools/dictation/rescue-import.mjs <path-to-json>` reads it, reports every
key and every slot it contains, and writes the answers into
`docs/dictation-20260807/answers.json` — which is a file in the repo, so it is
committed, diffable, and survives every future rebuild.
