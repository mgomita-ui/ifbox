// 仕上げ：初回ガイド、一覧の案内、AI席の例文（デモ）、投稿時の最初の一手（デモ）、タブの案内、型・比較の静的カード
const fs = require('fs');
let h = fs.readFileSync('proto/index.html', 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 80)); return; } h = h.replace(a, b); n++; }

/* CSS */
rep(`  @media (prefers-reduced-motion: reduce)`,
`  .guide{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12.5px;color:var(--ink3);margin:0 0 6px}
  .guide a{color:var(--gold-deep);font-weight:700;text-decoration:none;border-bottom:1px dashed var(--gold-deep)}
  .banner{background:var(--gold-soft);border-left:4px solid var(--gold);border-radius:10px;padding:8px 12px;font-size:13px;color:var(--ink);margin-top:12px}
  .first{position:absolute;right:6px;top:6px;background:var(--gold);color:#0E2A5B;font-size:10.5px;font-weight:900;padding:2px 8px;border-radius:999px}
  .tour{position:fixed;inset:0;background:rgba(7,21,47,.62);z-index:70;display:none;align-items:flex-end;justify-content:center;padding:18px}
  .tour.on{display:flex}
  .tour .p{background:var(--paper);color:var(--ink);border-radius:16px;max-width:560px;width:100%;padding:18px 20px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
  .tour .k{font-family:var(--latin);font-size:10.5px;letter-spacing:.24em;color:var(--gold-deep);font-weight:700}
  .tour h3{font-size:17px;margin:4px 0 6px;padding:0;border:0;color:var(--ink)}
  .tour ol{margin:0;padding-left:1.3em;font-size:13.5px;color:var(--ink2)}
  .tour li{margin:4px 0}
  .tour li b{color:var(--ink)}
  .tour .row{justify-content:flex-end}
  .seat .demo{display:block;font-size:9.5px;color:var(--gold-deep);font-weight:700;margin-top:2px}
  @media (prefers-reduced-motion: reduce)`);

/* 一覧上部の案内と「まずはこの例」 */
rep(`  <div class="toolbar">`, `  <div class="banner" id="listnote" hidden>ここに並ぶのは完成品ではなく、<b>実現途中の「もし」</b>です。開くと、誰が助かり、誰が払うか、どの席が空いているかが見えます。</div>\n  <div class="toolbar">`);
rep(`return \`<div class="pc" tabindex="0" onclick="openCase('\${c.id}')" onkeydown="if(event.key==='Enter')openCase('\${c.id}')">
      <div class="th" style="background:linear-gradient(160deg,hsl(\${h} 45% 30%),hsl(\${h} 55% 48%))">`,
    `return \`<div class="pc" tabindex="0" onclick="openCase('\${c.id}')" onkeydown="if(event.key==='Enter')openCase('\${c.id}')">
      <div class="th" style="background:linear-gradient(160deg,hsl(\${h} 45% 30%),hsl(\${h} 55% 48%))">\${c.id==='s09'?'<span class="first">まずはこの例</span>':''}`);
rep(`  if(sort==='like') list.sort(`, `  if(!q&&chip!=='real'&&list.some(c=>c.id==='s09')) list.sort((a,b)=>(a.id==='s09'?-1:0)-(b.id==='s09'?-1:0));\n  if(sort==='like') list.sort(`);

/* 案件のタブの上に読む順番 */
rep(`          <div class="tabs">`, `          <p class="guide">読む順番：<a href="#" onclick="tab('props');return false">① 誰が助かり、誰が払うか</a> → <a href="#" onclick="document.getElementById('c-seats').scrollIntoView({block:'center'});return false">② 席</a> → <a href="#" onclick="tab('accept');return false">③ 納品・検収</a> → <a href="#" onclick="tab('compare');return false">④ 型・比較</a>。段階は人の確定でだけ上がります。</p>\n          <div class="tabs">`);

/* 型・比較の冒頭に静的カード */
rep(`<div class="pane" id="p-compare"><div id="c-tplmake"></div>`, `<div class="pane" id="p-compare"><div class="grid2" style="margin-bottom:12px"><div class="box info" style="margin:0"><b>初回：</b>条件から相談する。誰が助かり、誰が払い、何ができたら合格か、を人が決めて公開する。</div><div class="box gold" style="margin:0"><b>二度目：</b>型との差分だけ相談する。席の行動・検収基準・配分条件が最初から埋まっている。速く安くなったかは実測で比べる。</div></div><div id="c-tplmake"></div>`);

/* AI席（デモ）：例文を開く */
rep(`  if(s.t==='ai'){
    md(\`<h3>\${n}の席に座る（AIから引き継ぐ）</h3>`,
    `  if(s.t==='ai'&&window.DEMO_MODE){
    md(\`<h3>\${n}の席 <span class="tag ai">デモ：例文のみ</span></h3><p class="sm">本番ではAIがこの席で準備し、人が来たら引き継ぎパケットを渡して交代します。デモでは案件の値を埋めた例文を表示します。AIの実行結果ではありません。</p>
      <div class="box info" style="font-size:13px"><b>この席でAIが用意するもの（例）</b><ul style="margin:4px 0 0;padding-left:1.2em">\${k==='BUILD'?\`<li>「\${esc(c.reframed)}」を満たす最小の試作の計画</li><li>検収基準 \${(c.criteria||[]).length} 件に対応する確認項目</li><li>構成素材と権利の一覧</li>\`:\`<li>払う人の候補：\${esc((c.payers||[]).join('／')||'未定')}</li><li>買い手候補への提案文の下書き</li><li>価格の比較根拠（例と明記）</li>\`}</ul></div>
      <div class="box gold" style="font-size:13px"><b>引き継ぎパケット（例）</b><ul style="margin:4px 0 0;padding-left:1.2em"><li>目的：\${esc(c.reframed)}</li><li>完了：上の準備</li><li>次の一手：\${esc(((c.actions||[]).find(a=>a.seat===k)||{}).text||'席の目的に沿った最初の行動')}</li><li>未決：払う人の確定</li><li>秘密の範囲：この案件の限定公開情報のみ</li></ul></div>
      <div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">閉じる</button><button class="btn" onclick="sit('\${k}')">この席に座る（デモ）</button></div>\`); return; }
  if(s.t==='ai'){
    md(\`<h3>\${n}の席に座る（AIから引き継ぐ）</h3>`);

/* 投稿：デモの最初の一手（例文） */
rep(`  if(sample){ try{ ai=await sample.json(fill(P_FIRST,{title,benefit,demo:demo||'なし'}),{modelTier:'default'}); }catch(e){ th.innerHTML='AIの一手は省きました（'+esc(e.code||e.message)+'）。案件は作ります。'; } }`,
    `  if(sample){ try{ ai=await sample.json(fill(P_FIRST,{title,benefit,demo:demo||'なし'}),{modelTier:'default'}); }catch(e){ th.innerHTML='AIの一手は省きました（'+esc(e.code||e.message)+'）。案件は作ります。'; } }
  else if(window.DEMO_MODE){ const b=benefit||'この願いで助かる人'; const pats=[
      \`便益を受けるのは\${b}。払うのは、その本人が候補です。これは例です。「\${title}」を最小の試作品にするなら何を残すか、まず一人に確かめましょう。\`,
      \`便益を受けるのは\${b}。払うのは、その人を支える組織が候補です。これは例です。「\${title}」で減らせる手間を一つ選び、担当者に予算と導入条件を聞きましょう。\`,
      \`便益を受けるのは\${b}。払うのは、先に試したい買い手が候補です。これは例です。「\${title}」の納品物・価格・合格条件を仮置きし、購入意思を確かめましょう。\`];
    ai={first_move:pats[title.length%3],reframed:title.length>40?title.slice(0,39)+'…':title,payers:['本人','その人を支える組織','先に試したい買い手'],lines:['これは例です。実際の線は案件ごとに専門家に確認します'],next_actions:[{seat:'OWN',text:'誰が払うかを一人に確かめる',due_days:7},{seat:'SELL',text:'買い手候補3つに一行で打診する',due_days:7},{seat:'BUILD',text:'最小の試作を決める',due_days:14}],domain:''}; }`);

/* 初回ガイド（デモのみ、端末に既読を保存） */
rep(`<div class="ov" id="ov"`, `<div class="tour" id="tour" onclick="if(event.target===this)closeTour()"><div class="p"><span class="k">FIRST 60 SECONDS</span><h3>デモの歩き方（5ステップ）</h3><ol>
  <li><b>一覧</b>｜サンプル20件から、気になる「もし」を一つ選びます。「まずはこの例」から始めるのが早いです。</li>
  <li><b>案件を開く</b>｜誰が助かり、誰が払うか。着手前に決める線を見ます。</li>
  <li><b>席をクリック</b>｜役割を確認。AIは作る・売るの仮席で、人が来たら交代します。</li>
  <li><b>納品・検収</b>｜納品と合格の条件を確認。段階を進めるのは人の確定です。</li>
  <li><b>型・比較</b>｜精算後に残す型を見ます。二度目に省ける手間を探しましょう。</li></ol>
  <p class="sm" style="margin-top:8px">デモは保存されません。AI席は例文のみ。</p>
  <div class="row"><button class="btn ghost sm" onclick="closeTour(true)">もう表示しない</button><button class="btn" onclick="closeTour();openCase('s09')">「まずはこの例」を開く</button></div></div></div>
<div class="ov" id="ov"`);
rep(`/* ===================== 接続 ===================== */`, `/* ===================== 初回ガイド ===================== */
function openTour(){ $('tour').classList.add('on'); }
function closeTour(never){ $('tour').classList.remove('on'); if(never){ try{ localStorage.setItem('ifbox.tour','done'); }catch(e){} } }
document.addEventListener('DOMContentLoaded',()=>{ if(window.DEMO_MODE){ $('listnote').hidden=false; let seen=false; try{ seen=localStorage.getItem('ifbox.tour')==='done'; }catch(e){} if(!seen) setTimeout(openTour,600); } });
/* ===================== 接続 ===================== */`);

fs.writeFileSync('proto/index.html', h);
console.log('replacements', n);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
console.log('scripts', m.length);
