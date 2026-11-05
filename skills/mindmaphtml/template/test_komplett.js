// Komplett-Test der Mindmap mit Playwright, ohne Netz (test_route.js blockt alles außer file:).
// Aufruf: node test_komplett.js [00_Fach_Mindmap.html]   Seiten liegen in ./pages/
const {chromium}=require('playwright');const route=require('./test_route');const dir=__dirname+'/pages/';
const MAP=process.argv[2]||'00_EMF_Mindmap.html';
// Beendet sich mit Code 1, wenn irgendetwas fehlschlägt (für die automatische Prüfung auf GitHub).
let failed=false;const bad=x=>/fail:(?!\[\])|errors: (?!\[\])|overflow:(?!\[\]| 0$)|muss leer sein\): (?!\[\])|removed: false/.test(x);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const out={push:x=>{console.log(x);if(bad(x))failed=true;}};
for(const scheme of ['light','dark']){
 const p=await b.newPage({viewport:{width:1440,height:950},colorScheme:scheme});const errs=[];
 p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await route(p);await p.goto('file://'+dir+MAP);await p.waitForTimeout(500);
 await p.screenshot({path:`f_${scheme}_1.png`});
 if(scheme==='light'){
  // jedes Konzept und Thema anklicken
  const ids=await p.evaluate(()=>MMmap.nodes.map(n=>n.id));let bad=[];
  for(const id of ids){await p.evaluate(i=>{MMmap.select(null);MMmap.select(i)},id);await p.waitForTimeout(30);const h=await p.$eval('#panel h2',e=>e.textContent);if(!h||h.includes('Klick auf'))bad.push(id);}
  out.push('panel-fail:'+JSON.stringify(bad));
  // jede Figur: Canvas nicht leer
  const figs=await p.evaluate(()=>MM.concepts.filter(c=>c.fig).map(c=>c.id));let fb=[];
  for(const id of figs){await p.evaluate(i=>{MMmap.select(null);MMmap.select(i)},id);await p.waitForTimeout(400);const w=await p.$eval('#fig canvas',c=>c.width).catch(()=>0);if(!w)fb.push(id);}
  out.push('figs '+figs.length+' fail:'+JSON.stringify(fb));
  if(figs[0]){await p.evaluate(i=>{MMmap.select(null);MMmap.select(i)},figs[0]);await p.waitForTimeout(500);await p.screenshot({path:'f_fig.png'});}
  // jedes Mini-Quiz: Fragen da, eine Antwort zeigt Erklärung
  const qz=await p.evaluate(()=>MM.concepts.filter(c=>!c.fig&&c.quiz).map(c=>[c.id,c.quiz.length]));let qb=[];
  for(const [id,n] of qz){await p.evaluate(i=>{MMmap.select(null);MMmap.select(i)},id);await p.waitForTimeout(50);
   const k=await p.$$eval('#quiz .q',x=>x.length);await p.click('#quiz .q .opt');const why=await p.$('#quiz .why');if(k!==n||!why)qb.push(id);}
  out.push('quiz '+qz.length+' fail:'+JSON.stringify(qb));
  if(qz[0]){await p.evaluate(i=>{MMmap.select(null);MMmap.select(i)},qz[0][0]);await p.waitForTimeout(100);await p.screenshot({path:'f_quiz.png'});}
  // alle Sprungziele prüfen
  const targets=await p.evaluate(()=>{const r=[];MM.concepts.forEach(c=>Object.entries(c.use).forEach(([t,h])=>r.push([c.id,t,h])));if(MM.always)Object.entries(MM.always.use).forEach(([t,h])=>r.push(['always',t,h]));return r;});
  const fileOf=await p.evaluate(()=>Object.fromEntries(MM.topics.map(t=>[t.id,t.file])));
  const q=await b.newPage();await route(q);let jf=[];
  for(const [c,t,h] of targets){if(!h){continue;}await q.goto('file://'+dir+fileOf[t]+'#'+h);await q.waitForTimeout(350);const ok=await q.evaluate(()=>!!document.querySelector('#sol-steps > li.mm-hit'));if(!ok)jf.push(c+'→'+t+'#'+h);}
  out.push('jumps '+targets.length+' fail:'+JSON.stringify(jf));
  // jede Aufgaben-Seite auf dem Handy: kein waagrechtes Scrollen
  await q.setViewportSize({width:390,height:844});let ov=[];
  for(const f of Object.values(fileOf)){await q.goto('file://'+dir+f);await q.waitForTimeout(300);const d=await q.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(d>0)ov.push(f+':'+d);}
  out.push('pages mobile overflow:'+JSON.stringify(ov));await q.close();
  // 3D-Ansicht
  await p.click('#v3d');await p.waitForTimeout(800);await p.screenshot({path:'f_3d.png'});await p.click('#v3d');await p.waitForTimeout(200);
  out.push('net3d removed: '+(await p.$('#net3d')===null));
 }
 out.push(scheme+' errors: '+JSON.stringify(errs));await p.close();}
// Handy
const m=await b.newPage({viewport:{width:390,height:844}});await route(m);await m.goto('file://'+dir+MAP);await m.waitForTimeout(400);
out.push('mobile overflow: '+await m.evaluate(()=>document.documentElement.scrollWidth-innerWidth));await m.screenshot({path:'f_mobile.png',fullPage:false});
out.push('offline (Anfragen ins Netz, muss leer sein): '+JSON.stringify(route.blocked));
await b.close();if(failed){console.log('TEST FEHLGESCHLAGEN');process.exitCode=1;}else console.log('ALLES OK');})().catch(e=>{console.error(e);process.exit(1);});
