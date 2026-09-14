// 第10回：探す画面をアプリのホーム構成に（ヒーロー／主ボタン／注目の案件／領域から探す／下ナビ）
// 使い方: node patch_home.js <target html>
const fs = require('fs'), path = require('path');
const target = process.argv[2] || 'ifbox-proto.html';
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 90)); return; } h = h.replace(a, b); n++; }

/* CSS */
rep(`  /* ===== 探す（一覧） ===== */`,
`  /* ===== 探す：ホーム ===== */
  :root{--coral:#E85B52}
  .tagline{font-size:11px;color:rgba(255,255,255,.7);margin-left:10px;line-height:1.3;border-left:1px solid rgba(255,255,255,.2);padding-left:10px}
  .hero{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--deep) 0%,var(--navy) 62%,#1B3A75 100%);color:#fff;border-radius:18px;padding:30px 24px 26px;margin-top:6px}
  .hero::before{content:"";position:absolute;right:-40px;top:-60px;width:340px;height:340px;background:linear-gradient(160deg,var(--gold),transparent 70%);opacity:.28;transform:rotate(18deg);border-radius:40px}
  .hero::after{content:"";position:absolute;right:120px;bottom:-90px;width:220px;height:220px;background:var(--coral);opacity:.16;transform:rotate(30deg);border-radius:32px}
  .hero .ht{position:relative;font-size:38px;line-height:1.18;font-weight:900;letter-spacing:.01em;text-wrap:balance}
  .hero .ht .ac{color:var(--gold)} .hero .ht .ac2{color:var(--coral)}
  .hero .hs{position:relative;margin-top:12px;font-size:13.5px;color:rgba(255,255,255,.85);max-width:520px;line-height:1.75}
  .hero .hen{position:absolute;right:22px;bottom:16px;font-family:var(--latin);font-style:italic;font-weight:600;font-size:15px;color:var(--gold);opacity:.9}
  @media(max-width:700px){.hero{padding:24px 18px 44px}.hero .ht{font-size:31px}.hero .hen{font-size:13px;bottom:12px}}
  .cta2{display:grid;grid-template-columns:1.25fr 1fr;gap:10px;margin-top:12px}
  @media(max-width:700px){.cta2{grid-template-columns:1fr 1fr;gap:8px}}
  .cta{text-align:left;border:0;border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;cursor:pointer;line-height:1.4}
  .cta b{font-size:15px;font-weight:900} .cta span{font-size:12px;opacity:.85}
  .cta.main{background:var(--gold);color:var(--deep)} .cta.main .plus{font-size:22px;font-weight:900;line-height:1;opacity:1}
  .cta.sub{background:var(--paper);color:var(--ink);border:1px solid var(--line)} .cta.sub span{color:var(--ink3)}
  .cta:hover{box-shadow:0 8px 22px rgba(14,42,91,.16)}
  #postwrap{margin-top:4px}
  h3.hh{margin-top:22px;display:flex;align-items:center;gap:8px;border:0;padding:0;font-size:16px}
  h3.hh::before{content:"";width:6px;height:18px;border-radius:3px;background:var(--gold)}
  h3.hh a{margin-left:auto;font-size:12px;color:var(--ink3);font-weight:500;cursor:pointer;text-decoration:none}
  .feat{background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden;cursor:pointer;display:grid;grid-template-columns:300px 1fr;margin-top:10px}
  .feat:hover{box-shadow:0 8px 24px rgba(14,42,91,.16)}
  @media(max-width:760px){.feat{grid-template-columns:1fr}}
  .feat .fth{position:relative;color:#fff;padding:16px 18px;min-height:190px;display:flex;flex-direction:column;justify-content:flex-end}
  .feat .fk{position:absolute;left:14px;top:12px;background:rgba(7,21,47,.7);font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px}
  .feat .ft2{font-size:20px;font-weight:900;line-height:1.35;text-wrap:balance;text-shadow:0 2px 10px rgba(0,0,0,.25)}
  .feat .fen{position:absolute;right:14px;top:12px;font-family:var(--latin);font-size:11px;letter-spacing:.14em;color:var(--gold);font-weight:700}
  .feat .fbd{padding:14px 18px 16px}
  .feat .ftt{font-size:15px;font-weight:700;color:var(--ink);line-height:1.5}
  .feat .fst{display:flex;gap:3px;margin-top:10px}
  .feat .fst span{flex:1;text-align:center;font-size:10px;font-weight:700;padding:3px 0;border-radius:5px;background:var(--soft);color:var(--ink3)}
  .feat .fst .done{background:var(--gold-soft);color:var(--gold-deep)} .feat .fst .now{background:var(--navy);color:#fff}
  .feat .fmt{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--ink3)} .feat .fmt .grow{flex:1}
  .feat .seatdots{margin:0}
  .cats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:10px}
  @media(max-width:900px){.cats{grid-template-columns:repeat(4,1fr)}} @media(max-width:600px){.cats{grid-template-columns:repeat(3,1fr)}}
  .cat{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:12px 6px;text-align:center;display:flex;flex-direction:column;gap:2px;cursor:pointer;color:var(--ink)}
  .cat b{font-size:13.5px} .cat small{font-size:11px;color:var(--ink3);font-family:var(--latin)}
  .cat.on,.cat:hover{border-color:var(--gold);background:var(--gold-soft)} .cat.on b{color:var(--gold-deep)}
  @media(max-width:700px){
    .tagline{display:none}
    nav{position:fixed;left:0;right:0;bottom:0;z-index:30;margin:0;padding:6px 4px calc(6px + env(safe-area-inset-bottom));background:var(--deep);border-top:1px solid rgba(255,255,255,.12);justify-content:space-around}
    nav button{display:flex;flex-direction:column;align-items:center;gap:1px;font-size:10.5px;padding:3px 6px;color:rgba(255,255,255,.7)}
    nav button::before{content:attr(data-ic);font-size:17px;line-height:1.1}
    nav button.on{background:transparent;color:var(--gold)}
    body{padding-bottom:64px}
    .top .wrap{height:auto;padding:8px 14px}
    .me{margin-left:auto}
  }

  /* ===== 探す（一覧） ===== */`);

/* 公開版（単体HTML）にビューポートを付ける */
if(h.includes('seed.js')&&!h.includes('name="viewport"')) rep('<title>IFbox 席の試作</title>', '<meta name="viewport" content="width=device-width,initial-scale=1"><title>IFbox 席の試作</title>');
/* チップから領域と出資型を外す（領域は「領域から探す」に移す） */
rep(`const all=[['real','実案件'],['sample','サンプル'],['all','すべて'],['open','席が空いている'],['cf','先に買う募集中'],['fund','資金募集中'],['sold','成約済'],...doms.map(d=>['d:'+d,d])];`,
    `const all=[['real','実案件'],['sample','サンプル'],['all','すべて'],['open','席が空いている'],['cf','先に買う募集中'],['sold','成約済']];`);
/* 上部バーにタグライン */
rep(`IFbox<small>試作</small></span>`, `IFbox<small>試作</small></span><span class="tagline">もしから、<br>社会を動かす。</span>`);

/* ホーム上部：ヒーロー → 検索 → 主ボタン → 投稿欄（折りたたみ） */
rep(`<section class="screen on" id="s-home"><div class="wrap">
  <div class="searchbar">`,
`<section class="screen on" id="s-home"><div class="wrap">
  <div class="hero">
    <div class="ht"><span class="ac">もし、</span>が社会を<br><span class="ac2">動</span>かす。</div>
    <p class="hs">まだないけど、きっとほしい。そんな一行の「もし」から、席が埋まり、先に買われ、かたちになる。AIが準備し、人が確定する共創の道具。</p>
    <span class="hen">Small If, Big Change.</span>
  </div>
  <div class="searchbar" style="margin-top:12px">`);
rep(`  <div class="postbox">`,
`  <div class="cta2">
    <button class="cta main" onclick="showPost(true)"><span class="plus">＋</span><b>新しい「もし」を置いてみる</b><span>一行でいい。AI席が最初の一手を返し、席が立つ</span></button>
    <button class="cta sub" onclick="go('members')"><b>紹介で参加する</b><span>会員・オファー型。席に座る人を探す側にも、座る側にも</span></button>
  </div>
  <div id="postwrap" hidden>
  <div class="postbox">`);
rep(`  <div id="tplbox"></div>`, `  <div id="tplbox"></div>\n  </div>`);
/* 注目の案件・領域から探す（一覧の前） */
{ const a = h.includes(`  <div class="banner" id="listnote" hidden>`) ? `  <div class="banner" id="listnote" hidden>` : `  <div class="toolbar">`;
  rep(a, `  <h3 class="hh">注目の案件 <a onclick="scrollGrid()">すべて見る →</a></h3>
  <div id="featured"></div>
  <h3 class="hh">領域から探す</h3>
  <div class="cats" id="cats"></div>
  <h3 class="hh">すべての案件</h3>
` + a); }
/* 一覧更新のたびにホームも更新 */
rep(`renderChips(); renderGrid(); if(cur&&cases[cur]) renderCase(); fillCaseSelect();`, `renderChips(); renderGrid(); renderHome(); if(cur&&cases[cur]) renderCase(); fillCaseSelect();`);
rep(`function startFromSample(){ const c=cases[cur]; if(!c||!isSample(c)) return; go('home');`, `function startFromSample(){ const c=cases[cur]; if(!c||!isSample(c)) return; go('home'); showPost(true);`);
/* 型を探す・適用でも投稿欄を開く */
h = h.replace(/function findTemplates\(\)\{/, 'function findTemplates(){ showPost(true);');
h = h.replace(/function applyTemplate\(([^)]*)\)\{/, 'function applyTemplate($1){ showPost(true);');

h = h.replace(/<\/script>\s*$/, fs.readFileSync(path.join(__dirname, 'home_snippet.js'), 'utf8') + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
