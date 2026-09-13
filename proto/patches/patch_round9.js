// 第9回：スレッド（K5）／会員・オファー（K6）／購入型のみ（K7）
// 使い方: node patch_round9.js <target html>
const fs = require('fs'), path = require('path');
const target = process.argv[2] || 'ifbox-proto.html';
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 90)); return; } h = h.replace(a, b); n++; }

/* CSS */
rep(`  .msgs{display:flex;flex-direction:column;gap:8px;max-height:380px;overflow:auto;padding:4px 2px}`,
`  .msgs{display:flex;flex-direction:column;gap:8px;max-height:380px;overflow:auto;padding:4px 2px}
  .thread{display:flex;flex-direction:column;gap:6px;max-height:480px;overflow:auto;padding:4px 2px}
  .tp{display:flex;gap:9px;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid var(--line);font-size:13px}
  .tp.me{background:var(--soft)} .tp.can{border-color:var(--navy);border-width:1.5px} .tp.offer{border-color:var(--gold);border-width:1.5px} .tp.bid{background:#FBFCFF}
  .tp .av{flex:0 0 28px;width:28px;height:28px;border-radius:50%;color:#fff;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center}
  .tp .av.ai{background:var(--gold-soft);color:var(--gold-deep)} .tp .av.gold{background:var(--gold);color:var(--navy)}
  .tp .bd{flex:1;min-width:0} .tp .who{font-size:11.5px;color:var(--ink3);display:flex;gap:6px;align-items:center;flex-wrap:wrap} .tp .who b{color:var(--ink)} .tp .tm{margin-left:auto;font-size:10.5px;color:var(--ink3);white-space:nowrap}
  .tp .tx{margin-top:3px;white-space:pre-wrap;word-break:break-word;color:var(--ink)} .tp .ft{margin-top:6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .tp.sys{background:transparent;border:none;padding:1px 10px;font-size:11.5px;color:var(--ink3);justify-content:space-between;gap:12px}
  .mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:12px} .mcard .kv{margin-top:8px}`);

/* ナビ：会員 */
rep(`    <button data-s="money" onclick="go('money')">配分</button>`,
    `    <button data-s="members" onclick="go('members')">会員</button>\n    <button data-s="money" onclick="go('money')">配分</button>`);
rep(`if(s==='turns') renderTurns(); }`, `if(s==='turns') renderTurns(); if(s==='members') renderMembers(); }`);
rep(`<!-- ===================== 配分 ===================== -->`,
`<!-- ===================== 会員 ===================== -->
<section class="screen" id="s-members"><div class="wrap">
  <p class="eb">MEMBERS</p><h2 class="t">会員 ― 紹介制・承認制・オファー型</h2>
  <p class="sm" style="margin-top:6px">紹介者がいる参加者を「会員」、いない参加者を「一般」と表示します。案件から会員へ「この席に座ってほしい」とオファーを送り、相手が受けるか辞退するかを決めます（承認制）。席に座るのを会員に限るかの線引きは未決のため、いまは表示だけで制限しません。</p>
  <div class="mgrid" id="members"></div>
</div></section>

<!-- ===================== 配分 ===================== -->`);

/* 案件のタブ：スレッドを先頭に、出資型を非表示 */
rep(`<button class="on" data-p="props" onclick="tab('props')">提案 <span id="n-props"></span></button><button data-p="msgs" onclick="tab('msgs')">メッセージ <span id="n-msgs"></span></button>`,
    `<button class="on" data-p="msgs" onclick="tab('msgs')">スレッド <span id="n-msgs"></span></button><button data-p="props" onclick="tab('props')">提案 <span id="n-props"></span></button>`);
rep(`<button data-p="fund" onclick="tab('fund')">資金を出す</button>`, `<button data-p="fund" id="tab-fund" onclick="tab('fund')" hidden>資金を出す</button>`);
rep(`<div class="pane on" id="p-props">`, `<div class="pane" id="p-props">`);
rep(`          <div class="pane" id="p-msgs">
            <div class="msgs" id="c-msgs"></div>
            <div class="row"><input class="f" id="msg-text" placeholder="提案内容や進め方について入力（案件の全員に見えます）" style="flex:1;min-width:200px" onkeydown="if(event.key==='Enter')sendMsg()"><button class="btn" onclick="sendMsg()">送る</button></div>
          </div>`,
`          <div class="pane on" id="p-msgs">
            <p class="sm">案件のスレッド。会員が「俺これできる」と席を名乗り、発案者が迎えると席に座ります。提案・オファー・着席・段階の変化も時系列でここに並びます。</p>
            <div class="thread" id="c-msgs"></div>
            <div class="box" style="background:var(--soft);margin-top:10px">
              <div class="row"><select class="f" id="msg-kind" onchange="msgKindChange()"><option value="msg">ひとこと</option><option value="can">俺これできる（席を名乗る）</option></select><select class="f" id="msg-seat" style="display:none"></select></div>
              <div class="row"><input class="f" id="msg-text" placeholder="提案内容や進め方について入力（案件の全員に見えます）" style="flex:1;min-width:200px" onkeydown="if(event.key==='Enter')sendMsg()"><button class="btn" onclick="sendMsg()">送る</button></div>
              <div class="row" id="msg-tools"></div>
            </div>
          </div>`);

/* renderCase：メッセージ描画をスレッドに */
rep(`  const msgs=c.messages||[]; $('n-msgs').textContent=msgs.length||'';
  $('c-msgs').innerHTML = msgs.length? msgs.map(m=>\`<div class="msg \${m.by===me()?'me':''}"><div class="who">\${esc(m.by)} ・ \${fmtDT(m.t)}</div>\${esc(m.text)}</div>\`).join('') : '<p class="sm">まだやり取りはありません。提案の相談、条件のすり合わせに使ってください。</p>';
  const box=$('c-msgs'); box.scrollTop=box.scrollHeight;`,
`  renderThread(c);`);
/* 提案カードに会員区分 */
rep(`<span class="nm">\${esc(b.by)}\${b.by==='AI'?'（最低ライン）':''}</span>`, `<span class="nm">\${esc(b.by)}\${b.by==='AI'?'（最低ライン）':''}</span>\${b.by==='AI'?'':rankTagByName(b.by)}`);
/* 出資型の状態表示を止める */
rep(`+(c.fund?.open?' <span class="tag bl">資金募集中</span>':'')`, `+(FUND_ENABLED&&c.fund?.open?' <span class="tag bl">資金募集中</span>':'')`);
rep(`function renderFund(c){`, `function renderFund_orig(c){`);
/* 参加者登録：紹介者・紹介動画・一言 */
{ const mm=h.match(/<input class="f" id="new-name" placeholder="[^"]*" style="width:100%;margin-top:8px">/); if(!mm) console.log("MISS new-name"); else rep(mm[0], mm[0]+`<div class="row"><span class="sm" style="width:90px">紹介者</span><select class="f" id="new-intro" style="flex:1">\${introducerOptions('',null)}</select></div><div class="row"><span class="sm" style="width:90px">紹介動画URL</span><input class="f" id="new-video" placeholder="https://…（任意）" style="flex:1"></div><div class="row"><span class="sm" style="width:90px">一言</span><input class="f" id="new-note" placeholder="できること・持っているもの（任意）" style="flex:1"></div><p class="sm">紹介者がいると「会員」、いなければ「一般」と表示されます。</p>`); }
rep(`async function pickMe(v){ if(v==='__new'){`, `async function pickMe(v){ if(v==='__edit'){ renderMe(); editMe(); return; } if(v==='__new'){`);
rep(`<option value="__new">＋ 新しく登録</option></select><span class="status" id="status">\${$('status')?.innerHTML||''}</span>`,
    `<option value="__edit">✎ 自分の情報・紹介</option><option value="__new">＋ 新しく登録</option></select><span class="status" id="status">\${$('status')?.innerHTML||''}</span>`);
/* 手番：自分宛てのオファー */
rep(`    for(const [k,n] of SEATS){ const s=c.seats?.[k]; if(!s||s.t!=='hu'||s.n!==name) continue;`,
    `    for(const o of (c.offers||[])){ if(o.state==='open'&&((o.toId&&o.toId===id)||o.to===name)) out.push({c,why:SNAME[o.seat]+'の席へのオファー（'+o.by+'）に返事する',anchor:'msgs'}); }
    if(c.owner===name) for(const m of (c.messages||[])){ if(m.kind==='can'&&c.seats?.[m.seat]?.t!=='hu') out.push({c,why:m.by+' が'+SNAME[m.seat]+'の席を名乗っている（迎えるか決める）',anchor:'msgs'}); }
    for(const [k,n] of SEATS){ const s=c.seats?.[k]; if(!s||s.t!=='hu'||s.n!==name) continue;`);

h = h.replace(/<\/script>\s*$/, fs.readFileSync(path.join(__dirname, 'round9_snippet.js'), 'utf8') + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
