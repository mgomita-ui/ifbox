// 第7回：参加者ID・サンプル分離・保管と復元
const fs = require('fs');
let h = fs.readFileSync('ifbox-proto.html', 'utf8'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

/* 名前欄 → 参加者選択（隠しinputで互換） */
rep(`  <div class="me"><span>あなたの名前</span><input id="me" placeholder="例：A" onchange="saveMe()"><span class="status" id="status">接続中…</span></div>`,
    `  <div class="me" id="mebox"><span>あなた</span><select id="me-sel" onchange="pickMe(this.value)"><option value="">（選ぶ）</option><option value="__new">＋ 新しく登録</option></select><span class="status" id="status">接続中…</span></div><input id="me" type="hidden">`);
/* 入口の注意 */
rep(`<span class="sm">段階は人の確定でだけ上がります。赤い角は成約済（買い手が決まった案件）。</span>`,
    `<span class="sm">段階は人の確定でだけ上がります。赤い角は成約済。参加者の選択は名札で、認証ではありません。機密情報・個人情報・実際の送金情報は入力しないでください。</span>`);
/* チップ：実案件／サンプル */
rep(`const all=[['all','すべて'],['open','席が空いている'],`, `const all=[['real','実案件'],['sample','サンプル'],['all','すべて'],['open','席が空いている'],`);
rep(`let db=null, sample=null, cases={}, cur=null, chip='all';`, `let db=null, sample=null, cases={}, cur=null, chip='real';`);
rep(`  if(chip==='open') list=list.filter(c=>openSeats(c).length>0);`,
    `  if(chip==='real') list=list.filter(c=>!isSample(c));\n  if(chip==='sample') list=list.filter(c=>isSample(c));\n  if(chip==='open') list=list.filter(c=>openSeats(c).length>0);`);
/* グリッドにサンプル印 */
rep(`<div class="mt">\${c.domain?\`<span class="tag bl">\${esc(c.domain)}</span>\`:''}`,
    `<div class="mt">\${isSample(c)?'<span class="tag em">サンプル</span>':''}\${c.domain?\`<span class="tag bl">\${esc(c.domain)}</span>\`:''}`);
/* 案件ヘッダー：サンプル表示・実案件を始める・保管へ移す */
rep(`  $('c-domain').textContent=c.domain||'領域未定';`,
    `  $('c-domain').textContent=(isSample(c)?'サンプル ・ ':'')+(c.domain||'領域未定');
  $('c-tools').innerHTML = (isSample(c)?\`<button class="btn ghost sm" onclick="startFromSample()">サンプルから実案件を始める</button>\`:'') + (c.archived?\`<span class="tag wn">保管中（\${esc(c.archiveReason||'')}）</span> <button class="btn ghost sm" onclick="restoreCase('\${c.id}')">戻す</button>\`:\`<button class="btn ghost sm" onclick="archiveCase()">保管へ移す</button>\`);`);
rep(`    <div id="c-test"></div>`, `    <div class="row" id="c-tools" style="margin-top:6px"></div>\n    <div id="c-test"></div>`);
/* 投稿：サンプル複製と real 区分、参加者ID */
rep(`  doc.measurement={stage2At:null,acceptedAt:null,settledAt:null,activeMinutes:null,effortBasis:'estimated',sameBenefit:'unconfirmed',comparisonNote:'',realCreatedAt:Date.now(),testClockUsed:!!CLOCK,aiCost:{amount:null,basis:'unknown'},materialCost:{amount:null,basis:'unknown'}};`,
    `  doc.measurement={stage2At:null,acceptedAt:null,settledAt:null,activeMinutes:null,effortBasis:'estimated',sameBenefit:'unconfirmed',comparisonNote:'',realCreatedAt:Date.now(),testClockUsed:!!CLOCK,aiCost:{amount:null,basis:'unknown'},materialCost:{amount:null,basis:'unknown'}};
  doc.kind='real'; doc.sample=false; doc.ownerId=meId()||null;
  if(window._fromSample){ doc.clonedFrom=window._fromSample.id; if(!doc.criteria.length&&window._fromSample.criteria.length) doc.criteria=window._fromSample.criteria.map((t,i)=>({id:'k'+i+'_'+now(),text:t})); doc.log.push({t:now(),m:'サンプル '+window._fromSample.id+' から投稿内容と検収基準だけを複製'}); window._fromSample=null; }`);
/* 接続時に参加者を購読、名前欄の互換 */
rep(`  fillSeatSelects(); subscribeClock(); subscribeTemplates();`, `  fillSeatSelects(); subscribeClock(); subscribeTemplates(); subscribeParticipants();`);
/* 保管庫画面：保管済み一覧を追加 */
rep(`    <div class="card"><h3>保管中</h3><ul class="arc" id="arc"></ul></div>`,
    `    <div class="card"><h3>保管へ移した案件（戻せます）</h3><ul class="arc" id="arc-manual"></ul><h3 style="margin-top:14px">反応がなく自動で保管中</h3><ul class="arc" id="arc"></ul></div>`);
rep(`  const quiet=list.filter(c=>now()-c.createdAt>ARCHIVE_DAYS*DAY && !reacted(c));`,
    `  $('arc-manual').innerHTML = list.filter(c=>c.archived).map(c=>\`<li><span>\${esc(c.title)} <span class="sm">\${esc(c.archiveReason||'')} ・ \${esc(c.archivedBy||'')}</span></span><span class="cnt">\${c.archivedAt?fmtDate(c.archivedAt):''} ・ <button class="btn ghost sm" onclick="openCase('\${c.id}')">開く</button> <button class="btn ghost sm" onclick="restoreCase('\${c.id}')">戻す</button></span></li>\`).join('')||'<li class="sm">ありません。</li>';
  const quiet=list.filter(c=>!c.archived && now()-c.createdAt>ARCHIVE_DAYS*DAY && !reacted(c));`);
/* 比較対象からサンプルを除く */
rep(`    const reasons=[]; const mis=condMismatch(c); reasons.push(...mis);`,
    `    const reasons=[]; if(isSample(c)||isSample(s)) reasons.push('サンプル案件は実利用の比較対象外'); const mis=condMismatch(c); reasons.push(...mis);`);
/* 取り込み担当に参加者IDを添える */
rep(`await save({intake:{assignee,status,targetVersionId:target||null,reason,by:me(),t:now()}},`,
    `const assigneeId=(Object.values(participantsAll).find(p=>dispName(p)===assignee)||{}).id||null; await save({intake:{assignee,assigneeId,status,targetVersionId:target||null,reason,by:me(),byId:meId()||null,t:now()}},`);

rep(`const me=()=>($('me').value.trim()||'名無し');`, `/* me() は第7回で参加者IDから決める */`);
h = h.replace(/<\/script>\s*$/, fs.readFileSync('round7_snippet.js','utf8') + '\n</script>\n');
fs.writeFileSync('ifbox-proto.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
