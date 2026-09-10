// 第8回：手番画面、二度目の確認、サンプルだけのときの既定チップ
const fs = require('fs');
let h = fs.readFileSync('ifbox-proto.html', 'utf8'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

rep(`    cases={}; snap.docs.forEach(d=>{ cases[d.id]={id:d.id,...d.data()}; });
    renderChips(); renderGrid();`,
    `    cases={}; snap.docs.forEach(d=>{ cases[d.id]={id:d.id,...d.data()}; });
    if(chip==='real'&&!window._chipTouched&&!Object.values(cases).some(c=>!isSample(c)&&!c.archived)) chip='all';
    renderChips(); renderGrid();`);
rep(`onclick="chip='\${k}';renderChips();renderGrid()"`, `onclick="chip='\${k}';window._chipTouched=true;renderChips();renderGrid()"`);
rep(`if(!list.length){ $('grid').innerHTML='<p class="sm">まだ何も置かれていません。上の欄から最初の「もし」をどうぞ。</p>'; return; }`,
    `if(!list.length){ $('grid').innerHTML='<p class="sm">'+(chip==='real'&&Object.values(cases).some(isSample)?'実案件はまだありません。「サンプル」か「すべて」で例の案件を見られます。':'まだ何も置かれていません。上の欄から最初の「もし」をどうぞ。')+'</p>'; return; }`);
rep(`    <button data-s="money" onclick="go('money')">配分</button>`,
    `    <button data-s="turns" onclick="go('turns')">手番</button>\n    <button data-s="money" onclick="go('money')">配分</button>`);
rep(`<!-- ===================== 配分 ===================== -->`,
    `<!-- ===================== 手番 ===================== -->
<section class="screen" id="s-turns"><div class="wrap">
  <p class="eb">MY TURN</p><h2 class="t">自分の手番 ― 次に自分が動くものだけ</h2>
  <div class="card" style="margin-top:12px" id="turns"></div>
</div></section>

<!-- ===================== 配分 ===================== -->`);
rep(`if(s==='money') fillCaseSelect(); if(s==='archive') renderArchive(); }`, `if(s==='money') fillCaseSelect(); if(s==='archive') renderArchive(); if(s==='turns') renderTurns(); }`);
rep(`<div class="pane" id="p-compare"><div id="c-tplmake"></div><div id="c-compare"></div></div>`, `<div class="pane" id="p-compare"><div id="c-tplmake"></div><div id="c-second"></div><div id="c-compare"></div></div>`);
rep(`  renderTplMake(c);`, `  renderTplMake(c); renderSecondCheck(c);`);
h = h.replace(/<\/script>\s*$/, fs.readFileSync('round8_snippet.js','utf8') + '\n</script>\n');
fs.writeFileSync('ifbox-proto.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
