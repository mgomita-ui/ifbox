// デモモード：claude.ai の共有DB・AIが無い環境ではメモリ上のDBにサンプルを入れて動かす
const fs = require('fs');
let h = fs.readFileSync('proto/index.html', 'utf8').replace(/\r\n/g, '\n');
if (h.includes('DEMO_MODE')) { console.log('already'); process.exit(0); }
const demo = `<script src="seed.js"></script>
<script>
/* デモモード：GitHub Pages など claude.ai の外では、メモリ上のDBにサンプルを入れて動かす。保存されない。AI席は省く */
(function(){
  if(window.claude&&window.claude.use) return;
  const mk=(seed)=>{ const store={...(seed||{})}; const subs=[]; const snap=()=>({docs:Object.entries(store).sort((a,b)=>(b[1].createdAt||0)-(a[1].createdAt||0)).map(([id,d])=>({id,data:()=>d,exists:true}))}); const fire=()=>subs.forEach(f=>f(snap()));
    return {store, coll:{add:async d=>{const id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);store[id]={...d};setTimeout(fire,0);return {id};},orderBy(){return this},limit(){return this},onSnapshot(f){subs.push(f);setTimeout(()=>f(snap()),0);return()=>{}}},
      doc:id=>({update:async d=>{store[id]={...store[id],...d};setTimeout(fire,0);},set:async d=>{store[id]={...d};setTimeout(fire,0);},get:async()=>({exists:!!store[id],data:()=>store[id]}),onSnapshot(f){f({exists:!!store[id],data:()=>store[id]});return()=>{}}})}; };
  const C=mk(window.SEED_CASES), T=mk(window.SEED_TEMPLATES), P=mk({}), M=mk({});
  const db={collection:n=>n==='templates'?T.coll:n==='participants'?P.coll:C.coll, doc:p=>{ const [c,id]=p.split('/'); return (c==='meta'?M:c==='templates'?T:c==='participants'?P:C).doc(id); }};
  window.claude={use:async n=>n==='db'?db:null};
  window.DEMO_MODE=true;
  document.addEventListener('DOMContentLoaded',()=>{ const b=document.createElement('div'); b.style.cssText='position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:60;background:#B3382B;color:#fff;font-size:12px;font-weight:700;padding:6px 12px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.25)'; b.textContent='デモモード：サンプル20件・保存されません・AI席なし'; document.body.appendChild(b); });
})();
</script>
`;
const anchor = '<script>\n/* AI席の指示文';
if (!h.includes(anchor)) { console.log('ANCHOR MISSING'); process.exit(1); }
h = h.replace(anchor, demo + anchor);
fs.writeFileSync('proto/index.html', h);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); } catch (e) { console.log('script', i, 'ERR', e.message); } }
console.log('injected; inline scripts', m.length);
