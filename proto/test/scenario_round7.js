
(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },12000);
try{
await sleep(30);
/* 参加者登録：同名2人 */
pickMe('__new');$('new-name').value='けん';await registerMe();await sleep(20);const idA=myId;pickMe('__new');$('new-name').value='けん';await registerMe();await sleep(20);const idB=myId;r.two=Object.keys(window.__pstore).length;r.nameA=dispName(window.__pstore[idA]?{id:idA,...window.__pstore[idA]}:null);r.nameB=me();r.distinct=r.nameA!==r.nameB;
r.persisted=localStorage.getItem('ifbox.pid')===idB;
/* サンプルと実案件 */
window.__store['s99']={title:'もし、サンプル',benefit:'x',owner:'例：さくら',createdAt:Date.now()-2e6,stage:1,domain:'例',reframed:'もし、例',firstMove:'',payers:[],lines:[],seats:newSeats('例：さくら'),actions:[],bids:[],messages:[],cf:null,fund:null,criteria:[{id:'k0',text:'基準A'}],deliveries:[{id:'d0',version:1,note:'x',by:'例',t:1,accepted:true}],artifacts:[],checks:[],ledger:[],notices:[],likes:[],dist:null,objections:[],archived:false,sample:true,log:[],measurement:{activeMinutes:100,effortBasis:'measured'},rev:0};
cases['s99']=window.__store['s99'];renderChips();chip='real';renderGrid();r.realCount=document.querySelectorAll('#grid .pc').length;chip='sample';renderGrid();r.sampleCount=document.querySelectorAll('#grid .pc').length;
openCase('s99');r.startBtn=!!$('c-tools').querySelector('button');startFromSample();await sleep(10);r.prefilled=$('ifline').value;await post();await sleep(30);const id=Object.keys(window.__store).find(k=>k!=='s99');const c=window.__store[id];r.cloned=c.clonedFrom;r.kind=c.kind;r.crit=c.criteria.length;r.noDeliveries=(c.deliveries||[]).length;r.noMeasure=c.measurement.activeMinutes;r.ownerId=c.ownerId===idB;
/* 保管と復元 */
openCase(id);archiveCase();$('arc-reason').value='';await doArchive(c.rev||0);await sleep(10);r.needReason=!window.__store[id].archived;
$('arc-reason').value='誤投稿';window.__store[id].rev=(window.__store[id].rev||0)+1;cases[id].rev=window.__store[id].rev;await doArchive(0);await sleep(10);r.conflictBlocked=!window.__store[id].archived;
openCase(id);archiveCase();$('arc-reason').value='誤投稿';await doArchive(window.__store[id].rev||0);await sleep(20);r.archived=window.__store[id].archived;
chip='real';go('home');renderGrid();r.hiddenFromGrid=document.querySelectorAll('#grid .pc').length;
openCase(id);await like();await sleep(10);r.editBlocked=(window.__store[id].likes||[]).length===0;r.artifactsKept=Array.isArray(window.__store[id].artifacts);
go('archive');r.manualList=$('arc-manual').textContent.includes('誤投稿');
await restoreCase(id);await sleep(20);r.restored=!window.__store[id].archived;await like();await sleep(10);r.editAfterRestore=(window.__store[id].likes||[]).length===1;
/* サンプルは比較対象外 */
window.__store[id].reuse={sourceCaseId:'s99',initialRate:50,applied:1,eligible:2};cases[id]=window.__store[id];openCase(id);tab('compare');r.sampleExcluded=$('c-compare').querySelector('.box.warn')?.textContent.includes('サンプル');
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);
})();
