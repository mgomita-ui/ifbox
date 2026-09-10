
(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },12000);
try{
async function runCase(title){ $('me').value='発案者';go('home');$('ifline').value=title;$('benefit').value='仲間';await post();await sleep(30);const id=Object.keys(window.__store).slice(-1)[0];openCase(id);
 if(!(window.__store[id].criteria||[]).length){tab('accept');$('crit-text').value='動く\n説明';await saveCriteria();await sleep(20);}
 $('me').value='提案者';renderCase();$('pp-seat').value='BUILD';$('pp-price').value='20000';$('pp-days').value='7';$('pp-text').value='作る';await propose();await sleep(20);$('me').value='発案者';renderCase();await pick(window.__store[id].bids[0].id);await sleep(20);await sit('BUY');await sleep(20);
 $('me').value='検収人';renderCase();await sit('ACC');await sleep(20);
 $('me').value='提案者';renderCase();tab('accept');$('del-name').value='手順書';$('del-body').value='1. 開く\n2. 撮る';await deliver();await sleep(20);
 $('me').value='検収人';renderCase();tab('accept');const sel=[...document.querySelectorAll('select[data-cid]')];sel[0].value='0';await setCheck(sel[0]);await sleep(20);$('rej-reason').value='直して';await rejectDelivery();await sleep(20);
 $('me').value='提案者';renderCase();tab('accept');$('del-name').value='手順書';$('del-body').value='1. 開く\n2. 撮る\n3. 送る';$('del-diff').value='';await deliver();await sleep(20);r.diffRequired=(window.__store[id].artifacts.length===1);$('del-diff').value='送る手順を足した';await deliver();await sleep(20);
 $('me').value='検収人';renderCase();tab('accept');for(const s of [...document.querySelectorAll('select[data-cid]')]){s.value='1';await setCheck(s);await sleep(15);}await acceptAll();await sleep(20);return id;}
const id1=await runCase('もし、元');const c1=window.__store[id1];r.artifacts=c1.artifacts.map(a=>[a.version,a.accepted,a.parentId?'p':'-']);r.acceptedIsV2=c1.artifacts.find(a=>a.accepted)?.version;
/* 版2登録後に検収対象が動かないこと：v3を登録しても accepted は v2 のまま */
r.stageAfter=c1.stage;
go('money');$('m-case').value=id1;$('m-price').value='30000';calc();await recordReceipt();await sleep(10);calc();await saveDist();await sleep(10);await bumpClock(8);await sleep(10);calc();await settle();await sleep(10);await bumpClock(0);await sleep(10);
$('me').value='発案者';openCase(id1);await makeTemplate();await sleep(30);[...document.querySelectorAll('#md button')].find(b=>b.textContent==='公開する').click();await sleep(30);const t=Object.values(window.__tstore)[0];r.tplArtifact=t.acceptedArtifact?.version;r.tplBodyHasV2=(t.acceptedArtifact?.body||'').includes('3. 送る');r.tplNoNames=!JSON.stringify(t.acceptedArtifact).includes('提案者');
go('home');$('ifline').value='もし、二度目';$('benefit').value='仲間';await findTemplates();await sleep(20);const tid=Object.keys(window.__tstore)[0];previewTemplate(tid);await sleep(10);r.itemsWithArtifact=[...document.querySelectorAll('#md input[type=checkbox]')].length;applyTemplate(tid);await sleep(10);
$('me').value='発案者';go('home');$('ifline').value='もし、二度目';$('benefit').value='仲間';await post();await sleep(30);const id2=Object.keys(window.__store).slice(-1)[0];const c2=window.__store[id2];r.srcArtifact=c2.sourceArtifact?.version;r.intake=c2.intake?.status;
openCase(id2);tab('accept');r.intakeUI=!!$('in-status');
/* 元案件で v3 を作っても適用先は変わらない */
$('in-status').value='修正して使用';$('in-target').value='';await saveIntake();await sleep(10);r.modifyNeedsTarget=(window.__store[id2].intake.status==='未確認');
$('in-status').value='不使用';$('in-reason').value='';await saveIntake();await sleep(10);r.unusedNeedsReason=(window.__store[id2].intake.status==='未確認');
$('in-status').value='そのまま使用';$('in-reason').value='そのまま';await saveIntake();await sleep(20);r.intakeSaved=window.__store[id2].intake.status;
/* 競合：フォーム表示後に他者更新 → deliver 拒否・入力保持 */
$('me').value='提案者';renderCase();$('pp-seat').value='BUILD';$('pp-price').value='1';$('pp-days').value='1';$('pp-text').value='x';await propose();await sleep(10);$('me').value='発案者';renderCase();await pick(window.__store[id2].bids.slice(-1)[0].id);await sleep(10);await sit('BUY');await sleep(20);
renderCase();tab('accept');$('del-name').value='二度目手順';$('del-body').value='本文';window.__store[id2].rev=(window.__store[id2].rev||0)+5;cases[id2].rev=window.__store[id2].rev;await deliver();await sleep(10);r.conflictBlocked=(window.__store[id2].artifacts||[]).length===0;r.inputKept=$('del-name').value==='二度目手順';
await deliver();await sleep(20);r.afterRetry=(window.__store[id2].artifacts||[]).length;
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);
})();
