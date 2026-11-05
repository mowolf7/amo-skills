// 2D-Karte: feste Plätze (deterministisches Layout), Zonen je Bereich, Zoom/Verschieben, Klick hebt Nachbarn hervor.
(function(){
const D=window.MM, svg=d3.select('#map'), W=1600, H=1050;
const L=D.layout||{},MID=L.mid||[900,560],HUB=Object.keys(D.areas).find(a=>D.areas[a].center)||null;
// feste Plätze der Themen (Landkarte: Elektrostatik links, Magnetostatik rechts, Ströme unten, Werkzeuge in der Mitte)
const POS={};D.topics.forEach(t=>{if(t.pos)POS[t.id]=t.pos;});
// ohne pos: Bereiche gleichmäßig um die Mitte, Themen eines Bereichs im Bogen
(()=>{const ar=Object.keys(D.areas).filter(a=>a!==HUB);ar.forEach((a,i)=>{const ang=Math.PI+i/ar.length*2*Math.PI,ts=D.topics.filter(t=>t.area===a&&!POS[t.id]);
  ts.forEach((t,j)=>{const off=(ts.length>1?(j/(ts.length-1)-.5):0)*1.4;POS[t.id]=[MID[0]+Math.cos(ang+off)*620,MID[1]+Math.sin(ang+off)*420];});});
  D.topics.filter(t=>!POS[t.id]).forEach((t,j)=>POS[t.id]=[MID[0]+(j-1)*260,MID[1]-260]);})();
const nodes=[], links=[], byId={};
D.topics.forEach(t=>{const n={...t,kind:'topic',label:t.name};nodes.push(n);byId[t.id]=n;});
D.concepts.forEach(c=>{const ts=Object.keys(c.use),id=c.id,n={...c,ts,kind:'concept',label:c.name};nodes.push(n);byId[id]=n;ts.forEach(t=>links.push({source:id,target:t,kind:'use'}));});
D.analog.forEach(([a,b,txt])=>links.push({source:a,target:b,kind:'analog',txt}));
nodes.forEach(n=>{n.w=(n.kind==='topic'?n.label.length*9.9+78:n.label.length*8.8+30); n.h=n.kind==='topic'?46:30;});
// Feste Regel statt Zufall: gleiche Karte bei jedem Öffnen
nodes.filter(n=>n.kind==='topic').forEach(n=>{[n.x,n.y]=POS[n.id];n.fixed=true;});
const own={};nodes.filter(n=>n.kind==='concept'&&n.ts.length===1&&n.area!==HUB).forEach(n=>(own[n.ts[0]]=own[n.ts[0]]||[]).push(n));
Object.entries(own).forEach(([t,list])=>{const [tx,ty]=POS[t];const base=Math.atan2(ty-MID[1],tx-MID[0]);
  const span=Math.min(2.4,0.55*list.length);list.forEach((n,i)=>{const ang=base+(list.length>1?(i/(list.length-1)-.5)*span:0);
  n.x=tx+Math.cos(ang)*175;n.y=ty+Math.sin(ang)*95;});});
nodes.filter(n=>n.kind==='concept'&&(n.ts.length>1||n.area===HUB)).forEach(n=>{const ps=n.ts.map(t=>POS[t]);let x=d3.mean(ps,p=>p[0]),y=d3.mean(ps,p=>p[1]);
  const k=n.area===HUB?0.62:0.1;n.x=x*(1-k)+MID[0]*k;n.y=y*(1-k)+MID[1]*k;});
// Überlappungen der Kästchen auflösen (Themen bleiben fest)
for(let it=0;it<400;it++){let moved=false;for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];
  const dx=b.x-a.x,dy=b.y-a.y,ox=(a.w+b.w)/2+14-Math.abs(dx),oy=(a.h+b.h)/2+14-Math.abs(dy);
  if(ox>0&&oy>0){moved=true;const fa=a.fixed?0:(b.fixed?1:.5),fb=1-fa;
    if(ox<oy){const s=Math.sign(dx)||1;a.x-=s*ox*fa;b.x+=s*ox*fb;}else{const s=Math.sign(dy)||(i%2?1:-1);a.y-=s*oy*fa;b.y+=s*oy*fb;}}}
  if(!moved)break;}
links.forEach(l=>{l.source=byId[l.source];l.target=byId[l.target];});
const css=v=>`var(${v})`, col=a=>css(D.areas[a].col);
const root=svg.append('g');
// Zonen
const zoneG=root.append('g');
Object.keys(D.areas).forEach(a=>{
  const pts=[];nodes.filter(n=>n.area===a&&(n.kind==='topic'||a===HUB||n.ts.length===1)).forEach(n=>{for(let k=0;k<12;k++){const t=k/12*2*Math.PI;pts.push([n.x+Math.cos(t)*(n.w/2+34),n.y+Math.sin(t)*(n.h/2+34)]);}});
  const hull=d3.polygonHull(pts);
  zoneG.append('path').attr('class','zone').attr('d',d3.line().curve(d3.curveCatmullRomClosed.alpha(.5))(hull))
    .style('fill',col(a)).style('stroke',col(a));
  const top=hull.reduce((m,p)=>p[1]<m[1]?p:m,hull[0]);
  zoneG.append('text').attr('class','zlabel').attr('x',d3.mean(hull,p=>p[0])).attr('y',top[1]-10).style('fill',col(a)).text(D.areas[a].name);
});
// Kanten (leicht gebogen)
const curve=l=>{const s=l.source,t=l.target,mx=(s.x+t.x)/2,my=(s.y+t.y)/2,dx=t.x-s.x,dy=t.y-s.y,k=l.kind==='analog'?.25:.08;return `M${s.x},${s.y}Q${mx-dy*k},${my+dx*k} ${t.x},${t.y}`;};
const linkSel=root.append('g').selectAll('path').data(links).join('path')
  .attr('class',l=>'link '+l.kind+(l.kind==='use'&&l.source.ts.length>=5?' quiet':'')).attr('d',curve).style('stroke',l=>l.kind==='analog'?css('--neg'):col(l.source.area));
linkSel.filter(l=>l.kind==='analog').append('title').text(l=>'Analogie: '+l.txt);
// Knoten
const nodeSel=root.append('g').selectAll('g').data(nodes).join('g')
  .attr('class',d=>'node '+d.kind).attr('transform',d=>`translate(${d.x},${d.y})`).attr('tabindex',0).attr('role','button')
  .attr('aria-label',d=>d.kind==='topic'?`Thema ${d.nr} ${d.name}`:`Konzept ${d.name}`);
nodeSel.append('rect').attr('x',d=>-d.w/2).attr('y',d=>-d.h/2).attr('width',d=>d.w).attr('height',d=>d.h)
  .attr('rx',d=>d.kind==='topic'?8:15).style('stroke',d=>d.kind==='topic'?css('--ink'):col(d.area));
const tp=nodeSel.filter(d=>d.kind==='topic');
tp.append('circle').attr('cx',d=>-d.w/2+24).attr('r',15).style('fill',d=>col(d.area));
tp.append('text').attr('class','nr').attr('x',d=>-d.w/2+24).attr('dy','.35em').text(d=>d.nr);
tp.append('text').attr('class','tname').attr('x',d=>-d.w/2+48).attr('dy','.35em').text(d=>d.name);
tp.append('text').attr('class','badge3d').attr('x',d=>d.w/2-10).attr('dy','.35em').text(d=>d.badge!==undefined?d.badge:(D.badge!==undefined?D.badge:'3D'));
nodeSel.filter(d=>d.kind==='concept').append('text').attr('class','cname').attr('dy','.35em').text(d=>d.name);
// Hervorheben
const nb=new Map(nodes.map(n=>[n.id,new Set([n.id])]));
links.forEach(l=>{nb.get(l.source.id).add(l.target.id);nb.get(l.target.id).add(l.source.id);});
let sel=null;
function select(id){sel=(sel===id)?null:id;const s=sel&&nb.get(sel);
  nodeSel.classed('dim',d=>s&&!s.has(d.id)).classed('sel',d=>d.id===sel);
  linkSel.classed('dim',l=>sel&&l.source.id!==sel&&l.target.id!==sel).classed('hot',l=>sel&&(l.source.id===sel||l.target.id===sel));
  dispatchEvent(new CustomEvent('mm-select',{detail:sel?byId[sel]:null}));}
nodeSel.on('click',(e,d)=>{e.stopPropagation();select(d.id);}).on('keydown',(e,d)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(d.id);}});
svg.on('click',()=>{if(sel)select(sel);});
// Zoom & Verschieben, Start: alles einpassen
const zoom=d3.zoom().scaleExtent([.3,4]).on('zoom',e=>root.attr('transform',e.transform));
svg.call(zoom).on('dblclick.zoom',null);
function fit(){const b=root.node().getBBox(),box=svg.node().getBoundingClientRect();const s=Math.min(box.width/(b.width+40),box.height/(b.height+40));
  svg.call(zoom.transform,d3.zoomIdentity.translate(box.width/2-s*(b.x+b.width/2),box.height/2-s*(b.y+b.height/2)).scale(s));}
function focus(id){const n=byId[id];if(!n)return;const box=svg.node().getBoundingClientRect();const t=d3.zoomTransform(svg.node());const k=Math.max(t.k,1.1);
  svg.transition().duration(600).call(zoom.transform,d3.zoomIdentity.translate(box.width/2-k*n.x,box.height/2-k*n.y).scale(k));}
function setSel(id){if(sel!==id)select(id);}
function filter(areas,q){q=(q||'').trim().toLowerCase();nodeSel.classed('off',d=>!areas.has(d.area)||(q&&!(d.label+' '+(d.nr||'')).toLowerCase().includes(q)));
  linkSel.classed('off',l=>!areas.has(l.source.area)||!areas.has(l.target.area));
  return nodes.filter(d=>areas.has(d.area)&&q&&(d.label+' '+(d.nr||'')).toLowerCase().includes(q));}
fit();addEventListener('resize',()=>{});window.MMmap={fit,select:setSel,toggle:select,focus,filter,byId,nodes,links,nb};
})();
