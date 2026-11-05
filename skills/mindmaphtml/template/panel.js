// Seitenfenster (Thema/Konzept mit 3D-Figur oder Mini-Quiz), Overlay mit der Aufgaben-Seite, Ecke „Immer machen“, Suche und Bereichsfilter.
(function(){
const D=window.MM, M=window.MMmap, $=id=>document.getElementById(id), P=$('panel');
const tById=Object.fromEntries(D.topics.map(t=>[t.id,t])), cById=Object.fromEntries(D.concepts.map(c=>[c.id,c]));
const col=a=>`var(${D.areas[a].col})`;
const stepLabel=h=>{if(!h)return 'Seite ansehen';const m=h.match(/(?:tab-([\w-]+)\/)?schritt-(\d+)/);const tab=(D.tabNames||{})[m[1]]||'';return `Schritt ${m[2]}${tab?' · '+tab:''}`;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ---------- Overlay: fertige 3D-Seite öffnen (nichts wird neu gebaut) ----------
const ov=$('ov'), frame=$('ov-frame');
function openPage(tid,hash){const t=tById[tid];const url=t.file+(hash?'#'+hash:'');
  $('ov-title').textContent=`${t.nr} · ${t.name}`+(hash?` — ${stepLabel(hash)}`:'');$('ov-tab').href=url;
  frame.src='about:blank';requestAnimationFrame(()=>{frame.src=url;});ov.hidden=false;document.body.classList.add('noscroll');$('ov-close').focus();}
function closePage(){ov.hidden=true;frame.src='about:blank';document.body.classList.remove('noscroll');}
$('ov-close').onclick=closePage;addEventListener('keydown',e=>{if(e.key==='Escape'&&!ov.hidden)closePage();});
ov.addEventListener('click',e=>{if(e.target===ov)closePage();});

// ---------- Panel-Inhalte ----------
function chip(c){return `<button class="chip" data-c="${c.id}" style="--c:${col(c.area)}">${esc(c.name)}</button>`;}
function intro(){P.innerHTML=`<div class="p-eyebrow">So funktioniert die Karte</div><h2>Klick auf einen Knoten</h2>
 <ul class="howto"><li><b>Kästchen mit Nummer</b> = Thema mit eigener Aufgaben-Seite</li><li><b>Pille</b> = Konzept mit Formel, Erklärung und Falle</li>
 <li><b>Linie</b> = „kommt in diesem Thema vor“</li><li><b style="color:var(--neg)">lila gestrichelt</b> = Analogie</li>
 <li>Ziehen = verschieben, Mausrad oder zwei Finger = zoomen</li></ul>
 <p class="p-muted">${D.topics.length} Themen · ${D.concepts.length} Konzepte · ${M.links.filter(l=>l.kind==='use').length} Verbindungen</p>`;}
function topic(t){const cs=D.concepts.filter(c=>t.id in c.use);const maxHits=Math.max(1,...D.topics.map(x=>x.hits||0));
 P.innerHTML=`<div class="p-eyebrow" style="color:${col(t.area)}">${D.areas[t.area].name} · Thema ${t.nr}</div><h2>${esc(t.name)}</h2>
 ${t.lede?`<p>${t.lede}</p>`:''}
 <dl class="facts">${(t.facts||[]).map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}
 ${t.hits?`<dt>Häufigkeit</dt><dd><span class="bar"><i style="width:${100*t.hits/maxHits}%;background:${col(t.area)}"></i></span> ${t.hits} ${D.hitsLabel||'Treffer'}</dd>`:''}</dl>
 <div class="btnrow"><button class="btn primary" data-open="${t.id}">Aufgaben-Seite öffnen</button>${!t.noSolution?`<button class="btn" data-open="${t.id}" data-h="loesung">Klausurlösung</button>`:''}</div>
 <h3>Konzepte in diesem Thema</h3><ul class="uses">${cs.map(c=>`<li>${chip(c)}<button class="go" data-open="${t.id}" data-h="${c.use[t.id]}">${stepLabel(c.use[t.id])} →</button></li>`).join('')}</ul>`;}
function concept(c){const an=D.analog.filter(a=>a[0]===c.id||a[1]===c.id);
 P.innerHTML=`<div class="p-eyebrow" style="color:${col(c.area)}">${D.areas[c.area].name} · Konzept</div><h2>${esc(c.name)}</h2>
 <div class="fbox">${c.f}</div>
 ${c.fig?`<div class="fig" id="fig" data-fig="${c.fig}"><span class="hint">ziehen zum Drehen</span></div>`:c.quiz?`<div class="qz" id="quiz"><span class="hint">Mini-Quiz</span></div>`:''}
 <h3>Kurz erklärt</h3><p>${c.k}</p>
 <div class="warn">${c.w}</div>
 ${c.m?`<div class="memo"><b>Merksatz:</b> ${c.m}</div>`:''}
 <h3>Taucht auf in</h3><ul class="uses">${Object.entries(c.use).map(([tid,h])=>{const t=tById[tid];return `<li><button class="tref" data-t="${tid}" style="--c:${col(t.area)}"><b>${t.nr}</b> ${esc(t.name)}</button><button class="go" data-open="${tid}" data-h="${h}">${stepLabel(h)} →</button></li>`;}).join('')}</ul>
 ${an.length?`<h3>Analogie</h3>${an.map(a=>{const o=cById[a[0]===c.id?a[1]:a[0]];return `<p class="analog">${chip(o)}<br>${a[2]}</p>`;}).join('')}`:''}`;
 if(c.fig&&window.MMfig)window.MMfig.mount($('fig'),c.fig);else if(c.quiz)quiz($('quiz'),c.quiz);}
// Mini-Quiz statt 3D-Figur (Konzept mit quiz:[{q,o:[…],r,why}]): eine Antwort pro Frage, danach die Erklärung
function quiz(el,Q){Q.forEach((q,qi)=>{const b=document.createElement('div');b.className='q';b.innerHTML=`<p><b>${qi+1}.</b> ${q.q}</p><div class="opts"></div>`;
  const o=b.querySelector('.opts'),bs=q.o.map(t=>{const x=document.createElement('button');x.className='opt';x.innerHTML=t;o.appendChild(x);return x;});
  bs.forEach((x,k)=>x.onclick=()=>{bs.forEach(y=>y.disabled=true);bs[q.r].classList.add('right');if(k!==q.r)x.classList.add('wrong');
   const w=document.createElement('p');w.className='why';w.innerHTML=(k===q.r?'<b>Richtig.</b> ':'<b>Nicht ganz.</b> ')+(q.why||'');b.appendChild(w);});
  el.appendChild(b);});}
function always(){const A=D.always;M.select(null);
 P.innerHTML=`<div class="p-eyebrow" style="color:var(--ok)">Gilt für jede Aufgabe</div><h2>${A.name}</h2>
 <ol class="checks">${A.items.map(([h,x])=>`<li><b>${h}:</b> ${x}</li>`).join('')}</ol>
 <h3>Proben auf deinen Seiten</h3><ul class="uses">${Object.entries(A.use).map(([tid,h])=>{const t=tById[tid];return `<li><button class="tref" data-t="${tid}" style="--c:${col(t.area)}"><b>${t.nr}</b> ${esc(t.name)}</button><button class="go" data-open="${tid}" data-h="${h}">${stepLabel(h)} →</button></li>`;}).join('')}</ul>`;}

addEventListener('mm-select',e=>{if(window.MMfig)window.MMfig.unmount();const n=e.detail;if(!n){intro();return;}
  n.kind==='topic'?topic(tById[n.id]):concept(cById[n.id]);P.scrollTop=0;
  if(matchMedia('(max-width:900px)').matches)P.scrollIntoView({behavior:'smooth',block:'start'});});
P.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.open){openPage(b.dataset.open,b.dataset.h||'');return;}
  const id=b.dataset.c||b.dataset.t;if(id){M.select(id);M.focus(id);}});
if(D.always)$('always').onclick=always;else $('always').hidden=true;
if(D.meta){['title','eyebrow','lede'].forEach(k=>{if(D.meta[k]){const el=document.querySelector(k==='title'?'h1':'.'+k);if(el)el.textContent=D.meta[k];}});if(D.meta.title)document.title=D.meta.title;if(D.meta.search)$('q').placeholder=D.meta.search;}
$('always').querySelector('b')&&D.always&&($('always').innerHTML=`<b>✓ Immer machen</b>${D.always.name}: gilt für jede Aufgabe`);

// ---------- Suche & Filter ----------
const on=new Set(Object.keys(D.areas));
$('chips').innerHTML=Object.entries(D.areas).map(([k,a])=>`<button class="fchip" data-a="${k}" aria-pressed="true" style="--c:var(${a.col})">${a.name}</button>`).join('');
function apply(){const hits=M.filter(on,$('q').value);$('qn').textContent=$('q').value.trim()?`${hits.length} Treffer`:'';return hits;}
$('chips').onclick=e=>{const b=e.target.closest('.fchip');if(!b)return;const a=b.dataset.a;on.has(a)?on.delete(a):on.add(a);b.setAttribute('aria-pressed',on.has(a));apply();};
$('q').oninput=apply;
$('q').onkeydown=e=>{if(e.key==='Enter'){const h=apply();if(h[0]){M.select(h[0].id);M.focus(h[0].id);}}};
$('fit').onclick=()=>M.fit();
intro();
})();
