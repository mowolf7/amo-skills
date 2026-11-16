// Prototype (tested with lucgrn3/anatomy-models): extract selected nodes from a meshopt-compressed, quantized glb
// into plain world-space geometry (JSON). Usage: node gltf_extract.mjs <file.glb> <out.json> <node-name> [...]
// Extract selected nodes from a meshopt-compressed, quantized glb into plain world-space geometry (JSON).
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptDecoder} from 'meshoptimizer';
import fs from 'fs';
const [glb,out,...names]=process.argv.slice(2);
await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc=await io.read(glb);const res=[];
for(const node of doc.getRoot().listNodes()){if(!names.includes(node.getName()))continue;
 const M=node.getWorldMatrix();const mesh=node.getMesh();
 for(const prim of mesh.listPrimitives()){const pa=prim.getAttribute('POSITION');const ia=prim.getIndices();
  const n=pa.getCount(),pos=new Array(n*3),el=[0,0,0];
  for(let i=0;i<n;i++){pa.getElement(i,el);const [x,y,z]=el;
   pos[i*3]=M[0]*x+M[4]*y+M[8]*z+M[12];pos[i*3+1]=M[1]*x+M[5]*y+M[9]*z+M[13];pos[i*3+2]=M[2]*x+M[6]*y+M[10]*z+M[14];}
  res.push({name:node.getName(),pos,idx:Array.from(ia.getArray())});}}
fs.writeFileSync(out,JSON.stringify(res));console.log('extracted',res.map(r=>r.name+':'+r.pos.length/3+'v/'+r.idx.length/3+'t').join(' '));
