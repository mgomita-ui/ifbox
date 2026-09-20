
/* ===================== 第14回：小学6年生でも直感で使える言葉と導線（GPT-6の総点検を反映） ===================== */
/* 原則：主ボタンは1つ／同じものは同じ名前（計画）／短い日常語、漢字は開かない／買う人にはチームの作業を見せない／お試しと本番を見分けられる */
window.PLAIN=[
 /* 長い言い回しを先に */
 ['（精算まで終わった案件の型を最初から埋める）','（うまくいった計画をお手本にする）'],
 ['案件を選び、受領額と各層の内訳を入れると計算します。配分案は「提示条件」で、7日間の異議期間のあとに確定します。','計画を選び、受け取った金額を入れると、分け方を計算します。決める前の7日間、チームは見直しを求められます。'],
 ['紹介者がいると「会員」、いなければ「一般」と表示されます。','紹介してくれた人がいれば選んでください。'],['（紹介者なし＝一般）','（いない）'],['紹介動画URL','自己紹介の動画（URL）'],['紹介者','紹介してくれた人'],
 ['残余配分のうち','残ったお金のうち'],['残額に対する割合','残ったお金に対する割合'],['IFBOX支援単位','IFBOXに払う分'],['契約生成','約束の書類づくり'],['検収・精算支援','確認と支払いの手伝い'],['価格・配分案の作成','値段と分け方の案づくり'],['価格・配分案','値段と分け方の案'],['支援総額を使う','申し込みの合計額を使う'],
 ['一般予定','発売後の予定価格'],['人が申込','人が申し込み'],['次の一手','次にやること'],['提案を募る','やる人を募る'],
 ['目標に届いたときだけ成立します（届かなければ全員キャンセル）。','期限までに目標額が集まった場合だけ、注文が成立します。'],['目標に届いたときだけ成立します。','期限までに目標額が集まった場合だけ、注文が成立します。'],['目標に届いたときだけ成立','期限までに目標額が集まった場合だけ成立'],
 ['目標に届かなくても、申し込まれた分は成立します。','目標額に届かなくても、注文は成立します。'],['届かなくても申込分は成立','目標額に届かなくても成立'],['申込分は成立','目標額に届かなくても成立'],
 ['この試作では決済は行いません（模擬）。申し込みは「先に買う約束」として記録されます。目標達成は完成や提供の保証ではありません。','お試しです。支払いも、実際のお届けもありません。目標額に届いても、完成やお届けができない場合があります。'],
 ['この試作では決済は行いません（模擬）。申し込みは「先に買う約束」の記録です。販売者は発案者で、IFBOXはお金を預かりません。','お試しです。支払いも、実際のお届けもありません。'],
 ['名札です。認証ではありません。他の人があなたを選ぶことは防げません。機密情報・個人情報・実際の送金情報は入力しないでください。','名前を選ぶだけで、本人かどうかは確認していません。本名や住所、お金の情報は入れないでください。'],
 ['段階は人の確定でだけ上がります。赤い角は成約済。参加者の選択は名札で、認証ではありません。機密情報・個人情報・実際の送金情報は入力しないでください。','本名や住所、お金の情報は入れないでください。'],
 ['雇用の募集ではなく、取り分のある共同の仕事です。','雇われる仕事ではなく、受け取るお金を決めて一緒に進める仕事です。'],
 ['スレッド・提案・納品と検収・台帳・配分の準備。買う人には、上の記事とチームだけで足ります。','話し合い、参加の申し出、できたものの確認、お金の記録。チームだけが使います。'],
 ['入る・募集内容を変えるのは、上の「チームと役割」のカードから。赤い印は、期限を過ぎた作業がある人です。','参加や募集の変更は、上の「チームと役割」から。'],
 ['3つの役割が揃うと、このページがそのまま先行販売の案内になります。','3つの役割がそろうと、このページで販売を始められます。'],
 ['仲間が揃ってから用意されます。気になる方はフォローしてください。','仲間がそろってから用意されます。「気になる」に入れておくと、始まったときに知らせが届きます。'],
 ['できること・持っているもの（技能・販路・場所・資格・実績）を一言。言い出した人が迎えると参加が決まります。スレッドにも載ります。','あなたが手伝えることを一言で。この計画を始めた人が受けると、参加が決まります。話し合いにも載ります。'],
 ['手を挙げました。言い出した人が迎えると参加が決まります。','送りました。始めた人が受けると、参加が決まります。'],
 ['同じ記事がそのまま販売の案内になります。仲間の名前と役割も載ります。','いまの紹介ページが、そのまま販売のページになります。'],
 ['注文と決済は外部サイトで行われます。IFBOXには、構想・チーム・進み具合・約束・購入先を残します。外部で売る場合、IFBOXへの支払いはありません。','申し込みと支払いは、その販売サイトで行います。IFBOXへの支払いはありません。'],
 ['まだ揃っていない役割があります。買う人は「誰が作り、誰が確かめるか」を見ます。','まだそろっていない役割があります。買う人は「誰が作り、誰が確かめるか」を見ています。'],
 ['3つの役割に、何人ずつ要るか。あなたは「つくる」に入っています。兼ねるのは自由ですが、つくる人は「確かめて良くする」を兼ねられません。あとから直せます。','3つの役割に、何人ずつ必要かを決めます。あなたは「つくる」に入っています。つくる人は「確かめて良くする」にはなれません。あとから直せます。'],
 ['この記事1本で、仲間もお金も募ります。AIに下書きさせてから直すのが早いです。','この紹介ページで、仲間も買う人も集めます。AIの下書きを直すのが早道です。'],
 ['紹介者がいる参加者を「会員」、いない参加者を「一般」と表示します。案件から会員へ「この席に座ってほしい」とオファーを送り、相手が受けるか辞退するかを決めます（承認制）。席に座るのを会員に限るかの線引きは未決のため、いまは表示だけで制限しません。','参加している人の一覧です。紹介してくれた人がいる場合は「紹介あり」と出ます。一緒にやりたい人には「招待」を送れます。受けるかどうかは相手が決めます。'],
 ['模擬精算を確定する（段階5）','お試しの支払いを終える'],['受領額で模擬受領を記録','受け取った金額を記録（お試し）'],['模擬受領と精算（実決済なし）','受け取りと支払い（お試し）'],['この案件に保存（提示）','この分け方を見せる'],
 ['AIの最初の一手','AIからの最初の助言'],['着手前に引く線','始める前に決めておくこと'],['リスクと、着手前に引く線','気をつけることと、始める前の約束'],['言い換えたもし','一言でいうと'],
 ['俺これできる（席を名乗る）','この役割をやりたい'],['俺これできる','やりたい'],['ひとこと','メッセージ'],
 ['の席に座ってもらう','として迎える'],['の席に座った','の役割に入った'],['の席に迎えた','の仲間に迎えた'],['の席を名乗った','に手を挙げた'],['の席を降りた','の役割を降りた'],['席を名乗っている','に手を挙げている'],['買い手席','買う人'],['買い手の席','買う人'],['AI席','AI'],['着席','参加決定'],
 ['先行販売を始める','販売を始める'],['先行販売中','販売中'],['先行販売','完成前の販売'],['リターンを選ぶ','買えるものを見る'],['リターンを足す','買えるものを足す'],['リターンを直す','買えるものを直す'],['リターン ― お金で参加する','買えるもの'],['リターン','買えるもの'],
 ['これを先に買う','申し込み内容を確認'],['申し込む（模擬）','申し込みを試す'],['先に買った人','申し込んだ人'],['先に買う','申し込む'],
 ['フォローして、販売開始を知る','「気になる」に入れて、開始の知らせを受ける'],['フォロー中 ✓','気になる ✓'],['フォローする','気になる'],['人がフォロー','人が気になる'],['フォロー','気になる'],['共感する','いいね'],['共感 ','いいね '],['共感','いいね'],
 ['会員にオファーを送る','一緒にやりたい人を招待する'],['会員にオファー','人を招待する'],['オファーを送る','招待する'],['オファー','招待'],
 ['取りまとめ役','まとめ役'],['取りまとめ','まとめ役'],['言い出した人','始めた人'],['発案者','始めた人'],['（発案者）','（始めた人）'],
 ['検収基準（着手前に公開）','完成とする条件（始める前に決める）'],['検収基準','完成とする条件'],['検収待ち','確認待ち'],['納品・検収','渡す・確認'],['検収','確認'],['納品','できたものを渡す'],['成果物','できたもの'],
 ['確定対価','売れなくても払う金額'],['成果連動','残ったお金から払う割合'],['発案枠','始めた人に分ける割合'],['受領額','受け取った金額'],['異議を出す','分け方の見直しを求める'],['異議期間','見直しを求められる期間'],['異議','見直しの求め'],
 ['配分案','お金の分け方の案'],['配分 ― 三層で分け、IFBOXの取り分は先に公開する','お金の分け方'],['配分','お金の分け方'],['取り分','受け取るお金'],['台帳','仕事と支払いの記録'],['型・比較','くり返し使う'],['似た型を探す','似た計画から始める'],
 ['期待する稼働','作業時間の目安'],['稼働 ','作業時間 '],['納期','仕上げる期限'],['販路','売る場所や方法'],['成約済','注文が決まった'],['実案件','実際の計画'],['（模擬）','（お試し）'],['模擬','お試し'],
 ['便益を受ける人','誰の役に立つ？'],['期限超過','期限を過ぎています'],['呼び戻す','一覧に戻す'],['領域から探す','テーマから探す'],['領域未定','テーマ未定'],
 ['チームの作業場','チームのページ'],['作業場','チームのページ'],['スレッド','話し合い'],['活動報告','進み具合のお知らせ'],
 ['保管庫 ― 反応のない「もし」は、捨てない・目立たせない・束ねる','休止中の計画'],['保管へ移す','休止にする'],['保管庫','休止中の計画'],['保管中','休止中'],
 ['自分の手番 ― 次に自分が動くものだけ','自分のやること'],['手番','自分のやること'],
 ['注目の案件','注目の計画'],['すべての案件','すべての計画'],['この案件','この計画'],['案件を','計画を'],['案件','計画'],['プロジェクト','計画'],['構想','アイデア'],
 ['あと1名 募集中','あと1人募集'],['名 募集中','人募集'],['募集内容と人数','募集の内容と人数'],
 ['揃った','そろった'],['揃いました','そろいました'],['揃う','そろう'],['揃って','そろって']
];
window.PLAIN_RE=[[/¥([\d,]+)/g,'$1円'],[/残り (\d+) \/ (\d+)/g,'残り$1／限定$2'],[/名札「([^」]*)」の自分のやること。.*持ちません。/,'「$1」さんが次にやることです。'],[/あなたの自分のやること/g,'あなたがやること']];
window.PLAIN_EXACT={'会員':'紹介あり','一般':'紹介なし'};
const PLAIN_SKIP='#c-msgs .tx,#pj-story p,.pj-title,.upd p,.upd b,.tc p,.tc-t,.rc>p,.rc-who b,.pct,.pj-cv h1,.pcx .nm,.ftt,.fdesc,#c-title,.prop .tx,.prop .nm,.feat .ft2,textarea,input,[data-raw]';
function plainText(s){ if(!s||!window.PLAIN||window.PLAIN_OFF) return s; let o=s; for(const [a,b] of window.PLAIN){ if(a!==b&&o.includes(a)) o=o.split(a).join(b); } for(const [re,to] of window.PLAIN_RE) o=o.replace(re,to); return o; }
function plainApply(root){ if(!root||window.PLAIN_OFF) return; const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{ const p=n.parentElement; if(!p||p.closest('script,style')||p.closest(PLAIN_SKIP)) return NodeFilter.FILTER_REJECT; return n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT; }}); const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
  for(const n of nodes){ const ex=window.PLAIN_EXACT&&window.PLAIN_EXACT[n.nodeValue.trim()]; const t=ex?n.nodeValue.replace(n.nodeValue.trim(),ex):plainText(n.nodeValue); if(t!==n.nodeValue) n.nodeValue=t; }
  document.querySelectorAll('body>div').forEach(e=>{ if(!e.id&&!e.className&&/^デモモード/.test(e.textContent||'')) e.remove(); });
  root.querySelectorAll('[placeholder],[title]').forEach(e=>{ if(e.placeholder){ const t=plainText(e.placeholder); if(t!==e.placeholder) e.placeholder=t; } if(e.title){ const t=plainText(e.title); if(t!==e.title) e.title=t; } }); }
/* 受入テスト（偽のDB）では止める。FORCE_PLAIN で有効化 */
window.PLAIN_OFF=!!window.__store&&!window.FORCE_PLAIN;
(function(){ let timer=null, busy=false; const run=()=>{ timer=null; busy=true; try{ plainApply(document.body); }catch(e){} busy=false; }; new MutationObserver(()=>{ if(busy||window.PLAIN_OFF) return; if(!timer) timer=setTimeout(run,20); }).observe(document.body,{childList:true,subtree:true,characterData:true}); setTimeout(run,0); window.plainNow=run; })();
const _toast14=toast; toast=function(t){ _toast14(plainText(t)); };

/* ---------- ナビ：入口ごとに4つ。残りは「その他」へ ---------- */
const NAV14={make:[['home','計画を探す',()=>{ go('home'); setChip('all'); },'search'],['x-write','アイデアを書く',()=>{ go('home'); showPost(true); },'plus'],['x-mine','参加中の計画',()=>{ go('home'); setChip('mine'); scrollGrid(); },'box'],['turns','自分のやること',()=>go('turns'),'check'],['x-more','その他',()=>openMore(),'list']],
 back:[['home','買えるもの',()=>{ go('home'); setChip('st:selling'); scrollGrid(); },'cart'],['x-prep','準備中の計画',()=>{ go('home'); setChip('st:pre'); scrollGrid(); },'spark'],['x-fav','気になる',()=>{ go('home'); setChip('fav'); scrollGrid(); },'heart'],['x-orders','申し込みの確認',()=>openOrders(),'doc']]};
function setChip(k){ chip=k; window._chipTouched=true; try{ renderChips(); renderGrid(); renderHome(); }catch(e){} }
function buildNav(){ const nav=document.querySelector('.top nav'); if(!nav) return; const items=NAV14[viewMode==='back'?'back':'make']; nav.innerHTML=''; items.forEach(([s,label,fn,ic])=>{ const b=document.createElement('button'); b.dataset.s=s; b.innerHTML=`<span class="ni">${I[ic]||''}</span>${label}`; b.onclick=()=>{ fn(); nav.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); }; nav.appendChild(b); }); const cur0=nav.querySelector('button[data-s="home"]'); if(cur0) cur0.classList.add('on'); }
function openMore(){ md(`<h3>その他</h3><div class="morelist"><button onclick="closeMd();go('members')"><b>参加している人</b><span>一緒にやりたい人を探して、招待する</span></button><button onclick="closeMd();go('money')"><b>お金の分け方</b><span>売れたお金を、チームでどう分けるか</span></button><button onclick="closeMd();go('archive')"><b>休止中の計画</b><span>止まっている計画を見る・一覧に戻す</span></button><button onclick="closeMd();editMe()"><b>自分の紹介</b><span>名前、紹介してくれた人、できること</span></button></div><div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">閉じる</button></div>`); }
function openOrders(){ const mine=[]; Object.values(cases).forEach(c=>{ (c.cf?.pledges||[]).forEach(p=>{ if(p.by===me()&&!p.ext) mine.push({c,p}); }); }); mine.sort((a,b)=>b.p.t-a.p.t);
  md(`<h3>申し込みの確認</h3><p class="sm">あなたが申し込んだものです。お試しなので、支払いはありません。外部の販売サイトで買ったものは、そのサイトで確認してください。</p>${mine.length?`<table><tr><th>計画</th><th>買えるもの</th><th style="text-align:right">数</th><th style="text-align:right">金額</th></tr>${mine.map(({c,p})=>`<tr style="cursor:pointer" onclick="closeMd();openCase('${c.id}')"><td data-raw>${esc(c.reframed||c.title)}</td><td class="sm" data-raw>${esc((tiersOf(c).find(t=>t.id===(p.tierId||'legacy'))||{}).title||'')}</td><td class="num">${pledgeQty(p)}</td><td class="num">${yen(p.amount)}</td></tr>`).join('')}</table>`:'<p class="sm" style="margin-top:8px">まだ申し込みはありません。</p>'}<div class="row" style="justify-content:flex-end"><button class="btn ghost" onclick="closeMd()">閉じる</button></div>`); }
/* 一覧：参加中・気になる・準備中の絞り込み */
const _renderGrid14=renderGrid; renderGrid=function(){ _renderGrid14(); const f=chip==='mine'?(c=>isTeam(c)):chip==='fav'?(c=>(c.followers||[]).includes(me())):chip==='st:pre'?(c=>['recruiting','preparing'].includes(projStatus(c))):null; if(!f) return; let n=0; document.querySelectorAll('#grid .pcx').forEach(el=>{ const m=(el.getAttribute('onclick')||'').match(/openCase\('([^']+)'\)/); const ok=m&&cases[m[1]]&&f(cases[m[1]]); el.hidden=!ok; if(ok) n++; }); $('cnt').textContent=n+' 件'; if(!n){ const p=document.createElement('p'); p.className='sm'; p.textContent=chip==='mine'?'まだ参加している計画はありません。':chip==='fav'?'「気になる」に入れた計画はまだありません。':'準備中の計画はまだありません。'; $('grid').prepend(p); } };
const _renderChips14=renderChips; renderChips=function(){ const all=viewMode==='back'?[['st:selling','販売中'],['st:pre','準備中'],['st:funded','目標額に到達'],['fav','気になる'],['all','すべて']]:[['all','すべて'],['st:recruiting','仲間を募集中'],['st:preparing','準備中'],['st:selling','販売中'],['mine','参加中'],['sample','サンプル']];
  $('chips').innerHTML=all.map(([k,n])=>`<button class="chip ${chip===k?'on':''}" onclick="setChip('${k}')">${n}</button>`).join(''); };

/* ---------- 入口ごとの言葉（主ボタンは1つ） ---------- */
const _setView14=setView; setView=function(v,keep){ _setView14(v,keep); buildNav(); const ht=document.querySelector('.hero .ht'), hs=document.querySelector('.hero .hs'); const m=document.querySelector('.cta.main'), s=document.querySelector('.cta.sub'); if(!ht||!m||!s) return;
  if(v==='back'){ ht.innerHTML='できる前から、<br><span class="ac2">応援</span>できる。'; hs.textContent='まだ世の中にないものを、完成する前に申し込めます。気になる計画は、始まったら知らせが届きます。'; m.querySelector('b').innerHTML='買えるものを見る'; m.querySelector('.d').textContent='いま申し込める計画'; m.onclick=()=>{ setChip('st:selling'); scrollGrid(); }; s.querySelector('b').innerHTML='準備中の計画を見る'; s.querySelector('.d').textContent='気になるものは、始まったら知らせが届く'; s.onclick=()=>{ setChip('st:pre'); scrollGrid(); }; }
  else { ht.innerHTML='<span class="ac">「もし」</span>を、<br>みんなで<span class="ac2">形</span>に。'; hs.textContent='思いついたことを1行書くと、紹介ページができます。そのページで、仲間も、先に買ってくれる人も集められます。'; m.querySelector('b').innerHTML='アイデアを書く'; m.querySelector('.d').textContent='1行で大丈夫。AIが紹介ページを下書きします'; m.onclick=()=>showPost(true); s.querySelector('b').innerHTML='仲間を募集している<br>計画を見る'; s.querySelector('.d').textContent='手伝えそうな役割に、手を挙げる'; s.onclick=()=>{ setChip('st:recruiting'); scrollGrid(); }; } };
(function(){ const L=(id,t)=>{ const l=document.querySelector('label[for="'+id+'"]'); if(l) l.textContent=t; }; L('ifline','アイデアを1行で'); L('benefit','誰の役に立つ？'); L('demo','見せられるもの（URL・なくてもよい）'); const pb=$('postbtn'); if(pb) pb.textContent='紹介ページを作る'; const i=$('ifline'); if(i) i.placeholder='例）冷蔵庫の写真を撮るだけで、今夜の献立が決まったら'; const b=$('benefit'); if(b) b.placeholder='例）夜に料理する一人暮らしの人';
  const tb=document.querySelector('.toolbar .sm'); if(tb) tb.textContent='本名や住所、お金の情報は入れないでください。';
  /* お試し版の帯 */
  if(!$('trialbar')){ const d=document.createElement('div'); d.id='trialbar'; d.className='trialbar'; d.textContent=window.DEMO_MODE?'お試し版｜支払いなし・入力は保存されません':'お試し版｜支払いなし・入力は参加者みんなに見えます'; document.querySelector('.top').insertAdjacentElement('afterend',d); }
  document.querySelectorAll('body>div').forEach(e=>{ if(/^デモモード/.test(e.textContent||'')&&!e.id) e.remove(); });
  /* 初回ガイド */
  const tour=$('tour'); if(tour){ const p=tour.querySelector('.p'); if(p){ const k=p.querySelector('.k'), h=p.querySelector('h3'), ol=p.querySelector('ol'); if(k) k.textContent='はじめに'; if(h) h.textContent='IFBOXでできること'; if(ol){ ol.setAttribute('data-raw','1'); } if(ol) ol.innerHTML='<li><b>アイデアを出す</b>なら「つくる」。1行から紹介ページを作れます。</li><li><b>仲間になる</b>なら、募集中の役割を選んで、手伝えることを送ります。</li><li><b>先に買う</b>なら「おうえん」。いまはお試しで、支払いはありません。</li>'; const sm=p.querySelector('.sm'); if(sm) sm.textContent='サンプルの計画が20件入っています。自由にさわってください。'; } }
  /* チームのページのタブ名 */
  const TL={msgs:'話し合い',props:'参加の申し出',cf:'販売と買えるもの',accept:'渡す・確認',ledger:'仕事と支払いの記録',compare:'くり返し使う',log:'できごと'}; document.querySelectorAll('.tabs button').forEach(b=>{ const t=TL[b.dataset.p]; if(!t) return; const sp=b.querySelector('span'); b.textContent=t+' '; if(sp) b.appendChild(sp); });
  const g=document.querySelector('#workroom .guide'); if(g) g.remove(); })();

/* ---------- 数字の見せ方 ---------- */
const _renderProject14=renderProject; renderProject=function(c){ _renderProject14(c); try{ const cf=c.cf; if(!cf||cf.draft) return; const total=cfTotal(c), goal=cf.goal||0, pct=goal?(total>=goal?Math.floor(total/goal*100):Math.min(99,Math.round(total/goal*100))):0, live=cfLive(c), leftMs=(cf.deadline||0)-now(); const meta=document.querySelector('.pj-side .pj-meta'); if(!meta) return;
  const leftTxt=!live?'申し込み終了':leftMs<DAY?'あと'+Math.max(1,Math.ceil(leftMs/3600000))+'時間':'終了まで'+Math.ceil(leftMs/DAY)+'日';
  meta.innerHTML=`<div><b>${goal?'目標額の'+pct+'%':'—'}</b><span>${goal?yen(total)+'／目標'+yen(goal):''}</span></div><div><b>${backerCount(c)}人</b><span>申し込んだ人</span></div><div><b>${leftTxt}</b><span>${cf.deadline?new Date(cf.deadline).toLocaleDateString('ja-JP',{year:'numeric',month:'numeric',day:'numeric'})+'まで':''}</span></div>`;
  const amt=document.querySelector('.pj-side .pj-amt'); if(amt&&goal){ let x=document.querySelector('.pj-side .pj-rest'); if(!x){ x=document.createElement('div'); x.className='pj-rest'; meta.insertAdjacentElement('afterend',x); } x.textContent=total>=goal?'目標額に到達しました（完成を約束するものではありません）':'目標まであと'+yen(goal-total); } }catch(e){} };
setTimeout(()=>{ try{ setView(viewMode,true); }catch(e){} },30);
