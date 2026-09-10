/* --- 資金を出す（出資型クラウドファンディング） --- */
function renderFund(c){
  const f=c.fund; const pane=$('c-fund'); const side=$('c-cfside');
  if(!f){ pane.innerHTML=`<p class="sm">この案件はまだ資金を募っていません。出資型は「作る前に資金を集める」形です。IFBOXは募集も預かりもしません。ここに残るのは出資の意向と、合意した残余配分の持分だけで、実際の募集と払込は登録事業者を通して行います。</p>${c.owner===me()?'<div class="row"><button class="btn" onclick="openFundForm()">資金を募る（目標額・使途・持分を置く）</button></div>':'<p class="sm">発案者だけが開けます。</p>'}`; return; }
  const total=fundTotal(c), pct=Math.min(100,Math.round(total/f.goal*100)), left=Math.ceil((f.deadline-now())/DAY), reached=total>=f.goal;
  const big=`<div class="cfbig"><div class="amt">${yen(total)}</div><div class="bar"><i style="width:${pct}%;background:var(--blue)"></i></div><div class="meta"><span>目標 ${yen(f.goal)}</span><span>${pct}%</span><span>${(f.pledges||[]).length}人</span><span>持分 ${f.share}%</span><span>${left>0?'あと'+left+'日':'締切'}</span></div>${reached?'<p class="tag ok" style="margin-top:6px">目標額に届きました（払込は外部で確定します）</p>':''}</div>`;
  side.insertAdjacentHTML('beforeend', `<h3 style="margin-top:10px">資金</h3>${big}${f.open&&left>0?`<div class="row"><input class="f num" id="fd-amt" type="number" placeholder="金額（円）" value="${f.unit||10000}" style="width:120px"><button class="btn ghost" onclick="fundPledge()">出資の意向を出す</button></div>`:''}`);
  pane.innerHTML=`${big}<div class="box info"><b>使途：</b>${esc(f.use)}<br><b>条件：</b>残余配分の ${f.share}% を出資者で分ける（出資額に応じて按分）。<br><span class="sm">これは出資の意向の記録です。IFBOXは募集も払込の受領もしません。実際の募集・契約・払込は登録事業者を通して行い、その結果をここに反映します。配当ではなく、残余配分の持分として扱います。</span></div>
    <table><tr><th>出資者（意向）</th><th style="text-align:right">金額</th><th>日時</th></tr>${(f.pledges||[]).slice().reverse().map(p=>`<tr><td>${esc(p.by)}</td><td class="num">${yen(p.amount)}</td><td class="sm">${fmtDT(p.t)}</td></tr>`).join('')||'<tr><td colspan="3" class="sm">まだ意向はありません。</td></tr>'}</table>
    ${c.owner===me()&&f.open?'<div class="row"><button class="btn ghost sm" onclick="closeFund()">募集を締める</button></div>':''}`;
}
function openFundForm(){ md(`<h3>資金を募る（出資型）</h3><p class="sm">目標額、1口、期限、使途、出資者に渡す残余配分の持分を置きます。IFBOXは募集も預かりもしません。実際の募集と払込は登録事業者を通します。</p>
  <div class="row"><span class="sm" style="width:90px">目標額（円）</span><input class="f num" id="fd-goal" type="number" value="300000" style="width:140px"></div>
  <div class="row"><span class="sm" style="width:90px">1口（円）</span><input class="f num" id="fd-unit" type="number" value="10000" style="width:140px"></div>
  <div class="row"><span class="sm" style="width:90px">期限（日）</span><input class="f num" id="fd-days" type="number" value="45" style="width:140px"></div>
  <div class="row"><span class="sm" style="width:90px">持分（%）</span><input class="f num" id="fd-share" type="number" value="20" style="width:140px"><span class="sm">残余配分のうち出資者に渡す割合</span></div>
  <textarea id="fd-use" placeholder="使途：例）フードの初回仕入れ 20万円、導入会の会場費 5万円、告知 5万円" style="margin-top:8px"></textarea>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="startFund()">募集を始める</button></div>`); }
async function startFund(){ const goal=+$('fd-goal').value||0, unit=+$('fd-unit').value||0, days=+$('fd-days').value||45, share=+$('fd-share').value||0, use=$('fd-use').value.trim(); if(!goal||!use){ toast('目標額と使途を入れてください'); return; } await save({fund:{goal,unit,deadline:now()+days*DAY,share,use,pledges:[],open:true,startedAt:now()}}, me()+' が資金を募り始めた（目標 '+yen(goal)+'、持分 '+share+'%）'); closeMd(); tab('fund'); }
async function fundPledge(){ const c=cases[cur]; const amount=+$('fd-amt').value||0; if(!amount){ toast('金額を入れてください'); return; } const pledges=(c.fund.pledges||[]).concat([{by:me(),amount,t:now()}]); await save({fund:{...c.fund,pledges}}, me()+' が'+yen(amount)+'の出資の意向を出した'); toast('意向を記録しました。募集と払込は外部の登録事業者で行います。'); }
async function closeFund(){ const c=cases[cur]; await save({fund:{...c.fund,open:false}}, me()+' が資金の募集を締めた'); }
