/* ===================== 模擬取引モード・テスト日時 ===================== */
let CLOCK=0;
function subscribeClock(){ if(!db) return; db.doc('meta/clock').onSnapshot(s=>{ CLOCK=(s.exists&&s.data()?.offsetMs)||0; if(cur&&cases[cur]) renderCase(); if(document.getElementById('s-money').classList.contains('on')) calc(); }, ()=>{}); }
async function bumpClock(days){ try{ await db.doc('meta/clock').set({offsetMs:(days===0?0:CLOCK+days*DAY),by:me(),t:Date.now()}); toast(days===0?'テスト日時を戻しました':'テスト日時を'+days+'日進めました（全員に反映）'); }catch(e){ toast('進められません: '+(e.code||e.message)); } }
function renderTest(c){
  const el=$('c-test'); if(!el) return;
  const unread=unreadNotices(c);
  el.innerHTML=`<div class="testbar"><span class="tag wn">仲間内テスト・実決済なし</span><span class="sm">テスト日時 <b class="num">${new Date(now()).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</b>${CLOCK?'（'+Math.round(CLOCK/DAY)+'日進めています）':''}</span><button class="btn ghost sm" onclick="bumpClock(1)">+1日</button><button class="btn ghost sm" onclick="bumpClock(7)">+7日</button>${CLOCK?'<button class="btn ghost sm" onclick="bumpClock(0)">戻す</button>':''}<span style="flex:1"></span><button class="btn ${unread.length?'':'ghost'} sm" onclick="openNotices()">自分宛て未読 ${unread.length}件</button></div>`;
}

/* ===================== 通知（画面内未読） ===================== */
function readKey(){ return 'ifbox.read.'+me(); }
function readSet(){ try{ return new Set(JSON.parse(localStorage.getItem(readKey())||'[]')); }catch(e){ return new Set(); } }
function markRead(id){ try{ const s=readSet(); s.add(id); localStorage.setItem(readKey(),JSON.stringify([...s].slice(-500))); }catch(e){} }
function unreadNotices(c){ const s=readSet(); return (c.notices||[]).filter(n=>(n.targets||[]).includes(me())&&!s.has(n.id)); }
function notice(c,targets,type,text,anchor){ const t=[...new Set((targets||[]).filter(x=>x&&x!==me()))]; if(!t.length) return c.notices||[]; return (c.notices||[]).concat([{id:'n'+now()+Math.random().toString(36).slice(2,6),targets:t,type,text,anchor,t:now()}]); }
function openNotices(){ const c=cases[cur]; const list=(c.notices||[]).filter(n=>(n.targets||[]).includes(me())).slice().reverse().slice(0,30); const s=readSet();
  md(`<h3>自分宛ての通知</h3><p class="sm">この端末・この名前での既読です。本人確認ではありません。</p><ul class="arc" style="margin-top:8px">${list.length?list.map(n=>`<li style="cursor:pointer" onclick="goNotice('${n.id}','${n.anchor}')"><span>${s.has(n.id)?'':'<span class=\"tag wn\">未読</span> '}${esc(n.text)}</span><span class="cnt">${fmtDT(n.t)}</span></li>`).join(''):'<li class="sm">通知はありません。</li>'}</ul><div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">閉じる</button></div>`); }
function goNotice(id,anchor){ markRead(id); closeMd(); if(anchor==='money'){ go('money'); $('m-case').value=cur; loadDist(); } else { tab(anchor||'props'); } renderCase(); }
function humanNames(c){ return SEATS.map(([k])=>c.seats[k]).filter(s=>s?.t==='hu'&&s.n&&!/^支援者/.test(s.n)).map(s=>s.n); }

/* ===================== 検収基準・納品・検収 ===================== */
function renderAccept(c){
  const el=$('c-accept'); if(!el) return;
  const crit=c.criteria||[]; const locked=!!c.criteriaLocked; const isOwner=c.owner===me();
  const dels=c.deliveries||[]; const last=dels[dels.length-1]; const checks=c.checks||[];
  const accName=c.seats.ACC?.t==='hu'?c.seats.ACC.n:null;
  let h=`<h3 style="margin-top:0">検収基準（着手前に公開）</h3>`;
  if(crit.length) h+=`<ol style="margin:4px 0 0;padding-left:1.4em;font-size:13px">${crit.map(x=>`<li>${esc(x.text)}</li>`).join('')}</ol>`; else h+=`<p class="sm">まだ基準がありません。発案者が1件以上置くと、提案の採用ができるようになります。</p>`;
  if(isOwner&&!locked) h+=`<textarea id="crit-text" placeholder="1行に1つ。例）飼い主30人が4週間記録できる／提案フードの購入導線がある／個別データを物販側に渡さない" style="margin-top:8px">${esc(crit.map(x=>x.text).join('\n'))}</textarea><div class="row"><button class="btn sm" onclick="saveCriteria()">基準を確定して公開</button><span class="sm">最初の採用のあとは編集できません。</span></div>`;
  if(locked) h+=`<p class="sm">採用後のため編集できません。</p>`;
  h+=`<h3 style="margin-top:14px">納品</h3>`;
  h+=dels.length?`<ul class="arc">${dels.slice().reverse().map(d=>`<li><span>${esc(d.by)}：${/^https?:/.test(d.note)?`<a href="${esc(d.note)}" target="_blank" rel="noopener">${esc(d.note)}</a>`:esc(d.note)} ${d.rejected?`<span class="tag wn">差し戻し</span> <span class="sm">${esc(d.reason||'')}</span>`:d.accepted?'<span class="tag ok">検収済</span>':'<span class="tag bl">検収待ち</span>'}</span><span class="cnt">${fmtDT(d.t)}</span></li>`).join('')}</ul>`:'<p class="sm">まだ納品はありません。</p>';
  if(c.stage>=2&&(!last||last.rejected)) h+=`<div class="row"><input class="f" id="del-note" placeholder="成果物のURLか説明" style="flex:1;min-width:200px"><button class="btn sm" onclick="deliver()">納品を確定する（段階3）</button></div><p class="sm">納品は人が確定します。買い手席が埋まる前は納品できません。</p>`;
  if(c.stage<2) h+=`<p class="sm">段階2「買い手あり」になると納品できます。</p>`;
  if(last&&!last.rejected&&!last.accepted){
    h+=`<h3 style="margin-top:14px">検収チェック ${accName?`<span class="sm">（検収席：${esc(accName)}）</span>`:'<span class="sm">（検収席が空です。買い手側の人が座ってください）</span>'}</h3>`;
    h+=`<table><tr><th>基準</th><th style="width:110px">結果</th><th>メモ</th></tr>${crit.map(x=>{ const ck=checks.find(k=>k.criterionId===x.id)||{}; return `<tr><td>${esc(x.text)}</td><td><select class="f" data-cid="${x.id}" onchange="setCheck(this)"><option value="">未確認</option><option value="1" ${ck.passed===true?'selected':''}>合格</option><option value="0" ${ck.passed===false?'selected':''}>不合格</option></select></td><td><input class="f" style="width:100%" data-note="${x.id}" value="${esc(ck.note||'')}" onchange="setCheck(this)" placeholder="メモ"></td></tr>`; }).join('')}</table>`;
    const allPass=crit.length&&crit.every(x=>checks.find(k=>k.criterionId===x.id)?.passed===true); const anyFail=checks.some(k=>k.passed===false);
    h+=`<div class="row"><button class="btn" ${allPass?'':'disabled'} onclick="acceptAll()">検収を確定する（段階4）</button><input class="f" id="rej-reason" placeholder="差し戻しの理由（必須）" style="flex:1;min-width:160px"><button class="btn red sm" ${anyFail?'':'disabled'} onclick="rejectDelivery()">差し戻す</button></div><p class="sm">全項目が合格のときだけ確定できます。不合格があるときは理由を書いて差し戻します。AIは検収を確定しません。検収席の名前の一致は誤操作防止のためで、本人確認ではありません。</p>`;
  }
  el.innerHTML=h;
}
async function saveCriteria(){ const c=cases[cur]; if(c.criteriaLocked) return; const lines=$('crit-text').value.split('\n').map(s=>s.trim()).filter(Boolean); if(!lines.length){ toast('1行以上書いてください'); return; } await save({criteria:lines.map((t,i)=>({id:'k'+i+'_'+now(),text:t})),criteriaConfirmedBy:me(),criteriaConfirmedAt:now()}, me()+' が検収基準を公開した（'+lines.length+'件）'); }
async function deliver(){ const c=cases[cur]; const note=$('del-note').value.trim(); if(!note){ toast('成果物のURLか説明を入れてください'); return; } if(c.stage<2){ toast('買い手席が埋まってから納品できます'); return; }
  const accName=c.seats.ACC?.t==='hu'?c.seats.ACC.n:c.owner;
  const patch={deliveries:(c.deliveries||[]).concat([{id:'d'+now(),note,by:me(),t:now(),rejected:false,accepted:false}]),checks:[],stage:Math.max(c.stage,3)};
  patch.notices=notice(c,[accName],'delivery',me()+' が納品しました。検収をお願いします','accept');
  await save(patch, me()+' が納品を確定した（段階3）'); $('del-note').value=''; }
async function setCheck(el){ const c=cases[cur]; const cid=el.dataset.cid||el.dataset.note; const sel=document.querySelector(`select[data-cid="${cid}"]`); const inp=document.querySelector(`input[data-note="${cid}"]`); const v=sel.value; const checks=(c.checks||[]).filter(k=>k.criterionId!==cid).concat([{criterionId:cid,passed:v===''?null:v==='1',note:inp.value,by:me(),t:now()}]); await save({checks}); }
async function acceptAll(){ const c=cases[cur]; const dels=c.deliveries.slice(); const last=dels[dels.length-1]; if(!last) return; dels[dels.length-1]={...last,accepted:true,acceptedBy:me(),acceptedAt:now()};
  const patch={deliveries:dels,stage:Math.max(c.stage,4),acceptedBy:me(),acceptedAt:now()}; patch.notices=notice(c,humanNames(c),'review',me()+' が検収を確定しました（段階4）。配分の提示へ','money'); await save(patch, me()+' が検収を確定した（段階4）'); }
async function rejectDelivery(){ const c=cases[cur]; const reason=$('rej-reason').value.trim(); if(!reason){ toast('差し戻しの理由は必須です'); return; } const dels=c.deliveries.slice(); const last=dels[dels.length-1]; dels[dels.length-1]={...last,rejected:true,reason,rejectedBy:me(),rejectedAt:now()};
  const builder=c.seats.BUILD?.t==='hu'?c.seats.BUILD.n:c.owner; const patch={deliveries:dels,checks:[]}; patch.notices=notice(c,[builder,last.by],'review',me()+' が納品を差し戻しました：'+reason,'accept'); await save(patch, me()+' が納品を差し戻した：'+reason); $('rej-reason').value=''; }

/* ===================== 台帳 ===================== */
function renderLedger(c){
  const el=$('c-ledger'); if(!el) return;
  const adopted=(c.bids||[]).filter(b=>b.won&&b.by!=='AI');
  const rows=adopted.map(b=>`<tr><td>${esc(b.by)}</td><td><span class="tag hu">${SNAME[b.seat]}</span></td><td>${esc(b.text).slice(0,60)}</td><td class="sm">採用済み提案</td><td class="num">${yen(b.price)}</td><td><span class="tag ok">合意</span></td></tr>`).join('');
  const sup=(c.ledger||[]).map(r=>`<tr><td>${esc(r.by)}</td><td><span class="tag em">${SNAME[r.seat]||esc(r.seat)}</span></td><td>${esc(r.text)}</td><td class="sm">${esc(r.evidence||'')}${r.rights?'<br>権利：'+esc(r.rights):''}</td><td class="num">${esc(r.amount||'')}</td><td>${(r.confirmedBy||[]).length?`<span class="tag ok">確認 ${r.confirmedBy.length}人</span>`:'<span class="tag wn">未確認</span>'} <button class="btn ghost sm" onclick="confirmRow('${r.id}')">確認する</button> ${r.by===me()?`<button class="btn ghost sm" onclick="editRow('${r.id}')">編集</button>`:''}</td></tr>`).join('');
  el.innerHTML=`<p class="sm">誰の作業にいくら払い、何を合意したかを一つの表で。上段は採用済み提案から自動、下段は補足（当事者が自己申告名で確認）。本人性や改ざん防止は保証しません。配分の計算はこの表を入力元にしません。</p>
    <table><tr><th>貢献者</th><th>席</th><th>貢献</th><th>根拠・権利</th><th style="text-align:right">対価</th><th>状態</th></tr>${rows}${sup}${!rows&&!sup?'<tr><td colspan="6" class="sm">まだ記録がありません。</td></tr>':''}</table>
    <div class="box" style="background:var(--soft);margin-top:10px"><b style="font-size:13px">補足の行を足す</b><div class="row"><select class="f" id="lg-seat">${SEATS.map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select><input class="f" id="lg-text" placeholder="貢献（何をした）" style="flex:1;min-width:160px"><input class="f" id="lg-amount" placeholder="対価（例 5,000円／成果連動）" style="width:170px"></div><div class="row"><input class="f" id="lg-evidence" placeholder="根拠（URL・記録）" style="flex:1;min-width:160px"><input class="f" id="lg-rights" placeholder="権利メモ（任意。移転は自動成立しない）" style="flex:1;min-width:160px"><button class="btn sm" onclick="addRow()">追加</button></div></div>
    <h3 style="margin-top:14px">配分と異議（読み取り）</h3>${c.dist?`<p class="sm">提示 ${fmtDate(c.dist.proposedAt)} ・ 受領額 ${yen(c.dist.price)} ・ 異議期間 ${fmtDate(c.dist.proposedAt+7*DAY)} まで</p><ul class="arc">${(c.objections||[]).map(o=>`<li><span class="tag ${o.resolved?'ok':'wn'}">${o.resolved?'解決':'異議'}</span><span>${esc(o.by)}：${esc(o.text)}</span><span class="cnt">${fmtDate(o.t)}</span></li>`).join('')||'<li class="sm">異議はありません。</li>'}</ul>`:'<p class="sm">配分はまだ提示されていません。</p>'}`;
}
async function addRow(){ const c=cases[cur]; const text=$('lg-text').value.trim(); if(!text){ toast('貢献を書いてください'); return; } await save({ledger:(c.ledger||[]).concat([{id:'l'+now(),by:me(),seat:$('lg-seat').value,text,amount:$('lg-amount').value.trim(),evidence:$('lg-evidence').value.trim(),rights:$('lg-rights').value.trim(),confirmedBy:[],t:now()}])}, me()+' が台帳に補足を足した'); }
async function confirmRow(id){ const c=cases[cur]; await save({ledger:c.ledger.map(r=>r.id===id?{...r,confirmedBy:[...new Set((r.confirmedBy||[]).concat([me()]))]}:r)}); }
function editRow(id){ const c=cases[cur]; const r=c.ledger.find(x=>x.id===id); md(`<h3>補足を編集</h3><p class="sm">編集すると確認は解除され、未確認に戻ります。</p><input class="f" id="ed-text" value="${esc(r.text)}" style="width:100%;margin-top:8px"><input class="f" id="ed-amount" value="${esc(r.amount||'')}" style="width:100%;margin-top:8px" placeholder="対価"><div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveRow('${id}')">保存</button></div>`); }
async function saveRow(id){ const c=cases[cur]; await save({ledger:c.ledger.map(r=>r.id===id?{...r,text:$('ed-text').value.trim(),amount:$('ed-amount').value.trim(),confirmedBy:[],updatedAt:now()}:r)}, me()+' が台帳の補足を編集した（確認は解除）'); closeMd(); }

/* ===================== 模擬受領・精算 ===================== */
async function recordReceipt(){ const id=$('m-case').value; const c=cases[id]; const amount=+$('m-price').value||0; if(!amount){ toast('受領額を入れてください'); return; } try{ await db.doc('cases/'+id).update({receipt:{amount,by:me(),t:now(),mock:true},log:(c.log||[]).concat([{t:now(),m:me()+' が模擬受領を記録した（'+yen(amount)+'・実決済なし）'}])}); toast('模擬受領を記録しました（実決済なし）。'); }catch(e){ toast('保存できません'); } }
function settleState(c){ if(!c) return {ok:false,why:'案件を選んでください'}; if(c.stage<4) return {ok:false,why:'検収（段階4）が終わっていません'}; if(!c.receipt) return {ok:false,why:'模擬受領が記録されていません'}; if(!c.dist) return {ok:false,why:'配分案が提示されていません'}; const until=c.dist.proposedAt+7*DAY; if(now()<until) return {ok:false,why:'異議期間中です（'+fmtDate(until)+'まで）。テスト日時を進めると確認できます'}; if((c.objections||[]).some(o=>!o.resolved)) return {ok:false,why:'未解決の異議があります'}; if(c.stage>=5) return {ok:false,why:'精算済みです'}; return {ok:true,why:'精算できます'}; }
async function settle(){ const id=$('m-case').value; const c=cases[id]; const st=settleState(c); if(!st.ok){ toast(st.why); return; } try{ await db.doc('cases/'+id).update({stage:5,settlement:{amount:c.receipt.amount,by:me(),t:now(),mock:true},notices:notice(c,humanNames(c).concat((c.cf?.pledges||[]).map(p=>p.by)),'allocation',me()+' が模擬精算を確定しました（段階5）','money'),log:(c.log||[]).concat([{t:now(),m:me()+' が模擬精算を確定した（段階5・実決済なし）'}])}); toast('模擬精算を確定しました。'); }catch(e){ toast('保存できません'); } }
async function resolveObj(id,oid){ const c=cases[id]; if(c.owner!==me()){ toast('発案者だけが解決にできます'); return; } try{ await db.doc('cases/'+id).update({objections:c.objections.map(o=>o.id===oid?{...o,resolved:true,resolvedBy:me(),resolvedAt:now()}:o),log:(c.log||[]).concat([{t:now(),m:me()+' が異議を解決にした'}])}); }catch(e){ toast('保存できません'); } }
async function confirmBuyers(){ const c=cases[cur]; if(c.owner!==me()){ toast('発案者が確定します'); return; } const n=new Set((c.cf.pledges||[]).map(p=>p.by)).size; await save({stage:Math.max(c.stage,2),seats:{...c.seats,BUY:{t:'hu',n:'支援者 '+n+'人',since:now()}}}, me()+' が支援者を買い手として確定した（段階2）'); }
