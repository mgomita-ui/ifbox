
/* ===================== 第11回：ホームのデザイン寄せ（アイコン・タイポ・カード・写真枠） ===================== */
/* 色は紺×金のまま。写真は img/hero.jpg, img/featured_food.jpg, img/banner.jpg が置かれたときだけ出る（無ければ図形で代替）。 */
const I={
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9.5" r="2.5"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M15.5 14.2c2.6.2 5 2 5 4.8"/></svg>',
 chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
 crown:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>',
 grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
 list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z"/></svg>',
 comment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4z"/></svg>',
 tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.3"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/></svg>',
 box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 8l9-4 9 4-9 4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/></svg>',
 yen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 4l5 8 5-8M12 12v8M8 13h8M8 17h8"/></svg>',
 archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9"/><path d="M10 13h4"/></svg>',
 bowl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 4l1 4M14 3l-1 5"/></svg>',
 house:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 11l8-7 8 7v9H4z"/></svg>',
 care:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z"/><path d="M12 10v5M9.5 12.5h5"/></svg>',
 cap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M2 9l10-4 10 4-10 4z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/></svg>',
 brief:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/></svg>',
 pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
 paw:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><circle cx="7" cy="9" r="1.8"/><circle cx="11" cy="6" r="1.8"/><circle cx="15.5" cy="7" r="1.8"/><circle cx="18.5" cy="11" r="1.8"/><path d="M8 17c0-2.5 2-4.5 4.5-4.5S17 14.5 17 17a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 8 17z"/></svg>',
 leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l8-8"/></svg>',
 cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10.2L20 7H6.5"/><circle cx="9" cy="19" r="1.3"/><circle cx="16" cy="19" r="1.3"/></svg>',
 spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
 plane:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 12l18-8-5 17-4-6z"/><path d="M12 15l9-11"/></svg>'
};
function catIcon(d){ const s=String(d||'');
  if(/食|献立|料理|飲食/.test(s)) return I.bowl; if(/介護|医療|健康|福祉/.test(s)) return I.care; if(/子ども|教育|学|育児/.test(s)) return I.cap;
  if(/労務|働|人事|社内|手続|受任|事務|法務/.test(s)) return I.brief; if(/旅行|観光/.test(s)) return I.plane; if(/地域|不動産|場所/.test(s)) return I.pin;
  if(/ペット|動物/.test(s)) return I.paw; if(/農|環境|自然/.test(s)) return I.leaf; if(/物販|商品|店|購買/.test(s)) return I.cart; if(/家事|暮らし|生活|家庭/.test(s)) return I.house;
  if(/書|文書|申し送り|記録/.test(s)) return I.doc; return I.spark; }
const SCRIPT_BY={食:'Good Food,<br>Better Life.',介護:'Care for<br>Someone.',子ども:'Grow<br>Together.',労務:'Work<br>Smarter.',地域:'Local<br>Matters.',旅行:'Go<br>Further.',家事:'Everyday,<br>Easier.'};
function scriptFor(d){ const k=Object.keys(SCRIPT_BY).find(k=>String(d||'').includes(k)); return k?SCRIPT_BY[k]:'Small If,<br>Big Change.'; }
const NAV_SVG={home:I.home,case:I.box,turns:I.check,members:I.people,money:I.yen,archive:I.archive};
document.querySelectorAll('nav button').forEach(b=>{ if(NAV_SVG[b.dataset.s]&&!b.querySelector('.ni')){ const s=document.createElement('span'); s.className='ni'; s.innerHTML=NAV_SVG[b.dataset.s]; b.prepend(s); } });
/* ヘッダーのアイコン */
(function(){ const nav=document.querySelector('nav'); if(!nav||$('hicons')) return; const d=document.createElement('div'); d.className='hicons'; d.id='hicons';
  d.innerHTML=`<button class="hic" title="探す" onclick="go('home');setTimeout(()=>$('q')?.focus(),50)">${I.search}</button><button class="hic" id="bell" title="お知らせ" onclick="openAllNotices()">${I.bell}<i class="dot" id="bellN" hidden></i></button>`;
  nav.insertAdjacentElement('afterend',d); })();
function allUnread(){ const out=[]; Object.values(cases).forEach(c=>{ if(c.archived) return; unreadNotices(c).forEach(n=>out.push({c,n})); }); return out.sort((a,b)=>b.n.t-a.n.t); }
function updateBell(){ const b=$('bellN'); if(!b) return; const n=allUnread().length; b.hidden=!n; b.title=n+'件'; }
function openAllNotices(){ const list=allUnread().slice(0,40);
  md(`<h3>お知らせ</h3><p class="sm">あなた宛ての未読です。案件を開くと既読になります。</p>${list.length?`<ul class="arc" style="margin-top:8px">${list.map(({c,n})=>`<li style="cursor:pointer" onclick="closeMd();openCase('${c.id}');goNotice('${n.id}','${esc(n.anchor||'msgs')}')"><span><b>${esc(c.title)}</b><br><span class="sm">${esc(n.text)}</span></span><span class="cnt">${fmtDT(n.t)}</span></li>`).join('')}</ul>`:'<p class="sm" style="margin-top:8px">未読はありません。</p>'}<div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">閉じる</button></div>`); }
/* 領域タグ（横スクロール） */
function renderTags(){ const el=$('tags'); if(!el) return; const all=Object.values(cases).filter(c=>!c.archived); const cnt={}; all.forEach(c=>{ const d=c.domain||''; if(d) cnt[d]=(cnt[d]||0)+1; });
  const doms=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([d])=>d);
  el.innerHTML=`<button class="tag2 ${!chip.startsWith('d:')?'on':''}" onclick="chip='all';window._chipTouched=true;renderChips();renderGrid();renderHome()"><b>#</b>すべて</button>`+doms.map(d=>`<button class="tag2 ${chip==='d:'+d?'on':''}" onclick="chip='d:${esc(d)}';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid()"><b>#</b>${esc(d)}</button>`).join(''); }
function tagsNext(){ const el=$('tags'); if(el) el.scrollBy({left:180,behavior:'smooth'}); }
/* 注目の案件（左テキスト・右写真） */
function renderHome(){ const f=$('featured'), k=$('cats'); if(!f||!k) return; renderTags(); updateBell();
  const c=pickFeatured();
  if(!c){ f.innerHTML='<p class="sm">まだ案件がありません。「新しい「もし」を置いてみる」からどうぞ。</p>'; }
  else { const h=hue(c.domain||c.title); const open=openSeats(c); const photo=/食/.test(c.domain||'')?'img/featured_food.jpg':''; const tags=[c.domain||'領域未定',STAGES[c.stage]||'',open.length?'空席あり':'席は満席'].filter(Boolean);
    f.innerHTML=`<div class="feat" tabindex="0" onclick="openCase('${c.id}')" onkeydown="if(event.key==='Enter')openCase('${c.id}')">
      <div class="fbd">
        <span class="pill">${isSample(c)?'サンプル ・ ':''}${esc(c.domain||'領域未定')}</span>
        <div class="ftt">${esc(c.reframed||c.title)}</div>
        <p class="fdesc">${esc(c.firstMove||c.benefit||c.title)}</p>
        <div class="ftags">${tags.map(t=>`<span><b>#</b>${esc(t)}</span>`).join('')}</div>
        <div class="fst">${STAGES.map((n,i)=>`<span class="${i<c.stage?'done':i===c.stage?'now':''}">${n}</span>`).join('')}</div>
        <div class="fmt"><span class="seatdots">${SEATS.map(([kk,n])=>`<i class="${c.seats?.[kk]?.t||'em'}" title="${n}">${n[0]}</i>`).join('')}</span><span class="grow"></span><span class="ic">${I.heart}${(c.likes||[]).length}</span><span class="ic">${I.comment}${(c.messages||[]).length}</span><span class="ic">${I.tag}${(c.bids||[]).filter(b=>b.by!=='AI').length}</span></div>
      </div>
      <div class="fth" style="background:linear-gradient(150deg,hsl(${h} 45% 28%),hsl(${h} 55% 46%))">${photo?`<img src="${photo}" alt="" onerror="this.remove()">`:''}<div class="fsc">${scriptFor(c.domain)}</div><div class="fen">Stage ${c.stage} / 5</div></div>
    </div>`; }
  const all=Object.values(cases).filter(c=>!c.archived&&(chip!=='real'||!isSample(c)||!Object.values(cases).some(x=>!isSample(x)&&!x.archived)));
  const cnt={}; all.forEach(c=>{ const d=c.domain||'領域未定'; cnt[d]=(cnt[d]||0)+1; });
  const doms=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,9);
  k.innerHTML = doms.length? doms.map(([d,n])=>`<button class="cat ${chip==='d:'+d?'on':''}" onclick="chip='d:${esc(d)}';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid()"><span class="ci">${catIcon(d)}</span><b>${esc(d)}</b><small>${n}件</small></button>`).join('')+`<button class="cat ${chip==='open'?'on':''}" onclick="chip='open';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid()"><span class="ci">${I.people}</span><b>席が空いている</b><small>${all.filter(c=>openSeats(c).length).length}件</small></button>` : '<p class="sm">領域はAI席が最初の一手で付けます。</p>'; }
