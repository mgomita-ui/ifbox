(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },16000);
try{
await sleep(40);
pickMe('__new'); $('new-name').value='さくら'; await registerMe(); await sleep(30); const ownerId=myId;
go('home'); showPost(true); $('ifline').value='もし、クラファン'; $('benefit').value='夜に料理する人'; await post(); await sleep(40);
const id=Object.keys(window.__store)[0]; openCase(id); await sleep(10);
r.pjRendered=!!document.querySelector('#pj .pjx'); r.statusRecruiting=projStatus(cases[id])==='recruiting'; r.roleCards=document.querySelectorAll("#pj .rc").length===3; r.workroom=!!$('workroom'); r.workroomOpenForOwner=$('workroom').open===true;
r.noTiersMsg=$('pj-tiers').textContent.includes('リターンはまだありません'); r.sideShowsTeam=document.querySelector('.pj-side').textContent.includes('役割');
/* 記事 */
editArticle(); await aiDraftArticle(); $('ar-why').value='なぜ'; $('ar-who').value='だれ'; $('ar-what').value='なに'; $('ar-risks').value='線1\n線2'; $('ar-faq').value='いつ届く｜12月'; $('ar-cover').value='ftp://x'; await saveArticle(); await sleep(10); r.badCoverRejected=!cases[id].article; $('ar-cover').value=''; await saveArticle(); await sleep(30);
r.articleSaved=cases[id].article?.why==='なぜ'&&cases[id].article.faq[0].a==='12月'; r.articleShown=$('pj-story').textContent.includes('なぜ')&&$('pj-risk').textContent.includes('線2');
/* 役割の募集内容 */
editRole('SELL'); $('ro-desc').value='販路を持つ人'; $('ro-hours').value='週2時間'; $('ro-share').value='成果の20%'; await saveRole('SELL'); await sleep(30); r.roleSaved=$('pj-team').textContent.includes('販路を持つ人')&&$('pj-team').textContent.includes('成果の20%');
/* リターン（下書き） */
openTierForm(); $('ti-title').value='早割'; $('ti-price').value='2000'; $('ti-regular').value='3000'; $('ti-limit').value='2'; $('ti-early').checked=true; $('ti-delivery').value='2026年12月'; $('ti-desc').value='4週間'; await saveTier(''); await sleep(30);
r.tierDraft=cases[id].cf?.draft===true&&cases[id].cf.tiers.length===1; r.stillRecruiting=projStatus(cases[id])==='recruiting'; r.tierShown=$('pj-tiers').textContent.includes('早割')&&$('pj-tiers').textContent.includes('33%'); r.noBuyBtnBeforeSale=!$('pj-tiers').innerHTML.includes('openPledge(');
const tid=cases[id].cf.tiers[0].id;
/* 2人目：手を挙げる */
pickMe('__new'); $('new-name').value='けん'; await registerMe(); await sleep(30); const kenId=myId; openCase(id); await sleep(10);
r.workroomClosedForVisitor=$('workroom').open===false; r.visitorNoEdit=!$('pj').innerHTML.includes('editArticle()');
applyRole('SELL'); $('ap-text').value='売れます'; await sendApply('SELL'); await sleep(30); r.applied=(cases[id].messages||[]).some(m=>m.kind==='can'&&m.seat==='SELL'&&m.by==='けん'); r.appliedTag=$('pj-team').textContent.includes('手を挙げました');
await toggleFollow(); await sleep(20); r.followed=(cases[id].followers||[]).includes('けん');
r.visitorCannotUpdate=!$('pj').innerHTML.includes('openUpdateForm()');
/* 発案者：迎える → 役割を埋める */
pickMe(ownerId); await sleep(10); openCase(id); const ci=(cases[id].messages||[]).findIndex(m=>m.kind==='can'); await sitFromCan(ci); await sleep(30); r.kenSeated=cases[id].seats.SELL.n==='けん';
await sit('BUILD','たろう'); await sleep(20); await sit('ACC','はな'); await sleep(30); r.preparing=projStatus(cases[id])==='preparing';
/* 先行販売 */
openSaleForm(); $('sa-where').value='own'; $('sa-goal').value='5000'; $('sa-days').value='30'; $('sa-mode').value='aon'; await startSale(); await sleep(30);
r.selling=projStatus(cases[id])==='selling'&&cfLive(cases[id]); r.followerNotified=(cases[id].notices||[]).some(n=>n.type==='sale'&&n.targets.includes('けん')); r.buyBtn=$('pj-tiers').innerHTML.includes('openPledge(');
go('home'); chip='st:selling'; renderChips(); renderGrid(); r.gridSelling=document.querySelectorAll('#grid .pcx').length===1&&$('grid').textContent.includes('あと'); chip='st:recruiting'; renderGrid(); r.gridRecruitingEmpty=document.querySelectorAll('#grid .pcx').length===0; chip='all'; renderGrid();
/* 申込 */
pickMe(kenId); await sleep(10); openCase(id); openPledge(tid); $('pl-qty').value='2'; $('pl-cm').value='応援'; await pledgeTier(tid); await sleep(30);
r.pledged=cases[id].cf.pledges.length===1&&cases[id].cf.pledges[0].amount===4000&&cases[id].cf.pledges[0].qty===2; r.commentToThread=(cases[id].messages||[]).some(m=>m.text.includes('先に買いました')); r.soldOut=$('pj-tiers').textContent.includes('売り切れ');
openPledge(tid); if($('pl-qty')){ $('pl-qty').value='1'; await pledgeTier(tid); await sleep(20); } r.limitEnforced=cases[id].cf.pledges.length===1; closeMd();
/* 発案者：売れたリターンは価格を変えられない／新しいリターンを足す */
pickMe(ownerId); await sleep(10); openCase(id); openTierForm(tid); $('ti-price').value='1000'; await saveTier(tid); await sleep(20); r.soldTierLocked=cases[id].cf.tiers[0].price===2000; closeMd();
openTierForm(); $('ti-title').value='通常'; $('ti-price').value='3000'; $('ti-limit').value=''; await saveTier(''); await sleep(30); const tid2=cases[id].cf.tiers[1].id;
pickMe(kenId); await sleep(10); openCase(id); openPledge(tid2); $('pl-qty').value='1'; await pledgeTier(tid2); await sleep(30);
r.funded=projStatus(cases[id])==='funded'&&cfTotal(cases[id])===7000; r.goalNotice=(cases[id].notices||[]).some(n=>n.text.includes('目標に届きました'));
pickMe(ownerId); await sleep(10); openCase(id); r.confirmBtn=document.querySelector('.pj-side').innerHTML.includes('confirmBuyers()'); await confirmBuyers(); await sleep(30); r.stage2=cases[id].stage===2;
/* 活動報告 */
openUpdateForm(); $('up-title').value='試作1号'; $('up-body').value='できました'; await postUpdate(); await sleep(30); r.updatePosted=(cases[id].updates||[]).length===1&&$('pj-ups').textContent.includes('試作1号'); r.backerNotified=(cases[id].notices||[]).some(n=>n.type==='update'&&n.targets.includes('けん'));
/* 管理タブ */
tab('cf'); r.manageTable=$('c-cf').textContent.includes('申込の一覧')&&$('c-cf').textContent.includes('早割');
/* 旧形式の cf も1つのリターンとして見える */
window.__store['legacy1']={...window.__store[id],title:'もし、旧形式',createdAt:Date.now()-5,stage:0,cf:{goal:9000,unit:3000,deadline:Date.now()+5*86400000,ret:'旧リターン',pledges:[],open:true},updates:[],followers:[],article:null,roles:null}; cases['legacy1']={id:'legacy1',...window.__store['legacy1']}; openCase('legacy1'); r.legacyTier=$('pj-tiers').textContent.includes('旧リターン')&&$('pj-tiers').innerHTML.includes("openPledge('legacy')");
/* 期限切れ・未達は不成立 */
cases['legacy1'].cf.deadline=Date.now()-1000; r.unfunded=projStatus(cases['legacy1'])==='unfunded';
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r,null,1); document.body.appendChild(pre);
})();
