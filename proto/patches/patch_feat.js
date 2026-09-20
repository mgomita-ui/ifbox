// 第14回の仕上げ：注目の計画カードから内部の6段階と席の記号を外し、状態と役割の数にする
const fs=require('fs'); const target=process.argv[2]; let h=fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n');
const FN=`
/* 注目の計画カード：内部用語を出さない */
const _renderHome14=renderHome; renderHome=function(){ _renderHome14(); try{ const f=document.querySelector('#featured .feat'); if(!f) return; const m=(f.getAttribute('onclick')||'').match(/openCase.'([^']+)'/); const c=m&&cases[m[1]]; if(!c) return; f.querySelector('.fst')?.remove(); const en=f.querySelector('.fen'); if(en) en.outerHTML='<div class="fen2">'+stTag(c)+'</div>'; const sd=f.querySelector('.seatdots'); if(sd){ const need=neededRoles(c), filled=teamFilled(c); const s=document.createElement('span'); s.textContent='役割 '+filled+'/'+need.length+(openRoleNames(c).length?' ・ 募集中：'+openRoleNames(c).join('、'):' ・ そろいました'); sd.replaceWith(s); const nx=s.nextElementSibling; if(nx&&!nx.classList.contains('grow')&&!nx.classList.contains('ic')) nx.remove(); } }catch(e){} };
`;
if(!h.includes('.fen2{')) h=h.replace('  /* ===== 探す（一覧） ===== */','  .fen2{position:absolute;left:12px;top:12px;z-index:1}\n\n  /* ===== 探す（一覧） ===== */');
h=h.replace(/<\/script>\s*$/, FN+'\n</script>\n'); fs.writeFileSync(target,h);
const m=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]); for(const [i,code] of m.entries()){ try{ new Function(code); console.log('script',i,'ok'); }catch(e){ console.log('script',i,'SYNTAX ERROR',e.message); } }
