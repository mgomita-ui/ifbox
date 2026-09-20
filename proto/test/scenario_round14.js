(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },20000);
const BAD=['リターン','検収','フォロー','案件','手番','保管庫','配分','台帳','スレッド','オファー','発案者','言い出した人','模擬','¥','先行販売','共感'];
const vis=el=>{ const c=el.cloneNode(true); c.querySelectorAll('[data-raw],textarea,input,script,style,.pj-title,.pj-cv h1,#pj-story p,.pct,.nm').forEach(x=>x.remove()); return c.innerText||c.textContent||''; };
try{
await sleep(80);
r.plainOn=window.PLAIN_OFF===false; r.trialbar=!!$('trialbar')&&$('trialbar').textContent.includes('お試し版');
r.navMake=[...document.querySelectorAll('.top nav button')].map(b=>b.textContent.trim()).join('|')==='計画を探す|アイデアを書く|参加中の計画|自分のやること|その他';
r.postLabels=document.querySelector('label[for="ifline"]').textContent==='アイデアを1行で'&&$('postbtn').textContent==='紹介ページを作る';
pickMe('__new'); await sleep(60); r.regPlain=!$('md').textContent.includes('認証')&&$('md').textContent.includes('本人かどうかは確認していません'); $('new-name').value='さくら'; await registerMe(); await sleep(40); const ownerId=myId;
go('home'); showPost(true); $('ifline').value='もし、検収とリターンが分かりやすくなったら'; $('benefit').value='だれか'; await post(); await sleep(80);
const id=Object.keys(window.__store)[0]; closeMd(); await sleep(60);
r.userTextKept=document.querySelector('.pj-title').textContent.includes('検収とリターン');
/* 買えるものを作って、IFBOX内で販売 */
openTierForm(); await sleep(40); $('ti-title').value='早割'; $('ti-price').value='2400'; $('ti-regular').value='3000'; $('ti-limit').value='30'; await saveTier(''); await sleep(60);
openSaleForm(); await sleep(40); r.saleFormPlain=$('md').textContent.includes('販売を始める')&&!$('md').textContent.includes('先行販売'); $('sa-where').value='own'; $('sa-goal').value='120000'; await startSale(); await sleep(80);
pickMe('__new'); await sleep(40); $('new-name').value='けん'; await registerMe(); await sleep(40); openCase(id); await sleep(80);
const tid=cases[id].cf.tiers[0].id; openPledge(tid); await sleep(60); r.pledgeModalPlain=$('md').textContent.includes('申し込みを試す')&&$('md').textContent.includes('お試しです'); await pledgeTier(tid); await sleep(80);
const side=vis(document.querySelector('.pj-side')); r.sideNumbers=side.includes('目標額の2%')&&side.includes('2,400円／目標120,000円')&&side.includes('目標まであと117,600円')&&side.includes('終了まで30日'); r.sideWords=side.includes('気になる')&&side.includes('いいね');
const page=vis($('pj')); r.badOnProject=BAD.filter(w=>page.includes(w));
const tiers=vis($('pj-tiers')); r.tierPlain=tiers.includes('発売後の予定価格 3,000円')&&tiers.includes('残り29／限定30')&&tiers.includes('申し込み内容を確認');
go('home'); await sleep(60); const home=vis($('s-home')); r.badOnHome=BAD.filter(w=>home.includes(w));
/* おうえん側 */
setView('back'); await sleep(80); r.navBack=[...document.querySelectorAll('.top nav button')].map(b=>b.textContent.trim()).join('|')==='買えるもの|準備中の計画|気になる|申し込みの確認'; r.heroBack=document.querySelector('.hero .ht').textContent.includes('応援');
openOrders(); await sleep(60); r.orders=$('md').textContent.includes('早割')&&$('md').textContent.includes('2,400円'); closeMd();
setChip('fav'); await sleep(40); r.favEmpty=$('grid').textContent.includes('まだありません'); openCase(id); await toggleFollow(); await sleep(60); go('home'); setChip('fav'); await sleep(60); r.favOne=[...document.querySelectorAll('#grid .pcx')].filter(e=>!e.hidden).length===1;
setView('make'); await sleep(60); setChip('mine'); await sleep(60); r.mineEmptyForBacker=[...document.querySelectorAll('#grid .pcx')].filter(e=>!e.hidden).length===0;
pickMe(ownerId); await sleep(40); setChip('mine'); await sleep(60); r.mineForOwner=[...document.querySelectorAll('#grid .pcx')].filter(e=>!e.hidden).length===1;
openMore(); await sleep(40); r.more=$('md').textContent.includes('参加している人')&&$('md').textContent.includes('お金の分け方')&&$('md').textContent.includes('休止中の計画'); closeMd();
openCase(id); $('workroom').open=true; await sleep(80); const wr=vis($('workroom')); r.tabsPlain=['話し合い','参加の申し出','販売と買えるもの','渡す・確認','仕事と支払いの記録'].every(w=>wr.includes(w)); r.badOnWorkroomSide=BAD.filter(w=>vis(document.querySelector('#workroom .side')).includes(w));
go('turns'); await sleep(60); r.turnsPlain=vis($('s-turns')).includes('さんが次にやることです')&&!vis($('s-turns')).includes('名札');
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r,null,1); document.body.appendChild(pre);
})();
