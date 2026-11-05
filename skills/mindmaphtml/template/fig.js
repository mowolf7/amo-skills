// Mini-3D im Seitenfenster: freigegebene Figuren aus figb.js 1:1, eine aktive Szene, sauber aufräumen beim Wechsel.
(function(){if(!window.THREE)return;const F=MMFIGB(THREE);let cur=null;
function unmount(){if(!cur)return;cancelAnimationFrame(cur.raf);cur.ro.disconnect();cur.ctl.dispose();cur.r.dispose();cur.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});cur.r.domElement.remove();cur=null;}
function mount(el,key){unmount();if(!el)return;const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.setClearColor(0,0);el.prepend(r.domElement);
 const scene=new THREE.Scene();scene.add(new THREE.AmbientLight(0xffffff,.8));const dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(3,5,4);scene.add(dl);scene.add(F.build(key));
 const cam=new THREE.PerspectiveCamera(40,1,.1,50);cam.position.set(2.9,2.3,3.8);const ctl=new THREE.OrbitControls(cam,r.domElement);ctl.enableDamping=true;ctl.autoRotate=true;ctl.autoRotateSpeed=.8;ctl.enableZoom=false;
 r.domElement.addEventListener('pointerdown',()=>ctl.autoRotate=false);
 const size=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();};const ro=new ResizeObserver(size);ro.observe(el);size();
 cur={r,scene,ctl,ro,raf:0};(function loop(){if(!cur)return;cur.raf=requestAnimationFrame(loop);ctl.update();r.render(scene,cam);})();}
window.MMfig={mount,unmount};})();
