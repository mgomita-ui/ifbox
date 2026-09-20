// 第13回の手直し2：チームの作業場の右側を3役割に揃える（段階の言葉・席→チーム・次の一手）
// 使い方: node patch_workroom.js <target html>
const fs = require('fs');
const target = process.argv[2];
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

rep(`<h3 style="margin-top:8px">段階</h3>`, `<h3 style="margin-top:8px">進み具合（チーム用）</h3>`);
rep(`<h3 style="margin-top:12px">席</h3>`, `<h3 style="margin-top:12px">チーム</h3>`);
rep(`<p class="sm" style="margin-top:6px">■人　■AIが準備中　□AIは座れない空席。赤枠は期限超過。クリックで座る・降りる。</p>`, `<p class="sm" style="margin-top:6px" id="c-seatnote">入る・募集内容を変えるのは、上の「チームと役割」のカードから。赤い印は、期限を過ぎた作業がある人です。</p>`);
rep(`  /* ===== 探す（一覧） ===== */`, `  /* ===== 作業場：チームの一覧 ===== */
  .wteam{display:flex;flex-direction:column;gap:6px;margin-top:8px}
  .wt{border:1.5px solid var(--line);border-radius:12px;padding:8px 10px;background:var(--paper)}
  .wt.open{border-style:dashed;border-color:var(--coral)}
  .wt-h{display:flex;align-items:center;gap:8px}.wt-h b{font-size:13.5px}.wt-h .cnt{margin-left:auto;font-size:11px;font-weight:700;color:var(--ink3);font-family:var(--latin)}.wt.open .wt-h .cnt{color:var(--coral)}
  .wt-m{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:4px;font-size:12px;color:var(--ink2)}.wt-m .late{color:var(--red);font-weight:700}.wt-m button{background:none;border:0;color:var(--ink3);font-size:11px;text-decoration:underline;padding:0;cursor:pointer}
  .stages .stg{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

  /* ===== 探す（一覧） ===== */`);

const FN = `
/* ===================== 作業場の右側を3役割に揃える ===================== */
STAGES[0]='構想'; STAGES[1]='形になった'; STAGES[2]='買う人がいる'; STAGES[3]='届けた'; STAGES[4]='確かめた'; STAGES[5]='分けた';
const STAGE_NOTE={0:'つくる役割に仲間が入るか、動くものができると「形になった」に進みます。',1:'まとめて買う人が決まるか、先行販売が目標に届いて言い出した人が確定すると「買う人がいる」に進みます。',2:'「納品・検収」タブで、できあがりを届けたと確定すると「届けた」に進みます。',3:'「確かめて良くする」役割の人が、全項目を確かめて確定すると「確かめた」に進みます。',4:'「配分」で受け取った額を記録し、分け方を示して7日待ち、精算すると「分けた」に進みます。',5:'分け終わりました（模擬）。'};
const ACT_LABEL={OWN:'つくる',BUILD:'つくる',SITE:'つくる',SELL:'ひろめる',ACC:'確かめる',BUY:'買う人'};
function fixWorkroom(c){ if(!c) return; const sn=$('c-stagenote'); if(sn) sn.textContent=STAGE_NOTE[c.stage]||'';
  const el=$('c-seats'); if(el){ const t=teamOf(c); const lateOf=name=>(c.actions||[]).some(a=>a.state==='open'&&a.due<now()&&c.seats?.[a.seat]?.n===name);
    el.className='wteam'; el.innerHTML=ROLES.map(([r,n])=>{ const x=t[r], room=x.n-x.members.length; return \`<div class="wt \${room>0?'open':''}"><div class="wt-h"><b>\${n}</b><span class="cnt">\${room>0?'あと'+room+'名 募集中':'決定'} \${x.members.length}/\${x.n}</span></div><div class="wt-m">\${x.members.map(m=>\`<span class="\${lateOf(m.name)?'late':''}">\${esc(m.name)}\${m.lead&&x.members.length>1?'（取りまとめ）':''}\${lateOf(m.name)?' ・期限超過':''}\${m.name===me()&&m.name!==c.owner?\` <button onclick="leaveRole('\${r}')">降りる</button>\`:''}</span>\`).join('')||'<span>まだ誰もいません'+(r==='CHECK'?'':'。AIが下準備中')+'</span>'}</div></div>\`; }).join('')
      + \`<div class="wt \${c.seats?.BUY?.t==='hu'?'':'open'}"><div class="wt-h"><b>買う人</b><span class="cnt">\${c.seats?.BUY?.t==='hu'?'決定':'先行販売か、まとめて買う人'}</span></div><div class="wt-m"><span>\${c.seats?.BUY?.t==='hu'?esc(c.seats.BUY.n):'まだいません'}</span>\${c.seats?.BUY?.t!=='hu'?\`<button onclick="seatClick('BUY')">まとめて買う</button>\`:''}</div></div>\`; }
  document.querySelectorAll('#c-acts li').forEach(li=>{ const k=li.querySelector('.k'); if(k&&ACT_LABEL[k.textContent.trim()]) k.textContent=ACT_LABEL[k.textContent.trim()]; li.querySelectorAll('button').forEach(b=>{ if(b.textContent.trim()==='✓'){ b.textContent='済'; b.title='完了にする'; } if(b.textContent.trim()==='募る'){ b.textContent='提案を募る'; } }); });
  const opt=[['BUILD','つくる'],['ACC','確かめて良くする'],['SELL','ひろめる'],['BUY','買う人']].map(([k,n])=>\`<option value="\${k}">\${n}</option>\`).join('');
  for(const id of ['na-seat','pp-seat']){ const s=$(id); if(s&&s.dataset.r3!=='1'){ const v=s.value; s.innerHTML=opt; s.value=['BUILD','ACC','SELL','BUY'].includes(v)?v:(id==='pp-seat'?'SELL':'BUILD'); s.dataset.r3='1'; } } }
async function leaveRole(r){ const c=cases[cur]; const t=teamOf(c); if(!t[r].members.some(m=>m.name===me())||me()===c.owner) return; t[r].members=t[r].members.filter(m=>m.name!==me()); const seats={...c.seats}; for(const [k] of SEATS){ if(ROLE_OF[k]===r&&k!=='OWN'&&seats[k]?.t==='hu'&&seats[k].n===me()) seats[k]=emptySeat(k); }
  await save({team:t,seats:syncSeats({...c,seats},t),notices:notice(c,[c.owner],'seated',me()+' が「'+RNAME[r]+'」の役割を降りました','msgs')}, me()+' が「'+RNAME[r]+'」の役割を降りた'); }
const _renderCase13=renderCase; renderCase=function(){ _renderCase13(); try{ fixWorkroom(cases[cur]); }catch(e){} };
`;
h = h.replace(/<\/script>\s*$/, FN + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
