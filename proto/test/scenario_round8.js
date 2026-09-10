(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const errs=[];window.addEventListener('error',e=>errs.push(e.message));const r={};
setTimeout(()=>{ if(!document.getElementById('RESULT')){ const pre=document.createElement('pre'); pre.id='RESULT'; r.timeout=true; r.errors=errs; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);} },12000);
try{
await sleep(30);
window.__store['s99']={title:'もし、サンプル',benefit:'x',owner:'例：さくら',createdAt:Date.now()-2e6,stage:2,domain:'例',reframed:'もし、例',firstMove:'',payers:[],lines:[],seats:newSeats('例：さくら'),actions:[],bids:[],messages:[],cf:null,fund:null,criteria:[{id:'k0',text:'基準A'}],deliveries:[],artifacts:[],checks:[],ledger:[],notices:[],likes:[],dist:null,objections:[],archived:false,sample:true,log:[],measurement:{},rev:0};
cases['s99']=window.__store['s99'];chip='real';window._chipTouched=false; if(chip==='real'&&!Object.values(cases).some(c=>!isSample(c)&&!c.archived)) chip='all'; renderChips();renderGrid();r.defaultChip=chip;r.gridCount=document.querySelectorAll('#grid .pc').length;
pickMe('__new');$('new-name').value='けん';await registerMe();await sleep(20);
go('home');$('ifline').value='もし、手番';$('benefit').value='仲間';await post();await sleep(30);const id=Object.keys(window.__store).find(k=>k!=='s99');openCase(id);tab('accept');$('crit-text').value='動く';await saveCriteria();await sleep(20);
await sit('BUILD');await sleep(20);
cases[id].actions=[{id:'a1',seat:'BUILD',text:'古い行動',due:Date.now()-2*86400000,state:'open',by:'AI'}];window.__store[id].actions=cases[id].actions;
go('turns');r.hasStall=$('turns').textContent.includes('停滞');
cases[id].bids=[{id:'b1',seat:'SELL',by:'提案者',text:'x',price:1,days:1,won:false,t:Date.now()}];window.__store[id].bids=cases[id].bids;go('turns');r.hasUnadopted=$('turns').textContent.includes('未採用');
cases[id].archived=true;go('turns');r.archivedHidden=!$('turns').textContent.includes('もし、手番');cases[id].archived=false;
cases[id].reuse={sourceCaseId:'s99',initialRate:50,applied:1,eligible:2};cases[id].sourceArtifact={name:'手順書',version:1,body:'x',sourceCaseId:'s99'};cases[id].intake={assignee:'けん',status:'未確認'};openCase(id);tab('compare');r.secondItems=document.querySelectorAll('#c-second li').length;r.secondHead=$('c-second').querySelector('h3')?.textContent;
go('turns');r.intakeTurn=$('turns').textContent.includes('使用区分が未確認');
}catch(e){ r.exception=String(e&&e.stack||e); }
r.errors=errs; const pre=document.createElement('pre'); pre.id='RESULT'; pre.textContent=JSON.stringify(r); document.body.appendChild(pre);
})();
