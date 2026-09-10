// 出資型クラウドファンディングを ifbox-proto.html に足す
const fs = require('fs');
let h = fs.readFileSync('ifbox-proto.html', 'utf8'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 70)); return; } h = h.replace(a, b); n++; }

rep(`<button data-p="cf" onclick="tab('cf')">支援</button>`,
    `<button data-p="cf" onclick="tab('cf')">先に買う</button><button data-p="fund" onclick="tab('fund')">資金を出す</button>`);
rep(`<div class="pane" id="p-cf"><div id="c-cf"></div></div>`,
    `<div class="pane" id="p-cf"><div id="c-cf"></div></div>\n          <div class="pane" id="p-fund"><div id="c-fund"></div></div>`);
rep(`['cf','支援募集中'],['sold','買い手あり']`, `['cf','先に買う募集中'],['fund','資金募集中'],['sold','成約済']`);
rep(`if(chip==='cf') list=list.filter(c=>c.cf?.open);`,
    `if(chip==='cf') list=list.filter(c=>c.cf?.open);\n  if(chip==='fund') list=list.filter(c=>c.fund?.open);`);
rep('<div class="seatdots" title="席">',
    '${c.fund?.open?`<div class="cf"><div class="bar"><i style="width:${Math.min(100,Math.round(fundTotal(c)/c.fund.goal*100))}%;background:var(--blue)"></i></div><div class="lb">出資 ${Math.min(100,Math.round(fundTotal(c)/c.fund.goal*100))}% ・ ${(c.fund.pledges||[]).length}人 ・ 持分 ${c.fund.share}%</div></div>`:\'\'}<div class="seatdots" title="席">');
rep(`const cfTotal=c=>(c.cf?.pledges||[]).reduce((s,p)=>s+(+p.amount||0),0);`,
    `const cfTotal=c=>(c.cf?.pledges||[]).reduce((s,p)=>s+(+p.amount||0),0);\nconst fundTotal=c=>(c.fund?.pledges||[]).reduce((s,p)=>s+(+p.amount||0),0);`);
rep(`bids:[], messages:[], cf:null,`, `bids:[], messages:[], cf:null, fund:null,`);
rep(`  renderCf(c);`, `  renderCf(c); renderFund(c);`);
rep(`(c.cf?.open?'<span class="tag ai">支援募集中</span>':'<span class="tag ok">募集中</span>')`,
    `(c.cf?.open?'<span class="tag ai">先に買う募集中</span>':'<span class="tag ok">募集中</span>')+(c.fund?.open?' <span class="tag bl">資金募集中</span>':'')`);
rep(`||(c.cf?.pledges||[]).length>0;`, `||(c.cf?.pledges||[]).length>0||(c.fund?.pledges||[]).length>0;`);
rep(`const rows=[["確定対価",`,
    `const fshare=(c?.fund&&(c.fund.pledges||[]).length)?(+c.fund.share||0):0; const fundAmt=Math.round(restOthers*fshare/100); const restHumans=restOthers-fundAmt;\n  const rows=[["確定対価",`);
rep(`["残余",'人が座った席で合意比率',restOthers,'続けて売れる分','ok']];`,
    `["残余",'人が座った席で合意比率',restHumans,'続けて売れる分','ok']].concat(fshare?[["残余",'出資者（合意した持分 '+fshare+'%）',fundAmt,'資金調達の条件。配当ではなく残余配分の持分','bl']]:[]);`);

const FUND = fs.readFileSync('fund_snippet.js','utf8') + "\n";
rep(`function useCf(){`, FUND + `function useCf(){`);

fs.writeFileSync('ifbox-proto.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
