(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },20000);
try{
await sleep(60);
r.viewSwitch=!!$('viewsw'); r.seatNames=SNAME.BUILD==='つくる'&&SNAME.ACC==='確かめて良くする'&&SNAME.SELL==='ひろめる';
pickMe('__new'); $('new-name').value='さくら'; await registerMe(); await sleep(30); const ownerId=myId;
go('home'); showPost(true); $('ifline').value='もし、三役割'; $('benefit').value='だれか'; await post(); await sleep(60);
const id=Object.keys(window.__store)[0];
r.setupOpened=!!$('ts-n-MAKE')&&cur===id; await aiTeamSetup(); $('ts-n-MAKE').value='2'; $('ts-n-SPREAD').value='2'; $('ts-n-CHECK').value='1'; $('ts-share-SPREAD').value='成果の20%'; await saveTeamSetup(); await sleep(40);
let t=teamOf(cases[id]); r.teamSaved=t.MAKE.n===2&&t.SPREAD.n===2&&t.CHECK.n===1; r.ownerInMake=t.MAKE.members[0].name==='さくら'&&t.MAKE.members[0].lead===true;
r.threeCards=document.querySelectorAll('#pj .rc').length===3; r.cardNames=$('pj-team').textContent.includes('つくる')&&$('pj-team').textContent.includes('確かめて良くする')&&$('pj-team').textContent.includes('ひろめる');
r.recruiting=projStatus(cases[id])==='recruiting'; r.openNames=openRoleNames(cases[id]).length===3;
/* 発案者は「確かめて良くする」を兼ねられない */
r.ownerCannotCheck=joinCheck(cases[id],'CHECK','さくら').includes('兼ねられません');
/* 仲間：けん＝つくる、みか＝ひろめる、ゆう＝ひろめる（2人目）、はな＝確かめて良くする */
const reg=async n=>{ pickMe('__new'); $('new-name').value=n; await registerMe(); await sleep(30); return myId; };
const kenId=await reg('けん'); openCase(id); applyRole('MAKE'); $('ap-text').value='作れます'; await sendApply('MAKE'); await sleep(30);
const mikaId=await reg('みか'); openCase(id); applyRole('SPREAD'); $('ap-text').value='売れます'; await sendApply('SPREAD'); await sleep(30);
const yuId=await reg('ゆう'); openCase(id); applyRole('SPREAD'); $('ap-text').value='紹介できます'; await sendApply('SPREAD'); await sleep(30);
pickMe(ownerId); await sleep(10); openCase(id); const cans=(cases[id].messages||[]).map((m,i)=>[m,i]).filter(x=>x[0].kind==='can'); for(const [,i] of cans){ await sitFromCan(i); await sleep(30); }
t=teamOf(cases[id]); r.makeTwo=t.MAKE.members.length===2&&t.MAKE.members[1].name==='けん'; r.spreadTwo=t.SPREAD.members.length===2; r.seatsSynced=cases[id].seats.BUILD.n==='けん'&&cases[id].seats.SELL.n==='みか'; r.stage1=cases[id].stage===1;
r.leadTag=$('pj-team').textContent.includes('取りまとめ');
/* つくる人は確かめる役に入れない */
pickMe(kenId); await sleep(10); openCase(id); applyRole('CHECK'); r.makerBlocked=!$('ap-text')||$('ov').classList.contains('on')===false||joinCheck(cases[id],'CHECK','けん').includes('兼ねられません'); closeMd();
/* 枠が埋まった役割には手を挙げられない */
const hanaId=await reg('はな'); openCase(id); r.noRoomSpread=joinCheck(cases[id],'SPREAD','はな').includes('埋まって'); applyRole('CHECK'); $('ap-text').value='確かめます'; await sendApply('CHECK'); await sleep(30);
pickMe(ownerId); await sleep(10); openCase(id); const ci=(cases[id].messages||[]).findIndex(m=>m.kind==='can'&&m.by==='はな'); await sitFromCan(ci); await sleep(30);
r.preparing=projStatus(cases[id])==='preparing'&&cases[id].seats.ACC.n==='はな'; r.checkerIsHana=(()=>{ pickMe(hanaId); const v=checkerName(cases[id])==='はな'; pickMe(ownerId); return v; })();
/* 担当と取りまとめ役、外す */
await sleep(10); openCase(id); editRole('SPREAD'); $('ro-task-1').value='紹介'; document.querySelectorAll('input[name="ro-lead"]')[1].checked=true; await saveRole('SPREAD'); await sleep(30); t=teamOf(cases[id]); r.leadChanged=t.SPREAD.members[1].lead===true&&t.SPREAD.members[1].task==='紹介';
editRole('SPREAD'); await removeMember('SPREAD',0); await sleep(30); t=teamOf(cases[id]); r.removed=t.SPREAD.members.length===1&&t.SPREAD.members[0].name==='ゆう'&&cases[id].seats.SELL.n==='ゆう'; r.backToRecruiting=projStatus(cases[id])==='recruiting';
/* 外部サイトで先行販売 */
openSaleForm(); $('sa-where').value='ext'; $('sa-site').value='Makuake'; $('sa-url').value='ftp://x'; $('sa-goal').value='100000'; await startSale(); await sleep(10); r.badUrlRejected=!cases[id].cf||cases[id].cf.draft!==false; $('sa-url').value='https://example.com/p/1'; await startSale(); await sleep(40);
r.extSelling=projStatus(cases[id])==='selling'&&cases[id].cf.external.site==='Makuake'; r.extLink=document.querySelector('.pj-side a[href="https://example.com/p/1"]')!==null; r.noMockNote=!$('pj-tiers').textContent.includes('模擬');
openExtResult(); $('ex-amt').value='60000'; $('ex-n').value='20'; $('ex-proof').value='https://example.com/proof'; await saveExtResult(); await sleep(30); r.extRecorded=cfTotal(cases[id])===60000&&backerCount(cases[id])===20;
openExtResult(); $('ex-amt').value='120000'; $('ex-n').value='41'; await saveExtResult(); await sleep(30); r.extReplaced=cfTotal(cases[id])===120000&&backerCount(cases[id])===41&&cases[id].cf.pledges.filter(p=>p.ext).length===1; r.funded=projStatus(cases[id])==='funded';
await confirmBuyers(); await sleep(30); r.stage2=cases[id].stage===2;
/* 入口の切り替え */
setView('back'); await sleep(20); r.backMode=document.body.classList.contains('v-back')&&document.querySelector('.hero .ht').textContent.includes('応'); r.backHidesNav=!document.querySelector('nav button[data-s="turns"]')&&!!document.querySelector('nav button[data-s="x-orders"]');
pickMe(hanaId); openCase(id); r.backTeamTitle=$('pj-team').textContent.includes('誰が作り、誰が確かめるのか');
const vId=await reg('とおりすがり'); openCase(id); r.backWorkroomHidden=$('workroom').hidden===true; setView('make'); await sleep(20); openCase(id); r.makeWorkroomShown=$('workroom').hidden===false;
/* 旧データ（team なし）の互換 */
window.__store['old1']={...window.__store[id],title:'もし、旧データ',team:undefined,roles:{SELL:{desc:'旧の募集',share:'10%'}},cf:null,seats:{...newSeats('さくら'),SELL:{t:'hu',n:'みか',since:1}},stage:0}; delete window.__store['old1'].team; cases['old1']={id:'old1',...window.__store['old1']}; t=teamOf(cases['old1']); r.legacyDerived=t.SPREAD.members[0].name==='みか'&&t.SPREAD.desc==='旧の募集'&&t.MAKE.members[0].name==='さくら';
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r,null,1); document.body.appendChild(pre);
})();
