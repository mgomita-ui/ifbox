// 第11回：ホームのデザイン寄せ（第10回の上に当てる）。色は紺×金のまま、構造・余白・タイポ・アイコン・写真枠を参考モックに寄せる。
// 使い方: node patch_home2.js <target html>
const fs = require('fs'), path = require('path');
const target = process.argv[2] || 'ifbox-proto.html';
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 90)); return; } h = h.replace(a, b); n++; }

/* 筆記体フォント */
rep(`family=Poppins:wght@600;700&display=swap`, `family=Poppins:wght@600;700&family=Caveat:wght@600&display=swap`);

/* CSS（後勝ち） */
rep(`  /* ===== 探す（一覧） ===== */`,
`  /* ===== 第11回：デザイン寄せ ===== */
  :root{--script:'Caveat',cursive;--shadow:0 8px 24px rgba(14,42,91,.10);--r16:16px}
  .top .wrap{gap:8px}
  .hicons{display:flex;gap:2px;margin-left:auto}
  .hic{width:36px;height:36px;border-radius:50%;background:transparent;border:0;color:#fff;display:grid;place-items:center;position:relative;padding:0}
  .hic svg{width:21px;height:21px} .hic:hover{background:rgba(255,255,255,.1)}
  .hic .dot{position:absolute;top:7px;right:7px;width:9px;height:9px;border-radius:50%;background:var(--coral);border:2px solid var(--deep)}
  .me{margin-left:0;gap:6px} .me>span:first-child{display:none}
  .me select{appearance:none;-webkit-appearance:none;background:var(--gold);color:var(--deep);border:0;border-radius:999px;padding:6px 12px;font-weight:700;font-size:12px;max-width:140px;text-overflow:ellipsis;cursor:pointer}
  @media(max-width:700px){.status{display:none}.me select{max-width:96px}}
  .hero{min-height:300px;padding:34px 26px 30px;border-radius:20px;background:var(--paper);color:var(--ink);box-shadow:var(--shadow)}
  .hero::before{display:block;content:"";position:absolute;left:-10%;top:-40%;width:70%;height:180%;background:linear-gradient(135deg,rgba(246,166,35,.16),rgba(246,166,35,0) 60%);transform:rotate(14deg);border-radius:0;opacity:1}
  .hero::after{display:none}
  .hero .art{position:absolute;right:0;top:0;bottom:0;width:56%;clip-path:polygon(30% 0,100% 0,100% 100%,0 100%);background:linear-gradient(160deg,#1B3A75,var(--navy) 60%,#0B1F49);overflow:hidden}
  .hero .art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% 40%}
  .hero .art .sky{position:absolute;inset:0;background:linear-gradient(180deg,rgba(246,166,35,.0) 30%,rgba(246,166,35,.28) 100%)}
  .hero .art svg.city{position:absolute;left:0;right:0;bottom:0;width:100%;height:46%;color:rgba(7,21,47,.85)}
  .hero .art::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,42,91,.25),rgba(14,42,91,0) 35%)}
  .hero .ht{font-size:44px;line-height:1.08;letter-spacing:-.02em;max-width:60%;color:var(--ink)}
  .hero .ht .ac,.hero .ht .ac2{color:var(--coral)}
  .hero .hs{max-width:48%;font-size:13px;color:var(--ink2)}
  .hero .hen{font-family:var(--script);font-style:normal;font-size:24px;letter-spacing:.01em;color:#fff;right:22px;bottom:26px;transform:rotate(-12deg);text-shadow:0 2px 12px rgba(0,0,0,.45);opacity:1;z-index:2}
  @media(max-width:700px){.hero{border-radius:0;margin:0 -18px;padding:26px 18px 36px;min-height:300px;box-shadow:none}.hero .ht{font-size:40px;max-width:62%}.hero .hs{max-width:48%;font-size:12.5px}.hero .art{width:54%;clip-path:polygon(34% 0,100% 0,100% 100%,0 100%)}.hero .hen{font-size:21px;right:14px;bottom:20px}}
  .searchbar{border:0;border-radius:14px;box-shadow:var(--shadow);padding:10px 14px}
  .searchbar .si{width:22px;height:22px;color:var(--ink);flex:0 0 22px}
  .tagrow{display:flex;gap:8px;align-items:center;margin-top:10px}
  .tags{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px;flex:1;min-width:0} .tags::-webkit-scrollbar{display:none}
  .tag2{white-space:nowrap;border:1px solid var(--line);background:var(--paper);border-radius:10px;padding:7px 12px;font-size:12.5px;font-weight:700;color:var(--ink2);cursor:pointer}
  .tag2 b{color:var(--gold-deep);margin-right:2px} .tag2.on{background:var(--navy);color:#fff;border-color:transparent} .tag2.on b{color:var(--gold)}
  .tagnext{flex:0 0 32px;width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:var(--paper);color:var(--ink);display:grid;place-items:center;padding:0} .tagnext svg{width:18px;height:18px}
  .chips{margin-top:8px}
  .cta2{margin-top:14px;gap:12px} @media(max-width:700px){.cta2{gap:10px}}
  .cta{position:relative;min-height:152px;padding:18px 16px 44px;border-radius:var(--r16);gap:4px;box-shadow:var(--shadow)}
  .cta .ic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;margin-bottom:8px} .cta .ic svg{width:22px;height:22px}
  .cta.main{background:var(--coral);color:#fff} .cta.main .ic{background:#fff;color:var(--coral)} .cta.sub .ic{background:var(--navy);color:#fff}
  .cta b{font-size:16px;line-height:1.35} .cta span.d{font-size:11.5px;line-height:1.5;opacity:.9}
  .cta .chev{position:absolute;right:14px;bottom:14px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center} .cta .chev svg{width:17px;height:17px}
  .cta.main .chev{background:#fff;color:var(--coral)} .cta.sub .chev{background:var(--navy);color:#fff}
  .cta.main .plus{display:none}
  h3.hh{font-size:18px;margin-top:26px} h3.hh::before{display:none} h3.hh .hi{width:22px;height:22px;color:var(--gold);flex:0 0 22px} h3.hh .hi svg{width:22px;height:22px}
  h3.hh a{font-size:12.5px;color:var(--ink2)}
  .feat{grid-template-columns:1.25fr 1fr;border:0;border-radius:var(--r16);box-shadow:var(--shadow)}
  @media(max-width:760px){.feat{grid-template-columns:1.2fr 1fr}}
  .feat .fbd{padding:16px 16px 14px;display:flex;flex-direction:column;gap:8px}
  .feat .pill{align-self:flex-start;background:var(--coral);color:#fff;font-size:11px;font-weight:900;padding:3px 10px;border-radius:999px}
  .feat .ftt{font-size:19px;font-weight:900;line-height:1.4;color:var(--ink);text-wrap:balance;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .feat .fdesc{font-size:12.5px;color:var(--ink2);line-height:1.65;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin:0}
  .feat .ftags{display:flex;gap:6px;flex-wrap:wrap} .feat .ftags span{font-size:11px;font-weight:700;color:var(--ink2);background:var(--soft);border-radius:8px;padding:3px 8px} .feat .ftags b{color:var(--gold-deep);margin-right:1px}
  .feat .fst{margin-top:0} .feat .fmt{margin-top:2px;gap:8px} .feat .fmt .ic{display:inline-flex;align-items:center;gap:3px;font-family:var(--latin);font-weight:600;color:var(--ink2)} .feat .fmt .ic svg{width:17px;height:17px}
  .feat .fth{min-height:100%;padding:0;justify-content:flex-end}
  .feat .fth img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .feat .fth .fsc{position:absolute;right:14px;bottom:14px;font-family:var(--script);font-size:24px;line-height:1.05;text-align:right;color:#fff;transform:rotate(-8deg);text-shadow:0 2px 10px rgba(0,0,0,.4)}
  .feat .fth .fen{left:12px;right:auto;top:12px;background:rgba(7,21,47,.55);padding:2px 8px;border-radius:999px}
  @media(max-width:700px){.feat .fbd{padding:14px 12px 12px;gap:6px}.feat .ftt{font-size:16px}.feat .fdesc{font-size:12px;-webkit-line-clamp:2}.feat .fth .fsc{font-size:19px}.feat .fst span{font-size:9px;white-space:nowrap;overflow:hidden;padding:3px 1px}}
  .cats{grid-template-columns:repeat(5,1fr);gap:8px} @media(max-width:600px){.cats{grid-template-columns:repeat(5,1fr);gap:6px}}
  .cat{padding:14px 4px 12px;border-radius:14px;gap:2px;box-shadow:0 2px 10px rgba(14,42,91,.05)}
  .cat .ci{width:26px;height:26px;margin:0 auto 4px;color:var(--navy);display:block} .cat .ci svg{width:26px;height:26px}
  .cat b{font-size:12.5px;line-height:1.25;word-break:keep-all} .cat small{font-size:10.5px}
  .cat.on{border-color:var(--coral);background:rgba(232,91,82,.08)} .cat.on .ci,.cat.on b{color:var(--coral)} .cat:hover{border-color:var(--coral);background:var(--paper)}
  @media(max-width:600px){.cat b{font-size:11px}.cat .ci,.cat .ci svg{width:22px;height:22px}}
  .bnr{position:relative;border-radius:var(--r16);overflow:hidden;min-height:150px;margin-top:16px;cursor:pointer;color:#fff;background:linear-gradient(120deg,var(--deep),var(--navy) 55%,#1B3A75);box-shadow:var(--shadow);display:flex;align-items:center}
  .bnr img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.6}
  .bnr svg.mt{position:absolute;right:0;bottom:0;width:70%;height:80%;color:rgba(246,166,35,.22)}
  .bnr::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,21,47,.85) 30%,rgba(7,21,47,.2))}
  .bnr .bt{position:relative;z-index:1;padding:22px 24px} .bnr .bt b{display:block;font-size:20px;font-weight:900;line-height:1.4} .bnr .bt span{display:block;font-size:12px;opacity:.85;margin-top:6px;max-width:70%}
  .bnr .chev{position:absolute;right:16px;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:50%;background:#fff;color:var(--deep);display:grid;place-items:center;z-index:1} .bnr .chev svg{width:18px;height:18px}
  .ni{display:none}
  @media(max-width:700px){.ni{display:block;width:22px;height:22px} .ni svg{width:22px;height:22px} nav button::before{content:none} nav{padding:6px 2px calc(6px + env(safe-area-inset-bottom));background:var(--paper);border-top:1px solid var(--line)} nav button{font-size:10px;gap:3px;color:var(--ink3)} nav button.on{color:var(--coral);font-weight:700;background:transparent} body{padding-bottom:70px}}

  /* ===== 探す（一覧） ===== */`);

/* ヒーロー：3行見出し＋斜めの写真枠 */
rep(`    <div class="ht"><span class="ac">もし、</span>が社会を<br><span class="ac2">動</span>かす。</div>
    <p class="hs">まだないけど、きっとほしい。そんな一行の「もし」から、席が埋まり、先に買われ、かたちになる。AIが準備し、人が確定する共創の道具。</p>
    <span class="hen">Small If, Big Change.</span>`,
`    <div class="art"><span class="sky"></span><svg class="city" viewBox="0 0 400 120" preserveAspectRatio="none" fill="currentColor"><path d="M0 120V70h18V40h14v30h10V55h22v20h8V30h26v45h12V62h18v13h10V20h8v8h8v-8h8v55h16V48h20v27h10V38h24v37h12V58h20v17h10V44h22v31h12V66h16v9h10V52h26v23h20V120z"/></svg><img src="img/hero.jpg" alt="" onerror="this.remove()"></div>
    <div class="ht"><span class="ac">もし、</span><br>が社会を<br><span class="ac2">動</span>かす。</div>
    <p class="hs">まだないけど、きっとほしい。そんな「もし」から、席が埋まり、先に買われ、かたちになる。</p>
    <span class="hen">Small If, Big Change.</span>`);
/* 検索アイコン */
rep(`<span aria-hidden="true" style="color:var(--ink3)">⌕</span><input id="q"`, `<span class="si" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><input id="q"`);
rep(`placeholder="キーワードで案件を探す（もし、領域、名前）"`, `placeholder="気になる「もし」を探す（一行・領域・名前）"`);
/* 領域タグの横スクロール（状態チップは一覧の上へ移す） */
rep(`  <div class="chips" id="chips"></div>\n  <div class="cta2">`, `  <div class="tagrow"><div class="tags" id="tags"></div><button class="tagnext" onclick="tagsNext()" title="次へ"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div>\n  <div class="cta2">`);
rep(`  <div class="toolbar"><span class="cnt" id="cnt"></span>`, `  <div class="chips" id="chips"></div>\n  <div class="toolbar"><span class="cnt" id="cnt"></span>`);
/* 主ボタン：アイコン円＋矢印 */
rep(`    <button class="cta main" onclick="showPost(true)"><span class="plus">＋</span><b>新しい「もし」を置いてみる</b><span>一行でいい。AI席が最初の一手を返し、席が立つ</span></button>
    <button class="cta sub" onclick="go('members')"><b>紹介で参加する</b><span>会員・オファー型。席に座る人を探す側にも、座る側にも</span></button>`,
`    <button class="cta main" onclick="showPost(true)"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span><b>新しい「もし」を<br>置いてみる</b><span class="d">一行でいい。AI席が最初の一手を返し、席が立つ</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></button>
    <button class="cta sub" onclick="go('members')"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9.5" r="2.5"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M15.5 14.2c2.6.2 5 2 5 4.8"/></svg></span><b>紹介で参加する</b><span class="d">会員・オファー型。席に座る人を探す側にも、座る側にも</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></button>`);
/* 見出しアイコン＋バナー */
rep(`  <h3 class="hh">注目の案件 <a onclick="scrollGrid()">すべて見る →</a></h3>`, `  <h3 class="hh"><span class="hi"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg></span>注目の案件 <a onclick="scrollGrid()">すべて見る →</a></h3>`);
rep(`  <h3 class="hh">領域から探す</h3>`, `  <h3 class="hh"><span class="hi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg></span>領域から探す</h3>`);
rep(`  <h3 class="hh">すべての案件</h3>`,
`  <div class="bnr" onclick="go('members')" tabindex="0" onkeydown="if(event.key==='Enter')go('members')"><svg class="mt" viewBox="0 0 400 160" preserveAspectRatio="none" fill="currentColor"><path d="M0 160L70 80l50 40 60-70 50 50 60-60 60 70 50-30v80z"/></svg><img src="img/banner.jpg" alt="" onerror="this.remove()"><div class="bt"><b>挑戦する人と、<br>社会をつなぐ。</b><span>あなたの一歩が、未来のきっかけに。紹介で参加し、席に座る。</span></div><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></div>
  <h3 class="hh"><span class="hi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg></span>すべての案件</h3>`);

h = h.replace(/<\/script>\s*$/, fs.readFileSync(path.join(__dirname, 'home2_snippet.js'), 'utf8') + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
