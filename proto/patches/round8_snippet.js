/* ===================== 第8回：案件をまたぐ自分の手番（K3）／二度目の確認（K4） ===================== */
function myTurns(){
  const name=me(), id=meId(); const out=[]; const unassigned=[];
  for(const c of Object.values(cases)){
    if(c.archived||isSample(c)) continue;
    /* 取り込み未確認：自分が担当 */
    if(c.sourceArtifact&&c.intake){ const mine=(c.intake.assigneeId&&id&&c.intake.assigneeId===id)||(!c.intake.assigneeId&&c.intake.assignee===name);
      if(c.intake.status==='未確認'){ if(mine) out.push({c,why:'元成果物の使用区分が未確認',anchor:'accept'}); else if(!c.intake.assignee) unassigned.push({c,why:'取り込み担当が未確定',anchor:'accept'}); } }
    /* 自分の席：期限超過の行動、次の一手が空 */
    for(const [k,n] of SEATS){ const s=c.seats?.[k]; if(!s||s.t!=='hu'||s.n!==name) continue;
      const open=(c.actions||[]).filter(a=>a.seat===k&&a.state==='open'); const over=open.filter(a=>a.due<now());
      if(over.length) out.push({c,why:n+'の席：期限超過の行動 '+over.length+'件（停滞）',anchor:'props'});
      else if(open.length) out.push({c,why:n+'の席：次の一手「'+open[0].text.slice(0,24)+'」 期限 '+fmtDate(open[0].due),anchor:'props'});
      if(k==='ACC'){ const last=(c.deliveries||[]).slice(-1)[0]; if(last&&!last.rejected&&!last.accepted) out.push({c,why:'検収待ち v'+last.version,anchor:'accept'}); }
      if(k==='OWN'){ if((c.bids||[]).some(b=>b.by!=='AI'&&!b.won&&!(c.bids||[]).some(w=>w.won&&w.seat===b.seat))) out.push({c,why:'未採用の提案がある',anchor:'props'});
        if(c.cf?.open&&cfTotal(c)>=c.cf.goal&&c.stage<2) out.push({c,why:'支援が目標に届いた。買い手を確定',anchor:'cf'});
        if(c.stage===4&&!c.dist) out.push({c,why:'検収済み。配分案を提示',anchor:'money'});
        if((c.objections||[]).some(o=>!o.resolved)) out.push({c,why:'未解決の異議がある',anchor:'money'}); } }
    /* 自分宛て未読 */
    const un=unreadNotices(c); if(un.length) out.push({c,why:'未読の通知 '+un.length+'件',anchor:un[0].anchor||'props'});
  }
  return {out,unassigned};
}
function renderTurns(){
  const el=$('turns'); if(!el) return; const {out,unassigned}=myTurns();
  const row=t=>`<li style="cursor:pointer" onclick="cur='${t.c.id}';go('case');renderCase();${t.anchor==='money'?`go('money');$('m-case').value='${t.c.id}';loadDist();`:`tab('${t.anchor}');`}"><span><b>${esc(t.c.title)}</b><br><span class="sm">${esc(t.why)}</span></span><span class="cnt">段階${t.c.stage} →</span></li>`;
  el.innerHTML=`<p class="sm">名札「${esc(me())}」の手番。実案件で保管されていないものだけ。席の状態と取り込みの状態から都度計算し、別の完了状態は持ちません。</p>
    <ul class="arc">${out.length?out.map(row).join(''):'<li class="sm">いま、あなたの手番はありません。</li>'}</ul>
    ${unassigned.length?`<h3 style="margin-top:14px">担当未確定（誰かが担当を決める必要があります）</h3><ul class="arc">${unassigned.map(row).join('')}</ul>`:''}`;
}
/* 二度目の確認（K4）：チェックリスト */
function renderSecondCheck(c){
  const el=$('c-second'); if(!el) return; if(!c.reuse){ el.innerHTML=''; return; }
  const s=cases[c.reuse.sourceCaseId]; const cp=c.comparison; const it=c.intake; const accepted=(c.artifacts||[]).find(a=>a.accepted); const srcAcc=s?(s.artifacts||[]).find(a=>a.accepted):null;
  const items=[
    ['両方が実案件',!isSample(c)&&!!s&&!isSample(s)],
    ['元成果物が型で固定されている',!!c.sourceArtifact],
    ['取り込み担当が決まっている',!!(it&&it.assignee)],
    ['使用区分が確認済み（そのまま／修正／不使用）',!!(it&&it.status&&it.status!=='未確認')],
    ['使用区分が「不使用」ではない',!!(it&&it.status&&it.status!=='不使用')],
    ['比較条件を確定し、変更していない',!!(cp&&cp.confirmedAt)&&condMismatch(c).length===0],
    ['適用先が検収済み（段階4以上）',c.stage>=4&&!!accepted],
    ['同じ便益・同等以上の検収条件と人が確認',c.measurement?.sameBenefit==='yes'],
    ['原価の入力に不足がない（両案件）',(()=>{ const rate=cp?.hourlyRate||3000; return !!s&&costOf(s,rate).total!=null&&costOf(c,rate).total!=null; })()],
  ];
  const done=items.filter(x=>x[1]).length;
  el.innerHTML=`<h3>二度目の確認（${done}/${items.length}）</h3><p class="sm">型を適用しただけでは便益の証明にならない。使用と検収の根拠を時間・原価の差につなぐ。全部そろうまで結論は出しません。</p>
    <ul style="list-style:none;padding:0;margin:6px 0 0">${items.map(x=>`<li style="padding:3px 0;font-size:13px"><span class="tag ${x[1]?'ok':'em'}">${x[1]?'済':'未'}</span> ${x[0]}</li>`).join('')}</ul>
    <table style="margin-top:8px"><tr><th>元成果物</th><th>使用区分</th><th>適用先の検収</th><th>時間・原価差</th></tr><tr><td>${c.sourceArtifact?esc(c.sourceArtifact.name)+' v'+c.sourceArtifact.version:'—'}</td><td>${it?esc(it.status)+(it.targetVersionId?'（→ v'+(artifactOf(c,it.targetVersionId)?.version||'?')+'）':''):'—'}</td><td>${accepted?'v'+accepted.version+' 検収済':'未'}</td><td class="sm">下の比較欄を参照（不足があれば理由が出ます）</td></tr></table>
    ${it&&it.status==='不使用'?'<div class="box warn">元成果物を使わなかった案件です。再利用の成功とはせず、そのまま結果に残します。</div>':''}`;
}
