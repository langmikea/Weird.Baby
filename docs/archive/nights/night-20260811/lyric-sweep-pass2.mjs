/* A2, second pass: any QUOTED RUN of 6+ words whose attribution is NOT a
   named person or outlet. That is the shape a lyric hides in when nobody
   bothered to cite it. Printed for human review, not auto-judged. */
import fs from "node:fs";
import { sweep } from "./tools/provenance-sweep.mjs";
const rows=[];
const s=sweep();
for(const r of (s.rows||s.strings||s.found||[])) rows.push({w:`${r.file}:${r.line}`,id:"",t:r.text});
const vault=JSON.parse(fs.readFileSync("src/data/exhibits/hunter_root.facts.json","utf8"));
vault.facts.forEach(f=>f.lines.forEach((l,i)=>rows.push({w:"vault",id:f.id+"["+i+"]",t:l})));
const arts=JSON.parse(fs.readFileSync("src/data/exhibits/hunter_root.json","utf8"));
(arts.artifacts||[]).forEach(a=>["title","description"].forEach(k=>a[k]&&rows.push({w:"artifacts",id:a.id+"."+k,t:a[k]})));
const wal=(await import("./src/data/artists/worth-a-listen-facts.js")).default;
wal.forEach(f=>f.lines.forEach((l,i)=>rows.push({w:"wal-facts",id:f.id+"["+i+"]",t:l})));
const hrf=(await import("./src/routes/hr/hr_facts.js")).FACTS;
hrf.forEach(f=>f.lines.forEach((l,i)=>rows.push({w:"hr_facts",id:f.id+"["+i+"]",t:l})));

const QUOTE=/[""“”"]([^""“”"]{25,})[""“”"]/g;
const CITED=/[—-]\s*[A-Z][\w.'’]+(\s+[A-Z][\w.'’]+)*|Wikipedia|Bandcamp|NPR|Deezer|Apple Music|her own|his own|read 20\d\d|, 20\d\d/;
let n=0;
for(const r of rows){
  const t=String(r.t); let m;
  QUOTE.lastIndex=0;
  while((m=QUOTE.exec(t))){
    const q=m[1];
    if(q.split(/\s+/).length<6) continue;
    if(CITED.test(t)) continue;                 // it names a source somewhere
    n++;
    console.log("── "+(r.id||r.w));
    console.log("   QUOTED: "+JSON.stringify(q));
    console.log("   FULL:   "+JSON.stringify(t).slice(0,240));
    console.log();
  }
}
console.log("uncited quoted runs of 6+ words:",n,"  (rows scanned: "+rows.length+")");
