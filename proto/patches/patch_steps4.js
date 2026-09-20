// 第14回の手直し：進み方を4歩に（作り込みと届ける段階を分ける）。支払いは届いたあと、届かなければ返金。
// 使い方: node patch_steps4.js <target html>
const fs = require('fs');
const target = process.argv[2];
let h = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
const FN = `
/* ===================== 進み方は4歩。支払いは届いたあと ===================== */
const PAY_RULE='支払いは、届いたあと。届かなければ返金します。';
function stepBar(c){ const st=projStatus(c); const now=c.stage>=5?5:c.stage>=4?4:c.stage>=2?3:(st==='selling'||st==='funded'||st==='unfunded')?2:1;
  const S=[['仲間を集める','3つの役割がそろうまで'],['申し込みを集める','目標額に届いたら、つくり始める'],['つくって、確かめて、良くする','つくる人とは別の人が、確かめながら仕上げる'],['届けて、支払い','支払いは届いたあと。届かなければ返金']];
  return '<div class="steps">'+S.map(([a,b],i)=>'<div class="sp '+(i+1<now?'done':i+1===now?'now':'')+'"><span class="no">'+(i+1<now?'✓':(i+1))+'</span><div><b>'+a+'</b><small>'+(i+1===now?'いまここ ・ ':'')+b+'</small></div></div>').join('')+'</div>'; }
const _renderProject15=renderProject; renderProject=function(c){ _renderProject15(c); try{ const cf=c.cf; if(!cf||cf.draft) return; const side=document.querySelector('.pj-side .card'); if(!side||side.querySelector('.pj-pay')) return; const p=document.createElement('p'); p.className='pj-pay'; p.textContent=PAY_RULE; const anchor=side.querySelector('.pj-rest')||side.querySelector('.pj-meta'); if(anchor) anchor.insertAdjacentElement('afterend',p); }catch(e){} };
if(window.PLAIN){ window.PLAIN.forEach(p=>{ if(p[1]==='お試しです。支払いも、実際のお届けもありません。目標額に届いても、完成やお届けができない場合があります。') p[1]='お試しなので、支払いも実際のお届けもありません。本番では、'+PAY_RULE; if(p[1]==='お試しです。支払いも、実際のお届けもありません。') p[1]='お試しなので、支払いはありません。本番では、'+PAY_RULE; }); }
`;
if (!h.includes('.pj-pay{')) h = h.replace('  /* ===== 探す（一覧） ===== */', '  .pj-pay{font-size:12.5px;font-weight:700;color:var(--navy);background:var(--gold-soft);border-radius:10px;padding:7px 10px;margin:0 0 8px}\n\n  /* ===== 探す（一覧） ===== */');
h = h.replace(/<\/script>\s*$/, FN + '\n</script>\n');
fs.writeFileSync(target, h);
const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
for (const [i, code] of m.entries()) { try { new Function(code); console.log('script', i, 'ok'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } }
