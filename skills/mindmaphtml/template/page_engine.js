/* Gemeinsame Lern-Engine aller Aufgaben-Seiten (mit und ohne 3D). Wird von offline.py in jede Seite eingebettet. Nicht pro Seite neu schreiben.
   Enthält:
   Vorhersagen (schaltet 2+3 frei), Beweis, Klausurlösung, Üben mit Multiple Choice, Zuordnen, Lückentext,
   Reihenfolge, Freitext mit Musterantwort, dazu Helfer für Simulationen (slider, seg).
   Die Inhalte (Fragen, Simulation, Lösung) stehen in der jeweiligen Seite und rufen diese Funktionen auf. */
const $=id=>document.getElementById(id);
const fr=(n,d)=>`<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const nf=(v,d=2)=>Number(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const num=s=>{s=String(s).trim().replace(/\s|€|%/g,'');if(/,\d{1,2}$/.test(s)||/\d\.\d{3}/.test(s))s=s.replace(/\./g,'').replace(',','.');else s=s.replace(',','.');return parseFloat(s);};
const norm=s=>String(s).toLowerCase().replace(/[\s.\-–]/g,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss');

/* ---------- 1 Vorhersagen ---------- */
function predict(Q,onDone){const S={};
 const done=()=>Q.every(q=>S[q.id]);
 function r(){const qs=$('qs');qs.innerHTML='';
  Q.forEach((q,qi)=>{const p=S[q.id],locked=qi>0&&!S[Q[qi-1].id];const blk=document.createElement('div');blk.className='qblock';blk.innerHTML=`<p>${q.q}</p>`;
   const o=document.createElement('div');o.className='opts';
   q.opts.forEach(([k,t])=>{const b=document.createElement('button');b.className='opt';b.id=`opt-${q.id}-${k}`;b.innerHTML=t;
    if(p||locked)b.disabled=true;if(p){if(k===q.right)b.classList.add('right');else if(k===p)b.classList.add('wrong');}
    b.onclick=()=>{S[q.id]=k;r();};o.appendChild(b);});
   blk.appendChild(o);if(p){const n=document.createElement('p');n.className='note';n.innerHTML=p===q.right?q.yes:q.no;blk.appendChild(n);}qs.appendChild(blk);});
  const old=$('s1').querySelector('.stamp');if(old)old.remove();
  if(done()){const n=Q.filter(q=>S[q.id]===q.right).length;const st=document.createElement('span');st.className='stamp '+(n===Q.length?'ok':'no');st.textContent=`${n} / ${Q.length} richtig`;$('s1').appendChild(st);}
  $('s2').classList.toggle('locked',!done());$('s3').classList.toggle('locked',!done());
  $('s2-note').textContent=done()?'Simulation entsperrt – probier die Eingaben aus.':'Erst alle Vorhersagen tippen, dann sind Simulation und Beweis frei.';
  document.querySelectorAll('.sim-lock').forEach(e=>e.classList.toggle('is-locked',!done()));
  if(done()&&onDone)onDone();}
 r();}

/* ---------- 3 Beweisen ---------- */
function proof(items){$('proof').innerHTML=`<ol class="proof">${items.map(x=>`<li><div>${x}</div></li>`).join('')}</ol>`;}

/* ---------- Klausurlösung ---------- */
function solution(STEPS,TRAPS){
 $('sol-steps').innerHTML=STEPS.map(st=>`<li><div><div class="t">${st.t}</div>${st.m?`<div class="m">${st.m}</div>`:''}<p class="x">${st.x}</p>${st.w?`<div class="warn">${st.w}</div>`:''}</div></li>`).join('');
 $('sol-traps').innerHTML=TRAPS.map(t=>`<li>${t}</li>`).join('');}

/* ---------- Üben: Tabs ---------- */
function practice(list){const host=$('practice');const tabs=host.querySelector('.tabs'),body=host.querySelector('.pbody');
 list.forEach((p,i)=>{const b=document.createElement('button');b.className='tab';b.id='p-'+p.id;b.textContent=p.name;b.setAttribute('aria-pressed',i===0);tabs.appendChild(b);
  const d=document.createElement('div');d.className='pane';d.id='pane-'+p.id;d.hidden=i>0;body.appendChild(d);p.render(d);
  b.onclick=()=>{tabs.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-pressed',t===b));body.querySelectorAll('.pane').forEach(x=>x.hidden=x!==d);};});}

/* ---------- Multiple Choice: [{q, o:[…], r:Index der richtigen, why}] ---------- */
function mc(el,Q){let got=0,answered=0;const head=document.createElement('p');head.className='score';el.appendChild(head);
 const upd=()=>head.textContent=answered?`${got} / ${answered} richtig · ${Q.length-answered} offen`:`${Q.length} Fragen · tippe eine Antwort`;upd();
 Q.forEach((q,qi)=>{const blk=document.createElement('div');blk.className='qblock';blk.innerHTML=`<p><b>${qi+1}.</b> ${q.q}</p>`;
  const o=document.createElement('div');o.className='opts';const bs=[];
  q.o.forEach((t,k)=>{const b=document.createElement('button');b.className='opt';b.innerHTML=t;bs.push(b);
   b.onclick=()=>{bs.forEach(x=>x.disabled=true);bs[q.r].classList.add('right');if(k!==q.r)b.classList.add('wrong');answered++;if(k===q.r)got++;
    const n=document.createElement('p');n.className='why';n.innerHTML=(k===q.r?'<b class="ok">Richtig.</b> ':'<b class="no">Nicht ganz.</b> ')+q.why;blk.appendChild(n);upd();};o.appendChild(b);});
  blk.appendChild(o);el.appendChild(blk);});
 const re=document.createElement('button');re.className='btn';re.textContent='Nochmal von vorn';re.onclick=()=>{el.innerHTML='';mc(el,Q);};el.appendChild(re);}

/* ---------- Zuordnen: {q, cats:[…], items:[[Text, richtige Kategorie, Begründung]]} ---------- */
function match(el,M){const blk=document.createElement('div');blk.className='qblock';blk.innerHTML=`<p>${M.q}</p>`;
 const tb=document.createElement('table');tb.className='mt';tb.innerHTML=M.items.map(([t],i)=>`<tr><td>${t}</td><td><select data-i="${i}" aria-label="Kategorie für ${String(t).replace(/<[^>]+>/g,'')}"><option>– wählen –</option>${M.cats.map(c=>`<option>${c}</option>`).join('')}</select></td><td class="mr"></td></tr>`).join('');
 blk.appendChild(tb);const b=document.createElement('div');b.className='btnrow';b.innerHTML='<button class="btn">Prüfen</button>';blk.appendChild(b);const res=document.createElement('p');res.className='why';blk.appendChild(res);
 b.firstChild.onclick=()=>{let n=0;tb.querySelectorAll('select').forEach(s=>{const it=M.items[s.dataset.i],good=s.value===it[1];if(good)n++;
   const td=s.closest('tr').querySelector('.mr');td.innerHTML=good?`<span class="ok">✓</span> <small>${it[2]||''}</small>`:`<span class="no">✗ ${it[1]}</span> <small>${it[2]||''}</small>`;});
  res.innerHTML=`<b>${n} / ${M.items.length} richtig.</b>`;};
 el.appendChild(blk);}

/* ---------- Lückentext: [{h, t:'… [[Antwort|Alternative]] …', why}], Zahlen mit Toleranz ±0,01 ---------- */
function cloze(el,C){C.forEach((c,ci)=>{const blk=document.createElement('div');blk.className='qblock';let k=0;const ans=[];
  const html=c.t.replace(/\[\[(.+?)\]\]/g,(_,a)=>{ans.push(a.split('|'));return `<input class="gap" data-k="${k++}" size="${Math.max(6,a.split('|')[0].length+1)}" aria-label="Lücke ${k}">`;});
  blk.innerHTML=`${c.h?`<p><b>${ci+1}.</b> ${c.h}</p>`:''}<div class="cl">${html}</div><div class="btnrow"><button class="btn">Prüfen</button><button class="btn">Lösung zeigen</button></div><p class="why"></p>`;
  const [bc,bs]=blk.querySelectorAll('.btnrow .btn');
  const chk=(v,a)=>a.some(x=>{const nx=num(x),nv=num(v);return(!isNaN(nx)&&/^[\d.,\s€%-]+$/.test(x))?Math.abs(nx-nv)<0.011:norm(v)===norm(x);});
  bc.onclick=()=>{let n=0;blk.querySelectorAll('.gap').forEach(g=>{const good=chk(g.value,ans[g.dataset.k]);g.classList.toggle('g-ok',good);g.classList.toggle('g-no',!good);if(good)n++;});
   blk.querySelector('.why').innerHTML=`<b>${n} / ${ans.length} Lücken richtig.</b> ${n===ans.length&&c.why?c.why:''}`;};
  bs.onclick=()=>{blk.querySelectorAll('.gap').forEach(g=>{g.value=ans[g.dataset.k][0];g.classList.add('g-ok');g.classList.remove('g-no');});blk.querySelector('.why').innerHTML=c.why||'';};
  el.appendChild(blk);});}

/* ---------- Reihenfolge: [{q, steps:[… in richtiger Reihenfolge], why}] – Schritte werden gemischt angezeigt ---------- */
function order(el,O){O.forEach((o,oi)=>{const blk=document.createElement('div');blk.className='qblock';const n=o.steps.length;
  const mix=o.steps.map((_,i)=>i).sort((a,b)=>((a*7+3)%n)-((b*7+3)%n));
  blk.innerHTML=`<p><b>${oi+1}.</b> ${o.q}</p><ol class="ord">${mix.map(i=>`<li><span>${o.steps[i]}</span> <select data-i="${i}" aria-label="Position"><option value="">Platz …</option>${o.steps.map((_,k)=>`<option value="${k}">${k+1}</option>`).join('')}</select></li>`).join('')}</ol>
   <div class="btnrow"><button class="btn">Prüfen</button><button class="btn">Lösung zeigen</button></div><p class="why"></p>`;
  const [bc,bs]=blk.querySelectorAll('.btnrow .btn'),sel=[...blk.querySelectorAll('select')];
  bc.onclick=()=>{let g=0;sel.forEach(s=>{const good=s.value!==''&&+s.value===+s.dataset.i;if(good)g++;s.style.borderColor=good?'var(--ok)':'var(--bad)';});
   blk.querySelector('.why').innerHTML=`<b>${g} / ${n} an der richtigen Stelle.</b> ${g===n&&o.why?o.why:''}`;};
  bs.onclick=()=>{sel.forEach(s=>{s.value=s.dataset.i;s.style.borderColor='var(--ok)';});blk.querySelector('.why').innerHTML=`<b>Reihenfolge:</b> ${o.steps.map((t,i)=>`${i+1}. ${t}`).join(' · ')}<br>${o.why||''}`;};
  el.appendChild(blk);});}

/* ---------- Freitext mit Musterantwort: [{q, keys:[Kernpunkte], model:'Musterantwort'}] – erst schreiben, dann selbst abhaken ---------- */
function freetext(el,F){F.forEach((f,fi)=>{const blk=document.createElement('div');blk.className='qblock';
  blk.innerHTML=`<p><b>${fi+1}.</b> ${f.q}</p><textarea class="free" aria-label="Deine Antwort" placeholder="Deine Antwort in ganzen Sätzen …"></textarea>
   <div class="btnrow"><button class="btn">Mit Musterantwort vergleichen</button></div><div class="cmp" hidden><p class="why">Hake ab, welche Kernpunkte deine Antwort enthält:</p>
   <ul class="keys">${f.keys.map((k,i)=>`<li><label><input type="checkbox" data-k="${i}"> <span>${k}</span></label></li>`).join('')}</ul><p class="score"></p><div class="model"><b>Musterantwort:</b> ${f.model}</div></div>`;
  const cmp=blk.querySelector('.cmp'),sc=blk.querySelector('.score'),boxes=[...blk.querySelectorAll('input[type=checkbox]')];
  const upd=()=>{const g=boxes.filter(b=>b.checked).length;sc.textContent=`${g} / ${boxes.length} Kernpunkte`;};
  blk.querySelector('.btn').onclick=()=>{cmp.hidden=false;upd();};boxes.forEach(b=>b.onchange=upd);
  el.appendChild(blk);});}

/* ---------- Helfer für Simulationen ---------- */
function slider(id,label,min,max,step,val,fmt){return {id,label,min,max,step,val,fmt};}
function mountSliders(host,list,onchange){host.innerHTML=list.map(s=>`<div class="slider"><label for="${s.id}" id="${s.id}-l"></label><input id="${s.id}" type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}"></div>`).join('');
 const read=()=>{const v={};list.forEach(s=>{v[s.id]=+$(s.id).value;$(s.id+'-l').textContent=`${s.label}: ${s.fmt(v[s.id])}`;});return v;};
 list.forEach(s=>$(s.id).addEventListener('input',()=>onchange(read())));return read;}
function seg(host,opts,val,cb){host.innerHTML=opts.map(([k,t])=>`<button data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('');
 host.onclick=e=>{const b=e.target.closest('button');if(!b)return;host.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));cb(b.dataset.k);};}

