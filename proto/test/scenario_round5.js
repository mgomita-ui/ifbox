// ヘッドレス検証：第5回（時間・原価比較）＋第6回先行（版・差分）
(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};window.__r=r;setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },9000);
try{
async function runCase(title){ $('me').value='発案者';go('home');$('ifline').value=title;$('benefit').value='仲間';r.sub='posting';await post();await sleep(30);const id=Object.keys(window.__store).slice(-1)[0];openCase(id);r.sub='opened';
 if(!(window.__store[id].criteria||[]).length){tab('accept');$('crit-text').value='動く\n説明';await saveCriteria();await sleep(20);}
 $('me').value='提案者';renderCase();$('pp-seat').value='BUILD';$('pp-price').value='20000';$('pp-days').value='7';$('pp-text').value='作る';r.sub='proposing';await propose();await sleep(20);$('me').value='発案者';renderCase();r.sub='picking';await pick(window.__store[id].bids[0].id);await sleep(20);await sit('BUY');await sleep(20);
 $('me').value='検収人';renderCase();await sit('ACC');await sleep(20);$('me').value='提案者';renderCase();tab('accept');r.sub='deliver1';$('del-name').value='手順書';$('del-body').value='1. 開く';await deliver();await sleep(20);
 $('me').value='検収人';renderCase();tab('accept');const sel=[...document.querySelectorAll('select[data-cid]')];sel[0].value='0';await setCheck(sel[0]);await sleep(20);$('rej-reason').value='直して';await rejectDelivery();await sleep(20);
 $('me').value='提案者';renderCase();tab('accept');$('del-name').value='手順書';$('del-body').value='1. 開く 2. 送る';$('del-diff').value='';await deliver();await sleep(20);r.diffRequired=(window.__store[id].deliveries.length===1);$('del-diff').value='説明を足した';await deliver();await sleep(20);
 $('me').value='検収人';renderCase();tab('accept');for(const s of [...document.querySelectorAll('select[data-cid]')]){s.value='1';await setCheck(s);await sleep(15);}r.sub='accepting';await acceptAll();await sleep(20);r.sub='done';return id;}
r.step='case1';const id1=await runCase('もし、元');r.step='case1done';r.versions=window.__store[id1].deliveries.map(d=>d.version);r.real2=!!window.__store[id1].measurement.realStage2At;r.real4=!!window.__store[id1].measurement.realAcceptedAt;
r.step='settle';go('money');$('m-case').value=id1;$('m-price').value='30000';calc();await recordReceipt();await sleep(10);calc();await saveDist();await sleep(10);await bumpClock(8);await sleep(10);calc();await settle();await sleep(10);await bumpClock(0);await sleep(10);r.stage5=window.__store[id1].stage;
r.step='template';$('me').value='発案者';openCase(id1);await makeTemplate();await sleep(30);[...document.querySelectorAll('#md button')].find(b=>b.textContent==='公開する').click();await sleep(30);r.templates=Object.keys(window.__tstore).length;
r.step='find';go('home');$('ifline').value='もし、二度目';$('benefit').value='仲間';await findTemplates();await sleep(20);const tid=Object.keys(window.__tstore)[0];previewTemplate(tid);await sleep(10);applyTemplate(tid);await sleep(10);
r.step='case2';const id2=await runCase('もし、二度目');r.step='case2done';r.reuse=!!window.__store[id2].reuse;r.stage2b=window.__store[id2].stage;
r.step='compare';openCase(id2);tab('compare');r.why1=$('c-compare').querySelector('.box.warn')?.textContent.slice(0,30);
$('cp-scope').value='範囲';$('cp-qty').value='10人';$('cp-end').value='4';$('cp-rate').value='3000';await confirmComparison();await sleep(15);tab('compare');r.why2=$('c-compare').querySelector('.box.warn')?.textContent.slice(0,70);
openCase(id1);tab('compare');$('ms-min').value='300';$('ms-basis').value='measured';$('ms-ai').value='1000';$('ms-aib').value='measured';$('ms-mt').value='0';$('ms-mtb').value='measured';await saveMeasure();await sleep(15);
openCase(id2);tab('compare');$('ms-min').value='120';$('ms-basis').value='measured';$('ms-mt').value='0';$('ms-mtb').value='measured';$('ms-same').value='yes';$('ms-note').value='同じ';await saveMeasure();await sleep(15);tab('compare');r.why3=$('c-compare').querySelector('.box.warn')?.textContent.slice(0,60);
$('ms-ai').value='500';$('ms-aib').value='estimated';await saveMeasure();await sleep(15);tab('compare');r.result=$('c-compare').querySelector('.box.ok, .box.info')?.textContent.slice(0,160);
$('cp-change').value='数量変更';await changeComparison();await sleep(15);tab('compare');r.afterChange=$('c-compare').querySelector('.box.warn')?.textContent.slice(0,60);
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);
})();
