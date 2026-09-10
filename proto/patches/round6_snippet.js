/* ===================== 第6回：成果物の固定版と取り込み記録（C） ===================== */
/* 保存の競合防止：案件に rev を持ち、フォーム表示時の rev と違えば上書きしない */
window._formRev={};
const INTAKE=['未確認','そのまま使用','修正して使用','不使用'];
function participants(c){ return [...new Set([c.owner].concat(SEATS.map(([k])=>c.seats[k]).filter(s=>s?.t==='hu'&&s.n&&!/^支援者/.test(s.n)).map(s=>s.n)).concat((c.bids||[]).filter(b=>b.by!=='AI').map(b=>b.by)))]; }
function artifactOf(c,id){ return (c.artifacts||[]).find(a=>a.id===id); }
function showArtifact(id){ const c=cases[cur]; const a=artifactOf(c,id)||c.sourceArtifact; if(!a) return; md(`<h3>${esc(a.name||'成果物')} <span class="tag bl">v${a.version||'?'}</span></h3>${a.url?`<p class="sm"><a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.url)}</a></p>`:''}${a.summary?`<p class="sm">変更：${esc(a.summary)}</p>`:''}<pre style="white-space:pre-wrap;background:var(--soft);border-radius:8px;padding:10px;font-size:12.5px;max-height:50vh;overflow:auto">${esc(a.body||'（本文なし）')}</pre><p class="sm">登録：${esc(a.by||'')} ${a.t?fmtDT(a.t):''}${a.sourceCaseId?' ・ 出典：案件 '+esc(a.sourceCaseId)+' v'+a.version:''}</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">閉じる</button></div>`); }
function renderAccept(c){
  const el=$('c-accept'); if(!el) return; window._formRev[c.id]=c.rev||0;
  const crit=c.criteria||[]; const locked=!!c.criteriaLocked; const isOwner=c.owner===me();
  const dels=c.deliveries||[]; const last=dels[dels.length-1]; const checks=c.checks||[];
  const accName=c.seats.ACC?.t==='hu'?c.seats.ACC.n:null;
  let h='';
  /* 型から来た元成果物と取り込み記録 */
  if(c.sourceArtifact){ const it=c.intake||{status:'未確認'}; const arts=c.artifacts||[];
    h+=`<div class="box info" style="margin-top:0"><b>元案件の成果物（型で固定された本文）</b> <button class="btn ghost sm" onclick="showArtifact('src')">本文を見る</button><br><span class="sm">${esc(c.sourceArtifact.name||'')} v${c.sourceArtifact.version} ・ 出典 ${esc(c.sourceArtifact.sourceCaseId)}。元案件で新しい版が作られても、ここは変わりません。</span>
      <div class="row"><span class="sm" style="width:90px">取り込み担当</span><select class="f" id="in-assignee">${participants(c).map(p=>`<option value="${esc(p)}" ${it.assignee===p?'selected':''}>${esc(p)}</option>`).join('')}</select><span class="sm" style="width:70px;margin-left:8px">使用区分</span><select class="f" id="in-status">${INTAKE.map(s=>`<option ${it.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="row"><span class="sm" style="width:90px">適用先の版</span><select class="f" id="in-target"><option value="">（未指定）</option>${arts.map(a=>`<option value="${a.id}" ${it.targetVersionId===a.id?'selected':''}>v${a.version} ${esc(a.name)}</option>`).join('')}</select><input class="f" id="in-reason" placeholder="判断理由（不使用なら必須）" value="${esc(it.reason||'')}" style="flex:1;min-width:160px"><button class="btn sm" onclick="saveIntake()">記録</button></div>
      <p class="sm">担当は参加名から人が指定します。認証や権限ではありません。「修正して使用」は適用先の版を、「不使用」は理由を必ず入れます。初期再利用率は初期値のまま。ここは実際の使用記録です。</p></div>`; }
  h+=`<h3 style="margin-top:${c.sourceArtifact?'14px':'0'}">検収基準（着手前に公開）</h3>`;
  if(crit.length) h+=`<ol style="margin:4px 0 0;padding-left:1.4em;font-size:13px">${crit.map(x=>`<li>${esc(x.text)}</li>`).join('')}</ol>`; else h+=`<p class="sm">まだ基準がありません。発案者が1件以上置くと、提案の採用ができるようになります。</p>`;
  if(isOwner&&!locked) h+=`<textarea id="crit-text" placeholder="1行に1つ。例）飼い主30人が4週間記録できる／提案フードの購入導線がある" style="margin-top:8px">${esc(crit.map(x=>x.text).join('\n'))}</textarea><div class="row"><button class="btn sm" onclick="saveCriteria()">基準を確定して公開</button><span class="sm">最初の採用のあとは編集できません。</span></div>`;
  if(locked) h+=`<p class="sm">採用後のため編集できません。</p>`;
  /* 成果物の版 */
  const arts=c.artifacts||[];
  h+=`<h3 style="margin-top:14px">成果物の版（保存済みの版は上書きしない。修正は新しい版）</h3><p class="sm">取り込む権限：発案者（${esc(c.owner)}）。検収の確定は検収席。対象は短い本文と手順書。ファイル保管や外部URLの中身の取得はしません。</p>`;
  h+=arts.length?`<table><tr><th>版</th><th>名称</th><th>変更</th><th>登録</th><th></th></tr>${arts.slice().reverse().map(a=>`<tr><td><span class="tag ${a.accepted?'ok':'bl'}">v${a.version}</span></td><td>${esc(a.name)}</td><td class="sm">${esc(a.summary||'—')}</td><td class="sm">${esc(a.by)} ${fmtDate(a.t)}</td><td><button class="btn ghost sm" onclick="showArtifact('${a.id}')">本文</button></td></tr>`).join('')}</table>`:'<p class="sm">まだ版はありません。</p>';
  /* 納品 */
  h+=`<h3 style="margin-top:14px">納品（版を選んで人が確定）</h3>`;
  h+=dels.length?`<ul class="arc">${dels.slice().reverse().map(d=>{ const a=artifactOf(c,d.artifactId); return `<li><span><span class="tag ${d.accepted?'ok':d.rejected?'wn':'bl'}">v${d.version}</span> ${esc(d.by)}：${a?esc(a.name):(/^https?:/.test(d.note)?`<a href="${esc(d.note)}" target="_blank" rel="noopener">${esc(d.note)}</a>`:esc(d.note))}${d.diff?`<br><span class="sm">変更：${esc(d.diff)}</span>`:''} ${d.rejected?`<span class="tag wn">差し戻し</span> <span class="sm">${esc(d.reason||'')}</span>`:d.accepted?'<span class="tag ok">取り込み済み</span>':'<span class="tag bl">検収待ち</span>'}</span><span class="cnt">${fmtDT(d.t)}</span></li>`; }).join('')}</ul>`:'<p class="sm">まだ納品はありません。</p>';
  if(c.stage>=2&&(!last||last.rejected)){
    const v=arts.length+1;
    h+=`<div class="box" style="background:var(--soft)"><b style="font-size:13px">v${v} を登録して納品する</b>
      <div class="row"><input class="f" id="del-name" placeholder="名称（例 手順書 v${v}）" style="width:220px"><input class="f" id="del-note" placeholder="参考URL（任意）" style="flex:1;min-width:180px"></div>
      <textarea id="del-body" placeholder="本文（短いテキスト・手順書。検収はこの本文に対して行います）" style="margin-top:8px;min-height:80px"></textarea>
      ${arts.length?`<input class="f" id="del-diff" placeholder="前の版（v${arts.length}）からの変更（必須）" style="width:100%;margin-top:8px">`:''}
      <div class="row"><button class="btn sm" onclick="deliver()">v${v} を納品として確定する${c.stage<3?'（段階3）':''}</button><span class="sm">新しい版を登録しても、検収対象は自動で切り替わりません。差し戻し後の再納品は変更を必ず書きます。</span></div></div>`;
  }
  if(c.stage<2) h+=`<p class="sm">段階2「買い手あり」になると納品できます。</p>`;
  /* 検収 */
  if(last&&!last.rejected&&!last.accepted){
    const a=artifactOf(c,last.artifactId);
    h+=`<h3 style="margin-top:14px">検収チェック <span class="sm">対象：v${last.version}${a?' '+esc(a.name):''} ${accName?`（検収席：${esc(accName)}）`:'（検収席が空です。買い手側の人が座ってください）'}</span></h3>`;
    h+=`<table><tr><th>基準</th><th style="width:110px">結果</th><th>メモ</th></tr>${crit.map(x=>{ const ck=checks.find(k=>k.criterionId===x.id)||{}; return `<tr><td>${esc(x.text)}</td><td><select class="f" data-cid="${x.id}" onchange="setCheck(this)"><option value="">未確認</option><option value="1" ${ck.passed===true?'selected':''}>合格</option><option value="0" ${ck.passed===false?'selected':''}>不合格</option></select></td><td><input class="f" style="width:100%" data-note="${x.id}" value="${esc(ck.note||'')}" onchange="setCheck(this)" placeholder="メモ"></td></tr>`; }).join('')}</table>`;
    const allPass=crit.length&&crit.every(x=>checks.find(k=>k.criterionId===x.id)?.passed===true); const anyFail=checks.some(k=>k.passed===false);
    h+=`<div class="row"><button class="btn" ${allPass?'':'disabled'} onclick="acceptAll()">v${last.version} の検収を確定する（段階4）</button><input class="f" id="rej-reason" placeholder="差し戻しの理由（必須）" style="flex:1;min-width:160px"><button class="btn red sm" ${anyFail?'':'disabled'} onclick="rejectDelivery()">差し戻す</button></div><p class="sm">全項目が合格のときだけ確定できます。AIは検収を確定しません。検収席の名前の一致は誤操作防止で、本人確認ではありません。</p>`;
  }
  el.innerHTML=h;
}
async function deliver(){
  const c=cases[cur]; if(c.stage<2){ toast('買い手席が埋まってから納品できます'); return; }
  const name=($('del-name')?.value||'').trim(), url=($('del-note')?.value||'').trim(), body=($('del-body')?.value||'').trim(); const arts=c.artifacts||[]; const prev=arts.length; const diff=$('del-diff')?$('del-diff').value.trim():'';
  if(!name||!body){ toast('名称と本文を入れてください'); return; } if(prev&&!diff){ toast('前の版からの変更を書いてください'); return; }
  if((c.rev||0)!==(window._formRev[c.id]||0)){ const keep={name,url,body,diff}; toast('他の人がこの案件を更新しました。入力は保持しています。もう一度「確定」を押してください'); renderAccept(c); if($('del-name')){$('del-name').value=keep.name;$('del-note').value=keep.url;$('del-body').value=keep.body;if($('del-diff'))$('del-diff').value=keep.diff;} return; }
  const art={id:'v'+now(),version:prev+1,parentId:prev?arts[prev-1].id:null,name,body,url,summary:diff,by:me(),t:now(),accepted:false};
  const accName=c.seats.ACC?.t==='hu'?c.seats.ACC.n:c.owner;
  const patch={artifacts:arts.concat([art]),deliveries:(c.deliveries||[]).concat([{id:'d'+now(),version:art.version,artifactId:art.id,note:url,diff,by:me(),t:now(),rejected:false,accepted:false}]),checks:[],stage:Math.max(c.stage,3)};
  patch.notices=notice(c,[accName],'delivery',me()+' が v'+art.version+'「'+name+'」を納品しました。検収をお願いします','accept');
  await save(patch, me()+' が v'+art.version+'「'+name+'」を納品した'+(prev?'（変更：'+diff+'）':'（段階3）'));
}
async function acceptAll(){ const c=cases[cur]; const dels=c.deliveries.slice(); const last=dels[dels.length-1]; if(!last) return; dels[dels.length-1]={...last,accepted:true,acceptedBy:me(),acceptedAt:now()};
  const arts=(c.artifacts||[]).map(a=>a.id===last.artifactId?{...a,accepted:true}:a);
  const patch=stampStage({deliveries:dels,artifacts:arts,stage:Math.max(c.stage,4),acceptedBy:me(),acceptedAt:now()},c,4); patch.notices=notice(c,humanNames(c),'review',me()+' が v'+last.version+' の検収を確定しました（段階4）。配分の提示へ','money'); await save(patch, me()+' が v'+last.version+' の検収を確定した（段階4）'); }
async function saveIntake(){ const c=cases[cur]; const status=$('in-status').value, target=$('in-target').value, reason=$('in-reason').value.trim(), assignee=$('in-assignee').value; if(status==='修正して使用'&&!target){ toast('修正して使用のときは適用先の版を指定してください'); return; } if(status==='不使用'&&!reason){ toast('不使用のときは理由が必須です'); return; } await save({intake:{assignee,status,targetVersionId:target||null,reason,by:me(),t:now()}}, assignee+' が元成果物の使用区分を「'+status+'」にした'+(reason?'：'+reason:'')); }
/* save に rev を足す（同名の後方宣言で上書き） */
async function save(patch,logMsg){ const c=cases[cur]; if(!c) return; const log=(c.log||[]).concat(logMsg?[{t:now(),m:logMsg}]:[]); try{ await db.doc('cases/'+cur).update({...patch,log,rev:(c.rev||0)+1}); }catch(e){ toast('保存できません: '+(e.code||e.message)); } }
