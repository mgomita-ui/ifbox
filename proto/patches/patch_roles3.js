// 第13回：役割を3つに・複数人・最初から設定・2つの入口・外部販売。第12回の上に当てる。
// 使い方: node patch_roles3.js <target html>
const fs = require('fs'), path = require('path');
const target = process.argv[2] || 'ifbox-proto.html';
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 90)); return; } h = h.replace(a, b); n++; }

rep(`  /* ===== 探す（一覧） ===== */`,
`  /* ===== 第13回：2つの入口 ===== */
  .viewsw{display:flex;background:rgba(255,255,255,.12);border-radius:999px;padding:3px;margin-left:8px}
  .viewsw button{background:none;border:0;color:rgba(255,255,255,.8);font-weight:700;font-size:12.5px;padding:5px 14px;border-radius:999px}
  .viewsw button.on{background:#fff;color:var(--deep)}
  .v-back nav button[data-s="turns"],.v-back nav button[data-s="members"],.v-back nav button[data-s="money"],.v-back nav button[data-s="archive"]{display:none}
  .pj-main{display:flex;flex-direction:column}.pj-main>.pj-nav{order:-10}
  .v-back .pj-main>#pj-tiers{order:-5}.v-back .pj-main>#pj-story{order:-4}.v-back .pj-main>#pj-ups{order:-3}
  .v-back #c-tools,.v-back #c-test{display:none}
  @media(max-width:700px){.viewsw{margin-left:4px}.viewsw button{padding:5px 10px;font-size:12px}.brand small{display:none}}

  /* ===== 探す（一覧） ===== */`);
/* 確かめる役割の誰でも検収できるように */
{ const a=`const accName=c.seats.ACC?.t==='hu'?c.seats.ACC.n:null;`; const cnt=h.split(a).length-1; if(!cnt) console.log('MISS accName'); else { h=h.split(a).join(`const accName=checkerName(c);`); n++; } }

h = h.replace(/<\/script>\s*$/, fs.readFileSync(path.join(__dirname, 'roles3_snippet.js'), 'utf8') + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
