// Prototype (tested with BodyParts3D): binary STL -> welded, simplified geometry (JSON).
// Binary STL -> welded, simplified geometry (JSON). Args: out.json maxTris file1.stl[:target] file2.stl[:target] ...
import {MeshoptSimplifier} from 'meshoptimizer';import fs from 'fs';import path from 'path';
const [out,...files]=process.argv.slice(2);await MeshoptSimplifier.ready;const res=[];
for(const spec of files){const [f,tgt]=spec.split(':');const b=fs.readFileSync(f);const n=b.readUInt32LE(80);
 const map=new Map(),pos=[],idx=new Uint32Array(n*3);
 for(let t=0;t<n;t++){const o=84+t*50;for(let v=0;v<3;v++){const p=o+12+v*12;const x=b.readFloatLE(p),y=b.readFloatLE(p+4),z=b.readFloatLE(p+8);
  const k=x.toFixed(4)+','+y.toFixed(4)+','+z.toFixed(4);let i=map.get(k);if(i===undefined){i=pos.length/3;map.set(k,i);pos.push(x,y,z);}idx[t*3+v]=i;}}
 const P=new Float32Array(pos);const target=Math.min(idx.length,(+tgt||3000)*3);
 const [s]=MeshoptSimplifier.simplify(idx,P,3,target,0.02,['LockBorder']);
 // compact vertices
 const remap=new Map(),np=[],ni=[];for(const i of s){let j=remap.get(i);if(j===undefined){j=np.length/3;remap.set(i,j);np.push(P[i*3],P[i*3+1],P[i*3+2]);}ni.push(j);}
 res.push({name:path.basename(f,'.stl'),pos:np,idx:ni});console.log(path.basename(f),n,'->',ni.length/3,'tris');}
fs.writeFileSync(out,JSON.stringify(res));
