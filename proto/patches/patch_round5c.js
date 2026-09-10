// 第5回（C）：成果物の版と差分、取り込み担当の明示
const fs = require('fs');
let h = fs.readFileSync('ifbox-proto.html', 'utf8'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

/* 納品一覧に版番号・差分・取り込み担当 */
rep("  h+=dels.length?`<ul class=\"arc\">${dels.slice().reverse().map(d=>`<li><span>${esc(d.by)}：${/^https?:/.test(d.note)?`<a href=\"${esc(d.note)}\" target=\"_blank\" rel=\"noopener\">${esc(d.note)}</a>`:esc(d.note)} ${d.rejected?`<span class=\"tag wn\">差し戻し</span> <span class=\"sm\">${esc(d.reason||'')}</span>`:d.accepted?'<span class=\"tag ok\">検収済</span>':'<span class=\"tag bl\">検収待ち</span>'}</span><span class=\"cnt\">${fmtDT(d.t)}</span></li>`).join('')}</ul>`:'<p class=\"sm\">まだ納品はありません。</p>';",
    "  h+=`<p class=\"sm\">取り込む権限：発案者（${esc(c.owner)}）。検収の確定は検収席。納品ごとに版番号が付き、二度目以降は前の版からの変更を書きます。</p>`;\n  h+=dels.length?`<ul class=\"arc\">${dels.slice().reverse().map((d,i)=>`<li><span><span class=\"tag ${d.accepted?'ok':d.rejected?'wn':'bl'}\">v${d.version||(dels.length-i)}</span> ${esc(d.by)}：${/^https?:/.test(d.note)?`<a href=\"${esc(d.note)}\" target=\"_blank\" rel=\"noopener\">${esc(d.note)}</a>`:esc(d.note)}${d.diff?`<br><span class=\"sm\">変更：${esc(d.diff)}</span>`:''} ${d.rejected?`<span class=\"tag wn\">差し戻し</span> <span class=\"sm\">${esc(d.reason||'')}</span>`:d.accepted?'<span class=\"tag ok\">取り込み済み</span>':'<span class=\"tag bl\">検収待ち</span>'}</span><span class=\"cnt\">${fmtDT(d.t)}</span></li>`).join('')}</ul>`:'<p class=\"sm\">まだ納品はありません。</p>';");

/* 納品フォームに差分欄（2回目以降） */
rep("  if(c.stage>=2&&(!last||last.rejected)) h+=`<div class=\"row\"><input class=\"f\" id=\"del-note\" placeholder=\"成果物のURLか説明\" style=\"flex:1;min-width:200px\"><button class=\"btn sm\" onclick=\"deliver()\">納品を確定する（段階3）</button></div><p class=\"sm\">納品は人が確定します。買い手席が埋まる前は納品できません。</p>`;",
    "  if(c.stage>=2&&(!last||last.rejected)) h+=`<div class=\"row\"><input class=\"f\" id=\"del-note\" placeholder=\"成果物のURLか説明（v${dels.length+1}）\" style=\"flex:1;min-width:200px\">${dels.length?`<input class=\"f\" id=\"del-diff\" placeholder=\"前の版（v${dels.length}）からの変更\" style=\"flex:1;min-width:200px\">`:''}<button class=\"btn sm\" onclick=\"deliver()\">納品を確定する（v${dels.length+1}${c.stage<3?'・段階3':''}）</button></div><p class=\"sm\">納品は人が確定します。買い手席が埋まる前は納品できません。${dels.length?'差し戻し後の再納品は、前の版からの変更を必ず書いてください。':''}</p>`;");

/* deliver：版番号・差分を保存。再納品で差分必須 */
rep("async function deliver(){ const c=cases[cur]; const note=$('del-note').value.trim(); if(!note){ toast('成果物のURLか説明を入れてください'); return; } if(c.stage<2){ toast('買い手席が埋まってから納品できます'); return; }",
    "async function deliver(){ const c=cases[cur]; const note=$('del-note').value.trim(); if(!note){ toast('成果物のURLか説明を入れてください'); return; } if(c.stage<2){ toast('買い手席が埋まってから納品できます'); return; }\n  const prev=(c.deliveries||[]).length; const diff=$('del-diff')?$('del-diff').value.trim():''; if(prev&&!diff){ toast('前の版からの変更を書いてください'); return; }");
rep("  const patch={deliveries:(c.deliveries||[]).concat([{id:'d'+now(),note,by:me(),t:now(),rejected:false,accepted:false}]),checks:[],stage:Math.max(c.stage,3)};",
    "  const patch={deliveries:(c.deliveries||[]).concat([{id:'d'+now(),version:prev+1,note,diff,by:me(),t:now(),rejected:false,accepted:false}]),checks:[],stage:Math.max(c.stage,3)};");
rep("  await save(patch, me()+' が納品を確定した（段階3）'); $('del-note').value=''; }",
    "  await save(patch, me()+' が v'+(prev+1)+' を納品した'+(prev?'（変更：'+diff+'）':'（段階3）')); $('del-note').value=''; }");

/* 型に「取り込み済みの版の数」を残す（型の中身には氏名を入れない） */
rep("    proposalSummary: ai?.proposalSummary || '' };",
    "    proposalSummary: ai?.proposalSummary || '', deliveryVersions:(c.deliveries||[]).length, acceptedVersion:(c.deliveries||[]).find(d=>d.accepted)?.version||null };");

fs.writeFileSync('ifbox-proto.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
