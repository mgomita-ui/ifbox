// 第14回：小学6年生でも直感で使える言葉と導線。第13回（手直し済み）の上に当てる。
// 使い方: node patch_plain.js <target html>
const fs = require('fs'), path = require('path');
const target = process.argv[2];
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }
rep(`  /* ===== 探す（一覧） ===== */`, `  /* ===== 第14回：お試し版の帯・その他メニュー・数字 ===== */
  .trialbar{background:var(--gold-soft);color:var(--gold-deep);font-size:12px;font-weight:700;text-align:center;padding:5px 12px;border-bottom:1px solid rgba(143,90,8,.15)}
  .morelist{display:flex;flex-direction:column;gap:8px;margin-top:10px}
  .morelist button{display:flex;flex-direction:column;gap:2px;text-align:left;background:var(--paper);border:1.5px solid var(--line);border-radius:12px;padding:10px 14px;cursor:pointer;color:var(--ink)}
  .morelist button:hover{border-color:var(--coral)}.morelist b{font-size:14.5px}.morelist span{font-size:12px;color:var(--ink3)}
  .status{display:none!important}
  .pj-rest{font-size:12.5px;font-weight:700;color:var(--coral);margin:-2px 0 8px}
  .pj-meta b{font-size:15px!important;font-family:var(--body)!important;font-weight:900}
  .hero .ht{font-size:40px}@media(max-width:700px){.hero .ht{font-size:33px}}
  @media(max-width:700px){nav button{font-size:9.5px!important;padding:3px 2px!important}}

  /* ===== 探す（一覧） ===== */`);
h = h.replace(/<\/script>\s*$/, fs.readFileSync(path.join(__dirname, 'plain_snippet.js'), 'utf8') + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
