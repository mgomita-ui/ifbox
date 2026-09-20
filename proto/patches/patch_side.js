// 第13回の手直し：プロジェクトページ右の箱を分かりやすく（役割はチェックリスト、段階は3歩）
// 使い方: node patch_side.js <target html または roles3_snippet.js>
const fs = require('fs');
const target = process.argv[2];
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;

/* A: 「1/3 役割が揃った」→ 役割のチェックリスト */
const reA = /`<div class="pj-amt">\$\{filled\}<small> \/ \$\{need\.length\} 役割が揃った[\s\S]*?役割を見る・手を挙げる<\/button>`:''\}/;
if (reA.test(h)) { h = h.replace(reA, () => '`<div class="pj-k">${st===\'recruiting\'?\'仲間を募集しています\':\'仲間が揃いました\'}</div>${roleChecklist(c)}<p class="sm">${st===\'recruiting\'?\'3つの役割が揃うと、このページがそのまま先行販売の案内になります。\':\'先行販売の準備をしています。始まるとお知らせが届きます。\'}</p>\n      ${st===\'recruiting\'&&viewMode!==\'back\'?`<button class="btn wide" onclick="pjGo(\'pj-team\')">仲間になる（役割を見る）</button>`:\'\'}'); n++; } else console.log('MISS A');

/* B: 内部の6段階 → 3歩の「いまここ」 */
const reB = /<div class="pj-stg">(?:(?!<div class="pj-stg">)[\s\S])*?約束どおりか確かめます。<\/p>/;
if (reB.test(h)) { h = h.replace(reB, () => '${stepBar(c)}'); n++; } else console.log('MISS B');

/* 関数とCSS（html のときだけ CSS を入れる。snippet のときは関数だけ末尾に足す） */
const FN = `
/* 右の箱：役割のチェックリストと、3歩の「いまここ」 */
function roleChecklist(c){ const t=teamOf(c); return '<div class="rlist">'+ROLES.map(([r,n])=>{ const x=t[r], full=x.members.length>=x.n; const who=x.members.map(m=>esc(m.name)).join('、'); return \`<button class="rl \${full?'ok':'open'}" onclick="pjGo('pj-team')"><span class="ck">\${full?'✓':x.members.length?x.members.length+'/'+x.n:''}</span><b>\${n}</b><span class="w">\${full?who:(who?who+' ・ ':'')+'あと'+(x.n-x.members.length)+'名 募集中'}</span></button>\`; }).join('')+'</div>'; }
function stepBar(c){ const st=projStatus(c); const now=(c.stage>=3||st==='settled')?3:(st==='selling'||st==='funded'||st==='unfunded'||c.stage>=2)?2:1; const S=[['仲間を集める','役割が揃うまで'],['先に買ってもらう','目標に届けば作る'],['届けて、確かめる','約束どおりか別の人が確認']];
  return '<div class="steps">'+S.map(([a,b],i)=>\`<div class="sp \${i+1<now?'done':i+1===now?'now':''}"><span class="no">\${i+1<now?'✓':i+1}</span><div><b>\${a}</b><small>\${i+1===now?'いまここ ・ ':''}\${b}</small></div></div>\`).join('')+'</div>'; }
`;
const CSS = `  /* ===== 右の箱：役割のチェックリストと3歩 ===== */
  .pj-k{font-size:15px;font-weight:900;color:var(--ink);margin-bottom:8px}
  .rlist{display:flex;flex-direction:column;gap:6px;margin-bottom:8px}
  .rl{display:flex;align-items:center;gap:8px;width:100%;text-align:left;background:var(--paper);border:1.5px solid var(--line);border-radius:12px;padding:8px 10px;cursor:pointer;color:var(--ink)}
  .rl .ck{flex:0 0 24px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:900;font-family:var(--latin)}
  .rl.ok .ck{background:var(--navy);color:#fff}.rl.open{border-style:dashed;border-color:var(--coral)}.rl.open .ck{border:2px dashed var(--coral);color:var(--coral)}
  .rl b{font-size:13.5px;white-space:nowrap}.rl .w{margin-left:auto;font-size:11.5px;color:var(--ink2);text-align:right}.rl.open .w{color:var(--coral);font-weight:700}
  .steps{display:flex;flex-direction:column;gap:0;margin-top:14px;border-top:1px solid var(--line);padding-top:10px}
  .sp{display:flex;gap:10px;align-items:flex-start;padding:5px 0;opacity:.55}.sp.now,.sp.done{opacity:1}
  .sp .no{flex:0 0 22px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:900;font-family:var(--latin);background:var(--soft);color:var(--ink3)}
  .sp.now .no{background:var(--coral);color:#fff}.sp.done .no{background:var(--navy);color:#fff}
  .sp b{display:block;font-size:13px;line-height:1.3}.sp small{display:block;font-size:11px;color:var(--ink3)}.sp.now small{color:var(--coral);font-weight:700}

  /* ===== 探す（一覧） ===== */`;
if (/\.html$/.test(target)) {
  if (h.includes('  /* ===== 探す（一覧） ===== */')) { h = h.replace('  /* ===== 探す（一覧） ===== */', CSS); n++; } else console.log('MISS CSS');
  h = h.replace(/<\/script>\s*$/, FN + '\n</script>\n');
} else { h = h + FN; }
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
if (/\.html$/.test(target)) { const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]); for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } } }
