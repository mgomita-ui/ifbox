/* ===================== 第5回：条件を揃えた時間・原価比較（S） ===================== */
const BASIS={measured:'実測',estimated:'推計',unknown:'不明'};
function costOf(c,rate){
  const m=c.measurement||{}; const parts=[];
  const mins=m.activeMinutes; const aiC=m.aiCost||{amount:null,basis:'unknown'}; const mt=m.materialCost||{amount:null,basis:'unknown'};
  const missing=[]; if(mins==null) missing.push('実作業分数'); if(aiC.amount==null||aiC.basis==='unknown') missing.push('AI利用費'); if(mt.amount==null||mt.basis==='unknown') missing.push('材料費等');
  const estimated=[m.effortBasis==='estimated'&&mins!=null?'実作業分数':null, aiC.basis==='estimated'?'AI利用費':null, mt.basis==='estimated'?'材料費等':null].filter(Boolean);
  const total = missing.length ? null : Math.round(mins/60*rate + (+aiC.amount||0) + (+mt.amount||0));
  return {total,missing,estimated,labor:mins==null?null:Math.round(mins/60*rate)};
}
function condMismatch(c){ const cp=c.comparison; if(!cp||!cp.confirmedAt) return ['比較条件が未確定']; const out=[]; const cur=(c.criteria||[]).map(x=>x.text); if(JSON.stringify(cur)!==JSON.stringify(cp.criteriaSnapshot||[])) out.push('検収基準が確定時と違う'); if((cp.history||[]).length) out.push('確定後に条件が変更された（'+cp.history.length+'回）'); return out; }
function renderCompare(c){
  const el=$('c-compare'); if(!el) return;
  const m=c.measurement||{}; const aiC=m.aiCost||{}; const mt=m.materialCost||{};
  const basisSel=(id,v)=>`<select class="f" id="${id}"><option value="measured" ${v==='measured'?'selected':''}>実測</option><option value="estimated" ${v==='estimated'?'selected':''}>推計</option><option value="unknown" ${!v||v==='unknown'?'selected':''}>不明</option></select>`;
  let h=`<h3 style="margin-top:0">計測（この案件）</h3>
    <div class="row"><span class="sm" style="width:130px">実作業分数（申告）</span><input class="f num" id="ms-min" type="number" value="${m.activeMinutes??''}" placeholder="例 240" style="width:110px"><select class="f" id="ms-basis"><option value="measured" ${m.effortBasis==='measured'?'selected':''}>実測</option><option value="estimated" ${m.effortBasis!=='measured'?'selected':''}>推計</option></select></div>
    <div class="row"><span class="sm" style="width:130px">AI利用費（円）</span><input class="f num" id="ms-ai" type="number" value="${aiC.amount??''}" placeholder="未入力＝不明" style="width:110px">${basisSel('ms-aib',aiC.basis)}</div>
    <div class="row"><span class="sm" style="width:130px">材料費等（円）</span><input class="f num" id="ms-mt" type="number" value="${mt.amount??''}" placeholder="0なら0と入力" style="width:110px">${basisSel('ms-mtb',mt.basis)}</div>`;
  if(c.reuse){ h+=`<div class="row"><span class="sm" style="width:130px">同じ便益・同等以上の検収条件か</span><select class="f" id="ms-same"><option value="unconfirmed" ${!m.sameBenefit||m.sameBenefit==='unconfirmed'?'selected':''}>未確認</option><option value="yes" ${m.sameBenefit==='yes'?'selected':''}>はい</option><option value="no" ${m.sameBenefit==='no'?'selected':''}>いいえ</option></select><input class="f" id="ms-note" placeholder="理由" value="${esc(m.comparisonNote||'')}" style="flex:1;min-width:160px"></div>`; }
  h+=`<div class="row"><button class="btn ghost sm" onclick="saveMeasure()">計測値を保存</button><span class="sm">未入力はゼロ扱いにしません。配分額・模擬受領額は原価に足しません。</span></div>`;
  if(c.reuse){
    const s=cases[c.reuse.sourceCaseId]; const cp=c.comparison;
    h+=`<h3 style="margin-top:14px">比較条件（二度目の開始前に人が確定して固定）</h3>`;
    if(!cp?.confirmedAt){
      h+=`<div class="row"><span class="sm" style="width:130px">成果物の範囲</span><input class="f" id="cp-scope" placeholder="例 記録→フード提案→購入導線まで" style="flex:1;min-width:200px"></div>
        <div class="row"><span class="sm" style="width:130px">数量</span><input class="f" id="cp-qty" placeholder="例 飼い主30人・4週間" style="flex:1;min-width:200px"></div>
        <div class="row"><span class="sm" style="width:130px">終了点</span><select class="f" id="cp-end"><option value="4">検収（段階4）</option><option value="5">精算（段階5）</option></select><span class="sm" style="margin-left:8px">共通の換算時給（円）</span><input class="f num" id="cp-rate" type="number" value="${cp?.hourlyRate||3000}" style="width:100px"></div>
        <p class="sm">検収基準は現在の${(c.criteria||[]).length}件を固定します。確定後に基準や範囲を変えると、その組は「条件不一致」になります。</p>
        <div class="row"><button class="btn sm" onclick="confirmComparison()">条件を確定する</button></div>`;
    } else {
      h+=`<table><tr><td class="sm" style="width:130px">成果物の範囲</td><td>${esc(cp.scope)}</td></tr><tr><td class="sm">数量</td><td>${esc(cp.quantity)}</td></tr><tr><td class="sm">終了点</td><td>${cp.endPoint==5?'精算（段階5）':'検収（段階4）'}</td></tr><tr><td class="sm">換算時給</td><td class="num">${yen(cp.hourlyRate)}/時</td></tr><tr><td class="sm">検収基準（固定）</td><td>${(cp.criteriaSnapshot||[]).map(esc).join('／')}</td></tr><tr><td class="sm">確定</td><td>${esc(cp.confirmedBy)} ・ ${fmtDT(cp.confirmedAt)}</td></tr></table>
        <div class="row"><input class="f" id="cp-change" placeholder="条件を変更する理由（変更すると条件不一致になり、履歴に残ります）" style="flex:1;min-width:200px"><button class="btn ghost sm" onclick="changeComparison()">変更を記録</button></div>${(cp.history||[]).length?`<ul class="arc">${cp.history.map(x=>`<li><span class="tag wn">変更</span><span>${esc(x.by)}：${esc(x.reason)}</span><span class="cnt">${fmtDT(x.t)}</span></li>`).join('')}</ul>`:''}`;
    }
    h+=`<h3 style="margin-top:14px">元案件との比較</h3>`;
    if(!s){ h+='<p class="sm">元案件が読み込めません。</p>'; el.innerHTML=h; return; }
    const rate=cp?.hourlyRate||3000, end=+(cp?.endPoint||4);
    const row=(label,f)=>`<tr><td>${label}</td><td>${f(s)}</td><td>${f(c)}</td></tr>`;
    const reach=x=>`段階${x.stage} ${STAGES[x.stage]}`;
    const realEl=(x,k)=>x.measurement?.[k]?Math.round((x.measurement[k]-(x.measurement.realCreatedAt||x.createdAt))/DAY*10)/10+'日':'未到達';
    const mins=x=>x.measurement?.activeMinutes!=null?x.measurement.activeMinutes+'分（'+(x.measurement.effortBasis==='measured'?'実測':'推計')+'）':'未申告';
    const costTxt=x=>{ const k=costOf(x,rate); return k.total==null?'不足：'+k.missing.join('・'):yen(k.total)+(k.estimated.length?'（推計含む）':''); };
    const testUsed=x=>!!x.measurement?.testClockUsed;
    h+=`<table><tr><th></th><th>元案件</th><th>この案件</th></tr>${row('到達',reach)}${row('作成→段階2（実時計）',x=>realEl(x,'realStage2At')+(testUsed(x)?' ※':''))}${row('作成→検収（実時計）',x=>realEl(x,'realAcceptedAt')+(testUsed(x)?' ※':''))}${row('作成→精算（実時計）',x=>realEl(x,'realSettledAt')+(testUsed(x)?' ※':''))}${row('実作業分数',mins)}${row('比較用原価（分数÷60×時給＋AI費＋材料費）',costTxt)}${row('初期再利用率',x=>x.reuse?x.reuse.initialRate+'%（'+x.reuse.applied+'/'+x.reuse.eligible+'）':'―')}</table>
      <p class="sm">※ テスト日時送りを使った案件。経過時間は検証対象外。配分額・模擬受領額・模擬精算額は原価に含めません。</p>`;
    const reasons=[]; const mis=condMismatch(c); reasons.push(...mis);
    if(s.stage<end||c.stage<end) reasons.push('両方が終了点（'+(end==5?'精算':'検収')+'）に人の確定で到達していない');
    if(m.sameBenefit!=='yes') reasons.push('同じ便益・同等以上の検収条件が人の確認で「はい」になっていない');
    const ks=costOf(s,rate), kc=costOf(c,rate); if(ks.total==null) reasons.push('元案件の原価に不足：'+ks.missing.join('・')); if(kc.total==null) reasons.push('この案件の原価に不足：'+kc.missing.join('・'));
    if(reasons.length){ h+=`<div class="box warn"><b>結果は確定表示しません。</b>${reasons.join('。')}。</div>`; }
    else{
      const est=[...new Set(ks.estimated.concat(kc.estimated))]; const dc=kc.total-ks.total; const bothMeasuredMin=s.measurement?.effortBasis==='measured'&&c.measurement?.effortBasis==='measured'; const dm=c.measurement.activeMinutes-s.measurement.activeMinutes;
      const timeOk=!testUsed(s)&&!testUsed(c)&&s.measurement?.['real'+(end==5?'SettledAt':'AcceptedAt')]&&c.measurement?.['real'+(end==5?'SettledAt':'AcceptedAt')];
      const dt=timeOk?Math.round(((c.measurement['real'+(end==5?'SettledAt':'AcceptedAt')]-(c.measurement.realCreatedAt||c.createdAt))-(s.measurement['real'+(end==5?'SettledAt':'AcceptedAt')]-(s.measurement.realCreatedAt||s.createdAt)))/DAY*10)/10:null;
      h+=`<div class="box ${est.length?'info':'ok'}"><b>${est.length?'推計比較':'比較結果'}（この一組の観測。型化が原因とは断定しない）</b><br>比較用原価の差：${dc>0?'+':''}${yen(dc)}（元 ${yen(ks.total)} → 二度目 ${yen(kc.total)}）${est.length?'。推計を含む項目：'+est.join('・'):''}<br>実作業時間の差：${bothMeasuredMin?(dm>0?'+':'')+dm+'分':'両方が実測ではないため確定表示しない'}<br>経過時間の差（実時計）：${dt!=null?(dt>0?'+':'')+dt+'日':'テスト日時送りを含むか未到達のため検証対象外'}</div>`;
    }
  } else if(c.template){ h+=`<p class="sm" style="margin-top:8px">この案件の型（第${c.template.version}版）は公開済みです。型から作られた案件が終了点まで進むと、そちらで比較が出ます。</p>`; }
  el.innerHTML=h;
}
async function saveMeasure(){ const c=cases[cur]; const m={...(c.measurement||{})}; const v=$('ms-min').value; m.activeMinutes=v===''?null:+v; m.effortBasis=$('ms-basis').value;
  const a=$('ms-ai').value, ab=$('ms-aib').value; m.aiCost={amount:a===''?null:+a,basis:a===''?'unknown':ab}; const t=$('ms-mt').value, tb=$('ms-mtb').value; m.materialCost={amount:t===''?null:+t,basis:t===''?'unknown':tb};
  if($('ms-same')){ m.sameBenefit=$('ms-same').value; m.comparisonNote=$('ms-note').value.trim(); } await save({measurement:m}, me()+' が計測値を申告した'); }
async function confirmComparison(){ const c=cases[cur]; const scope=$('cp-scope').value.trim(), quantity=$('cp-qty').value.trim(), endPoint=+$('cp-end').value, hourlyRate=+$('cp-rate').value||0; if(!scope||!quantity||!hourlyRate){ toast('範囲・数量・換算時給を入れてください'); return; } await save({comparison:{scope,quantity,endPoint,hourlyRate,criteriaSnapshot:(c.criteria||[]).map(x=>x.text),confirmedBy:me(),confirmedAt:now(),history:[]}}, me()+' が比較条件を確定した（終了点：'+(endPoint==5?'精算':'検収')+'、時給 '+yen(hourlyRate)+'）'); }
async function changeComparison(){ const c=cases[cur]; const reason=$('cp-change').value.trim(); if(!reason){ toast('理由を書いてください'); return; } await save({comparison:{...c.comparison,history:(c.comparison.history||[]).concat([{by:me(),reason,t:now()}])}}, me()+' が比較条件の変更を記録した：'+reason); }
/* 実時計の到達時刻も残す（テスト日時とは別） */
function stampStage(patch,c,stage){ const m={...(c.measurement||{})}; const real=Date.now(); if(!m.realCreatedAt) m.realCreatedAt=c.realCreatedAt||c.createdAt; if(CLOCK) m.testClockUsed=true; if(stage===2){ if(!m.stage2At) m.stage2At=now(); if(!m.realStage2At) m.realStage2At=real; } if(stage===4){ if(!m.acceptedAt) m.acceptedAt=now(); if(!m.realAcceptedAt) m.realAcceptedAt=real; } if(stage===5){ if(!m.settledAt) m.settledAt=now(); if(!m.realSettledAt) m.realSettledAt=real; } patch.measurement=m; return patch; }
