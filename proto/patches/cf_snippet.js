
/* ===================== 第12回：クラファンサイト化（記事1本で、仲間もお金も募る） ===================== */
/* 主役はプロジェクトページ。席・検収・台帳・配分は「チームの作業場」に回す。決済は模擬。法務の細部は後で詰める。 */
const ST={recruiting:['仲間募集中','st-rec'],preparing:['準備中','st-pre'],selling:['先行販売中','st-sel'],funded:['達成','st-ok'],unfunded:['不成立','st-ng'],settled:['精算済','st-ok']};
const ROLE_DEFAULT={BUILD:['作る','形にする人。試作、開発、制作。AIが下準備をしています。'],SELL:['売る','届ける人。販路、告知、営業、代理店。AIが下準備をしています。'],SITE:['場所・設備','場所や設備、機材、在庫置き場を出せる人。'],ACC:['検収','できあがりを基準どおりか確かめる人。買う側の目線。'],BUY:['買い手','まとめて買う人。個人は下のリターンから。']};
function tiersOf(c){ const cf=c.cf; if(!cf) return []; if((cf.tiers||[]).length) return cf.tiers; if(cf.ret||cf.unit) return [{id:'legacy',title:cf.ret||'先に買う',price:cf.unit||3000,desc:cf.ret||'',limit:0,delivery:''}]; return []; }
function pledgeQty(p){ return +p.qty||1; }
function tierSold(c,tid){ return (c.cf?.pledges||[]).filter(p=>(p.tierId||'legacy')===tid).reduce((s,p)=>s+pledgeQty(p),0); }
function backerCount(c){ return new Set((c.cf?.pledges||[]).map(p=>p.by)).size; }
function cfLeftDays(c){ return c.cf?.deadline?Math.ceil((c.cf.deadline-now())/DAY):0; }
function cfLive(c){ return !!(c.cf&&c.cf.open&&!c.cf.draft&&cfLeftDays(c)>0); }
function neededRoles(c){ return SEATS.filter(([k])=>k!=='OWN'&&k!=='BUY'&&(c.roles?.[k]?.need ?? (k!=='SITE'))).map(([k])=>k); }
function teamFilled(c){ return neededRoles(c).filter(k=>c.seats?.[k]?.t==='hu').length; }
function projStatus(c){ if(c.stage>=5) return 'settled'; const cf=c.cf; if(cf&&!cf.draft){ const total=cfTotal(c); if(cfLive(c)) return total>=cf.goal&&cf.goal>0?'funded':'selling'; if(total>=cf.goal&&cf.goal>0) return 'funded'; if((cf.mode||'aon')==='aon'&&cf.goal>0) return 'unfunded'; if(total>0) return 'funded'; }
  return teamFilled(c)<neededRoles(c).length?'recruiting':'preparing'; }
function stTag(c){ const [n,cl]=ST[projStatus(c)]; return `<span class="pst ${cl}">${n}</span>`; }
function coverStyle(c){ const h=hue(c.domain||c.title); return `background:linear-gradient(150deg,hsl(${h} 45% 26%),hsl(${h} 55% 46%))`; }
function coverImg(c){ const u=c.article?.cover||(/食/.test(c.domain||'')&&c.id==='s09'?'img/featured_food.jpg':''); return u?`<img src="${esc(u)}" alt="" onerror="this.remove()">`:''; }
function articleOf(c){ const a=c.article||{}; return { why:a.why||c.firstMove||'', who:a.who||c.benefit||'', what:a.what||c.reframed||c.title, risks:(a.risks&&a.risks.length?a.risks:(c.lines||[])), faq:a.faq||[], cover:a.cover||'' }; }
function isTeam(c){ return c.owner===me()||participants(c).includes(me()); }

/* ---------- プロジェクトページ ---------- */
function renderProject(c){ const el=$('pj'); if(!el) return; const st=projStatus(c), a=articleOf(c), cf=c.cf, tiers=tiersOf(c), total=cfTotal(c), owner=c.owner===me();
  const pct=cf&&cf.goal?Math.round(total/cf.goal*100):0, left=cfLeftDays(c), live=cfLive(c), need=neededRoles(c), filled=teamFilled(c), ups=(c.updates||[]).slice().reverse(), fol=(c.followers||[]), following=fol.includes(me());
  const sidePanel = (cf&&!cf.draft) ? `
      <div class="pj-amt">${yen(total)}</div><div class="pj-bar"><i style="width:${Math.min(100,pct)}%"></i></div>
      <div class="pj-meta"><div><b>${pct}%</b><span>目標 ${yen(cf.goal)}</span></div><div><b>${backerCount(c)}人</b><span>先に買った人</span></div><div><b>${live?left+'日':'終了'}</b><span>${live?'残り':fmtDate(cf.deadline)}</span></div></div>
      <p class="sm">${(cf.mode||'aon')==='aon'?'目標に届いたときだけ成立します（届かなければ全員キャンセル）。':'目標に届かなくても、申し込まれた分は成立します。'}</p>
      ${live?`<button class="btn wide" onclick="pjGo('pj-tiers')">リターンを選ぶ</button>`:''}
      ${st==='funded'&&c.stage<2&&owner?`<button class="btn wide" style="margin-top:6px" onclick="confirmBuyers()">買い手として確定する（段階2へ）</button>`:''}`
    : `<div class="pj-amt">${filled}<small> / ${need.length} 役割</small></div><div class="pj-bar team"><i style="width:${need.length?Math.round(filled/need.length*100):100}%"></i></div>
      <p class="sm">${st==='recruiting'?'仲間を募集しています。役割が埋まると、このページがそのまま先行販売のページになります。':'役割が揃いました。リターンを準備して先行販売に進みます。'}</p>
      ${st==='recruiting'?`<button class="btn wide" onclick="pjGo('pj-team')">役割を見る・手を挙げる</button>`:''}
      ${owner?`<button class="btn wide ${st==='recruiting'?'ghost':''}" style="margin-top:6px" onclick="openSaleForm()">${tiers.length?'先行販売を始める':'リターンを作って先行販売へ'}</button>`:''}`;
  el.innerHTML=`<div class="pjx">
    <div class="pj-cover" style="${coverStyle(c)}">${coverImg(c)}<div class="pj-cv"><div>${stTag(c)}${isSample(c)?'<span class="pst st-pre">サンプル</span>':''}<span class="pst st-dom">${esc(c.domain||'領域未定')}</span></div><h1>${esc(c.reframed||c.title)}</h1><p>発案 ${esc(c.owner)} ・ ${fmtDate(c.createdAt)} 公開</p></div></div>
   <div class="pj-main">
    <div class="pj-nav"><button onclick="pjGo('pj-story')">記事</button><button onclick="pjGo('pj-team')">チームと役割 <i>${filled}/${need.length}</i></button><button onclick="pjGo('pj-tiers')">リターン <i>${tiers.length}</i></button><button onclick="pjGo('pj-ups')">活動報告 <i>${ups.length}</i></button><button onclick="pjThread()">スレッド <i>${(c.messages||[]).length}</i></button></div>
    <section id="pj-story" class="pj-sec"><div class="pj-h"><h2>この「もし」について</h2>${owner?`<button class="btn ghost sm" onclick="editArticle()">記事を整える</button>`:''}</div>
      <p class="pj-title">${esc(c.title)}</p>
      <h4>なぜやるのか</h4><p>${esc(a.why)||'<span class="sm">まだ書かれていません。</span>'}</p>
      <h4>誰が助かるのか</h4><p>${esc(a.who)||'<span class="sm">まだ書かれていません。</span>'}</p>
      <h4>何を作るのか</h4><p>${esc(a.what)}</p>
      ${c.demo?`<h4>動くもの</h4><p>${/^https?:/.test(c.demo)?`<a href="${esc(c.demo)}" target="_blank" rel="noopener">${esc(c.demo)}</a>`:esc(c.demo)}</p>`:''}
      ${(c.payers||[]).length?`<h4>払う人の候補</h4><p>${c.payers.map(p=>`<span class="tag bl">${esc(p)}</span>`).join(' ')}</p>`:''}</section>
    <section id="pj-team" class="pj-sec"><div class="pj-h"><h2>チームと、募集中の役割</h2><span class="sm">役割で参加する。雇用の募集ではなく、取り分のある共同の仕事です。</span></div>
      <div class="rolegrid">${roleCard(c,'OWN')}${SEATS.filter(([k])=>k!=='OWN'&&k!=='BUY').map(([k])=>roleCard(c,k)).join('')}</div></section>
    <section id="pj-tiers" class="pj-sec"><div class="pj-h"><h2>リターン ― お金で参加する</h2>${owner?`<button class="btn ghost sm" onclick="openTierForm()">リターンを足す</button>`:''}</div>
      ${tiers.length?`<div class="tiergrid">${tiers.map(t=>tierCard(c,t,live)).join('')}</div>`:`<p class="sm">リターンはまだありません。${st==='recruiting'?'仲間が揃ってから用意されます。気になる方はフォローしてください。':''}</p>`}
      ${cf&&!cf.draft?'<p class="sm" style="margin-top:8px">この試作では決済は行いません（模擬）。申し込みは「先に買う約束」として記録されます。目標達成は完成や提供の保証ではありません。</p>':''}</section>
    <section id="pj-ups" class="pj-sec"><div class="pj-h"><h2>活動報告</h2>${isTeam(c)?`<button class="btn ghost sm" onclick="openUpdateForm()">活動報告を書く</button>`:''}</div>
      ${ups.length?ups.map(u=>`<article class="upd"><div class="who"><b>${esc(u.title)}</b><span>${esc(u.by)} ・ ${fmtDT(u.t)}</span></div><p>${esc(u.body)}</p></article>`).join(''):'<p class="sm">まだ活動報告はありません。</p>'}</section>
    <section id="pj-risk" class="pj-sec"><div class="pj-h"><h2>リスクと、着手前に引く線</h2></div>
      ${a.risks.length?`<ul class="pj-ul">${a.risks.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`:'<p class="sm">まだ書かれていません。</p>'}
      ${a.faq.length?`<h4>よくある質問</h4>${a.faq.map(f=>`<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}`:''}</section>
   </div>
   <aside class="pj-side"><div class="card">${sidePanel}
      <div class="row" style="margin-top:10px"><button class="btn ghost sm" onclick="toggleFollow()">${following?'フォロー中 ✓':'フォローする'}</button><span class="sm">${fol.length}人がフォロー</span><button class="btn ghost sm" onclick="like()">共感 ${(c.likes||[]).length}</button></div>
      <div class="pj-stg">${STAGES.map((n,i)=>`<span class="${i<c.stage?'done':i===c.stage?'now':''}">${n}</span>`).join('')}</div>
      <p class="sm" style="margin-top:6px">段階は人の確定でだけ上がります。納品は検収の役割が基準どおりか確かめます。</p></div></aside>
  </div>`; }
function pjGo(id){ $(id)?.scrollIntoView({block:'start',behavior:'smooth'}); }
function pjThread(){ const w=$('workroom'); if(w) w.open=true; tab('msgs'); setTimeout(()=>$('c-msgs')?.scrollIntoView({block:'center',behavior:'smooth'}),60); }
function roleCard(c,k){ const s=c.seats?.[k]||{t:'em'}; const r=c.roles?.[k]||{}; const name=SNAME[k]; const d=k==='OWN'?'言い出した人。方向を決め、採用と確定を行います。':(r.desc||ROLE_DEFAULT[k]?.[1]||''); const owner=c.owner===me();
  const who=s.t==='hu'?`<div class="rc-who"><span class="av2" style="background:hsl(${hue(s.n)} 55% 42%)">${esc(String(s.n).slice(0,1))}</span><b>${esc(s.n)}</b>${typeof rankTagByName==='function'?rankTagByName(s.n):''}</div>`:s.t==='ai'?`<div class="rc-who"><span class="av2 ai">AI</span><span>AIが準備中。人を募集しています</span></div>`:`<div class="rc-who"><span class="av2 em">空</span><span>募集しています</span></div>`;
  const meta=k==='OWN'?'':`<div class="rc-meta">${r.hours?`<span>稼働 ${esc(r.hours)}</span>`:''}${r.share?`<span>取り分 ${esc(r.share)}</span>`:'<span>取り分は相談</span>'}${r.need===false?'<span>必要なときだけ</span>':''}</div>`;
  const applied=(c.messages||[]).some(m=>m.kind==='can'&&m.seat===k&&m.by===me());
  const btn=k==='OWN'?'':s.t==='hu'?'':(owner?`<button class="btn ghost sm" onclick="editRole('${k}')">募集内容を書く</button><button class="btn ghost sm" onclick="openOffer()">会員にオファー</button>`:(applied?'<span class="tag ok">手を挙げました</span>':`<button class="btn sm" onclick="applyRole('${k}')">この役割に手を挙げる</button>`));
  return `<div class="rc ${s.t}"><div class="rc-h"><b>${name}</b>${s.t==='hu'?'<span class="tag hu">決定</span>':'<span class="tag ai">募集中</span>'}</div><p>${esc(d)}</p>${meta}${who}<div class="rc-ft">${btn}</div></div>`; }
function tierCard(c,t,live){ const sold=tierSold(c,t.id), lim=+t.limit||0, out=lim&&sold>=lim, owner=c.owner===me(); const off=t.regular&&t.regular>t.price?Math.round((1-t.price/t.regular)*100):0;
  return `<div class="tc ${out?'out':''}"><div class="tc-p">${yen(t.price)}${off?`<small>一般予定 ${yen(t.regular)} ・ ${off}%お得</small>`:''}</div><b class="tc-t">${t.early?'<span class="tag wn">早割</span> ':''}${esc(t.title)}</b><p>${esc(t.desc||'')}</p>
    <div class="tc-m">${t.delivery?`<span>お届け予定 ${esc(t.delivery)}</span>`:''}<span>${sold}人が申込</span>${lim?`<span class="${out?'ng':''}">${out?'売り切れ':'残り '+(lim-sold)+' / '+lim}</span>`:''}</div>
    <div class="rc-ft">${live&&!out?`<button class="btn" onclick="openPledge('${t.id}')">これを先に買う</button>`:''}${owner&&t.id!=='legacy'?`<button class="btn ghost sm" onclick="openTierForm('${t.id}')">直す</button>`:''}</div></div>`; }

/* ---------- 記事 ---------- */
function editArticle(){ const c=cases[cur], a=articleOf(c);
  md(`<h3>記事を整える</h3><p class="sm">この記事1本で、仲間もお金も募ります。AIに下書きさせてから直すのが早いです。</p>
  <div class="row"><button class="btn ghost sm" onclick="aiDraftArticle()">AIに下書きさせる</button><span class="sm" id="ar-ai"></span></div>
  <label class="lb">なぜやるのか</label><textarea id="ar-why">${esc(a.why)}</textarea>
  <label class="lb">誰が助かるのか</label><textarea id="ar-who">${esc(a.who)}</textarea>
  <label class="lb">何を作るのか</label><textarea id="ar-what">${esc(a.what)}</textarea>
  <label class="lb">リスクと、着手前に引く線（1行に1つ）</label><textarea id="ar-risks">${esc(a.risks.join('\n'))}</textarea>
  <label class="lb">よくある質問（「質問｜答え」を1行に1つ）</label><textarea id="ar-faq">${esc(a.faq.map(f=>f.q+'｜'+f.a).join('\n'))}</textarea>
  <label class="lb">表紙画像のURL（任意）</label><input class="f" id="ar-cover" value="${esc(a.cover)}" placeholder="https://…" style="width:100%">
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveArticle()">保存する</button></div>`); }
async function aiDraftArticle(){ const c=cases[cur]; const n=$('ar-ai'); n.textContent='下書き中…'; let d=null;
  if(sample){ try{ d=await sample.json(`あなたはクラウドファンディングの編集者です。次の「もし」の記事を下書きしてください。実在の企業名・人名は出さない。法律や効果を断定しない。金額は例。\nもし=${c.title}\n言い換え=${c.reframed}\n便益を受ける人=${c.benefit||''}\n出力はこのJSONだけ: {"why":"120〜200字","who":"80〜140字","what":"120〜200字","risks":["着手前に決める線を3つ"],"faq":[{"q":"","a":""},{"q":"","a":""}]}`,{modelTier:'default'}); }catch(e){} }
  if(!d){ const b=c.benefit||'この願いで助かる人'; d={why:`${b}が、いま困っていることがあります。${c.reframed||c.title}。小さく作って確かめ、先に買ってくれる人がいるかどうかで、続けるかを決めます。`,who:`${b}。まずは身近な数人に使ってもらい、声を活動報告に載せます。`,what:`${c.reframed||c.title} を、最小の形で作ります。作る人・売る人・検収する人が揃ったら、このページで先行販売を始めます。`,risks:(c.lines||[]).length?c.lines:['個人情報や健康に関わる表現は、公開前に確認する','お届け予定は余裕を持って示し、遅れるときは活動報告で先に伝える','目標に届かなければ作らない'],faq:[{q:'いつ届きますか',a:'各リターンのお届け予定をご覧ください。遅れる場合は活動報告でお知らせします。'},{q:'仲間として参加できますか',a:'「チームと役割」から手を挙げてください。発案者が迎えると参加が決まります。'}]}; }
  $('ar-why').value=d.why||''; $('ar-who').value=d.who||''; $('ar-what').value=d.what||''; $('ar-risks').value=(d.risks||[]).join('\n'); $('ar-faq').value=(d.faq||[]).map(f=>f.q+'｜'+f.a).join('\n'); n.textContent='下書きを入れました。直してから保存してください。'; }
async function saveArticle(){ const c=cases[cur]; if(c.owner!==me()){ toast('記事は発案者が整えます'); return; } const cover=$('ar-cover').value.trim(); if(cover&&!/^https?:\/\//.test(cover)&&!/^img\//.test(cover)){ toast('表紙は http から始まるURLを入れてください'); return; }
  const faq=$('ar-faq').value.split('\n').map(l=>l.split('｜')).filter(x=>x[0]&&x[0].trim()).map(x=>({q:x[0].trim(),a:(x[1]||'').trim()}));
  await save({article:{why:$('ar-why').value.trim(),who:$('ar-who').value.trim(),what:$('ar-what').value.trim(),risks:$('ar-risks').value.split('\n').map(x=>x.trim()).filter(Boolean),faq,cover}}, me()+' が記事を整えた'); closeMd(); }

/* ---------- 役割で参加する ---------- */
function editRole(k){ const c=cases[cur], r=c.roles?.[k]||{};
  md(`<h3>${SNAME[k]}の募集内容</h3><label class="lb">やること</label><textarea id="ro-desc">${esc(r.desc||ROLE_DEFAULT[k]?.[1]||'')}</textarea>
  <div class="row"><span class="sm" style="width:90px">期待する稼働</span><input class="f" id="ro-hours" value="${esc(r.hours||'')}" placeholder="例 週3時間・1か月" style="flex:1"></div>
  <div class="row"><span class="sm" style="width:90px">取り分</span><input class="f" id="ro-share" value="${esc(r.share||'')}" placeholder="例 確定対価2万円＋成果の20%" style="flex:1"></div>
  <div class="row"><label class="sm"><input type="checkbox" id="ro-need" ${r.need===false?'':'checked'}> この役割が埋まらないと始められない</label></div>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveRole('${k}')">保存する</button></div>`); }
async function saveRole(k){ const c=cases[cur]; if(c.owner!==me()){ toast('募集内容は発案者が書きます'); return; } const roles={...(c.roles||{}),[k]:{desc:$('ro-desc').value.trim(),hours:$('ro-hours').value.trim(),share:$('ro-share').value.trim(),need:$('ro-need').checked}}; await save({roles}, me()+' が'+SNAME[k]+'の募集内容を書いた'); closeMd(); }
function applyRole(k){ const c=cases[cur]; if(c.owner===me()){ toast('発案者は席を直接クリックして座れます'); return; } if(!participantsAll[myId]){ toast('右上の「あなた」から参加者を選ぶか登録してください'); return; }
  md(`<h3>${SNAME[k]}に手を挙げる</h3><p class="sm">できること・持っているもの（販路・場所・資格・実績）を一言。発案者が迎えると参加が決まります。スレッドにも載ります。</p><textarea id="ap-text" placeholder="例）飲食店20軒に紹介できます。週3時間なら動けます。"></textarea>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="sendApply('${k}')">手を挙げる</button></div>`); }
async function sendApply(k){ const c=cases[cur], text=$('ap-text').value.trim(); if(!text){ toast('一言添えてください'); return; } if(c.seats?.[k]?.t==='hu'){ toast('その役割はもう決まっています'); closeMd(); return; }
  await save({messages:(c.messages||[]).concat([{by:me(),byId:meId()||null,text,t:now(),kind:'can',seat:k}]),notices:notice(c,[c.owner],'can',me()+' が'+SNAME[k]+'に手を挙げました','msgs')}, me()+' が「俺これできる」と'+SNAME[k]+'の席を名乗った'); closeMd(); toast('手を挙げました。発案者が迎えると参加が決まります。'); }
async function toggleFollow(){ const c=cases[cur]; if(me()==='名無し'){ toast('右上の「あなた」から参加者を選んでください'); return; } const f=new Set(c.followers||[]); f.has(me())?f.delete(me()):f.add(me()); await save({followers:[...f]}); }

/* ---------- お金で参加する（リターン・先行販売・申込） ---------- */
function openCfForm(){ openSaleForm(); }
function openTierForm(id){ const c=cases[cur]; const t=(c.cf?.tiers||[]).find(x=>x.id===id)||{};
  md(`<h3>${id?'リターンを直す':'リターンを足す'}</h3>
  <div class="row"><span class="sm" style="width:100px">名前</span><input class="f" id="ti-title" value="${esc(t.title||'')}" placeholder="例 4週間の利用権（早割）" style="flex:1"></div>
  <div class="row"><span class="sm" style="width:100px">価格（円）</span><input class="f num" id="ti-price" type="number" value="${t.price||3000}" style="width:130px"><span class="sm">一般販売予定</span><input class="f num" id="ti-regular" type="number" value="${t.regular||''}" placeholder="任意" style="width:110px"></div>
  <div class="row"><span class="sm" style="width:100px">数量限定</span><input class="f num" id="ti-limit" type="number" value="${t.limit||''}" placeholder="なしは空欄" style="width:130px"><label class="sm"><input type="checkbox" id="ti-early" ${t.early?'checked':''}> 早割</label></div>
  <div class="row"><span class="sm" style="width:100px">お届け予定</span><input class="f" id="ti-delivery" value="${esc(t.delivery||'')}" placeholder="例 2026年12月" style="width:160px"></div>
  <textarea id="ti-desc" placeholder="受け取れるものを具体的に">${esc(t.desc||'')}</textarea>
  <div class="row" style="justify-content:flex-end">${id&&!tierSold(c,id)?`<button class="btn red" onclick="delTier('${id}')">消す</button>`:''}<button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveTier('${id||''}')">保存する</button></div>`); }
async function saveTier(id){ const c=cases[cur]; if(c.owner!==me()){ toast('リターンは発案者が作ります'); return; } const title=$('ti-title').value.trim(), price=+$('ti-price').value||0; if(!title||price<=0){ toast('名前と価格を入れてください'); return; }
  const t={id:id||('t'+now()),title,price,regular:+$('ti-regular').value||0,limit:+$('ti-limit').value||0,early:$('ti-early').checked,delivery:$('ti-delivery').value.trim(),desc:$('ti-desc').value.trim()};
  if(id&&t.limit&&t.limit<tierSold(c,id)){ toast('申込数より少ない数量にはできません'); return; }
  if(id&&tierSold(c,id)){ const o=(c.cf.tiers||[]).find(x=>x.id===id)||{}; if(o.price!==t.price||o.title!==t.title||o.delivery!==t.delivery){ toast('申込のあるリターンは、名前・価格・お届け予定を変えられません。新しいリターンを足してください'); return; } }
  const base=c.cf||{draft:true,open:false,goal:0,mode:'aon',pledges:[]}; let tiers=(base.tiers||[]).slice(); if(!tiers.length&&(base.ret||base.unit)&&!id) tiers=tiersOf(c).map(x=>({...x,id:'legacy'}));
  tiers=id?tiers.map(x=>x.id===id?t:x):tiers.concat([t]); await save({cf:{...base,tiers}}, me()+' がリターン「'+title+'」を'+(id?'直した':'足した')); closeMd(); }
async function delTier(id){ const c=cases[cur]; if(tierSold(c,id)){ toast('申込のあるリターンは消せません'); return; } await save({cf:{...c.cf,tiers:(c.cf.tiers||[]).filter(x=>x.id!==id)}}, me()+' がリターンを消した'); closeMd(); }
function openSaleForm(){ const c=cases[cur]; if(c.owner!==me()){ toast('先行販売は発案者が始めます'); return; } if(!tiersOf(c).length){ openTierForm(); toast('まずリターンを1つ作ってください'); return; } if(cfLive(c)){ toast('すでに先行販売中です'); return; }
  md(`<h3>先行販売を始める</h3><p class="sm">同じ記事がそのまま販売ページになります。仲間の名前と役割も載ります。</p>
  <div class="row"><span class="sm" style="width:100px">目標額（円）</span><input class="f num" id="sa-goal" type="number" value="${c.cf?.goal||120000}" style="width:140px"></div>
  <div class="row"><span class="sm" style="width:100px">期間（日）</span><input class="f num" id="sa-days" type="number" value="30" style="width:140px"><span class="sm">長くても60日程度</span></div>
  <div class="row"><span class="sm" style="width:100px">成立の条件</span><select class="f" id="sa-mode"><option value="aon">目標に届いたときだけ成立</option><option value="allin">届かなくても申込分は成立</option></select></div>
  ${teamFilled(c)<neededRoles(c).length?'<div class="box warn">まだ埋まっていない役割があります。買う人は「誰が作り、誰が確かめるか」を見ます。</div>':''}
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="startSale()">始める</button></div>`); }
async function startSale(){ const c=cases[cur]; const goal=+$('sa-goal').value||0, days=Math.min(90,+$('sa-days').value||30), mode=$('sa-mode').value; if(goal<=0){ toast('目標額を入れてください'); return; }
  const tiers=(c.cf?.tiers||[]).length?c.cf.tiers:tiersOf(c); await save({cf:{...(c.cf||{}),tiers,goal,mode,deadline:now()+days*DAY,open:true,draft:false,pledges:c.cf?.pledges||[],startedAt:now()},notices:notice(c,(c.followers||[]),'sale','フォロー中の「'+c.title+'」が先行販売を始めました','cf')}, me()+' が先行販売を始めた（目標 '+yen(goal)+'、'+days+'日、'+(mode==='aon'?'達成時のみ成立':'申込分は成立')+'）'); closeMd(); toast('先行販売を始めました。'); }
function openPledge(tid){ const c=cases[cur], t=tiersOf(c).find(x=>x.id===tid); if(!t) return; if(!participantsAll[myId]&&me()==='名無し'){ toast('右上の「あなた」から参加者を選ぶか登録してください'); return; } const lim=+t.limit||0, rest=lim?lim-tierSold(c,tid):99;
  md(`<h3>申し込みの確認</h3><div class="box info"><b>${esc(t.title)}</b><br>${esc(t.desc||'')}<br><span class="sm">${t.delivery?'お届け予定 '+esc(t.delivery)+' ・ ':''}${(c.cf.mode||'aon')==='aon'?'目標に届いたときだけ成立':'申込分は成立'}</span></div>
  <div class="row"><span class="sm" style="width:80px">数量</span><input class="f num" id="pl-qty" type="number" min="1" max="${rest}" value="1" style="width:90px" oninput="$('pl-sum').textContent=yen(${t.price}*Math.max(1,+this.value||1))"><span class="sm">合計</span><b id="pl-sum" class="num">${yen(t.price)}</b></div>
  <input class="f" id="pl-cm" placeholder="応援のひとこと（任意・公開）" style="width:100%;margin-top:8px">
  <p class="sm" style="margin-top:8px">この試作では決済は行いません（模擬）。申し込みは「先に買う約束」の記録です。販売者は発案者で、IFBOXはお金を預かりません。</p>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="pledgeTier('${tid}')">申し込む（模擬）</button></div>`); }
async function pledgeTier(tid){ const c=cases[cur], t=tiersOf(c).find(x=>x.id===tid); if(!t||!cfLive(c)){ toast('いまは申し込めません'); closeMd(); return; } const qty=Math.max(1,Math.floor(+$('pl-qty').value||1)); const lim=+t.limit||0; if(lim&&tierSold(c,tid)+qty>lim){ toast('残りの数量を超えています'); return; }
  const amount=t.price*qty, cm=$('pl-cm').value.trim(); const pledges=(c.cf.pledges||[]).concat([{by:me(),byId:meId()||null,tierId:tid,qty,amount,t:now(),comment:cm}]); const before=cfTotal(c), total=before+amount; const patch={cf:{...c.cf,pledges}}; let msg=me()+' が「'+t.title+'」を'+yen(amount)+'で先に買った（模擬）';
  if(before<c.cf.goal&&total>=c.cf.goal){ patch.notices=notice(c,[c.owner].concat(c.followers||[]),'proposal','「'+c.title+'」が目標に届きました','cf'); msg+='。目標に届いた'; }
  if(cm) patch.messages=(c.messages||[]).concat([{by:me(),byId:meId()||null,text:'【先に買いました】'+cm,t:now()}]);
  await save(patch,msg); closeMd(); toast('申し込みを記録しました（模擬）。'); }
async function pledge(){ return openPledge('legacy'); }

/* ---------- 活動報告 ---------- */
function openUpdateForm(){ md(`<h3>活動報告を書く</h3><input class="f" id="up-title" placeholder="見出し（例 試作1号ができました）" style="width:100%"><textarea id="up-body" placeholder="進んだこと、遅れていること、次にやること。" style="margin-top:8px;min-height:110px"></textarea><div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="postUpdate()">公開する</button></div>`); }
async function postUpdate(){ const c=cases[cur]; if(!isTeam(c)){ toast('活動報告はチームが書きます'); return; } const title=$('up-title').value.trim(), body=$('up-body').value.trim(); if(!title||!body){ toast('見出しと本文を入れてください'); return; }
  const targets=[...(c.followers||[]),...(c.cf?.pledges||[]).map(p=>p.by)]; await save({updates:(c.updates||[]).concat([{id:'u'+now(),by:me(),title,body,t:now()}]),notices:notice(c,targets,'update','「'+c.title+'」に活動報告：'+title,'props')}, me()+' が活動報告「'+title+'」を公開した'); closeMd(); }

/* ---------- 販売・リターンの管理（作業場のタブ） ---------- */
function renderCf(c){ const side=$('c-cfside'), pane=$('c-cf'); if(side) side.innerHTML=''; if(!pane) return; const cf=c.cf, owner=c.owner===me(), tiers=tiersOf(c);
  if(!cf){ pane.innerHTML=`<p class="sm">まだリターンも先行販売もありません。ページ上の「リターンを足す」から作れます。</p>${owner?'<div class="row"><button class="btn" onclick="openTierForm()">リターンを足す</button></div>':''}`; return; }
  const total=cfTotal(c); const tn=id=>(tiers.find(t=>t.id===(id||'legacy'))||{}).title||'（リターン）';
  pane.innerHTML=`<div class="box info"><b>${cf.draft?'下書き（未公開）':cfLive(c)?'先行販売中':'終了'}</b> ・ 合計 ${yen(total)} / 目標 ${yen(cf.goal||0)} ・ ${backerCount(c)}人${cf.deadline&&!cf.draft?' ・ 締切 '+fmtDate(cf.deadline):''}</div>
   <table><tr><th>リターン</th><th style="text-align:right">価格</th><th style="text-align:right">申込</th><th>限定</th></tr>${tiers.map(t=>`<tr><td>${esc(t.title)}</td><td class="num">${yen(t.price)}</td><td class="num">${tierSold(c,t.id)}</td><td class="sm">${t.limit||'なし'}</td></tr>`).join('')||'<tr><td colspan="4" class="sm">リターンがありません。</td></tr>'}</table>
   <h3 style="margin-top:14px">申込の一覧</h3><table><tr><th>人</th><th>リターン</th><th style="text-align:right">数量</th><th style="text-align:right">金額</th><th>日時</th></tr>${(cf.pledges||[]).slice().reverse().map(p=>`<tr><td>${esc(p.by)}</td><td class="sm">${esc(tn(p.tierId))}</td><td class="num">${pledgeQty(p)}</td><td class="num">${yen(p.amount)}</td><td class="sm">${fmtDT(p.t)}</td></tr>`).join('')||'<tr><td colspan="5" class="sm">まだ申込はありません。</td></tr>'}</table>
   ${owner?`<div class="row">${cf.draft||!cfLive(c)?'<button class="btn sm" onclick="openSaleForm()">先行販売を始める</button>':'<button class="btn ghost sm" onclick="closeCf()">募集を締める</button>'}<button class="btn ghost sm" onclick="openTierForm()">リターンを足す</button></div>`:''}
   <p class="sm" style="margin-top:8px">販売者の表示（特定商取引法）や決済の接続は、実際にお金を動かす前に整えます。いまは模擬です。</p>`; }

/* ---------- 一覧：クラファンのカード ---------- */
function renderChips(){ const all=[['all','すべて'],['st:recruiting','仲間募集中'],['st:preparing','準備中'],['st:selling','先行販売中'],['st:funded','達成'],['real','実案件'],['sample','サンプル']];
  $('chips').innerHTML=all.map(([k,n])=>`<button class="chip ${chip===k?'on':''}" onclick="chip='${k}';window._chipTouched=true;renderChips();renderGrid();renderHome()">${esc(n)}</button>`).join(''); }
function renderGrid(){ const q=($('q').value||'').trim().toLowerCase(); const sort=$('sort').value; let list=Object.values(cases).filter(c=>!c.archived);
  if(q) list=list.filter(c=>[c.title,c.reframed,c.domain,c.owner,c.benefit].join(' ').toLowerCase().includes(q));
  if(chip==='real') list=list.filter(c=>!isSample(c)); if(chip==='sample') list=list.filter(c=>isSample(c)); if(chip==='open') list=list.filter(c=>openSeats(c).length>0); if(chip==='cf') list=list.filter(c=>cfLive(c)); if(chip==='sold') list=list.filter(c=>c.stage>=2);
  if(chip.startsWith('st:')) list=list.filter(c=>projStatus(c)===chip.slice(3)||(chip==='st:funded'&&projStatus(c)==='settled')); if(chip.startsWith('d:')) list=list.filter(c=>c.domain===chip.slice(2));
  if(!q&&chip!=='real'&&list.some(c=>c.id==='s09')) list.sort((a,b)=>(a.id==='s09'?-1:0)-(b.id==='s09'?-1:0));
  if(sort==='like') list.sort((a,b)=>(b.likes||[]).length-(a.likes||[]).length); if(sort==='cf') list.sort((a,b)=>cfTotal(b)-cfTotal(a)); if(sort==='open') list.sort((a,b)=>openSeats(b).length-openSeats(a).length);
  $('cnt').textContent=list.length+' 件';
  if(!list.length){ $('grid').innerHTML='<p class="sm">'+(chip==='real'&&Object.values(cases).some(isSample)?'実案件はまだありません。「サンプル」か「すべて」で例を見られます。':'当てはまるプロジェクトがありません。')+'</p>'; return; }
  $('grid').innerHTML=list.map(c=>{ const st=projStatus(c), cf=c.cf, sale=cf&&!cf.draft, total=cfTotal(c), pct=sale&&cf.goal?Math.round(total/cf.goal*100):0, need=neededRoles(c), filled=teamFilled(c), left=cfLeftDays(c);
    return `<div class="pc pcx" tabindex="0" onclick="openCase('${c.id}')" onkeydown="if(event.key==='Enter')openCase('${c.id}')">
      <div class="th" style="${coverStyle(c)}">${coverImg(c)}${unreadNotices(c).length?`<span class="grid-unread">未読 ${unreadNotices(c).length}</span>`:''}<span class="pcst">${stTag(c)}</span><span class="pct">${esc(c.reframed||c.title)}</span></div>
      <div class="bd"><div class="mt">${isSample(c)?'<span class="tag em">サンプル</span>':''}${c.domain?`<span class="tag bl">${esc(c.domain)}</span>`:''}<span>${esc(c.owner)}</span></div>
        ${sale?`<div class="cf"><div class="bar"><i style="width:${Math.min(100,pct)}%"></i></div><div class="lb2"><b>${yen(total)}</b><span>${pct}%</span><span>${backerCount(c)}人</span><span>${cfLive(c)?'あと'+left+'日':'終了'}</span></div></div>`
             :`<div class="cf"><div class="bar team"><i style="width:${need.length?Math.round(filled/need.length*100):100}%"></i></div><div class="lb2"><b>役割 ${filled}/${need.length}</b><span>${need.filter(k=>c.seats?.[k]?.t!=='hu').map(k=>SNAME[k]).join('・')||'揃いました'}</span></div></div>`}
        <div class="mt"><span>♡ ${(c.likes||[]).length}</span><span>フォロー ${(c.followers||[]).length}</span><span>スレッド ${(c.messages||[]).length}</span></div>
      </div></div>`; }).join(''); }

/* ---------- 起動時：作業場に包む／タブ名 ---------- */
(function(){ const lay=document.querySelector('#c-body .lay'); if(lay&&!$('workroom')){ const d=document.createElement('details'); d.id='workroom'; d.className='workroom'; d.innerHTML='<summary><b>チームの作業場</b><span class="sm">スレッド・提案・納品と検収・台帳・配分の準備。買う人には、上の記事とチームだけで足ります。</span></summary>'; lay.parentNode.insertBefore(d,lay); d.appendChild(lay); ['c-tools','c-test'].forEach(i=>{ const e=$(i); if(e) d.parentNode.insertBefore(e,d); }); }
  const b=document.querySelector('.tabs button[data-p="cf"]'); if(b) b.textContent='販売・リターン'; })();
const _openCase0=openCase; openCase=function(id){ _openCase0(id); const c=cases[id], w=$('workroom'); if(w&&c) w.open=isTeam(c); };
/* デモ：見本の案件を販売ページらしくする */
async function enrichDemo(){ if(!window.DEMO_MODE||!db) return; const c=cases['s09']; if(!c||(c.cf?.tiers||[]).length) return; const base=c.cf||{pledges:[]};
  try{ await db.doc('cases/s09').update({cf:{...base,draft:false,open:true,mode:'aon',goal:base.goal||120000,deadline:Date.now()+21*DAY,startedAt:Date.now()-9*DAY,tiers:[{id:'t1',title:'4週間の利用権（早割・先着30）',price:2400,regular:3000,limit:30,early:true,delivery:'2026年12月',desc:'冷蔵庫の写真から献立と栄養の目安が出るアプリを4週間。先着30名。'},{id:'t2',title:'4週間の利用権',price:3000,regular:3000,limit:0,early:false,delivery:'2026年12月',desc:'同じ内容の通常価格。'},{id:'t3',title:'職場で使う（10名分）',price:25000,regular:30000,limit:5,early:false,delivery:'2027年1月',desc:'福利厚生として10名が4週間使えます。利用の様子をまとめた報告つき。'}],pledges:(base.pledges||[]).map(p=>({...p,tierId:'t2',qty:1})).concat([{by:'例：はると',tierId:'t1',qty:1,amount:2400,t:Date.now()-6*DAY,comment:'夜の献立に毎日悩んでいます'},{by:'例：企業の総務',tierId:'t3',qty:1,amount:25000,t:Date.now()-3*DAY,comment:''}])},
      updates:[{id:'u1',by:c.owner,title:'作る人が決まりました',body:'試作を担当してくれる仲間が決まりました。来週、最初の版を身近な3人に使ってもらいます。',t:Date.now()-8*DAY},{id:'u2',by:c.owner,title:'試作1号を3人に使ってもらいました',body:'写真の撮り方で結果がぶれることが分かりました。撮影の案内を足します。お届け予定は変えません。',t:Date.now()-2*DAY}],
      roles:{SELL:{desc:'職場の福利厚生として紹介できる人。総務・人事とのつながりがある方。',hours:'週2時間・2か月',share:'成果の20%',need:true},ACC:{desc:'届いたものが約束どおりかを、買う側の目で確かめる人。',hours:'納品時に2時間',share:'確定対価5,000円',need:true}},followers:['例：さくら','例：はると','例：みお']}); }catch(e){} }
setTimeout(enrichDemo,700);
