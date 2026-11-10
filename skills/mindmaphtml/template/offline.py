# Macht eine HTML-Datei komplett offline-fähig und eigenständig:
# - d3, Three.js und OrbitControls werden aus vendor/ eingebettet,
# - lokale Bausteine (<script src="page_engine.js">, <link rel="stylesheet" href="page_style.css">, eigene Themen-Engines
#   wie <script src="knee_engine.js">) werden eingebettet; gesucht wird neben der Seite, dann im Vorlagen-Ordner,
# - Web-Schriften werden entfernt (die CSS-Variablen haben Systemschriften als Ersatz).
# Aufruf: python3 -I offline.py <datei.html> [weitere.html …]   (überschreibt die Dateien)
# Bricht mit Fehler ab, wenn danach noch etwas aus dem Netz käme oder ein lokaler Baustein fehlt.
import re,sys,os
here=os.path.dirname(os.path.abspath(__file__))
LIBS=[('d3.min.js','d3.min.js'),('three.min.js','three.min.js'),('OrbitControls.js','OrbitControls.js')]
def vendor(f):return open(os.path.join(here,'vendor',f),encoding='utf-8').read().replace('</script','<\\/script')

def _local(name,base):
    for d in (base,here):
        p=os.path.join(d,name)
        if d and os.path.isfile(p):return open(p,encoding='utf-8').read()
    return None

def make_offline(html,base=None,missing=None):
    for key,f in LIBS:
        html=re.sub(r'<script[^>]*\ssrc="[^"]*'+re.escape(key)+r'"[^>]*>\s*</script>',lambda m:'<script>'+vendor(f)+'</script>',html)
    html=re.sub(r'<link[^>]*href="https://fonts\.(?:googleapis|gstatic)\.com[^"]*"[^>]*>\s*','',html)
    def js(m):
        c=_local(m.group(1),base)
        if c is None:
            if missing is not None:missing.append(m.group(1))
            return m.group(0)
        return '<script>\n'+c.replace('</script','<\\/script')+'\n</script>'
    def css(m):
        c=_local(m.group(1),base)
        if c is None:
            if missing is not None:missing.append(m.group(1))
            return m.group(0)
        return '<style>\n'+c+'\n</style>'
    html=re.sub(r'<script[^>]*\ssrc="(?!https?:|//)([^"]+\.js)"[^>]*>\s*</script>',js,html)
    html=re.sub(r'<link[^>]*rel="stylesheet"[^>]*href="(?!https?:|//)([^"]+\.css)"[^>]*>',css,html)
    return html

def external(html):
    """Alles, was beim Öffnen noch aus dem Netz käme (src/href auf http(s), @import, url(http…))."""
    return (re.findall(r'<(?:script|link|img|iframe|source|video|audio)\b[^>]*\s(?:src|href)="((?:https?:)?//[^"]+)"',html)
            +re.findall(r'url\(\s*["\']?(https?://[^)"\']+)',html))

if __name__=='__main__':
    bad=0
    for p in sys.argv[1:]:
        s=open(p,encoding='utf-8').read();miss=[];t=make_offline(s,os.path.dirname(os.path.abspath(p)),miss);ext=external(t)
        if t!=s:open(p,'w',encoding='utf-8').write(t)
        if ext:bad=1;print('FEHLER: lädt noch aus dem Netz:',p,ext[:5])
        elif miss:bad=1;print('FEHLER: lokaler Baustein nicht gefunden:',p,miss)
        else:print('offline ok:',p,len(t),'Bytes')
    sys.exit(bad)
