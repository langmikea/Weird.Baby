/* Frame sink. The twin POSTs each captured beat here as two PNG dataURLs
   (front glass + top glass) and this writes them to disk. Passing megabytes
   back through the browser tool result is what makes a capture fail; this
   keeps the payload on the machine. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const OUT = path.resolve("C:/AI/_night-20260820/refusal-check/frames");
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
const w = (file, dataUrl) => {
  if (!dataUrl) return null;
  const b = Buffer.from(dataUrl.split(",")[1], "base64");
  fs.writeFileSync(path.join(OUT, file), b);
  return b.length;
};
http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (req.method !== "POST") { res.writeHead(200); return res.end("sink up"); }
  let body = "";
  req.on("data", d => (body += d));
  req.on("end", () => {
    try {
      const f = JSON.parse(body);
      const id = String(++n).padStart(3, "0");
      const slug = String(f.name || "beat").replace(/[^a-z0-9]+/gi, "-").slice(0, 48).toLowerCase();
      const base = `${id}_${String(f.t ?? 0).padStart(6, "0")}ms_${slug}`;
      const a = w(`${base}__front.png`, f.front);
      const b = w(`${base}__top.png`, f.top);
      fs.appendFileSync(path.join(OUT, "..", "manifest.jsonl"),
        JSON.stringify({ id, t: f.t, name: f.name, seg: f.seg, run: f.run,
                         front: a ? `${base}__front.png` : null,
                         top: b ? `${base}__top.png` : null,
                         note: f.note || null }) + "\n");
      res.writeHead(200); res.end("ok");
    } catch (e) { res.writeHead(400); res.end(String(e)); }
  });
}).listen(8913, () => console.log("sink on 8913 ->", OUT));
