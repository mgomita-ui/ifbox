// 第12回：クラファンサイト化。第11回の上に当てる。
// 使い方: node patch_cf.js <target html>
const fs = require('fs'), path = require('path');
const target = process.argv[2] || 'ifbox-proto.html';
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n'); let n = 0;
function rep(a, b) { if (!h.includes(a)) { console.log('MISS', a.slice(0, 90)); return; } h = h.replace(a, b); n++; }

rep(`  /* ===== 探す（一覧） ===== */`,
`  /* ===== 第12回：プロジェクトページ ===== */
  .pst{display:inline-block;font-size:11px;font-weight:900;padding:3px 10px;border-radius:999px;margin-right:6px;background:rgba(7,21,47,.7);color:#fff}
  .pst.st-rec{background:var(--coral);color:#fff}.pst.st-pre{background:rgba(255,255,255,.9);color:var(--deep)}.pst.st-sel{background:var(--gold);color:var(--deep)}.pst.st-ok{background:var(--green);color:#fff}.pst.st-ng{background:#6B7690;color:#fff}.pst.st-dom{background:rgba(7,21,47,.55)}
  .pjx{display:grid;grid-template-columns:minmax(0,1fr) 330px;grid-template-areas:"cover side" "main side";gap:0 18px;align-items:start;margin-top:10px}
  .pj-cover{grid-area:cover}.pj-main{grid-area:main;min-width:0}.pj-side{grid-area:side}
  @media(max-width:900px){.pjx{grid-template-columns:minmax(0,1fr);grid-template-areas:"cover" "side" "main"}.pj-side{position:static!important;margin-top:12px}}
  .pj-cover{position:relative;border-radius:18px;overflow:hidden;min-height:260px;color:#fff;display:flex;align-items:flex-end}
  .pj-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .pj-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,21,47,.05) 30%,rgba(7,21,47,.78))}
  .pj-cv{position:relative;z-index:1;padding:20px 22px}
  .pj-cv h1{font-size:26px;font-weight:900;line-height:1.35;margin:8px 0 4px;text-wrap:balance}.pj-cv p{font-size:12px;opacity:.85;margin:0}
  @media(max-width:700px){.pj-cover{min-height:220px}.pj-cv h1{font-size:21px}}
  .pj-nav{display:flex;gap:4px;overflow-x:auto;max-width:100%;scrollbar-width:none;border-bottom:2px solid var(--line);margin-top:10px;position:sticky;top:56px;background:var(--bg);z-index:5}
  .pj-nav button{background:none;border:0;padding:10px 12px;font-weight:700;font-size:13px;color:var(--ink2);white-space:nowrap}.pj-nav button:hover{color:var(--coral)}.pj-nav i{font-style:normal;font-family:var(--latin);font-size:11px;background:var(--soft);border-radius:999px;padding:1px 7px;margin-left:3px}
  .pj-sec{background:var(--paper);border-radius:16px;box-shadow:var(--shadow);padding:18px 20px;margin-top:14px;scroll-margin-top:110px}
  .pj-h{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:6px}.pj-h h2{font-size:17px;font-weight:900;margin:0}.pj-h .btn{margin-left:auto}
  .pj-sec h4{font-size:13px;font-weight:900;color:var(--gold-deep);margin:14px 0 2px}.pj-sec p{margin:0;font-size:14px;line-height:1.9;color:var(--ink)}.pj-title{font-size:15px!important;font-weight:700;color:var(--ink2)!important}
  .pj-ul{margin:4px 0 0;padding-left:1.2em;font-size:13.5px;line-height:1.9}.faq{border-top:1px solid var(--line);padding:8px 0}.faq summary{font-weight:700;font-size:13.5px;cursor:pointer}.faq p{font-size:13px;color:var(--ink2);margin-top:4px}
  .rolegrid,.tiergrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;margin-top:8px}
  .rc,.tc{border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;background:var(--paper)}
  .rc.hu{border-color:var(--navy)}.rc.ai,.rc.em{border-style:dashed;border-color:var(--coral)}
  .rc-h{display:flex;align-items:center;gap:8px}.rc-h b{font-size:15px}.rc p,.tc p{font-size:12.5px!important;line-height:1.65!important;color:var(--ink2)!important}
  .rc-meta,.tc-m{display:flex;gap:6px;flex-wrap:wrap;font-size:11px;color:var(--ink2)}.rc-meta span,.tc-m span{background:var(--soft);border-radius:8px;padding:2px 8px}.tc-m .ng{background:var(--red-soft);color:var(--red);font-weight:700}
  .rc-who{display:flex;align-items:center;gap:8px;font-size:12.5px;flex-wrap:wrap}.av2{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:700;flex:0 0 26px}.av2.ai{background:var(--gold-soft);color:var(--gold-deep)}.av2.em{background:transparent;border:2px dashed #98A6C0;color:#98A6C0}
  .rc-ft{margin-top:auto;display:flex;gap:6px;flex-wrap:wrap;padding-top:4px}
  .tc:hover{border-color:var(--coral)}.tc.out{opacity:.55}
  .tc-p{font-family:var(--latin);font-size:22px;font-weight:700;color:var(--ink);display:flex;flex-direction:column}.tc-p small{font-family:var(--body);font-size:11px;font-weight:700;color:var(--coral)}.tc-t{font-size:14px}
  .upd{border-top:1px solid var(--line);padding:10px 0}.upd:first-of-type{border-top:0}.upd .who{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}.upd .who span{font-size:11px;color:var(--ink3)}.upd p{font-size:13.5px!important;margin-top:4px!important;white-space:pre-wrap}
  .pj-side{position:sticky;top:70px}.pj-side .card{border-radius:16px;box-shadow:var(--shadow);border:0}
  .pj-amt{font-family:var(--latin);font-size:30px;font-weight:700;line-height:1.1}.pj-amt small{font-family:var(--body);font-size:14px;color:var(--ink3);font-weight:700}
  .pj-bar{height:9px;background:var(--line);border-radius:5px;overflow:hidden;margin-top:8px}.pj-bar i{display:block;height:100%;background:var(--coral);border-radius:5px}.pj-bar.team i,.bar.team i{background:var(--navy)!important}
  .pj-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0}.pj-meta div{display:flex;flex-direction:column}.pj-meta b{font-family:var(--latin);font-size:17px}.pj-meta span{font-size:11px;color:var(--ink3)}
  .pj-stg{display:flex;gap:3px;margin-top:12px}.pj-stg span{flex:1;text-align:center;font-size:9.5px;font-weight:700;padding:3px 0;border-radius:5px;background:var(--soft);color:var(--ink3);white-space:nowrap;overflow:hidden}.pj-stg .done{background:var(--gold-soft);color:var(--gold-deep)}.pj-stg .now{background:var(--navy);color:#fff}
  .lb{display:block;font-size:12px;font-weight:700;color:var(--ink2);margin:10px 0 3px}
  .workroom{margin-top:18px;border:1px dashed var(--line);border-radius:16px;padding:6px 12px 12px;background:transparent}
  .workroom>summary{cursor:pointer;padding:10px 4px;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;font-size:14px}.workroom>summary b{font-size:15px}
  .pcx .th{aspect-ratio:16/10;align-items:flex-end}.pcx .th img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.pcx .th::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,21,47,0) 35%,rgba(7,21,47,.7))}
  .pcx .pcst{position:absolute;left:8px;top:8px;z-index:1}.pcx .pct{position:relative;z-index:1;font-size:14px}.pcx{border:0;border-radius:14px;box-shadow:0 4px 14px rgba(14,42,91,.08)}
  .pcx .cf .bar i{background:var(--coral)}.lb2{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:11px;color:var(--ink3);margin-top:3px}.lb2 b{font-family:var(--latin);font-size:13px;color:var(--ink)}
  #c-title,#c-body>.statusline{display:none}

  /* ===== 探す（一覧） ===== */`);

rep(`    <div id="c-reuse"></div>`, `    <div id="c-reuse"></div>\n    <div id="pj"></div>`);
rep(`renderTplMake(c); renderSecondCheck(c);`, `renderTplMake(c); renderSecondCheck(c); renderProject(c);`);
/* 言葉：主ボタンとヒーロー */
rep(`<span class="d">一行でいい。AI席が最初の一手を返し、席が立つ</span>`, `<span class="d">一行でいい。AIが記事を下書きし、仲間もお金も同じページで募れる</span>`);
rep(`<b>紹介で参加する</b><span class="d">会員・オファー型。席に座る人を探す側にも、座る側にも</span>`, `<b>仲間として<br>参加する</b><span class="d">「仲間募集中」のプロジェクトで、役割に手を挙げる</span>`);
rep(`<button class="cta sub" onclick="go('members')">`, `<button class="cta sub" onclick="chip='st:recruiting';window._chipTouched=true;renderChips();renderGrid();renderHome();scrollGrid()">`);
rep(`<p class="hs">まだないけど、きっとほしい。そんな「もし」から、席が埋まり、先に買われ、かたちになる。</p>`, `<p class="hs">チームも商品も、揃う前から始められるクラウドファンディング。記事1本で、仲間もお金も募れます。</p>`);

h = h.replace(/<\/script>\s*$/, fs.readFileSync(path.join(__dirname, 'cf_snippet.js'), 'utf8') + '\n</script>\n');
fs.writeFileSync(target, h);
console.log('replacements', n, '->', target);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
