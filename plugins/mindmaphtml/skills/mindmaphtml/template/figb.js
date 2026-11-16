// Mini-3D-Figuren für Konzepte. Jede Figur: kräftige Farben (hell+dunkel), beschriftetes Koordinatensystem.
window.MMFIGB=function(THREE){
const C={red:0xe0302a,blue:0x1f6fff,org:0xff8a00,grn:0x14a05a,pur:0x8a3ffc,pink:0xe0218a,ink:0x2b3a4f};
function label(t,col,size){const cv=document.createElement('canvas'),x=cv.getContext('2d'),fs=56,f='700 '+fs+'px "Atkinson Hyperlegible",system-ui,sans-serif';
 x.font=f;const w=x.measureText(t).width+28;cv.width=w;cv.height=fs+22;x.font=f;x.fillStyle='rgba(255,255,255,.92)';x.strokeStyle='#'+col.toString(16).padStart(6,'0');x.lineWidth=5;
 x.beginPath();x.roundRect?x.roundRect(3,3,w-6,cv.height-6,14):x.rect(3,3,w-6,cv.height-6);x.fill();x.stroke();x.fillStyle='#'+col.toString(16).padStart(6,'0');x.textBaseline='middle';x.fillText(t,14,cv.height/2+2);
 const tx=new THREE.CanvasTexture(cv);tx.minFilter=THREE.LinearFilter;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false,transparent:true}));
 const h=size||.32;s.scale.set(h*w/cv.height,h,1);s.renderOrder=9;return s;}
function lab(g,t,col,p,size){const s=label(t,col,size);s.position.set(...p);g.add(s);return s;}
function arrow(g,from,dir,len,col,head){const d=new THREE.Vector3(...dir).normalize();const a=new THREE.ArrowHelper(d,new THREE.Vector3(...from),len,col,head||len*.28,(head||len*.28)*.6);
 a.line.material.linewidth=2;g.add(a);return a;}
function mat(col,op){return new THREE.MeshStandardMaterial({color:col,roughness:.45,metalness:.05,transparent:op<1,opacity:op,side:THREE.DoubleSide,depthWrite:op>=1});}
function axes(g,o,len){[[1,0,0,C.red,'x'],[0,1,0,C.grn,'y'],[0,0,1,C.blue,'z']].forEach(([a,b,c,col,t])=>{arrow(g,o,[a,b,c],len,col,.14);lab(g,t,col,[o[0]+a*(len+.18),o[1]+b*(len+.18),o[2]+c*(len+.18)],.26);});}
function circle(r,col,z,seg){const pts=[];for(let i=0;i<=(seg||96);i++){const t=i/(seg||96)*2*Math.PI;pts.push(new THREE.Vector3(r*Math.cos(t),r*Math.sin(t),z||0));}
 return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col}));}
function line(g,a,b,col,dash){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a),new THREE.Vector3(...b)]),
 dash?new THREE.LineDashedMaterial({color:col,dashSize:.08,gapSize:.06}):new THREE.LineBasicMaterial({color:col}));if(dash)l.computeLineDistances();g.add(l);return l;}
// Konvention: z nach oben (Rotation am Ende), damit es wie in der Vorlesung aussieht
const B={
 huelle(){const g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.6,32,20),mat(C.red,1)));lab(g,'Q_enc',C.red,[0,0,0],.3);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(1.35,40,24),mat(C.blue,.13)));
  const w=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(1.35,16,10)),new THREE.LineBasicMaterial({color:C.blue,transparent:true,opacity:.35}));g.add(w);
  [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.7,.7,0],[-.7,.7,.0],[.6,0,.8],[-.6,-.3,-.7]].forEach(d=>{const v=new THREE.Vector3(...d).normalize();arrow(g,[v.x*.65,v.y*.65,v.z*.65],d,1.15,C.org,.18);});
  const n=new THREE.Vector3(.55,-.55,.63).normalize(),p=n.clone().multiplyScalar(1.35);
  const patch=new THREE.Mesh(new THREE.CircleGeometry(.25,24),mat(C.pur,.85));patch.position.copy(p);patch.lookAt(p.clone().multiplyScalar(2));g.add(patch);
  arrow(g,[p.x,p.y,p.z],[n.x,n.y,n.z],.6,C.pur,.15);lab(g,'dA',C.pur,[p.x+n.x*.8,p.y+n.y*.8,p.z+n.z*.8]);
  lab(g,'Gaußhülle',C.blue,[-.9,.9,1.3]);lab(g,'E',C.org,[1.95,0,.2]);axes(g,[-1.3,-1.3,-1.1],.6);return g;},
 pillbox(){const g=new THREE.Group();
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.2,3.2),mat(C.pur,.22));g.add(pl);lab(g,'Grenzfläche mit σ',C.pur,[-1.1,1.3,0]);
  const cyl=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.9,40,1,true),mat(C.grn,.28));cyl.rotation.x=Math.PI/2;g.add(cyl);
  [.45,-.45].forEach(z=>{const c=circle(.55,C.grn,z);g.add(c);});
  lab(g,'Pillendose',C.grn,[1,-.9,.55]);
  arrow(g,[0,0,-1.5],[0,0,1],.75,C.blue,.18);lab(g,'D₁',C.blue,[.35,0,-1.15]);
  arrow(g,[0,0,.25],[0,0,1],1.35,C.org,.2);lab(g,'D₂',C.org,[.35,0,1.2]);
  arrow(g,[-.9,.2,0],[0,0,1],.6,C.ink,.14);lab(g,'n',C.ink,[-.9,.2,.8]);
  axes(g,[-1.3,-1.3,-1.1],.6);return g;},
 umlauf(){const g=new THREE.Group();
  const w=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,3.4,16),mat(C.red,1));w.rotation.x=Math.PI/2;g.add(w);
  arrow(g,[0,0,1.2],[0,0,1],.6,C.red,.18);lab(g,'I_enc',C.red,[.35,0,1.75]);
  const c=circle(1.3,C.blue);g.add(c);lab(g,'Umlauf C',C.blue,[1.2,-1.2,.25]);
  const disk=new THREE.Mesh(new THREE.CircleGeometry(1.3,48),mat(C.blue,.1));g.add(disk);
  for(let i=0;i<8;i++){const t=i/8*2*Math.PI;arrow(g,[1.3*Math.cos(t),1.3*Math.sin(t),0],[-Math.sin(t),Math.cos(t),0],.75,C.org,.22);}
  lab(g,'H tangential',C.org,[-1.55,1.05,.3]);line(g,[0,0,0],[1.3*Math.cos(-.6),1.3*Math.sin(-.6),0],C.ink,true);lab(g,'R',C.ink,[.75,-.55,.15],.26);
  axes(g,[-1.3,-1.3,-1.1],.6);return g;},
 dreibein(){const g=new THREE.Group();const t=.75,p=[1.2*Math.cos(t),1.2*Math.sin(t),0];
  g.add(circle(1.2,C.ink));line(g,[0,0,-1.2],[0,0,1.4],C.ink,true);line(g,[0,0,0],p,C.ink,true);
  const s=new THREE.Mesh(new THREE.SphereGeometry(.06,16,12),mat(C.ink,1));s.position.set(...p);g.add(s);
  arrow(g,p,[Math.cos(t),Math.sin(t),0],.8,C.red,.18);lab(g,'e_R',C.red,[p[0]+Math.cos(t)*1.05,p[1]+Math.sin(t)*1.05,0]);
  arrow(g,p,[-Math.sin(t),Math.cos(t),0],.8,C.grn,.18);lab(g,'e_φ',C.grn,[p[0]-Math.sin(t)*1.05,p[1]+Math.cos(t)*1.05,0]);
  arrow(g,p,[0,0,1],.8,C.blue,.18);lab(g,'e_z',C.blue,[p[0],p[1],1.05]);
  lab(g,'e_R × e_φ = e_z',C.pur,[-.6,-1.1,1.25],.3);lab(g,'R → φ → z → R',C.pur,[-.6,-1.1,.9],.26);
  axes(g,[-1.3,-1.3,-1.1],.6);return g;},
 zylkoord(){const g=new THREE.Group();const R=1.1,ph=.9,z=1.0,P=[R*Math.cos(ph),R*Math.sin(ph),z];
  const cy=new THREE.Mesh(new THREE.CylinderGeometry(R,R,2.4,48,1,true),mat(C.blue,.08));cy.rotation.x=Math.PI/2;cy.position.z=.4;g.add(cy);
  g.add(circle(R,C.blue,0));g.add(circle(R,C.blue,z));
  line(g,[0,0,0],[R*Math.cos(ph),R*Math.sin(ph),0],C.red);lab(g,'R',C.red,[R*.5*Math.cos(ph)+.15,R*.5*Math.sin(ph)-.15,0]);
  line(g,[R*Math.cos(ph),R*Math.sin(ph),0],P,C.grn);lab(g,'z',C.grn,[P[0]+.2,P[1],z/2]);
  const arc=[];for(let i=0;i<=30;i++){const a=i/30*ph;arc.push(new THREE.Vector3(.45*Math.cos(a),.45*Math.sin(a),0));}
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(arc),new THREE.LineBasicMaterial({color:C.org})));lab(g,'φ',C.org,[.62*Math.cos(ph/2),.62*Math.sin(ph/2),0]);
  line(g,[0,0,0],[1.6,0,0],C.ink,true);
  const s=new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),mat(C.pink,1));s.position.set(...P);g.add(s);lab(g,'P',C.pink,[P[0]-.05,P[1]+.1,P[2]+.3]);
  lab(g,'dv = R dR dφ dz',C.pur,[-.4,-1.3,1.6],.28);axes(g,[-1.3,-1.3,-1.1],.6);return g;},
 aufquell(){const g=new THREE.Group();const rq=[1.0,.5,-.4],ra=[-.3,-.2,1.3];
  const ring=circle(1.1,C.red,-.4);g.add(ring);lab(g,'Quelle (ρ oder I)',C.red,[1.3,-1.1,-.4]);
  const s1=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),mat(C.pink,1));s1.position.set(...rq);g.add(s1);
  const s2=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),mat(C.blue,1));s2.position.set(...ra);g.add(s2);
  const len=(a)=>Math.hypot(...a);
  arrow(g,[0,0,0],rq,len(rq)-.05,C.pink,.15);lab(g,"r′ Quellpunkt",C.pink,[rq[0]+.25,rq[1]+.3,rq[2]+.15]);
  arrow(g,[0,0,0],ra,len(ra)-.05,C.blue,.15);lab(g,'r Aufpunkt',C.blue,[ra[0]-.2,ra[1],ra[2]+.3]);
  const d=[ra[0]-rq[0],ra[1]-rq[1],ra[2]-rq[2]];arrow(g,rq,d,len(d)-.08,C.org,.18);lab(g,"R = r − r′",C.org,[(ra[0]+rq[0])/2+.35,(ra[1]+rq[1])/2+.2,(ra[2]+rq[2])/2+.1]);
  axes(g,[-1.3,-1.3,-1.1],.6);return g;}
};
return {build:k=>{const g=B[k]();g.rotation.x=-Math.PI/2;return g;}, keys:Object.keys(B)};
};
