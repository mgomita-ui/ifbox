// 第3回：模擬取引モード／検収基準・納品／台帳／未読 を組み込む
const fs = require('fs');
let h = fs.readFileSync('ifbox-proto.html', 'utf8'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

/* CSS */
rep(`  @media (prefers-reduced-motion: reduce)`,
    `  .testbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:var(--red-soft);border:1px solid var(--red);border-radius:10px;padding:6px 10px;margin-top:8px;font-size:12.5px}
  .grid-unread{position:absolute;right:6px;top:6px;background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px}
  @media (prefers-reduced-motion: reduce)`);

/* 案件ヘッダーにテストバー */
rep(`    <h2 class="t" id="c-title" style="margin-top:6px"></h2>`,
    `    <h2 class="t" id="c-title" style="margin-top:6px"></h2>\n    <div id="c-test"></div>`);

/* タブ追加 */
rep(`<button data-p="fund" onclick="tab('fund')">資金を出す</button>`,
    `<button data-p="fund" onclick="tab('fund')">資金を出す</button><button data-p="accept" onclick="tab('accept')">納品・検収</button><button data-p="ledger" onclick="tab('ledger')">台帳</button>`);
rep(`          <div class="pane" id="p-fund"><div id="c-fund"></div></div>`,
    `          <div class="pane" id="p-fund"><div id="c-fund"></div></div>\n          <div class="pane" id="p-accept"><div id="c-accept"></div></div>\n          <div class="pane" id="p-ledger"><div id="c-ledger"></div></div>`);

/* 配分画面：模擬受領・精算 */
rep(`      <div class="row"><button class="btn ghost sm" onclick="objection()">異議を出す</button><span class="sm">確定前7日間。記録の漏れや取り違えを示せれば再計算します。</span></div>
      <ul class="arc" id="m-obj"></ul>`,
    `      <div class="row"><button class="btn ghost sm" onclick="objection()">異議を出す</button><span class="sm">確定前7日間。記録の漏れや取り違えを示せれば再計算します。</span></div>
      <ul class="arc" id="m-obj"></ul>
      <h3 style="margin-top:14px">模擬受領と精算（実決済なし）</h3>
      <div class="row"><button class="btn ghost sm" onclick="recordReceipt()">受領額で模擬受領を記録</button><span class="sm" id="m-receipt"></span></div>
      <div class="row"><button class="btn" id="m-settle" onclick="settle()">模擬精算を確定する（段階5）</button><span class="sm" id="m-settlewhy"></span></div>`);

/* now() をテスト日時に */
rep(`const now=()=>Date.now(), DAY=86400000;`, `const DAY=86400000; const now=()=>Date.now()+CLOCK;`);

/* 接続後にクロック購読 */
rep(`  fillSeatSelects();\n  if(!db){`, `  fillSeatSelects(); subscribeClock();\n  if(!db){`);

/* 投稿doc の追加フィールド */
rep(`bids:[], messages:[], cf:null, fund:null,`, `bids:[], messages:[], cf:null, fund:null, criteria:[], criteriaLocked:false, deliveries:[], checks:[], ledger:[], notices:[], receipt:null,`);

/* renderCase に追加描画 */
rep(`  renderCf(c); renderFund(c);`, `  renderCf(c); renderFund(c); renderAccept(c); renderLedger(c); renderTest(c);`);

/* 段階ノート：確定の場所を案内 */
rep("  $('c-stagenote').innerHTML = c.stage<2 ? '買い手席に人が座るか、支援が目標に達すると段階2に上がります。' : (c.stage<5?`次は「${STAGES[c.stage+1]}」。<button class=\"btn ghost sm\" onclick=\"stageUp()\">確定する</button>`:'精算まで終わっています。');",
    "  $('c-stagenote').innerHTML = ({0:'作る席に人が座ると段階1。買い手席に人が座るか、支援が目標に届いて発案者が確定すると段階2。',1:'買い手席に人が座るか、支援が目標に届いて発案者が確定すると段階2に上がります。',2:'「納品・検収」タブで納品を確定すると段階3。',3:'検収席が全項目を合格にして確定すると段階4。',4:'「配分」で模擬受領→提示→7日の異議期間→模擬精算で段階5。',5:'精算まで終わっています（模擬）。'})[c.stage];");

/* グリッドに未読バッジ */
rep(`<div class="th" style="background:linear-gradient(160deg,hsl(\${h} 45% 30%),hsl(\${h} 55% 48%))">`,
    `<div class="th" style="background:linear-gradient(160deg,hsl(\${h} 45% 30%),hsl(\${h} 55% 48%))">\${unreadNotices(c).length?\`<span class="grid-unread">未読 \${unreadNotices(c).length}</span>\`:''}`);

/* 提案 → 発案者へ通知 */
rep(`const c=cases[cur]; await save({bids:(c.bids||[]).concat([{id:'b'+now(),seat,by:me(),text,price,days,won:false,t:now()}])}, me()+' が'+SNAME[seat]+'に提案した（'+yen(price)+'）');`,
    `const c=cases[cur]; await save({bids:(c.bids||[]).concat([{id:'b'+now(),seat,by:me(),text,price,days,won:false,t:now()}]),notices:notice(c,[c.owner],'proposal',me()+' が'+SNAME[seat]+'に提案しました（'+yen(price)+'）','props')}, me()+' が'+SNAME[seat]+'に提案した（'+yen(price)+'）');`);

/* 採用：基準が要る・ロック・提案者へ通知 */
rep(`  const c=cases[cur]; const b=c.bids.find(x=>x.id===id); if(!b) return;
  const bids=c.bids.map(x=>x.seat===b.seat?{...x,won:x.id===id}:x);`,
    `  const c=cases[cur]; const b=c.bids.find(x=>x.id===id); if(!b) return;
  if(!(c.criteria||[]).length){ toast('先に「納品・検収」タブで検収基準を1件以上公開してください'); tab('accept'); return; }
  const bids=c.bids.map(x=>x.seat===b.seat?{...x,won:x.id===id}:x);`);
rep(`  const patch={bids,seats}; let msg=me()+'（発案者）が '+b.by+' の提案を採用。'+SNAME[b.seat]+'の席に座った';`,
    `  const patch={bids,seats,criteriaLocked:true,notices:notice(c,[b.by],'adopted','あなたの提案が採用されました。'+SNAME[b.seat]+'の席に座っています','props')}; let msg=me()+'（発案者）が '+b.by+' の提案を採用。'+SNAME[b.seat]+'の席に座った';`);

/* 先に買う：目標到達で自動昇格しない。発案者が確定 */
rep(`const patch={cf:{...c.cf,pledges}}; let msg=me()+' が'+yen(amount)+'で先に買った';
  if(total>=c.cf.goal&&c.stage<2){ patch.stage=2; patch.seats={...c.seats,BUY:{t:'hu',n:'支援者 '+pledges.length+'人',since:now()}}; msg+='。目標に届き、段階2「買い手あり」に上がった'; }`,
    `const patch={cf:{...c.cf,pledges}}; let msg=me()+' が'+yen(amount)+'で先に買った（模擬）';
  if(total>=c.cf.goal&&c.stage<2){ patch.notices=notice(c,[c.owner],'proposal','支援が目標に届きました。買い手として確定してください','cf'); msg+='。目標に届いた（発案者の確定待ち）'; }`);
rep(`\${reached?'<p class="tag ok" style="margin-top:6px">目標額を達成しました（完成・提供の保証ではありません）</p>':''}</div>\`;
  side.innerHTML=`,
    `\${reached?'<p class="tag ok" style="margin-top:6px">目標額を達成しました（完成・提供の保証ではありません）</p>':''}\${reached&&c.stage<2&&c.owner===me()?'<div class="row"><button class="btn sm" onclick="confirmBuyers()">支援者を買い手として確定する（段階2）</button></div>':''}</div>\`;
  side.innerHTML=`);
rep(`<button class="btn" onclick="pledge()">先に買う（外部決済へ）</button>`, `<button class="btn" onclick="pledge()">先に買う（模擬）</button>`);

/* 配分提示・異議に通知、異議にid・解決 */
rep(`try{ await db.doc('cases/'+id).update({dist:window._dist,log:(c.log||[]).concat([{t:now(),m:me()+' が配分案を提示した（7日間の異議期間）'}])});`,
    `try{ await db.doc('cases/'+id).update({dist:window._dist,notices:notice(c,humanNames(c).concat((c.cf?.pledges||[]).map(p=>p.by)),'allocation',me()+' が配分案を提示しました。7日間の異議期間です','money'),log:(c.log||[]).concat([{t:now(),m:me()+' が配分案を提示した（7日間の異議期間）'}])});`);
rep(`try{ await db.doc('cases/'+id).update({objections:(c.objections||[]).concat([{by:me(),text,t:now()}]),log:`,
    `try{ await db.doc('cases/'+id).update({objections:(c.objections||[]).concat([{id:'o'+now(),by:me(),text,t:now(),resolved:false}]),notices:notice(c,[c.owner],'objection',me()+' が配分案に異議を出しました：'+text,'money'),log:`);
rep("  $('m-obj').innerHTML=(c?.objections||[]).map(o=>`<li><span class=\"tag wn\">異議</span><span>${esc(o.by)}：${esc(o.text)}</span><span class=\"cnt\">${fmtDate(o.t)}</span></li>`).join('');",
    "  $('m-obj').innerHTML=(c?.objections||[]).map(o=>`<li><span class=\"tag ${o.resolved?'ok':'wn'}\">${o.resolved?'解決':'異議'}</span><span>${esc(o.by)}：${esc(o.text)}</span><span class=\"cnt\">${fmtDate(o.t)}${!o.resolved&&c.owner===me()?` <button class=\"btn ghost sm\" onclick=\"resolveObj('${c.id}','${o.id}')\">解決にする</button>`:''}</span></li>`).join('');\n  $('m-receipt').textContent = c?.receipt ? '模擬受領 '+yen(c.receipt.amount)+'（'+fmtDT(c.receipt.t)+'・'+c.receipt.by+'）' : '未記録';\n  const st=settleState(c); $('m-settle').disabled=!st.ok; $('m-settlewhy').textContent=st.why;");

/* 新関数を挿入 */
rep(`function useCf(){`, fs.readFileSync('round3_snippet.js','utf8') + "\nfunction useCf(){");

fs.writeFileSync('ifbox-proto.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
