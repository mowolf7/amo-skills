// Knopf „3D-Ansicht“: dasselbe Netz aus denselben Daten als freigegebene 3D-Vorschau. Klick auf Knoten öffnet dasselbe Seitenfenster.
(function(){if(!window.THREE)return;const D=MM,M=MMmap,box=document.querySelector('.mapbox'),btn=document.getElementById('v3d');let st=null;
let cur=null;addEventListener('mm-select',e=>{cur=e.detail&&e.detail.id;});
const PAL=[0x1f6fff,0xff8a00,0xe0218a,0x10a37f,0x8a3ffc,0x0aa3b5];const C={root:0x2b3a4f};
Object.entries(D.areas).forEach(([a,x],i)=>{const v=getComputedStyle(document.documentElement).getPropertyValue(x.col).trim();C[a]=/^#[0-9a-f]{6}$/i.test(v)?parseInt(v.slice(1),16):PAL[i%PAL.length];});
function label(text,col,size,bold){const cv=document.createElement('canvas');const ctx=cv.getContext('2d');const fs=48,f=(bold?'700 ':'500 ')+fs+'px "Atkinson Hyperlegible",system-ui,sans-serif';ctx.font=f;const w=ctx.measureText(text).width+36;cv.width=w;cv.height=fs+26;ctx.font=f;
 ctx.fillStyle='rgba(255,255,255,0.93)';ctx.strokeStyle='#'+col.toString(16).padStart(6,'0');ctx.lineWidth=5;ctx.beginPath();ctx.roundRect?ctx.roundRect(3,3,w-6,cv.height-6,16):ctx.rect(3,3,w-6,cv.height-6);ctx.fill();ctx.stroke();
 ctx.fillStyle='#111';ctx.textBaseline='middle';ctx.fillText(text,18,cv.height/2+2);const t=new THREE.CanvasTexture(cv);t.minFilter=THREE.LinearFilter;
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));s.scale.set(size*w/cv.height,size,1);s.renderOrder=10;return s;}
function build(){const host=document.createElement('div');host.id='net3d';box.appendChild(host);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(50,1,.1,2000);camera.position.set(0,50,280);const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
 scene.add(new THREE.AmbientLight(0xffffff,.75));const dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(50,80,60);scene.add(dl);
 // Knoten: Mitte, 4 Bereiche, Themen, Konzepte (wie in der Vorschau)
 const N=[],id={};let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647-.5;
 const add=(k,lab,type,area,fixed)=>{const n={k,lab,type,area,p:fixed?fixed.clone():new THREE.Vector3(rnd()*80,rnd()*80,rnd()*80),v:new THREE.Vector3(),fixed:!!fixed};id[k]=N.length;N.push(n);};
 add('root',(D.meta&&D.meta.title)||'Mindmap','root','root',new THREE.Vector3(0,0,0));
 const ak=Object.keys(D.areas);ak.forEach((a,i)=>{const t=i/ak.length*2*Math.PI;add('H'+a,D.areas[a].name,'hub',a,D.areas[a].center?new THREE.Vector3(0,45,45):new THREE.Vector3(Math.cos(t)*58,Math.sin(t)*40,-10+i*8));});
 D.topics.forEach(t=>add(t.id,t.nr+' '+t.name,'topic',t.area));D.concepts.forEach(c=>add(c.id,c.name,'concept',c.area));
 const E=[];Object.keys(D.areas).forEach(a=>E.push(['root','H'+a,'hub']));D.topics.forEach(t=>E.push(['H'+t.area,t.id,'topic']));
 D.concepts.forEach(c=>Object.keys(c.use).forEach(t=>E.push([c.id,t,'concept'])));D.analog.forEach(a=>E.push([a[0],a[1],'analog']));
 for(let it=0;it<500;it++){for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const d=N[i].p.clone().sub(N[j].p);const L=Math.max(d.length(),1);const f=d.multiplyScalar(900/(L*L*L));N[i].v.add(f);N[j].v.sub(f);}
  E.forEach(([a,b,ty])=>{const A=N[id[a]],Bn=N[id[b]];const d=Bn.p.clone().sub(A.p);const L=d.length()||1;const rest=ty==='concept'?26:ty==='analog'?60:38;const f=d.multiplyScalar(.02*(L-rest)/L);A.v.add(f);Bn.v.sub(f);});
  N.forEach(n=>{if(n.type==='concept'){const h=N[id['H'+n.area]];n.v.add(h.p.clone().sub(n.p).multiplyScalar(.004));}if(!n.fixed){n.v.multiplyScalar(.82);n.p.add(n.v);}else n.v.set(0,0,0);});}
 const meshes=[];N.forEach(n=>{const col=C[n.area];const r=n.type==='root'?7:n.type==='hub'?5:n.type==='topic'?3.6:1.6;const g=n.type==='topic'?new THREE.IcosahedronGeometry(r,0):new THREE.SphereGeometry(r,24,16);
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:col,roughness:.45,metalness:.1,emissive:col,emissiveIntensity:n.type==='topic'?.25:.1}));m.position.copy(n.p);m.userData=n;scene.add(m);meshes.push(m);n.mesh=m;
  const s=label(n.lab,col,n.type==='root'?6:n.type==='hub'?4.6:n.type==='topic'?3.6:2.4,n.type!=='concept');s.position.copy(n.p).add(new THREE.Vector3(0,r+2.4,0));scene.add(s);n.sprite=s;});
 const lines=E.map(([a,b,ty])=>{const A=N[id[a]],Bn=N[id[b]];const col=ty==='concept'?C[A.area]:C[Bn.area];const g=new THREE.BufferGeometry().setFromPoints([A.p,Bn.p]);
  const mat=ty==='analog'?new THREE.LineDashedMaterial({color:0x8a2be2,dashSize:3,gapSize:2,transparent:true,opacity:.95}):new THREE.LineBasicMaterial({color:col,transparent:true,opacity:ty==='concept'?.45:.85});
  const l=new THREE.Line(g,mat);if(ty==='analog')l.computeLineDistances();l.userData={a,b,base:mat.opacity};scene.add(l);return l;});
 const ax=new THREE.Group(),O=new THREE.Vector3(-85,-60,-40);[[1,0,0,0xd62828,'x'],[0,1,0,0x2a9d3a,'y'],[0,0,1,0x1f4fff,'z']].forEach(([x,y,z,c,t])=>{const d=new THREE.Vector3(x,y,z);ax.add(new THREE.ArrowHelper(d,O,18,c,4,2.5));const s=label(t,c,3.4,true);s.position.copy(O).addScaledVector(d,22);ax.add(s);});scene.add(ax);
 function hi(sel){const nb=new Set(sel?[sel]:[]);if(sel)E.forEach(([a,b])=>{if(a===sel)nb.add(b);if(b===sel)nb.add(a);});
  N.forEach(n=>{const on=!sel||nb.has(n.k);n.mesh.material.transparent=!on;n.mesh.material.opacity=on?1:.15;n.sprite.material.opacity=on?1:.12;});
  lines.forEach(l=>{const on=!sel||l.userData.a===sel||l.userData.b===sel;l.material.opacity=on?(sel?1:l.userData.base):.05;});}
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();
  mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const h=ray.intersectObjects(meshes)[0];const n=h&&h.object.userData;
  if(n&&(n.type==='topic'||n.type==='concept'))M.select(n.k);else M.select(null);});
 const onSel=e=>hi(e.detail&&e.detail.id);addEventListener('mm-select',onSel);
 const size=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};const ro=new ResizeObserver(size);ro.observe(host);size();
 st={host,renderer,ro,onSel,raf:0};hi(cur);(function loop(){if(!st)return;st.raf=requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);})();}
function destroy(){if(!st)return;cancelAnimationFrame(st.raf);st.ro.disconnect();removeEventListener('mm-select',st.onSel);st.renderer.dispose();st.host.remove();st=null;}
btn.onclick=()=>{const on=btn.getAttribute('aria-pressed')!=='true';btn.setAttribute('aria-pressed',on);btn.textContent=on?'2D-Karte':'3D-Ansicht';box.classList.toggle('is3d',on);on?build():destroy();};
})();
