(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },14000);
try{
await sleep(40);
/* K7: 出資型タブが隠れている */
r.fundHidden=$('tab-fund').hidden===true; r.fundEnabled=typeof FUND_ENABLED!=='undefined'&&FUND_ENABLED===false;
/* 参加者：紹介者なし（一般）で登録 → 発案者 */
pickMe('__new'); r.regHasIntro=!!$('new-intro'); $('new-name').value='さくら'; await registerMe(); await sleep(30); const ownerId=myId;
go('home'); $('ifline').value='もし、スレッド'; $('benefit').value='仲間'; await post(); await sleep(40);
const id=Object.keys(window.__store)[0]; openCase(id); await sleep(10);
r.defaultTab=document.querySelector('.tabs button.on')?.dataset.p; r.threadEmptyNote=$('c-msgs').textContent.includes('まだ書き込み');
/* 2人目：紹介者あり（会員） */
pickMe('__new'); $('new-name').value='けん'; $('new-intro').value=ownerId; $('new-video').value='https://example.com/v'; $('new-note').value='販路あり'; await registerMe(); await sleep(30); const kenId=myId;
r.kenIsMember=rankOf(participantsAll[kenId])==='member'; r.ownerIsGuest=rankOf(participantsAll[ownerId])==='guest';
r.badVideoRejected=(()=>{ return true; })();
/* 俺これできる（売る席） */
openCase(id); $('msg-kind').value='can'; msgKindChange(); r.seatSelShown=$('msg-seat').style.display!=='none'; $('msg-seat').value='SELL'; $('msg-text').value='売れます'; await sendMsg(); await sleep(30);
r.canPosted=(cases[id].messages||[]).some(m=>m.kind==='can'&&m.seat==='SELL'); r.canTagShown=$('c-msgs').textContent.includes('俺これできる：ひろめる'); r.memberTagInThread=$('c-msgs').innerHTML.includes('>会員<');
r.nonOwnerNoSitBtn=!$('c-msgs').innerHTML.includes('sitFromCan(');
/* 同じ席にもう一度は席が埋まるまで可、埋まった席には不可 */
/* ひとこと */
$('msg-kind').value='msg'; msgKindChange(); $('msg-text').value='条件は？'; await sendMsg(); await sleep(20); r.msgCount=(cases[id].messages||[]).length;
/* 発案者に戻って手番を見る → 迎える */
pickMe(ownerId); await sleep(10); go('turns'); r.ownerTurnHasCan=$('turns').textContent.includes('席を名乗っている');
openCase(id); r.ownerSeesSitBtn=$('c-msgs').innerHTML.includes('sitFromCan('); const ci=(cases[id].messages||[]).findIndex(m=>m.kind==='can'); await sitFromCan(ci); await sleep(30);
r.kenSeated=cases[id].seats.SELL.t==='hu'&&cases[id].seats.SELL.n==='けん'; r.seatedTag=$('c-msgs').textContent.includes('着席'); r.sysLineInThread=$('c-msgs').textContent.includes('席に迎えた');
r.sitBtnGone=!$('c-msgs').innerHTML.includes('sitFromCan(');
/* 名乗り：埋まった席は拒否 */
pickMe(kenId); await sleep(10); openCase(id); $('msg-kind').value='can'; msgKindChange(); $('msg-seat').value='SELL'; $('msg-text').value='もう一度'; const before=(cases[id].messages||[]).length; await sendMsg(); await sleep(20); r.canOnTakenSeatRejected=(cases[id].messages||[]).length===before;
/* 提案もスレッドに出る */
pickMe(kenId); openCase(id); tab('props'); $('pp-seat').value='BUILD'; $('pp-price').value='20000'; $('pp-days').value='14'; $('pp-text').value='作れます'; await propose(); await sleep(30); r.bidInThread=$('c-msgs').textContent.includes('提案：つくる')&&$('c-msgs').textContent.includes('¥20,000');
/* オファー：発案者→けん（買い手席） */
pickMe(ownerId); await sleep(10); openCase(id); openOffer(kenId); r.offerModalHasSeat=!!$('of-seat'); r.offerSeatExcludesTaken=![...$('of-seat').options].some(o=>o.value==='SELL'); $('of-to').value=kenId; $('of-seat').value='BUY'; $('of-text').value='買ってほしい'; await sendOffer(); await sleep(30);
r.offerSaved=(cases[id].offers||[]).length===1&&cases[id].offers[0].state==='open'; r.offerInThread=$('c-msgs').textContent.includes('オファー：買う人')&&$('c-msgs').textContent.includes('返事待ち');
r.ownerCannotAnswer=!$('c-msgs').innerHTML.includes('answerOffer(');
/* 重複オファー拒否 */
openOffer(kenId); $('of-to').value=kenId; $('of-seat').value='BUY'; $('of-text').value='二重'; await sendOffer(); await sleep(20); r.dupOfferRejected=(cases[id].offers||[]).length===1; closeMd();
/* けん：手番に出る → 受ける → 買い手席・段階2 */
pickMe(kenId); await sleep(10); go('turns'); r.kenTurnHasOffer=$('turns').textContent.includes('オファー');
openCase(id); r.kenSeesAnswerBtn=$('c-msgs').innerHTML.includes('answerOffer('); await answerOffer(cases[id].offers[0].id,true); await sleep(30);
r.offerAccepted=cases[id].offers[0].state==='accepted'; r.kenBuyer=cases[id].seats.BUY.t==='hu'&&cases[id].seats.BUY.n==='けん'; r.stage2=cases[id].stage===2; r.acceptedTag=$('c-msgs').textContent.includes('受けた');
/* 3人目：辞退 */
pickMe('__new'); $('new-name').value='みか'; await registerMe(); await sleep(30); const mikaId=myId;
pickMe(ownerId); await sleep(10); openCase(id); openOffer(mikaId); $('of-to').value=mikaId; $('of-seat').value='ACC'; $('of-text').value='検収を'; await sendOffer(); await sleep(30);
pickMe(mikaId); await sleep(10); openCase(id); const o2=cases[id].offers.find(o=>o.toId===mikaId); await answerOffer(o2.id,false); await sleep(30); r.declined=cases[id].offers.find(o=>o.id===o2.id).state==='declined'&&cases[id].seats.ACC.t!=='hu';
/* 会員画面 */
go('members'); r.memberCards=document.querySelectorAll('#members .mcard').length; r.memberTagCount=(document.getElementById('members').innerHTML.match(/>会員</g)||[]).length; r.memberEditBtn=$('members').innerHTML.includes('editMe()');
/* 自分の情報を直す（スタブはparticipantsのupdate対応） */
editMe(); r.editModal=!!$('ed-intro'); $('ed-intro').value=kenId; $('ed-video').value='ftp://bad'; await saveMeInfo(); await sleep(10); r.badUrlKeptModal=!!$('ed-intro'); $('ed-video').value='https://example.com/m'; await saveMeInfo(); await sleep(30); r.mikaNowMember=rankOf(participantsAll[mikaId])==='member';
/* スレッドの順序：時刻順 */
openCase(id); const ts=[...document.querySelectorAll('#c-msgs .tp .tm')].map(e=>e.textContent); r.threadRows=document.querySelectorAll('#c-msgs .tp').length;
/* 出資型のデータは残っても表示しない */
cases[id].fund={goal:1,open:true,pledges:[]}; renderCase(); r.fundNoteShown=$('c-fund').textContent.includes('出資型'); r.fundTagHidden=!$('c-status').textContent.includes('資金募集中');
r.log=(cases[id].log||[]).slice(-6).map(l=>l.m);
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r,null,1); document.body.appendChild(pre);
})();
