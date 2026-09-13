
/* ===================== 第9回：スレッド（K5）／会員・オファー（K6）／購入型のみ（K7） ===================== */
/* 打合せ（2026-09-13）で決まった3点。出資型は非表示（データは残す）。会員の線引きは未決なので表示のみ。 */
const FUND_ENABLED = false;
function renderFund(c){ if(FUND_ENABLED){ return renderFund_orig(c); } const el=$('c-fund'); if(el) el.innerHTML='<p class="sm">出資型（資金を出す）は行いません。免許が要るため、IFBOXはお金を預かりません。先に買う（購入型）だけを使います。</p>'; }

/* 出資型の入口と保存処理を無効化（データは残す） */
function openFundForm(){ if(!FUND_ENABLED){ toast('出資型は行いません。先に買う（購入型）を使ってください'); return; } }
async function startFund(){ if(!FUND_ENABLED){ toast('出資型は行いません'); return; } }
async function fundPledge(){ if(!FUND_ENABLED){ toast('出資型は行いません'); return; } }
async function closeFund(){ if(!FUND_ENABLED){ toast('出資型は行いません'); return; } }

/* --- 参加者の会員区分 --- */
function pByName(name){ return Object.values(participantsAll).find(p=>dispName(p)===name)||null; }
function rankOf(p){ if(!p) return null; return (p.introId&&participantsAll[p.introId]&&p.introId!==p.id)?'member':'guest'; }
function rankTag(p){ if(!p) return ''; return rankOf(p)==='member'?'<span class="tag ok" title="紹介者あり">会員</span>':'<span class="tag em" title="紹介者なし">一般</span>'; }
function rankTagByName(name){ return rankTagByNameCache(name); }
function rankTagByNameCache(name){ return rankTag(pByName(name)); }
function introducerOptions(sel,excludeId){ return '<option value="">（紹介者なし＝一般）</option>'+Object.values(participantsAll).filter(p=>p.id!==excludeId).map(p=>`<option value="${p.id}" ${p.id===sel?'selected':''}>${esc(dispName(p))}</option>`).join(''); }
async function registerMe(){ const name=$('new-name').value.trim(); if(!name){ toast('表示名を入れてください'); return; }
  const introId=$('new-intro')?.value||''; const introName=introId?dispName(participantsAll[introId]):''; const video=($('new-video')?.value||'').trim(); const note=($('new-note')?.value||'').trim();
  if(video&&!/^https?:\/\//.test(video)){ toast('紹介動画は http から始まるURLを入れてください'); return; }
  try{ const ref=await db.collection('participants').add({name,createdAt:Date.now(),introId:introId||null,introName:introName||null,video:video||null,note:note||null}); myId=ref.id; try{ localStorage.setItem('ifbox.pid',ref.id); }catch(e){} closeMd(); toast('登録しました。'+(introId?'紹介者ありなので「会員」と表示されます。':'紹介者なしなので「一般」と表示されます。')); }catch(e){ toast('登録できません: '+(e.code||e.message)); } }
function editMe(){ const p=participantsAll[myId]; if(!p){ toast('先に参加者を選ぶか登録してください'); return; }
  md(`<h3>自分の情報・紹介</h3><p class="sm">紹介者がいると「会員」、いなければ「一般」と表示されます。席に座るのを会員に限るかは未決なので、いまは表示だけです。</p>
  <dl class="kv" style="margin-top:8px"><dt>表示名</dt><dd>${esc(dispName(p))}</dd></dl>
  <div class="row"><span class="sm" style="width:90px">紹介者</span><select class="f" id="ed-intro" style="flex:1">${introducerOptions(p.introId,p.id)}</select></div>
  <div class="row"><span class="sm" style="width:90px">紹介動画URL</span><input class="f" id="ed-video" value="${esc(p.video||'')}" placeholder="https://…（自己紹介・実績の動画）" style="flex:1"></div>
  <div class="row"><span class="sm" style="width:90px">一言</span><input class="f" id="ed-note" value="${esc(p.note||'')}" placeholder="できること・持っているもの（販路・場所・資格・実績）" style="flex:1"></div>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveMeInfo()">保存する</button></div>`); }
async function saveMeInfo(){ const introId=$('ed-intro').value||null; const introName=introId?dispName(participantsAll[introId]):null; const video=$('ed-video').value.trim()||null; const note=$('ed-note').value.trim()||null;
  if(video&&!/^https?:\/\//.test(video)){ toast('紹介動画は http から始まるURLを入れてください'); return; }
  try{ await db.doc('participants/'+myId).update({introId,introName,video,note,updatedAt:Date.now()}); closeMd(); toast('保存しました。'); }catch(e){ toast('保存できません: '+(e.code||e.message)); } }

/* --- 会員一覧（オファー型） --- */
function renderMembers(){ const el=$('members'); if(!el) return; const list=Object.values(participantsAll);
  if(!list.length){ el.innerHTML='<p class="sm">まだ参加者がいません。右上の「あなた」から登録できます。</p>'; return; }
  el.innerHTML=list.map(p=>`<div class="card mcard"><div class="row" style="margin-top:0"><b style="font-size:15px">${esc(dispName(p))}</b>${rankTag(p)}${p.id===myId?'<span class="tag bl">あなた</span>':''}</div>
    <dl class="kv"><dt>紹介者</dt><dd>${esc(p.introName||'なし')}</dd><dt>紹介動画</dt><dd>${p.video?`<a href="${esc(p.video)}" target="_blank" rel="noopener">見る</a>`:'未登録'}</dd><dt>一言</dt><dd>${esc(p.note||'未記入')}</dd></dl>
    <div class="row" style="justify-content:flex-end">${p.id===myId?`<button class="btn ghost sm" onclick="editMe()">自分の情報を直す</button>`:`<button class="btn sm" onclick="offerFromMembers('${p.id}')">オファーを送る</button>`}</div></div>`).join(''); }
function offerFromMembers(pid){ const mine=Object.values(cases).filter(c=>!c.archived&&!isSample(c)&&(c.owner===me()||participants(c).includes(me())));
  if(!mine.length){ toast('オファーを送れる案件がありません。先に「もし」を置くか、案件に参加してください。'); return; }
  md(`<h3>どの案件にオファーしますか</h3><select class="f" id="of-case" style="width:100%;margin-top:8px">${mine.map(c=>`<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="cur=$('of-case').value;openOffer('${pid}')">次へ</button></div>`); }
function openOffer(pid){ const c=cases[cur]; if(!c) return; const list=Object.values(participantsAll).filter(p=>p.id!==myId); if(!list.length){ toast('オファーを送れる参加者がいません'); return; }
  const seats=SEATS.filter(([k])=>k!=='OWN'&&c.seats?.[k]?.t!=='hu'); if(!seats.length){ toast('空いている席がありません'); return; }
  md(`<h3>会員にオファーを送る</h3><p class="sm">紹介動画や一言を見て「この人に座ってほしい」と思ったら送ります。受けるか辞退するかは相手が決めます（承認制）。案件：${esc(c.title)}</p>
  <div class="row"><select class="f" id="of-to" style="flex:1">${list.map(p=>`<option value="${p.id}" ${p.id===pid?'selected':''}>${esc(dispName(p))}${rankOf(p)==='member'?'（会員）':'（一般）'}</option>`).join('')}</select><select class="f" id="of-seat">${seats.map(([k,n])=>`<option value="${k}">${n}の席</option>`).join('')}</select></div>
  <textarea id="of-text" placeholder="なぜこの人に。何をお願いしたいか。" style="width:100%;margin-top:8px"></textarea>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="sendOffer()">オファーを送る</button></div>`); }
async function sendOffer(){ const c=cases[cur]; if(!c) return; if(c.archived){ toast('保管中の案件にはオファーを送れません'); return; } if(!(c.owner===me()||participants(c).includes(me()))){ toast('オファーは発案者か、席に座っている人が送ります'); return; } const toId=$('of-to').value, seat=$('of-seat').value, text=$('of-text').value.trim(); const p=participantsAll[toId];
  if(!p||!seat){ toast('相手と席を選んでください'); return; } if(!text){ toast('一言添えてください'); return; }
  if((c.offers||[]).some(o=>o.state==='open'&&o.toId===toId&&o.seat===seat)){ toast('同じ人に同じ席のオファーが返事待ちです'); return; }
  const o={id:'o'+now(),toId,to:dispName(p),seat,by:me(),byId:meId()||null,text,t:now(),state:'open'};
  await save({offers:(c.offers||[]).concat([o]),notices:notice(c,[o.to],'offer',me()+' から'+SNAME[seat]+'の席へのオファーが届きました','msgs')}, me()+' が '+o.to+' に'+SNAME[seat]+'の席をオファーした');
  closeMd(); toast('オファーを送りました。相手の返事を待ちます。'); if(cur&&cases[cur]) { openCase(cur); tab('msgs'); } }
async function answerOffer(id,ok){ const c=cases[cur]; const o=(c.offers||[]).find(x=>x.id===id); if(!o||o.state!=='open') return;
  if(!((o.toId&&o.toId===meId())||o.to===me())){ toast('このオファーはあなた宛てではありません'); return; }
  const offers=c.offers.map(x=>x.id===id?{...x,state:ok?'accepted':'declined',answeredAt:now()}:x);
  if(!ok){ await save({offers,notices:notice(c,[o.by],'offer',me()+' が'+SNAME[o.seat]+'の席のオファーを辞退しました','msgs')}, me()+' が'+SNAME[o.seat]+'の席のオファーを辞退した'); return; }
  if(c.seats?.[o.seat]?.t==='hu'){ toast('その席にはもう人が座っています。オファーは流れました。'); await save({offers:c.offers.map(x=>x.id===id?{...x,state:'declined',reason:'席が埋まった',answeredAt:now()}:x)}); return; }
  const seats={...c.seats,[o.seat]:{t:'hu',n:me(),since:now(),packet:null,offerId:id}};
  const patch={offers,seats,notices:notice(c,[o.by],'offer',me()+' がオファーを受けて'+SNAME[o.seat]+'の席に座りました','msgs')}; let msg=me()+' がオファーを受けて'+SNAME[o.seat]+'の席に座った';
  if(o.seat==='BUY'&&c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; stampStage(patch,c,2); }
  if(o.seat==='BUILD'&&c.stage<1){ patch.stage=1; }
  await save(patch,msg); toast('席に座りました。'); }

/* --- スレッド（mixi的）：新しい台帳は作らず、messages・bids・offers・logを時刻順に合成 --- */
const SYS_RE=/席に座った|席に迎えた|採用|段階|納品|検収|精算|先に買う|募った|保管|降りた|戻した|オファー|名乗った/;
function threadItems(c){ const items=[];
  (c.messages||[]).forEach((m,i)=>items.push({t:m.t,kind:m.kind==='can'?'can':'msg',m,i}));
  (c.bids||[]).forEach(b=>items.push({t:b.t,kind:'bid',b}));
  (c.offers||[]).forEach(o=>items.push({t:o.t,kind:'offer',o}));
  (c.log||[]).filter(l=>SYS_RE.test(l.m)&&!/名乗った|オファーした/.test(l.m)).forEach(l=>items.push({t:l.t,kind:'sys',l}));
  return items.sort((a,b)=>a.t-b.t); }
function av(name){ return name==='AI'?'<div class="av ai">AI</div>':`<div class="av" style="background:hsl(${hue(name)} 55% 42%)">${esc(String(name).slice(0,1))}</div>`; }
function renderThread(c){ const items=threadItems(c); $('n-msgs').textContent=(c.messages||[]).length||''; const el=$('c-msgs'); if(!el) return; const isOwner=c.owner===me();
  el.innerHTML = items.length? items.map(it=>{
    if(it.kind==='sys') return `<div class="tp sys"><span>${esc(it.l.m)}</span><span class="tm">${fmtDT(it.t)}</span></div>`;
    if(it.kind==='bid'){ const b=it.b; const short=b.text.length>140?b.text.slice(0,140)+'…':b.text; return `<div class="tp bid">${av(b.by)}<div class="bd"><div class="who"><b>${esc(b.by)}</b>${rankTagByName(b.by)}<span class="tag ${b.by==='AI'?'ai':'bl'}">提案：${SNAME[b.seat]||'席'}</span>${b.won?'<span class="tag ok">採用</span>':''}<span class="tm">${fmtDT(b.t)}</span></div><div class="tx">${esc(short)}</div><div class="ft">${b.by==='AI'?'<span class="sm">単価表（最低ライン）</span>':`<b>${yen(b.price)}</b>${b.days?`<span class="sm">納期 ${b.days}日</span>`:''}`}<button class="btn ghost sm" onclick="tab('props')">提案タブで見る</button></div></div></div>`; }
    if(it.kind==='offer'){ const o=it.o; const mine=(o.toId&&o.toId===meId())||o.to===me(); const st=o.state==='accepted'?'<span class="tag ok">受けた</span>':o.state==='declined'?`<span class="tag em">辞退${o.reason?'（'+esc(o.reason)+'）':''}</span>`:'<span class="tag bl">返事待ち</span>';
      return `<div class="tp offer"><div class="av gold">オ</div><div class="bd"><div class="who"><b>${esc(o.by)}</b><span>→</span><b>${esc(o.to)}</b><span class="tag ai">オファー：${SNAME[o.seat]||'席'}</span>${st}<span class="tm">${fmtDT(o.t)}</span></div><div class="tx">${esc(o.text)}</div>${o.state==='open'&&mine?`<div class="ft"><button class="btn sm" onclick="answerOffer('${o.id}',true)">受けて席に座る</button><button class="btn ghost sm" onclick="answerOffer('${o.id}',false)">辞退する</button></div>`:''}</div></div>`; }
    const m=it.m; const meP=m.by===me();
    if(it.kind==='can'){ const s=c.seats?.[m.seat]; const seated=s?.t==='hu'&&s.n===m.by; const taken=s?.t==='hu'&&s.n!==m.by;
      return `<div class="tp can">${av(m.by)}<div class="bd"><div class="who"><b>${esc(m.by)}</b>${rankTagByName(m.by)}<span class="tag hu">俺これできる：${SNAME[m.seat]||'席'}</span>${seated?'<span class="tag ok">着席</span>':taken?'<span class="tag em">席は埋まった</span>':''}<span class="tm">${fmtDT(m.t)}</span></div><div class="tx">${esc(m.text)}</div>${!seated&&!taken&&isOwner&&!meP?`<div class="ft"><button class="btn sm" onclick="sitFromCan(${it.i})">この人に${SNAME[m.seat]||''}の席に座ってもらう</button><button class="btn ghost sm" onclick="$('msg-text').value='${esc(m.by)}さん、';$('msg-text').focus()">返事</button></div>`:''}</div></div>`; }
    return `<div class="tp ${meP?'me':''}">${av(m.by)}<div class="bd"><div class="who"><b>${esc(m.by)}</b>${rankTagByName(m.by)}<span class="tm">${fmtDT(m.t)}</span></div><div class="tx">${esc(m.text)}</div></div></div>`;
  }).join('') : '<p class="sm">まだ書き込みはありません。「俺これできる」と席を名乗る、質問する、条件をすり合わせる。提案・着席・段階の変化もここに並びます。</p>';
  el.scrollTop=el.scrollHeight;
  const tools=$('msg-tools'); if(tools) tools.innerHTML=(isOwner||participants(c).includes(me()))&&!c.archived?`<button class="btn ghost sm" onclick="openOffer()">会員にオファーを送る</button><span class="sm">「席に座ってほしい人」がいるとき。相手が受けて初めて座ります。</span>`:'';
  const ms=$('msg-seat'); if(ms&&!ms.dataset.filled){ ms.innerHTML=SEATS.filter(([k])=>k!=='OWN').map(([k,n])=>`<option value="${k}">${n}の席</option>`).join(''); ms.dataset.filled='1'; ms.style.display='none'; } }
function msgKindChange(){ const k=$('msg-kind')?.value; const s=$('msg-seat'); if(s) s.style.display=k==='can'?'':'none'; const t=$('msg-text'); if(t) t.placeholder=k==='can'?'できること・持っているもの（販路・場所・資格・実績）を一言':'提案内容や進め方について入力（案件の全員に見えます）'; }
async function sendMsg(){ const text=$('msg-text').value.trim(); const kind=$('msg-kind')?.value||'msg'; const c=cases[cur]; if(!c) return;
  if(kind==='can'){ const seat=$('msg-seat').value; if(!text){ toast('できること・持っているものを一言添えてください'); return; } if(c.seats?.[seat]?.t==='hu'){ toast(SNAME[seat]+'の席にはもう人が座っています'); return; } if(c.owner===me()){ toast('発案者は自分の案件に名乗る必要はありません。席を直接クリックして座れます。'); return; }
    await save({messages:(c.messages||[]).concat([{by:me(),byId:meId()||null,text,t:now(),kind:'can',seat}]),notices:notice(c,[c.owner],'can',me()+' が「俺これできる」と'+SNAME[seat]+'の席を名乗りました','msgs')}, me()+' が「俺これできる」と'+SNAME[seat]+'の席を名乗った');
    $('msg-text').value=''; $('msg-kind').value='msg'; msgKindChange(); toast('名乗りました。発案者が席に座ってもらうかを決めます。'); return; }
  if(!text) return; await save({messages:(c.messages||[]).concat([{by:me(),byId:meId()||null,text,t:now()}])}); $('msg-text').value=''; }
async function sitFromCan(i){ const c=cases[cur]; const m=(c.messages||[])[i]; if(!m||m.kind!=='can') return;
  if(c.owner!==me()){ toast('席に座ってもらうのは発案者が決めます'); return; } if(c.seats?.[m.seat]?.t==='hu'){ toast('その席にはもう人が座っています'); return; }
  const seats={...c.seats,[m.seat]:{t:'hu',n:m.by,since:now(),packet:null,fromCan:true}}; const patch={seats,notices:notice(c,[m.by],'seated','発案者があなたを'+SNAME[m.seat]+'の席に迎えました','msgs')}; let msg=me()+'（発案者）が '+m.by+' を'+SNAME[m.seat]+'の席に迎えた（スレッドの名乗りから）';
  if(m.seat==='BUY'&&c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; stampStage(patch,c,2); }
  if(m.seat==='BUILD'&&c.stage<1){ patch.stage=1; }
  await save(patch,msg); toast(m.by+' さんが席に座りました。'); }
