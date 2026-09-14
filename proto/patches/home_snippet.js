
/* ===================== 第10回：探す画面をアプリのホーム構成に（ヒーロー／主ボタン／注目／領域） ===================== */
/* 写真は使わない（実物の画面と案件の色で見せる）。件数はすべて現在の案件数。色は紺×金、差し色にコーラル。 */
const NAV_ICONS={home:'⌕',case:'▤',turns:'☑',members:'⚇',money:'¥',archive:'▣'};
document.querySelectorAll('nav button').forEach(b=>{ if(NAV_ICONS[b.dataset.s]) b.dataset.ic=NAV_ICONS[b.dataset.s]; });
function showPost(on){ const w=$('postwrap'); if(!w) return; w.hidden=!on; if(on){ w.scrollIntoView({block:'start',behavior:'smooth'}); setTimeout(()=>$('ifline')?.focus(),250); } }
function scrollGrid(){ $('grid')?.scrollIntoView({block:'start',behavior:'smooth'}); }
function pickFeatured(){ const list=Object.values(cases).filter(c=>!c.archived); if(!list.length) return null;
  const real=list.filter(c=>!isSample(c)); const pool=(chip==='real'&&real.length)?real:list;
  const s09=pool.find(c=>c.id==='s09'); if(s09&&!real.length) return s09;
  return pool.slice().sort((a,b)=>((b.likes||[]).length+(b.bids||[]).filter(x=>x.by!=='AI').length*2+humanSeats(b)*3)-((a.likes||[]).length+(a.bids||[]).filter(x=>x.by!=='AI').length*2+humanSeats(a)*3)||b.createdAt-a.createdAt)[0]; }
function renderHome(){ const f=$('featured'), k=$('cats'); if(!f||!k) return;
  const c=pickFeatured();
  if(!c){ f.innerHTML='<p class="sm">まだ案件がありません。上の「新しい「もし」を置いてみる」からどうぞ。</p>'; }
  else { const h=hue(c.domain||c.title); const open=openSeats(c);
    f.innerHTML=`<div class="feat" tabindex="0" onclick="openCase('${c.id}')" onkeydown="if(event.key==='Enter')openCase('${c.id}')">
      <div class="fth" style="background:linear-gradient(150deg,hsl(${h} 45% 28%),hsl(${h} 55% 46%))"><div class="fk">${isSample(c)?'サンプル ・ ':''}${esc(c.domain||'領域未定')}</div><div class="ft2">${esc(c.reframed||c.title)}</div><div class="fen">Stage ${c.stage} / 5</div></div>
      <div class="fbd">
        <div class="ftt">${esc(c.title)}</div>
        <p class="sm">${esc(c.benefit?'便益を受ける人：'+c.benefit:'')}${c.firstMove?'　'+esc(c.firstMove.slice(0,60))+'…':''}</p>
        <div class="fst">${STAGES.map((n,i)=>`<span class="${i<c.stage?'done':i===c.stage?'now':''}">${n}</span>`).join('')}</div>
        <div class="fmt"><span class="seatdots">${SEATS.map(([kk,n])=>`<i class="${c.seats?.[kk]?.t||'em'}" title="${n}">${n[0]}</i>`).join('')}</span><span>${open.length?'空席 '+open.join('・'):'席はすべて埋まっています'}</span><span class="grow"></span><span>♡ ${(c.likes||[]).length}</span><span>提案 ${(c.bids||[]).filter(b=>b.by!=='AI').length}</span><span>スレッド ${(c.messages||[]).length}</span></div>
      </div></div>`; }
  const all=Object.values(cases).filter(c=>!c.archived&&(chip!=='real'||!isSample(c)||!Object.values(cases).some(x=>!isSample(x)&&!x.archived)));
  const cnt={}; all.forEach(c=>{ const d=c.domain||'領域未定'; cnt[d]=(cnt[d]||0)+1; });
  const doms=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,10);
  k.innerHTML = doms.length? doms.map(([d,n])=>`<button class="cat ${chip==='d:'+d?'on':''}" onclick="chip='d:${esc(d)}';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid()"><b>${esc(d)}</b><small>${n}件</small></button>`).join('')+`<button class="cat ${chip==='open'?'on':''}" onclick="chip='open';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid()"><b>席が空いている</b><small>${all.filter(c=>openSeats(c).length).length}件</small></button>` : '<p class="sm">領域はAI席が最初の一手で付けます。</p>'; }
