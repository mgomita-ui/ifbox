/* ===================== 型（テンプレート）化 ===================== */
let templates={};
function subscribeTemplates(){ if(!db) return; db.collection('templates').orderBy('createdAt','desc').limit(50).onSnapshot(s=>{ templates={}; s.docs.forEach(d=>{ templates[d.id]={id:d.id,...d.data()}; }); if(cur&&cases[cur]) renderCase(); }, ()=>{}); }
function templateEligible(c){ if(!c) return {ok:false,why:''}; if(c.stage<5) return {ok:false,why:'模擬精算（段階5）まで終わった案件だけ型にできます'}; if(!(c.criteria||[]).length) return {ok:false,why:'検収基準がありません'}; if((c.objections||[]).some(o=>!o.resolved)) return {ok:false,why:'未解決の異議があります'}; if(c.owner!==me()) return {ok:false,why:'発案者が公開します'}; return {ok:true,why:''}; }
const P_TPL = window.AI_TPL || `あなたはIFBOXの「AI席」です。精算まで終わった案件から、次の案件で再利用する「型」を作ります。
ルール:
{{rules}}
- 氏名・個人を特定する情報・金額は出力に含めない。提案文は役割と内容だけを匿名化して要約する。
案件: {{title}}
言い換え: {{reframed}}
席ごとの行動:
{{actions}}
採用された提案（匿名化して要約すること）:
{{proposals}}
出力はこのJSONだけ:
{"rephrase":"この型が解く願いを「もし、」で始まる40字以内で一般化","seats":[{"role":"OWN|BUILD|SELL|SITE|BUY|ACC","action":"その席の標準的な行動 40字以内"}],"proposalSummary":"採用提案の匿名要約 120字以内"}`;
async function makeTemplate(){
  const c=cases[cur]; const el=templateEligible(c); if(!el.ok){ toast(el.why); return; }
  toast('AIが型の下書きを作っています…');
  let ai=null;
  if(sample){ try{ ai=await sample.json(fill(P_TPL,{title:c.title,reframed:c.reframed,actions:(c.actions||[]).map(a=>'- '+SNAME[a.seat]+'：'+a.text).join('\n'),proposals:(c.bids||[]).filter(b=>b.won&&b.by!=='AI').map(b=>'- '+SNAME[b.seat]+'：'+b.text).join('\n')||'（なし）'}),{modelTier:'default'}); }catch(e){} }
  const seats = ai?.seats?.length ? ai.seats.filter(s=>SNAME[s.role]) : (c.actions||[]).map(a=>({role:a.seat,action:a.text}));
  const tpl={ sourceCaseId:c.id, version:(c.template?.version||0)+1, createdAt:now(), by:me(), title:c.title, domain:c.domain||'',
    rephrase: ai?.rephrase || c.reframed, seats, criteria:(c.criteria||[]).map(x=>x.text),
    alloc: c.dist?{fixed:c.dist.fixed,perf:c.dist.perf,idea:c.dist.idea,units:c.dist.units||[]}:null,
    proposalSummary: ai?.proposalSummary || '' };
  md(`<h3>型を公開する</h3><p class="sm">氏名・メッセージ・受領・採用者・検収結果は含みません。検収基準と配分条件は原文のまま入ります。内容を確認して公開してください。</p>
    <div class="box info" style="font-size:12.5px"><b>${esc(tpl.rephrase)}</b><ul>${tpl.seats.map(s=>`<li>${SNAME[s.role]}：${esc(s.action)}</li>`).join('')}</ul><b>検収基準</b><ol>${tpl.criteria.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${tpl.alloc?`<b>配分条件</b>：確定対価 ${yen(tpl.alloc.fixed)}、成果連動 ${tpl.alloc.perf}%、発案枠 ${tpl.alloc.idea}%`:''}${tpl.proposalSummary?`<br><b>採用提案の要約</b>：${esc(tpl.proposalSummary)}`:''}</div>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick='publishTemplate(${JSON.stringify(tpl).replace(/'/g,"&#39;")})'>公開する</button></div>`);
}
async function publishTemplate(tpl){ try{ const ref=await db.collection('templates').add(tpl); await save({template:{id:ref.id,version:tpl.version,createdAt:tpl.createdAt}}, me()+' がこの案件の型（第'+tpl.version+'版）を公開した'); closeMd(); toast('型を公開しました。次の投稿で提示されます。'); }catch(e){ toast('公開できません: '+(e.code||e.message)); } }

/* --- 投稿時：似た型を探して適用 --- */
window._tpl=null; window._tplChecks=null;
const P_PICK = window.AI_PICK || `あなたはIFBOXの「AI席」です。新しい投稿に似た「型」を、候補の中から最大3件選びます。
ルール:
{{rules}}
- 候補にないIDを出さない。似ていなければ空配列。
投稿: {{draft}}
候補:
{{templates}}
出力はこのJSONだけ: {"candidates":[{"id":"候補のID","reason":"似ている理由 40字以内"}]}`;
async function findTemplates(){
  const draft=($('ifline').value+' '+$('benefit').value).trim(); const list=Object.values(templates); const box=$('tplbox');
  if(!list.length){ box.innerHTML='<p class="sm">公開された型はまだありません。精算まで終わった案件から作れます。</p>'; return; }
  box.innerHTML='<p class="sm">似た型を探しています…</p>';
  let ids=[];
  if(sample&&draft){ try{ const r=await sample.json(fill(P_PICK,{draft,templates:list.map(t=>'- ID:'+t.id+' / '+t.rephrase+' / 席:'+t.seats.map(s=>SNAME[s.role]).join('・')).join('\n')}),{modelTier:'quick'}); ids=(r.candidates||[]).map(x=>x.id).filter(id=>templates[id]).slice(0,3); }catch(e){} }
  if(!ids.length) ids=list.slice(0,3).map(t=>t.id);
  box.innerHTML=`<p class="sm">${sample?'AIが選んだ候補（外れていれば手で選べます）':'公開済みの型'}</p>`+ids.map(id=>{ const t=templates[id]; return `<div class="prop"><div class="hd"><span class="tag ai">型</span><span class="nm">${esc(t.rephrase)}</span><span class="sm">元：${esc(t.title)}</span></div><div class="tx sm">席の行動 ${t.seats.length}・検収基準 ${t.criteria.length}${t.alloc?'・配分条件':''}${t.proposalSummary?'・提案要約':''}</div><div class="ft"><button class="btn sm" onclick="previewTemplate('${id}')">中身を見て適用</button></div></div>`; }).join('')+`<div class="row"><select class="f" id="tpl-manual">${list.map(t=>`<option value="${t.id}">${esc(t.rephrase)}</option>`).join('')}</select><button class="btn ghost sm" onclick="previewTemplate($('tpl-manual').value)">手で選ぶ</button></div>`;
}
function previewTemplate(id){
  const t=templates[id]; if(!t) return; const items=templateItems(t);
  md(`<h3>型を適用する</h3><p class="sm">チェックした項目が新しい案件に最初から入ります。氏名や採用者は入りません。新しい案件は段階0・未採用・未検収から始まり、検収と配分の合意はやり直します。</p>
    <ul style="list-style:none;padding:0;margin:8px 0 0">${items.map((it,i)=>`<li style="padding:4px 0;border-bottom:1px solid var(--line);font-size:13px"><label><input type="checkbox" data-i="${i}" checked> <span class="tag ${it.kind==='criteria'?'ok':it.kind==='alloc'?'bl':'ai'}">${it.label}</span> ${esc(it.text)}</label></li>`).join('')}</ul>
    <label class="sm" style="display:block;margin-top:10px">この案件で足す検収基準（1行1つ・任意。分母に数えます）</label><textarea id="tpl-add" style="min-height:48px"></textarea>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="applyTemplate('${id}')">空欄に適用</button></div>`);
}
function templateItems(t){ const items=[]; (t.seats||[]).forEach(s=>items.push({kind:'seat',label:SNAME[s.role],text:s.action,role:s.role})); (t.criteria||[]).forEach(x=>items.push({kind:'criteria',label:'検収基準',text:x})); if(t.alloc){ items.push({kind:'alloc',label:'配分条件',text:`確定対価 ${yen(t.alloc.fixed)}`,key:'fixed'}); items.push({kind:'alloc',label:'配分条件',text:`成果連動 ${t.alloc.perf}%`,key:'perf'}); items.push({kind:'alloc',label:'配分条件',text:`発案枠 ${t.alloc.idea}%`,key:'idea'}); } if(t.proposalSummary) items.push({kind:'summary',label:'提案要約',text:t.proposalSummary}); return items; }
function applyTemplate(id){
  const t=templates[id]; const items=templateItems(t); const checks=[...document.querySelectorAll('#md input[type=checkbox]')].map(x=>x.checked);
  const added=$('tpl-add').value.split('\n').map(s=>s.trim()).filter(Boolean);
  window._tpl={id,version:t.version,sourceCaseId:t.sourceCaseId,items,checks,added,eligible:items.length+added.length,applied:checks.filter(Boolean).length};
  closeMd(); $('tplbox').innerHTML=`<div class="box gold"><b>型を適用します</b>：${esc(t.rephrase)} ・ 初期再利用率 ${window._tpl.applied}/${window._tpl.eligible}（投稿時に固定）<button class="btn ghost sm" style="margin-left:8px" onclick="window._tpl=null;findTemplates()">外す</button></div>`;
  toast('投稿すると適用されます。');
}
function reuseIntoDoc(doc){
  const r=window._tpl; if(!r) return doc;
  const chosen=r.items.filter((it,i)=>r.checks[i]);
  const acts=chosen.filter(it=>it.kind==='seat').map((it,i)=>({id:'t'+i+'_'+now(),seat:it.role,text:it.text,due:now()+7*DAY,state:'open',by:'型'}));
  const aiActs=(doc.actions||[]).filter(a=>!acts.some(x=>x.seat===a.seat));
  doc.actions=acts.concat(aiActs);
  const crit=chosen.filter(it=>it.kind==='criteria').map(it=>it.text).concat(r.added);
  doc.criteria=crit.map((t,i)=>({id:'k'+i+'_'+now(),text:t}));
  const alloc={}; chosen.filter(it=>it.kind==='alloc').forEach(it=>{ alloc[it.key]=templates[r.id].alloc[it.key]; });
  if(Object.keys(alloc).length) doc.allocPrefill={...alloc,units:templates[r.id].alloc.units||[]};
  const sum=chosen.find(it=>it.kind==='summary'); if(sum) doc.proposalSummary=sum.text;
  doc.reuse={templateId:r.id,templateVersion:r.version,sourceCaseId:r.sourceCaseId,eligible:r.eligible,applied:r.applied,initialRate:Math.round(r.applied/r.eligible*100),appliedAt:now(),snapshot:chosen.map(it=>it.label+'：'+it.text)};
  doc.log.push({t:now(),m:'型（第'+r.version+'版）を適用。初期再利用率 '+r.applied+'/'+r.eligible});
  window._tpl=null; return doc;
}

/* ===================== 元案件との最小比較 ===================== */
function ledgerTotal(c){ const a=(c.bids||[]).filter(b=>b.won&&b.by!=='AI').reduce((s,b)=>s+(+b.price||0),0); const l=(c.ledger||[]).filter(r=>(r.confirmedBy||[]).length).reduce((s,r)=>s+(parseInt(String(r.amount||'').replace(/[^\d]/g,''))||0),0); return a+l; }
function stampStage(patch,c,stage){ const m={...(c.measurement||{})}; if(stage===2&&!m.stage2At) m.stage2At=now(); if(stage===4&&!m.acceptedAt) m.acceptedAt=now(); if(stage===5&&!m.settledAt) m.settledAt=now(); patch.measurement=m; return patch; }
function renderCompare(c){
  const el=$('c-compare'); if(!el) return;
  const m=c.measurement||{};
  let h=`<h3 style="margin-top:0">計測（この案件）</h3><div class="row"><span class="sm" style="width:130px">実作業分数（申告）</span><input class="f num" id="ms-min" type="number" value="${m.activeMinutes??''}" placeholder="例 240" style="width:110px"><select class="f" id="ms-basis"><option value="measured" ${m.effortBasis==='measured'?'selected':''}>実測</option><option value="estimated" ${m.effortBasis==='estimated'?'selected':''}>推定</option></select><button class="btn ghost sm" onclick="saveMeasure()">保存</button></div>`;
  if(c.reuse){
    h+=`<div class="row"><span class="sm" style="width:130px">同じ便益・同等以上の検収条件か</span><select class="f" id="ms-same"><option value="unconfirmed" ${!m.sameBenefit||m.sameBenefit==='unconfirmed'?'selected':''}>未確認</option><option value="yes" ${m.sameBenefit==='yes'?'selected':''}>はい</option><option value="no" ${m.sameBenefit==='no'?'selected':''}>いいえ</option></select><input class="f" id="ms-note" placeholder="理由" value="${esc(m.comparisonNote||'')}" style="flex:1;min-width:160px"></div>`;
    const s=cases[c.reuse.sourceCaseId];
    h+=`<h3 style="margin-top:14px">元案件との比較 <span class="sm">（テスト時計を含む参考値。模擬・台帳対価であり総開発コストではない）</span></h3>`;
    if(!s){ h+='<p class="sm">元案件が読み込めません。</p>'; }
    else{
      const row=(label,f)=>`<tr><td>${label}</td><td>${f(s)}</td><td>${f(c)}</td></tr>`;
      const reach=x=>`段階${x.stage} ${STAGES[x.stage]}`;
      const el2=(x,k)=>x.measurement?.[k]?Math.round((x.measurement[k]-x.createdAt)/DAY*10)/10+'日':'未到達';
      const mins=x=>x.measurement?.activeMinutes!=null?x.measurement.activeMinutes+'分（'+(x.measurement.effortBasis==='measured'?'実測':'推定')+'）':'未申告';
      h+=`<table><tr><th></th><th>元案件</th><th>この案件</th></tr>${row('到達',reach)}${row('作成→段階2',x=>el2(x,'stage2At'))}${row('作成→検収',x=>el2(x,'acceptedAt'))}${row('作成→精算',x=>el2(x,'settledAt'))}${row('実作業分数',mins)}${row('台帳対価合計（模擬）',x=>yen(ledgerTotal(x)))}${row('初期再利用率',x=>x.reuse?x.reuse.initialRate+'%（'+x.reuse.applied+'/'+x.reuse.eligible+'）':'―')}</table>`;
      const reasons=[]; if(s.stage<5||c.stage<5) reasons.push('両方の案件が模擬精算まで終わっていない'); if(m.sameBenefit!=='yes') reasons.push('同じ便益・同等以上の検収条件が人の確認で「はい」になっていない'); const bothMeasured=s.measurement?.effortBasis==='measured'&&c.measurement?.effortBasis==='measured'&&s.measurement?.activeMinutes!=null&&c.measurement?.activeMinutes!=null; if(!bothMeasured) reasons.push('実作業分数が両方とも実測で申告されていない');
      if(reasons.length) h+=`<div class="box warn"><b>比較不能：</b>${reasons.join('。')}。</div>`;
      else { const dm=c.measurement.activeMinutes-s.measurement.activeMinutes, dy=ledgerTotal(c)-ledgerTotal(s); h+=`<div class="box ok"><b>比較できます。</b>実作業時間の差 ${dm>0?'+':''}${dm}分、台帳対価の差 ${dy>0?'+':''}${yen(dy)}。${dm<0&&dy<0?'速く安く回りました。':dm>=0&&dy>=0?'速くも安くもなっていません。':'一方だけが改善しました。'}時間と対価は別々の値で、実費の削減を証明するものではありません。</div>`; }
    }
  } else if(c.template){ h+=`<p class="sm" style="margin-top:8px">この案件の型（第${c.template.version}版）は公開済みです。型から作られた案件が精算まで進むと、そちらで比較が出ます。</p>`; }
  el.innerHTML=h;
}
async function saveMeasure(){ const c=cases[cur]; const m={...(c.measurement||{})}; const v=$('ms-min').value; m.activeMinutes=v===''?null:+v; m.effortBasis=$('ms-basis').value; if($('ms-same')){ m.sameBenefit=$('ms-same').value; m.comparisonNote=$('ms-note').value.trim(); } await save({measurement:m}, me()+' が計測値を申告した'); }
function renderReuseHead(c){ const el=$('c-reuse'); if(!el) return; el.innerHTML = c.reuse ? `<div class="box info" style="margin-top:8px;font-size:12.5px"><b>型から作った案件。</b>元：<a href="#" onclick="openCase('${c.reuse.sourceCaseId}');return false">${esc(cases[c.reuse.sourceCaseId]?.title||c.reuse.sourceCaseId)}</a> ・ 初期再利用率 ${c.reuse.initialRate}%（${c.reuse.applied}/${c.reuse.eligible}、投稿時に固定）${c.proposalSummary?'<br>採用提案の要約（元案件）：'+esc(c.proposalSummary):''}</div>` : ''; }

function renderTplMake(c){
  const te=templateEligible(c); const el=$('c-tplmake'); if(!el) return;
  if(c.stage<5){ el.innerHTML='<p class="sm">模擬精算（段階5）まで終わると、この案件を型にできます。</p>'; return; }
  if(c.template){ el.innerHTML=`<p class="sm">型（第${c.template.version}版）を公開済み。<button class="btn ghost sm" onclick="makeTemplate()">新しい版を作る</button></p>`; return; }
  el.innerHTML = te.ok ? `<div class="box gold" style="margin-top:0"><b>この案件は型にできます。</b>席の行動・検収基準・配分条件・採用提案の匿名要約を切り出し、次の投稿で最初から埋めます。<div class="row"><button class="btn sm" onclick="makeTemplate()">型を作る</button></div></div>` : `<p class="sm">型にできません：${esc(te.why)}</p>`;
}
