# Prototype (tested with PubChem CID 5793/5957 and PDB 4HHB). Usage: python3 -I pack_molecule.py <folder with glucose.sdf, atp.sdf, 4HHB.cif>
# SDF (PubChem 3D) -> atoms+bonds; mmCIF (PDB) -> CA trace per chain + hetero groups (e.g. HEM) with bonds by distance.
import sys,json,shlex,math
def sdf(path):
    L=open(path).read().split('\n');na,nb=int(L[3][:3]),int(L[3][3:6])
    at=[[float(L[4+i][0:10]),float(L[4+i][10:20]),float(L[4+i][20:30]),L[4+i][31:34].strip()] for i in range(na)]
    bd=[[int(L[4+na+j][0:3])-1,int(L[4+na+j][3:6])-1,int(L[4+na+j][6:9])] for j in range(nb)]
    return {'atoms':at,'bonds':bd}
def cif(path,het=('HEM',)):
    L=open(path).read().split('\n');cols=[];rows=[];inloop=False
    for l in L:
        if l.startswith('_atom_site.'):cols.append(l.strip()[11:]);inloop=True;continue
        if inloop and (l.startswith('ATOM') or l.startswith('HETATM')):rows.append(shlex.split(l));continue
        if inloop and cols and rows and l.startswith('#'):break
    c={k:i for i,k in enumerate(cols)};chains={};hets={}
    for r in rows:
        if r[c['pdbx_PDB_model_num']]!='1':continue
        x,y,z=(float(r[c['Cartn_'+a]]) for a in 'xyz');ch=r[c['auth_asym_id']];comp=r[c['label_comp_id']]
        if r[c['group_PDB']]=='ATOM' and r[c['label_atom_id']]=='CA':chains.setdefault(ch,[]).append([x,y,z])
        elif r[c['group_PDB']]=='HETATM' and comp in het:hets.setdefault(comp+':'+ch,[]).append([x,y,z,r[c['type_symbol']]])
    groups=[]
    for k,a in hets.items():
        bd=[[i,j,1] for i in range(len(a)) for j in range(i+1,len(a)) if math.dist(a[i][:3],a[j][:3])<(2.3 if 'FE' in (a[i][3],a[j][3]) else 1.9)]
        groups.append({'name':k,'atoms':a,'bonds':bd})
    return {'chains':chains,'hets':groups}
d=sys.argv[1];out={'glucose':sdf(d+'/glucose.sdf'),'atp':sdf(d+'/atp.sdf'),'hb':cif(d+'/4HHB.cif')}
open(d+'/mol_data.js','w').write('window.MOL='+json.dumps(out,separators=(',',':'))+';')
print({k:(len(v['atoms']) if 'atoms' in v else {c:len(p) for c,p in v['chains'].items()}) for k,v in out.items()}, [g['name'] for g in out['hb']['hets']], len(open(d+'/mol_data.js').read()),'bytes')
