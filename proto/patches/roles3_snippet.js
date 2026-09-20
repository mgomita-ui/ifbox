
/* ===================== 第13回：役割を3つに（つくる／確かめて良くする／ひろめる）・複数人・最初から設定・2つの入口・外部販売 ===================== */
const ROLES=[['MAKE','つくる','アイデアを形にする。場所や道具を出すのもここ。AIが下準備を手伝います。'],['CHECK','確かめて良くする','買う側の目で、約束どおりか確かめ、良くなる点を返す。つくる人とは兼ねられません。AIが確認表を下書きします。'],['SPREAD','ひろめる','欲しい人を探し、届ける準備をする。告知、販路、紹介。AIが下準備を手伝います。']];
const RNAME=Object.fromEntries(ROLES.map(r=>[r[0],r[1]]));
const ROLE_OF={OWN:'MAKE',BUILD:'MAKE',SITE:'MAKE',ACC:'CHECK',SELL:'SPREAD',MAKE:'MAKE',CHECK:'CHECK',SPREAD:'SPREAD'};
const SEAT_OF={MAKE:'BUILD',CHECK:'ACC',SPREAD:'SELL'};
/* 旧6席の呼び名を新しい言葉に寄せる */
SNAME.OWN='つくる（言い出した人）'; SNAME.BUILD='つくる'; SNAME.SITE='つくる（場所・道具）'; SNAME.SELL='ひろめる'; SNAME.ACC='確かめて良くする'; SNAME.BUY='買う人';
SEATS.forEach(s=>{ s[1]=SNAME[s[0]]; }); try{ fillSeatSelects(); }catch(e){}
function teamOf(c){ const base=c.team||{}; const t={}; ROLES.forEach(([r])=>{ const b=base[r]||{}; t[r]={n:+b.n||1,desc:b.desc||'',hours:b.hours||'',share:b.share||'',need:b.need!==false,members:(b.members||[]).map(m=>({...m}))}; });
  const add=(r,name,extra)=>{ if(!name||/^支援者/.test(name)) return; if(!t[r].members.some(m=>m.name===name)) t[r].members.push({name,since:now(),...(extra||{})}); };
  if(!t.MAKE.members.some(m=>m.name===c.owner)) t.MAKE.members.unshift({name:c.owner,id:c.ownerId||null,task:'言い出した人',lead:true,since:c.createdAt});
  for(const [k] of SEATS){ const s=c.seats?.[k]; if(k==='OWN'||k==='BUY'||!s||s.t!=='hu') continue; add(ROLE_OF[k],s.n,k==='SITE'?{task:'場所・道具'}:null); }
  /* 旧データの募集内容を引き継ぐ */
  if(!c.team&&c.roles){ for(const k of Object.keys(c.roles)){ const r=ROLE_OF[k]; const o=c.roles[k]; if(r&&o){ t[r].desc=t[r].desc||o.desc||''; t[r].hours=t[r].hours||o.hours||''; t[r].share=t[r].share||o.share||''; if(o.need===false&&k!=='SITE') t[r].need=false; } } }
  ROLES.forEach(([r])=>{ t[r].n=Math.max(t[r].n,t[r].members.length); if(t[r].members.length&&!t[r].members.some(m=>m.lead)) t[r].members[0].lead=true; });
  return t; }
function inRole(c,r,name){ return teamOf(c)[r].members.some(m=>m.name===name); }
function roleRoom(c,r){ const x=teamOf(c)[r]; return x.n-x.members.length; }
function syncSeats(c,team){ const seats={...c.seats};
  const keep=(k,r,skipOwner)=>{ const s=seats[k]; if(s?.t==='hu'&&team[r].members.some(m=>m.name===s.n)) return s; const m=team[r].members.find(x=>!(skipOwner&&x.name===c.owner)); return m?{t:'hu',n:m.name,since:m.since||now()}:emptySeat(k); };
  seats.BUILD=keep('BUILD','MAKE',true); seats.ACC=keep('ACC','CHECK'); seats.SELL=keep('SELL','SPREAD');
  if(seats.SITE?.t==='hu'&&!team.MAKE.members.some(m=>m.name===seats.SITE.n)) seats.SITE=emptySeat('SITE');
  return seats; }
function joinCheck(c,r,name){ const t=teamOf(c); if(t[r].members.some(m=>m.name===name)) return 'すでにこの役割に入っています'; if(t[r].n-t[r].members.length<=0) return RNAME[r]+'の枠は埋まっています';
  if(r==='CHECK'&&t.MAKE.members.some(m=>m.name===name)) return 'つくる人は「確かめて良くする」を兼ねられません'; if(r==='MAKE'&&t.CHECK.members.some(m=>m.name===name)) return '「確かめて良くする」人は、つくる役割を兼ねられません'; return ''; }
function joinPatch(c,r,name,id,task){ const t=teamOf(c); t[r].members.push({name,id:id||null,task:task||'',since:now(),lead:!t[r].members.length}); const patch={team:t,seats:syncSeats(c,t)}; if(r==='MAKE'&&name!==c.owner&&c.stage<1) patch.stage=1; return patch; }
function checkerName(c){ const t=teamOf(c).CHECK.members; if(t.some(m=>m.name===me())) return me(); return t[0]?.name||null; }
/* 状態の判定を役割ベースに */
function neededRoles(c){ const t=teamOf(c); return ROLES.map(r=>r[0]).filter(r=>t[r].need); }
function teamFilled(c){ const t=teamOf(c); return neededRoles(c).filter(r=>t[r].members.length>=t[r].n).length; }
function openRoleNames(c){ const t=teamOf(c); return neededRoles(c).filter(r=>t[r].members.length<t[r].n).map(r=>RNAME[r]+(t[r].n>1?' あと'+(t[r].n-t[r].members.length)+'名':'')); }

/* ---------- 役割カード（3枚） ---------- */
function roleCard3(c,r){ const t=teamOf(c)[r], owner=c.owner===me(), room=t.n-t.members.length; const def=ROLES.find(x=>x[0]===r)[2]; const applied=(c.messages||[]).some(m=>m.kind==='can'&&ROLE_OF[m.seat]===r&&m.by===me()&&!t.members.some(x=>x.name===me()));
  const members=t.members.map(m=>`<div class="rc-who"><span class="av2" style="background:hsl(${hue(m.name)} 55% 42%)">${esc(String(m.name).slice(0,1))}</span><b>${esc(m.name)}</b>${m.lead&&t.members.length>1?'<span class="tag bl">取りまとめ</span>':''}${m.task?`<span class="sm">${esc(m.task)}</span>`:''}${typeof rankTagByName==='function'?rankTagByName(m.name):''}</div>`).join('');
  const slots=room>0?`<div class="rc-who"><span class="av2 ${r==='CHECK'?'em':'ai'}">${r==='CHECK'?'空':'AI'}</span><span>あと<b>${room}</b>名 募集中${r==='CHECK'?'':'（その間はAIが下準備）'}</span></div>`:'';
  const btn=owner?`<button class="btn ghost sm" onclick="editRole('${r}')">募集内容と人数</button>${room>0?`<button class="btn ghost sm" onclick="openOffer()">会員にオファー</button>`:''}`:(t.members.some(m=>m.name===me())?'<span class="tag ok">参加中</span>':applied?'<span class="tag ok">手を挙げました</span>':room>0?`<button class="btn sm" onclick="applyRole('${r}')">この役割に手を挙げる</button>`:'');
  return `<div class="rc ${room>0?'ai':'hu'}"><div class="rc-h"><b>${RNAME[r]}</b>${room>0?`<span class="tag ai">募集中 ${t.members.length}/${t.n}</span>`:`<span class="tag hu">決定 ${t.members.length}/${t.n}</span>`}</div><p>${esc(t.desc||def)}</p><div class="rc-meta">${t.hours?`<span>稼働 ${esc(t.hours)}</span>`:''}<span>取り分 ${esc(t.share||'相談')}</span>${t.need?'':'<span>必要なときだけ</span>'}</div>${members}${slots}<div class="rc-ft">${btn}</div></div>`; }
function editRole(k){ const c=cases[cur], r=ROLE_OF[k]||k, t=teamOf(c)[r]; const def=ROLES.find(x=>x[0]===r)[2];
  md(`<h3>${RNAME[r]}の募集内容</h3><label class="lb">やること</label><textarea id="ro-desc">${esc(t.desc||def)}</textarea>
  <div class="row"><span class="sm" style="width:90px">人数</span><input class="f num" id="ro-n" type="number" min="${Math.max(1,t.members.length)}" value="${t.n}" style="width:80px"><span class="sm">いま ${t.members.length}名</span></div>
  <div class="row"><span class="sm" style="width:90px">期待する稼働</span><input class="f" id="ro-hours" value="${esc(t.hours)}" placeholder="例 週3時間・1か月" style="flex:1"></div>
  <div class="row"><span class="sm" style="width:90px">取り分</span><input class="f" id="ro-share" value="${esc(t.share)}" placeholder="例 確定対価2万円＋成果の20%" style="flex:1"></div>
  <div class="row"><label class="sm"><input type="checkbox" id="ro-need" ${t.need?'checked':''}> この役割が揃わないと始められない</label></div>
  ${t.members.length?`<label class="lb">メンバー（担当と取りまとめ役）</label>${t.members.map((m,i)=>`<div class="row" style="margin-top:4px"><label class="sm"><input type="radio" name="ro-lead" value="${i}" ${m.lead?'checked':''}> 取りまとめ</label><b style="min-width:80px">${esc(m.name)}</b><input class="f" id="ro-task-${i}" value="${esc(m.task||'')}" placeholder="担当（例 デザイン）" style="flex:1">${m.name!==c.owner?`<button class="btn ghost sm" onclick="removeMember('${r}',${i})">外す</button>`:''}</div>`).join('')}`:''}
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveRole('${r}')">保存する</button></div>`); }
async function saveRole(k){ const c=cases[cur], r=ROLE_OF[k]||k; if(c.owner!==me()){ toast('募集内容は言い出した人が書きます'); return; } const t=teamOf(c); const n=Math.max(t[r].members.length,1,Math.floor(+$('ro-n').value||1)); const lead=+(document.querySelector('input[name="ro-lead"]:checked')?.value??0);
  t[r]={...t[r],desc:$('ro-desc').value.trim(),n,hours:$('ro-hours').value.trim(),share:$('ro-share').value.trim(),need:$('ro-need').checked,members:t[r].members.map((m,i)=>({...m,task:($('ro-task-'+i)?.value||'').trim(),lead:i===lead}))};
  await save({team:t,seats:syncSeats(c,t)}, me()+' が「'+RNAME[r]+'」の募集内容を決めた（'+n+'名）'); closeMd(); }
async function removeMember(r,i){ const c=cases[cur]; if(c.owner!==me()) return; const t=teamOf(c); const m=t[r].members[i]; if(!m||m.name===c.owner) return; t[r].members.splice(i,1); const seats={...c.seats}; for(const [k] of SEATS){ if(ROLE_OF[k]===r&&k!=='OWN'&&seats[k]?.t==='hu'&&seats[k].n===m.name) seats[k]=emptySeat(k); }
  await save({team:t,seats:syncSeats({...c,seats},t),notices:notice(c,[m.name],'seated','「'+RNAME[r]+'」の役割から外れました','msgs')}, me()+' が '+m.name+' を「'+RNAME[r]+'」から外した'); closeMd(); }
function applyRole(k){ const c=cases[cur], r=ROLE_OF[k]||k; if(!participantsAll[myId]){ toast('右上の「あなた」から参加者を選ぶか登録してください'); return; } const why=joinCheck(c,r,me()); if(why){ toast(why); return; }
  md(`<h3>「${RNAME[r]}」に手を挙げる</h3><p class="sm">できること・持っているもの（技能・販路・場所・資格・実績）を一言。言い出した人が迎えると参加が決まります。スレッドにも載ります。</p><textarea id="ap-text" placeholder="例）飲食店20軒に紹介できます。週3時間なら動けます。"></textarea>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="sendApply('${r}')">手を挙げる</button></div>`); }
async function sendApply(k){ const c=cases[cur], r=ROLE_OF[k]||k, text=$('ap-text').value.trim(); if(!text){ toast('一言添えてください'); return; } const why=joinCheck(c,r,me()); if(why){ toast(why); closeMd(); return; }
  await save({messages:(c.messages||[]).concat([{by:me(),byId:meId()||null,text,t:now(),kind:'can',seat:SEAT_OF[r],role:r}]),notices:notice(c,[c.owner],'can',me()+' が「'+RNAME[r]+'」に手を挙げました','msgs')}, me()+' が「俺これできる」と'+RNAME[r]+'の席を名乗った'); closeMd(); toast('手を挙げました。言い出した人が迎えると参加が決まります。'); }
async function sitFromCan(i){ const c=cases[cur]; const m=(c.messages||[])[i]; if(!m||m.kind!=='can') return; if(c.owner!==me()){ toast('迎えるのは言い出した人が決めます'); return; } const r=m.role||ROLE_OF[m.seat]; const why=joinCheck(c,r,m.by); if(why){ toast(why); return; }
  const patch=joinPatch(c,r,m.by,m.byId,''); patch.notices=notice(c,[m.by],'seated','「'+RNAME[r]+'」の仲間として迎えられました','msgs'); await save(patch, me()+'（発案者）が '+m.by+' を'+RNAME[r]+'の席に迎えた（スレッドの名乗りから）'); toast(m.by+' さんが仲間になりました。'); }
async function sit(k,who){ let c=cases[cur]; const name=who||me(); if(k==='BUY'){ const seats={...c.seats,BUY:{t:'hu',n:name,since:now()}}; const patch={seats}; let msg=name+' が買う人として席に座った'; if(c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; stampStage(patch,c,2); } await save(patch,msg); closeMd(); return; }
  const r=ROLE_OF[k]; const t0=teamOf(c);
  if(t0[r].members.some(m=>m.name===name)){ if(c.seats?.[k]?.t==='hu'){ toast('すでにこの役割に入っています'); return; } await save({seats:{...c.seats,[k]:{t:'hu',n:name,since:now(),packet:window._pk||null}}}, name+' が'+SNAME[k]+'の席に座った'); window._pk=null; closeMd(); return; }
  if(t0[r].n-t0[r].members.length<=0&&c.seats?.[k]?.t!=='hu'&&c.owner===me()){ t0[r].n+=1; c={...c,team:t0}; }
  const why=joinCheck(c,r,name); if(why){ toast(why); return; } const patch=joinPatch(c,r,name,who?null:meId(),k==='SITE'?'場所・道具':''); if(k==='SITE') patch.seats={...patch.seats,SITE:{t:'hu',n:name,since:now()}}; window._pk=null; await save(patch,name+' が'+RNAME[r]+'の席に座った'); closeMd(); toast(name+' が「'+RNAME[r]+'」に入りました。'); }
async function leave(k){ const c=cases[cur]; const who=c.seats[k]?.n; const r=ROLE_OF[k]; const t=teamOf(c); if(r&&who){ t[r].members=t[r].members.filter(m=>m.name!==who||m.name===c.owner); } const seats={...c.seats,[k]:emptySeat(k)}; await save({team:t,seats:syncSeats({...c,seats},t)}, (who||me())+' が'+SNAME[k]+'の席を降りた。'); closeMd(); }
async function revert(k){ const c=cases[cur]; const who=c.seats[k]?.n; const r=ROLE_OF[k]; const t=teamOf(c); if(r&&who){ t[r].members=t[r].members.filter(m=>m.name!==who||m.name===c.owner); } const seats={...c.seats,[k]:emptySeat(k)}; await save({team:t,seats:syncSeats({...c,seats},t)}, SNAME[k]+'の席を期限超過でAIに戻した（前任 '+who+'）'); closeMd(); }
/* オファー：枠のある役割と「買う人」 */
function openOffer(pid){ const c=cases[cur]; if(!c) return; const list=Object.values(participantsAll).filter(p=>p.id!==myId); if(!list.length){ toast('オファーを送れる参加者がいません'); return; }
  const opts=ROLES.filter(([r])=>roleRoom(c,r)>0).map(([r,n])=>[SEAT_OF[r],n+'（あと'+roleRoom(c,r)+'名）']); if(c.seats?.BUY?.t!=='hu') opts.push(['BUY','買う人（まとめて買う）']); if(!opts.length){ toast('空いている枠がありません'); return; }
  md(`<h3>会員にオファーを送る</h3><p class="sm">紹介動画や一言を見て「この人に入ってほしい」と思ったら送ります。受けるか辞退するかは相手が決めます。プロジェクト：${esc(c.title)}</p>
  <div class="row"><select class="f" id="of-to" style="flex:1">${list.map(p=>`<option value="${p.id}" ${p.id===pid?'selected':''}>${esc(dispName(p))}${rankOf(p)==='member'?'（会員）':'（一般）'}</option>`).join('')}</select><select class="f" id="of-seat">${opts.map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select></div>
  <textarea id="of-text" placeholder="なぜこの人に。何をお願いしたいか。" style="width:100%;margin-top:8px"></textarea>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="sendOffer()">オファーを送る</button></div>`); }
async function answerOffer(id,ok){ const c=cases[cur]; const o=(c.offers||[]).find(x=>x.id===id); if(!o||o.state!=='open') return; if(!((o.toId&&o.toId===meId())||o.to===me())){ toast('このオファーはあなた宛てではありません'); return; }
  const mark=(st,reason)=>c.offers.map(x=>x.id===id?{...x,state:st,reason:reason||x.reason,answeredAt:now()}:x);
  if(!ok){ await save({offers:mark('declined'),notices:notice(c,[o.by],'offer',me()+' が'+SNAME[o.seat]+'のオファーを辞退しました','msgs')}, me()+' が'+SNAME[o.seat]+'の席のオファーを辞退した'); return; }
  if(o.seat==='BUY'){ if(c.seats?.BUY?.t==='hu'){ toast('もう買う人が決まっています'); await save({offers:mark('declined','席が埋まった')}); return; } const patch={offers:mark('accepted'),seats:{...c.seats,BUY:{t:'hu',n:me(),since:now(),offerId:id}},notices:notice(c,[o.by],'offer',me()+' がオファーを受けて買う人になりました','msgs')}; let msg=me()+' がオファーを受けて買い手の席に座った'; if(c.stage<2){ patch.stage=2; msg+='。段階2「買い手あり」に上がった'; stampStage(patch,c,2); } await save(patch,msg); toast('受けました。'); return; }
  const r=ROLE_OF[o.seat]; const why=joinCheck(c,r,me()); if(why){ toast(why+'。オファーは流れました。'); await save({offers:mark('declined',why)}); return; }
  const patch=joinPatch(c,r,me(),meId(),''); patch.offers=mark('accepted'); patch.notices=notice(c,[o.by],'offer',me()+' がオファーを受けて「'+RNAME[r]+'」に入りました','msgs'); await save(patch, me()+' がオファーを受けて'+RNAME[r]+'の席に座った'); toast('仲間になりました。'); }

/* ---------- 最初からチームの形を決める（投稿の直後） ---------- */
function openTeamSetup(){ const c=cases[cur]; if(!c||c.owner!==me()) return; const t=teamOf(c);
  md(`<h3>チームの形を最初に決める</h3><p class="sm">3つの役割に、何人ずつ要るか。あなたは「つくる」に入っています。兼ねるのは自由ですが、つくる人は「確かめて良くする」を兼ねられません。あとから直せます。</p>
  <div class="row"><button class="btn ghost sm" onclick="aiTeamSetup()">AIに提案させる</button><span class="sm" id="ts-ai"></span></div>
  ${ROLES.map(([r,n,d])=>`<div class="box" style="background:var(--soft)"><div class="row" style="margin-top:0"><b style="min-width:130px">${n}</b><span class="sm">人数</span><input class="f num" id="ts-n-${r}" type="number" min="${Math.max(1,t[r].members.length)}" value="${t[r].n}" style="width:70px"><span class="sm">取り分</span><input class="f" id="ts-share-${r}" value="${esc(t[r].share)}" placeholder="例 成果の20%" style="flex:1;min-width:120px"></div><textarea id="ts-desc-${r}" style="margin-top:6px;min-height:48px" placeholder="${esc(d)}">${esc(t[r].desc)}</textarea></div>`).join('')}
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">あとで</button><button class="btn" onclick="saveTeamSetup()">この形で募集する</button></div>`); }
async function aiTeamSetup(){ const c=cases[cur]; const n=$('ts-ai'); n.textContent='提案中…'; let d=null;
  if(sample){ try{ d=await sample.json(`あなたは小さな事業チームの編成を助ける編集者です。次の「もし」を実現するチームを、3つの役割で提案してください。実在の企業名は出さない。金額は例。\nもし=${c.title}\n言い換え=${c.reframed||''}\n助かる人=${c.benefit||''}\n役割: MAKE=つくる（発案者は既にここにいる。追加で要る人数を含めた合計人数）, CHECK=確かめて良くする（つくる人以外）, SPREAD=ひろめる\n出力はこのJSONだけ: {"MAKE":{"n":1,"desc":"60字以内","share":"例"},"CHECK":{"n":1,"desc":"","share":""},"SPREAD":{"n":1,"desc":"","share":""}}`,{modelTier:'quick'}); }catch(e){} }
  if(!d||!d.MAKE){ d={MAKE:{n:2,desc:'最小の形を作る。言い出した人と、手を動かせる人がもう1人。',share:'確定対価＋成果の30%'},CHECK:{n:1,desc:'買う側の目で使ってみて、約束どおりか確かめ、直す点を返す。',share:'確定対価5,000円'},SPREAD:{n:1,desc:'最初に買ってくれそうな10人に届ける。販路や紹介先がある人。',share:'成果の20%'}}; }
  ROLES.forEach(([r])=>{ const x=d[r]||{}; const el=$('ts-n-'+r); if(el) el.value=Math.max(+el.min||1,Math.min(9,Math.floor(+x.n||1))); if($('ts-desc-'+r)) $('ts-desc-'+r).value=x.desc||''; if($('ts-share-'+r)) $('ts-share-'+r).value=x.share||''; }); n.textContent='提案を入れました。直してから決めてください。'; }
async function saveTeamSetup(){ const c=cases[cur]; if(c.owner!==me()) return; const t=teamOf(c); ROLES.forEach(([r])=>{ t[r].n=Math.max(t[r].members.length,1,Math.floor(+$('ts-n-'+r).value||1)); t[r].desc=$('ts-desc-'+r).value.trim(); t[r].share=$('ts-share-'+r).value.trim(); });
  await save({team:t,seats:syncSeats(c,t)}, me()+' がチームの形を決めた（'+ROLES.map(([r,n])=>n+t[r].n+'名').join('・')+'）'); closeMd(); toast('この形で仲間を募集します。'); }
const _post13=post; post=async function(){ const before=new Set(Object.keys(cases)); await _post13(); for(let i=0;i<30;i++){ const id=Object.keys(cases).find(k=>!before.has(k)&&cases[k].owner===me()); if(id){ openCase(id); openTeamSetup(); return; } await new Promise(r=>setTimeout(r,80)); } };

/* ---------- 2つの入口：つくる／おうえん ---------- */
let viewMode='make'; try{ viewMode=localStorage.getItem('ifbox.view')||'make'; }catch(e){}
function setView(v,keep){ viewMode=v; try{ localStorage.setItem('ifbox.view',v); }catch(e){} document.body.classList.toggle('v-back',v==='back'); document.querySelectorAll('#viewsw button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  const ht=document.querySelector('.hero .ht'), hs=document.querySelector('.hero .hs'); if(ht&&hs){ if(v==='back'){ ht.innerHTML='<span class="ac">もし、</span><br>を先に<br><span class="ac2">応</span>援する。'; hs.textContent='まだ世の中にないものを、できる前から応援する。気になる構想はフォロー、販売が始まったら先に買えます。'; } else { ht.innerHTML='<span class="ac">もし、</span><br>が社会を<br><span class="ac2">動</span>かす。'; hs.textContent='チームも商品も、揃う前から始められるクラウドファンディング。記事1本で、仲間もお金も募れます。'; } }
  const m=document.querySelector('.cta.main'), s=document.querySelector('.cta.sub'); if(m&&s){ const mb=m.querySelector('b'), md_=m.querySelector('.d'), sb=s.querySelector('b'), sd=s.querySelector('.d');
    if(v==='back'){ mb.innerHTML='販売中の<br>プロジェクトを見る'; md_.textContent='先に買って、できあがりを待つ'; m.onclick=()=>{ chip='st:selling';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid(); }; sb.innerHTML='構想を<br>フォローする'; sd.textContent='仲間募集中・準備中の構想。販売開始をお知らせします'; s.onclick=()=>{ chip='st:recruiting';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid(); }; }
    else { mb.innerHTML='新しい「もし」を<br>置いてみる'; md_.textContent='一行でいい。AIが記事を下書きし、仲間もお金も同じページで募れる'; m.onclick=()=>showPost(true); sb.innerHTML='仲間として<br>参加する'; sd.textContent='「仲間募集中」のプロジェクトで、役割に手を挙げる'; s.onclick=()=>{ chip='st:recruiting';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid(); }; } }
  if(!keep){ const has=k=>Object.values(cases).some(c=>!c.archived&&projStatus(c)===k); chip=v==='back'?(has('selling')?'st:selling':'all'):'all'; } try{ renderChips(); renderGrid(); renderHome(); if(cur&&cases[cur]) renderCase(); }catch(e){} }
(function(){ if($('viewsw')) return; const nav=document.querySelector('.top nav'); if(!nav) return; const d=document.createElement('div'); d.id='viewsw'; d.className='viewsw'; d.innerHTML='<button data-v="make" onclick="setView(\'make\')">つくる</button><button data-v="back" onclick="setView(\'back\')">おうえん</button>'; nav.insertAdjacentElement('beforebegin',d); setTimeout(()=>setView(viewMode,true),0); })();

/* ---------- 外部のクラファンサイトで売る ---------- */
function extOf(c){ return c.cf?.external||null; }
function openSaleForm(){ const c=cases[cur]; if(c.owner!==me()){ toast('先行販売は言い出した人が始めます'); return; } if(cfLive(c)){ toast('すでに先行販売中です'); return; }
  md(`<h3>先行販売を始める</h3><p class="sm">同じ記事がそのまま販売の案内になります。仲間の名前と役割も載ります。</p>
  <div class="row"><span class="sm" style="width:100px">販売先</span><select class="f" id="sa-where" onchange="$('sa-ext').hidden=this.value!=='ext'"><option value="ext">外部のクラファンサイト</option><option value="own">IFBOXの中（模擬・決済なし）</option></select></div>
  <div id="sa-ext"><div class="row"><span class="sm" style="width:100px">サイト名</span><input class="f" id="sa-site" placeholder="例 Makuake / CAMPFIRE" style="flex:1"></div><div class="row"><span class="sm" style="width:100px">ページのURL</span><input class="f" id="sa-url" placeholder="https://…" style="flex:1"></div><p class="sm">注文と決済は外部サイトで行われます。IFBOXには、構想・チーム・進み具合・約束・購入先を残します。外部で売る場合、IFBOXへの支払いはありません。</p></div>
  <div class="row"><span class="sm" style="width:100px">目標額（円）</span><input class="f num" id="sa-goal" type="number" value="${c.cf?.goal||120000}" style="width:140px"></div>
  <div class="row"><span class="sm" style="width:100px">期間（日）</span><input class="f num" id="sa-days" type="number" value="30" style="width:140px"></div>
  <div class="row"><span class="sm" style="width:100px">成立の条件</span><select class="f" id="sa-mode"><option value="aon">目標に届いたときだけ成立</option><option value="allin">届かなくても申込分は成立</option></select></div>
  ${teamFilled(c)<neededRoles(c).length?'<div class="box warn">まだ揃っていない役割があります。買う人は「誰が作り、誰が確かめるか」を見ます。</div>':''}
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="startSale()">始める</button></div>`); }
async function startSale(){ const c=cases[cur]; const where=$('sa-where').value, goal=+$('sa-goal').value||0, days=Math.min(150,+$('sa-days').value||30), mode=$('sa-mode').value; if(goal<=0){ toast('目標額を入れてください'); return; }
  let external=null; if(where==='ext'){ const site=$('sa-site').value.trim(), url=$('sa-url').value.trim(); if(!site||!/^https?:\/\//.test(url)){ toast('外部サイトの名前と、http から始まるURLを入れてください'); return; } external={site,url}; } else if(!tiersOf(c).length){ closeMd(); openTierForm(); toast('IFBOXの中で売るには、まずリターンを1つ作ってください'); return; }
  const tiers=(c.cf?.tiers||[]).length?c.cf.tiers:tiersOf(c); await save({cf:{...(c.cf||{}),tiers,goal,mode,external,deadline:now()+days*DAY,open:true,draft:false,pledges:c.cf?.pledges||[],startedAt:now()},notices:notice(c,(c.followers||[]),'sale','フォロー中の「'+c.title+'」が先行販売を始めました'+(external?'（'+external.site+'）':''),'cf')}, me()+' が先行販売を始めた（'+(external?external.site:'IFBOX内・模擬')+'、目標 '+yen(goal)+'、'+days+'日）'); closeMd(); toast('先行販売を始めました。'); }
function openExtResult(){ const c=cases[cur], e=extOf(c); if(!e||c.owner!==me()) return; const p=(c.cf.pledges||[]).find(x=>x.ext)||{};
  md(`<h3>${esc(e.site)}での実績を記録する</h3><p class="sm">外部サイトの管理画面の数字を、人が写します。証憑（画面のURLや画像のURL）を残すと、あとの精算が楽になります。</p>
  <div class="row"><span class="sm" style="width:100px">合計額（円）</span><input class="f num" id="ex-amt" type="number" value="${p.amount||''}" style="width:140px"></div><div class="row"><span class="sm" style="width:100px">購入者数</span><input class="f num" id="ex-n" type="number" value="${p.count||''}" style="width:140px"></div><div class="row"><span class="sm" style="width:100px">証憑のURL</span><input class="f" id="ex-proof" value="${esc(p.proof||'')}" placeholder="https://…（任意）" style="flex:1"></div>
  <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">やめる</button><button class="btn" onclick="saveExtResult()">記録する</button></div>`); }
async function saveExtResult(){ const c=cases[cur], e=extOf(c); const amount=+$('ex-amt').value||0, count=Math.max(0,Math.floor(+$('ex-n').value||0)), proof=$('ex-proof').value.trim(); if(amount<=0){ toast('合計額を入れてください'); return; } if(proof&&!/^https?:\/\//.test(proof)){ toast('証憑は http から始まるURLを入れてください'); return; }
  const before=cfTotal(c); const pledges=(c.cf.pledges||[]).filter(x=>!x.ext).concat([{by:e.site+'の購入者 '+count+'人',amount,count,ext:true,proof,t:now(),recordedBy:me()}]); const patch={cf:{...c.cf,pledges}}; const total=pledges.reduce((s,p)=>s+(+p.amount||0),0); if(before<c.cf.goal&&total>=c.cf.goal) patch.notices=notice(c,[c.owner].concat(c.followers||[]),'proposal','「'+c.title+'」が目標に届きました','cf');
  await save(patch, me()+' が'+e.site+'の実績を記録した（'+yen(amount)+'・'+count+'人'+(proof?'・証憑あり':'')+'）'); closeMd(); }
function backerCount(c){ const ps=c.cf?.pledges||[]; return new Set(ps.filter(p=>!p.ext).map(p=>p.by)).size+ps.filter(p=>p.ext).reduce((s,p)=>s+(+p.count||0),0); }

/* ---------- プロジェクトページ（3役割・入口別の並び・外部販売） ---------- */
function renderProject(c){ const el=$('pj'); if(!el) return; const st=projStatus(c), a=articleOf(c), cf=c.cf, tiers=tiersOf(c), total=cfTotal(c), owner=c.owner===me(), ext=extOf(c);
  const pct=cf&&cf.goal?Math.round(total/cf.goal*100):0, left=cfLeftDays(c), live=cfLive(c), need=neededRoles(c), filled=teamFilled(c), ups=(c.updates||[]).slice().reverse(), fol=(c.followers||[]), following=fol.includes(me()), openR=openRoleNames(c);
  const buyBtn=live?(ext?`<a class="btn wide" style="display:block;text-align:center;text-decoration:none" href="${esc(ext.url)}" target="_blank" rel="noopener">${esc(ext.site)}で先に買う ↗</a>`:`<button class="btn wide" onclick="pjGo('pj-tiers')">リターンを選ぶ</button>`):'';
  const sidePanel=(cf&&!cf.draft)?`<div class="pj-amt">${yen(total)}</div><div class="pj-bar"><i style="width:${Math.min(100,pct)}%"></i></div>
      <div class="pj-meta"><div><b>${pct}%</b><span>目標 ${yen(cf.goal)}</span></div><div><b>${backerCount(c)}人</b><span>先に買った人</span></div><div><b>${live?left+'日':'終了'}</b><span>${live?'残り':fmtDate(cf.deadline)}</span></div></div>
      <p class="sm">${ext?'注文と決済は '+esc(ext.site)+' で行われます。金額は実行者が写した実績です。':''}${(cf.mode||'aon')==='aon'?'目標に届いたときだけ成立します。':'目標に届かなくても、申し込まれた分は成立します。'}</p>${buyBtn}
      ${ext&&owner?`<button class="btn ghost wide" style="margin-top:6px" onclick="openExtResult()">${esc(ext.site)}の実績を記録する</button>`:''}
      ${st==='funded'&&c.stage<2&&owner?`<button class="btn wide" style="margin-top:6px" onclick="confirmBuyers()">買い手として確定する（段階2へ）</button>`:''}`
    :`<div class="pj-amt">${filled}<small> / ${need.length} 役割が揃った</small></div><div class="pj-bar team"><i style="width:${need.length?Math.round(filled/need.length*100):100}%"></i></div>
      <p class="sm">${st==='recruiting'?'仲間を募集しています：'+esc(openR.join('、'))+'。揃うと、このページがそのまま先行販売の案内になります。':'役割が揃いました。先行販売の準備をしています。'}</p>
      ${st==='recruiting'&&viewMode!=='back'?`<button class="btn wide" onclick="pjGo('pj-team')">役割を見る・手を挙げる</button>`:''}${viewMode==='back'?`<button class="btn wide" onclick="toggleFollow()">${following?'フォロー中 ✓':'フォローして、販売開始を知る'}</button>`:''}
      ${owner?`<button class="btn wide ghost" style="margin-top:6px" onclick="openTeamSetup()">チームの形を決める</button><button class="btn wide ${st==='recruiting'?'ghost':''}" style="margin-top:6px" onclick="openSaleForm()">先行販売を始める</button>`:''}`;
  el.innerHTML=`<div class="pjx">
    <div class="pj-cover" style="${coverStyle(c)}">${coverImg(c)}<div class="pj-cv"><div>${stTag(c)}${isSample(c)?'<span class="pst st-pre">サンプル</span>':''}<span class="pst st-dom">${esc(c.domain||'領域未定')}</span>${ext&&cf&&!cf.draft?`<span class="pst st-dom">${esc(ext.site)}</span>`:''}</div><h1>${esc(c.reframed||c.title)}</h1><p>言い出した人 ${esc(c.owner)} ・ ${fmtDate(c.createdAt)} 公開</p></div></div>
   <div class="pj-main">
    <div class="pj-nav"><button onclick="pjGo('pj-story')">記事</button><button onclick="pjGo('pj-team')">チームと役割 <i>${filled}/${need.length}</i></button><button onclick="pjGo('pj-tiers')">${ext?'購入先':'リターン'} <i>${ext?1:tiers.length}</i></button><button onclick="pjGo('pj-ups')">活動報告 <i>${ups.length}</i></button><button onclick="pjThread()">スレッド <i>${(c.messages||[]).length}</i></button></div>
    <section id="pj-story" class="pj-sec"><div class="pj-h"><h2>この「もし」について</h2>${owner?`<button class="btn ghost sm" onclick="editArticle()">記事を整える</button>`:''}</div>
      <p class="pj-title">${esc(c.title)}</p><h4>なぜやるのか</h4><p>${esc(a.why)||'<span class="sm">まだ書かれていません。</span>'}</p><h4>誰が助かるのか</h4><p>${esc(a.who)||'<span class="sm">まだ書かれていません。</span>'}</p><h4>何を作るのか</h4><p>${esc(a.what)}</p>
      ${c.demo?`<h4>動くもの</h4><p>${/^https?:/.test(c.demo)?`<a href="${esc(c.demo)}" target="_blank" rel="noopener">${esc(c.demo)}</a>`:esc(c.demo)}</p>`:''}${(c.payers||[]).length&&viewMode!=='back'?`<h4>払う人の候補</h4><p>${c.payers.map(p=>`<span class="tag bl">${esc(p)}</span>`).join(' ')}</p>`:''}</section>
    <section id="pj-team" class="pj-sec"><div class="pj-h"><h2>${viewMode==='back'?'誰が作り、誰が確かめるのか':'チームと、募集中の役割'}</h2><span class="sm">${viewMode==='back'?'つくる人と確かめる人は、別の人です。':'役割で参加する。雇用の募集ではなく、取り分のある共同の仕事です。'}</span>${owner?`<button class="btn ghost sm" onclick="openTeamSetup()">チームの形</button>`:''}</div>
      <div class="rolegrid">${ROLES.map(([r])=>roleCard3(c,r)).join('')}</div></section>
    <section id="pj-tiers" class="pj-sec"><div class="pj-h"><h2>${ext?'購入先':'リターン ― お金で参加する'}</h2>${owner&&!ext?`<button class="btn ghost sm" onclick="openTierForm()">リターンを足す</button>`:''}</div>
      ${ext&&cf&&!cf.draft?`<div class="box info" style="margin-top:0"><b>${esc(ext.site)}</b> で${live?'先行販売中':'販売しました'}。注文と決済は外部サイトで行われます。<div class="row"><a class="btn" style="text-decoration:none" href="${esc(ext.url)}" target="_blank" rel="noopener">${esc(ext.site)}のページを開く ↗</a></div></div>`:''}
      ${tiers.length&&!ext?`<div class="tiergrid">${tiers.map(t=>tierCard(c,t,live)).join('')}</div>`:(!ext?`<p class="sm">リターンはまだありません。${st==='recruiting'?'仲間が揃ってから用意されます。気になる方はフォローしてください。':''}</p>`:'')}
      ${cf&&!cf.draft&&!ext?'<p class="sm" style="margin-top:8px">この試作では決済は行いません（模擬）。申し込みは「先に買う約束」として記録されます。目標達成は完成や提供の保証ではありません。</p>':''}</section>
    <section id="pj-ups" class="pj-sec"><div class="pj-h"><h2>活動報告</h2>${isTeam(c)?`<button class="btn ghost sm" onclick="openUpdateForm()">活動報告を書く</button>`:''}</div>
      ${ups.length?ups.map(u=>`<article class="upd"><div class="who"><b>${esc(u.title)}</b><span>${esc(u.by)} ・ ${fmtDT(u.t)}</span></div><p>${esc(u.body)}</p></article>`).join(''):'<p class="sm">まだ活動報告はありません。</p>'}</section>
    <section id="pj-risk" class="pj-sec"><div class="pj-h"><h2>リスクと、着手前に引く線</h2></div>${a.risks.length?`<ul class="pj-ul">${a.risks.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`:'<p class="sm">まだ書かれていません。</p>'}${a.faq.length?`<h4>よくある質問</h4>${a.faq.map(f=>`<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}`:''}</section>
   </div>
   <aside class="pj-side"><div class="card">${sidePanel}
      <div class="row" style="margin-top:10px"><button class="btn ghost sm" onclick="toggleFollow()">${following?'フォロー中 ✓':'フォローする'}</button><span class="sm">${fol.length}人がフォロー</span><button class="btn ghost sm" onclick="like()">共感 ${(c.likes||[]).length}</button></div>
      <div class="pj-stg">${STAGES.map((n,i)=>`<span class="${i<c.stage?'done':i===c.stage?'now':''}">${n}</span>`).join('')}</div>
      <p class="sm" style="margin-top:6px">段階は人の確定でだけ上がります。できあがりは「確かめて良くする」役割が、約束どおりか確かめます。</p></div></aside>
  </div>`; const w=$('workroom'); if(w) w.hidden=(viewMode==='back'&&!isTeam(c)); }
function isTeam(c){ const t=teamOf(c); return c.owner===me()||ROLES.some(([r])=>t[r].members.some(m=>m.name===me()))||participants(c).includes(me()); }

/* ---------- 一覧のカード（役割の行を3役割に） ---------- */
const _renderGrid13=renderGrid; renderGrid=function(){ _renderGrid13(); document.querySelectorAll('#grid .pcx').forEach(el=>{ const m=(el.getAttribute('onclick')||'').match(/openCase\('([^']+)'\)/); const c=m&&cases[m[1]]; if(!c) return; const lb=el.querySelector('.bar.team'); if(!lb) return; const need=neededRoles(c), filled=teamFilled(c); lb.querySelector('i').style.width=(need.length?Math.round(filled/need.length*100):100)+'%'; const t=lb.parentNode.querySelector('.lb2'); if(t) t.innerHTML=`<b>役割 ${filled}/${need.length}</b><span>${esc(openRoleNames(c).join('・')||'揃いました')}</span>`; }); };
