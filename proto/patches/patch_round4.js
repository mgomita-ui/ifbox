// 第4回：型化（T）と元案件との最小比較（K）
const fs = require('fs');
let h = fs.readFileSync('ifbox-proto.html', 'utf8'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

/* 投稿欄の下に「似た型」ボックス */
rep(`  <div class="think" id="think"></div>`,
    `  <div class="row" style="margin-top:8px"><button class="btn ghost sm" onclick="findTemplates()">似た型を探す（精算まで終わった案件の型を最初から埋める）</button></div>
  <div id="tplbox"></div>
  <div class="think" id="think"></div>`);

/* 案件ヘッダーに元案件の表示 */
rep(`    <div id="c-test"></div>`, `    <div id="c-test"></div>\n    <div id="c-reuse"></div>`);

/* タブ：比較 */
rep(`<button data-p="ledger" onclick="tab('ledger')">台帳</button>`,
    `<button data-p="ledger" onclick="tab('ledger')">台帳</button><button data-p="compare" onclick="tab('compare')">型・比較</button>`);
rep(`          <div class="pane" id="p-ledger"><div id="c-ledger"></div></div>`,
    `          <div class="pane" id="p-ledger"><div id="c-ledger"></div></div>\n          <div class="pane" id="p-compare"><div id="c-tplmake"></div><div id="c-compare"></div></div>`);

/* 購読 */
rep(`  fillSeatSelects(); subscribeClock();`, `  fillSeatSelects(); subscribeClock(); subscribeTemplates();`);

/* 投稿doc に型を適用 */
rep(`  if(ai) doc.log.push({t:now(),m:'AI席が最初の一手を返した。作る席と売る席で準備を開始'});
  try{ const ref=await db.collection('cases').add(doc);`,
    `  if(ai) doc.log.push({t:now(),m:'AI席が最初の一手を返した。作る席と売る席で準備を開始'});
  doc.measurement={stage2At:null,acceptedAt:null,settledAt:null,activeMinutes:null,effortBasis:'estimated',sameBenefit:'unconfirmed',comparisonNote:''};
  reuseIntoDoc(doc);
  try{ const ref=await db.collection('cases').add(doc); $('tplbox').innerHTML='';`);

/* renderCase に追加描画 */
rep(`  renderCf(c); renderFund(c); renderAccept(c); renderLedger(c); renderTest(c);`,
    `  renderCf(c); renderFund(c); renderAccept(c); renderLedger(c); renderTest(c); renderReuseHead(c); renderCompare(c);
  renderTplMake(c);`);

/* 到達時刻の記録：段階2（座る・採用・支援者確定）、段階4（検収）、段階5（精算） */
rep(`  if(k==='BUY'&&c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; }
  if(k==='BUILD'&&c.stage<1){ patch.stage=1; }
  await save(patch,msg); closeMd(); toast(name+' が席に座りました。');`,
    `  if(k==='BUY'&&c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; stampStage(patch,c,2); }
  if(k==='BUILD'&&c.stage<1){ patch.stage=1; }
  await save(patch,msg); closeMd(); toast(name+' が席に座りました。');`);
rep(`  if(b.seat==='BUY'&&c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; }
  if(b.seat==='BUILD'&&c.stage<1){ patch.stage=1; }`,
    `  if(b.seat==='BUY'&&c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; stampStage(patch,c,2); }
  if(b.seat==='BUILD'&&c.stage<1){ patch.stage=1; }`);
rep(`await save({stage:Math.max(c.stage,2),seats:{...c.seats,BUY:{t:'hu',n:'支援者 '+n+'人',since:now()}}}, me()+' が支援者を買い手として確定した（段階2）'); }`,
    `await save(stampStage({stage:Math.max(c.stage,2),seats:{...c.seats,BUY:{t:'hu',n:'支援者 '+n+'人',since:now()}}},c,2), me()+' が支援者を買い手として確定した（段階2）'); }`);
rep(`  const patch={deliveries:dels,stage:Math.max(c.stage,4),acceptedBy:me(),acceptedAt:now()};`,
    `  const patch=stampStage({deliveries:dels,stage:Math.max(c.stage,4),acceptedBy:me(),acceptedAt:now()},c,4);`);
rep(`try{ await db.doc('cases/'+id).update({stage:5,settlement:{amount:c.receipt.amount,by:me(),t:now(),mock:true},`,
    `try{ await db.doc('cases/'+id).update({stage:5,settlement:{amount:c.receipt.amount,by:me(),t:now(),mock:true},measurement:{...(c.measurement||{}),settledAt:(c.measurement?.settledAt)||now()},`);

/* 配分画面：型の配分条件を初期値に */
rep(`function loadDist(){ const c=cases[$('m-case').value]; if(c?.dist){ $('m-price').value=c.dist.price; $('m-fixed').value=c.dist.fixed; $('m-perf').value=c.dist.perf; $('m-idea').value=c.dist.idea; } calc(); }`,
    `function loadDist(){ const c=cases[$('m-case').value]; if(c?.dist){ $('m-price').value=c.dist.price; $('m-fixed').value=c.dist.fixed; $('m-perf').value=c.dist.perf; $('m-idea').value=c.dist.idea; } else if(c?.allocPrefill){ if(c.allocPrefill.fixed!=null) $('m-fixed').value=c.allocPrefill.fixed; if(c.allocPrefill.perf!=null) $('m-perf').value=c.allocPrefill.perf; if(c.allocPrefill.idea!=null) $('m-idea').value=c.allocPrefill.idea; ['u1','u2','u3'].forEach(k=>{ $(k).checked=(c.allocPrefill.units||[]).includes(k); }); toast('型の配分条件を初期値に入れました。合意はこの案件でやり直します。'); } calc(); }`);

/* 新関数を挿入 */
rep(`function useCf(){`, fs.readFileSync('round4_snippet.js','utf8') + "\nfunction useCf(){");

fs.writeFileSync('ifbox-proto.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
