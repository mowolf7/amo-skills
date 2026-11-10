# Prototype (tested with the knee and heart test page). Reads the JSON from gltf_extract.mjs / stl_simplify.mjs.
# Packs extracted geometry into compact base64: Int16 positions in one common frame (z up), Uint16 indices.
# crop=(part, half_size): keep only triangles whose centroid lies in a box around that part's centre.
import json,base64,struct
def pack(parts,zup_from_yup,scale_to=2.6,crop=None):
    items=[]
    for p in parts:
        v=p['pos'];pts=[(v[i],v[i+1],v[i+2]) for i in range(0,len(v),3)]
        if zup_from_yup: pts=[(x,-z,y) for x,y,z in pts]
        items.append([p['name'],pts,list(p['idx'])])
    if crop:
        cn,h=crop;cp=next(it[1] for it in items if it[0]==cn)
        cc=[(min(q[i] for q in cp)+max(q[i] for q in cp))/2 for i in range(3)]
        for it in items:
            pts,idx=it[1],it[2];keep=[]
            for t in range(0,len(idx),3):
                a,b,c=(pts[idx[t+k]] for k in range(3))
                if all(abs((a[i]+b[i]+c[i])/3-cc[i])<=h for i in range(3)): keep+=idx[t:t+3]
            it[2]=keep
        items=[it for it in items if it[2]]
    used=[it[1][k] for it in items for k in set(it[2])]
    mn=[min(q[i] for q in used) for i in range(3)];mx=[max(q[i] for q in used) for i in range(3)]
    c=[(mn[i]+mx[i])/2 for i in range(3)];s=scale_to/max(mx[i]-mn[i] for i in range(3))
    out=[]
    for name,pts,idx in items:
        q=[max(-32767,min(32767,round((a-c[i])*s/1.5*32767))) for x in pts for i,a in enumerate(x)]
        out.append({'name':name,'p':base64.b64encode(struct.pack('<%dh'%len(q),*q)).decode(),'i':base64.b64encode(struct.pack('<%dH'%len(idx),*idx)).decode()})
    return out
d={'knee':pack(json.load(open('knee_bones.json'))+json.load(open('knee_lig.json')),True,crop=('ta2-1390.r',0.11)),
   'heart':pack(json.load(open('heart.json')),False,crop=('FMA7274',62))}
open('anat_data.js','w').write('window.ANAT='+json.dumps(d)+';')
print('bytes',len(open('anat_data.js').read()),{k:[x['name'] for x in v] for k,v in d.items()})
