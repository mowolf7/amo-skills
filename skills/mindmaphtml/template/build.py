# Baut die Mindmap als EINE HTML-Datei.
# Aufruf: python3 -I build.py <data.js> <Ordner mit den fertigen Seiten> <Stil-Seite (Dateiname in dem Ordner)> <Ausgabe.html>
# Stil (Farben, Schriften, Hell/Dunkel, Bruch, Achtung-Box, Merkbox, Knopf) wird 1:1 aus der Stil-Seite übernommen,
# die Einleitungstexte (class="lede") der Themen 1:1 aus den verlinkten Seiten.
# Das Ergebnis ist immer offline nutzbar (siehe offline.py). Aufgaben-Seiten danach mit offline.py behandeln.
import re,sys,json,os
here=os.path.dirname(os.path.abspath(__file__))
data_p,pages,style,out=sys.argv[1:5]
s=open(os.path.join(pages,style),encoding='utf-8').read()
if ':root{' not in s:  # Stil-Seite bindet page_style.css nur ein: Stil aus der gemeinsamen Datei nehmen
    s=open(os.path.join(here,'page_style.css'),encoding='utf-8').read()
css=s[s.index(':root{'):s.index('.tabs,.seg')]
reuse='\n'.join(re.findall(r'^\.(?:fr|memo|warn|btn)\b[^{]*\{[^}]*\}',s,re.M))
data=open(data_p,encoding='utf-8').read()
ledes={}
for m in re.finditer(r"file:'([^']+)'",data):
    f=m.group(1);fp=os.path.join(pages,f)
    if os.path.exists(fp):
        l=re.search(r'class="lede"[^>]*>(.*?)</p>',open(fp,encoding='utf-8').read(),re.S);ledes[f]=l.group(1).strip() if l else ''
    else: print('WARNUNG: Seite fehlt:',f)
data+='\n(function(){const L='+json.dumps(ledes,ensure_ascii=False)+';MM.topics.forEach(t=>{if(!t.lede)t.lede=L[t.file]||"";});})();'
src=lambda f:open(os.path.join(here,f),encoding='utf-8').read()
t=src('tpl.html')
for k,v in {'/*BASECSS*/':css,'/*REUSECSS*/':reuse,'/*DATA*/':data,'/*MAP*/':src('map.js'),'/*PANEL*/':src('panel.js'),'/*FIGB*/':src('figb.js'),'/*FIG*/':src('fig.js'),'/*NET3D*/':src('net3d.js')}.items():
    t=t.replace(k,v)
# Immer offline: Bibliotheken aus vendor/ einbetten, Web-Schriften entfernen, Rest prüfen
# Titel im Browser-Tab und im Artifact aus meta.title (statt des Vorlagen-Titels)
m=re.search(r"title:'([^']+)'",data)
if m:t=re.sub(r'<title>.*?</title>','<title>'+m.group(1).replace('&','&amp;').replace('<','&lt;')+'</title>',t,count=1)
sys.path.insert(0,here);import offline
t=offline.make_offline(t);ext=offline.external(t)
open(out,'w',encoding='utf-8').write(t);print('ok',out,len(t),'Bytes, Einleitungen:',sum(1 for x in ledes.values() if x))
if ext:print('FEHLER: lädt noch aus dem Netz:',ext[:5]);sys.exit(1)
