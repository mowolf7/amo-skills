# Macht eine HTML-Datei komplett offline-fähig: d3, Three.js und OrbitControls werden aus vendor/ eingebettet,
# Web-Schriften werden entfernt (die CSS-Variablen haben Systemschriften als Ersatz).
# Aufruf: python3 -I offline.py <datei.html> [weitere.html …]   (überschreibt die Dateien)
# Bricht mit Fehler ab, wenn danach noch etwas aus dem Internet geladen würde.
import re,sys,os
here=os.path.dirname(os.path.abspath(__file__))
LIBS=[('d3.min.js','d3.min.js'),('three.min.js','three.min.js'),('OrbitControls.js','OrbitControls.js')]
def vendor(f):return open(os.path.join(here,'vendor',f),encoding='utf-8').read().replace('</script','<\\/script')

def make_offline(html):
    for key,f in LIBS:
        html=re.sub(r'<script[^>]*\ssrc="[^"]*'+re.escape(key)+r'"[^>]*>\s*</script>',lambda m:'<script>'+vendor(f)+'</script>',html)
    html=re.sub(r'<link[^>]*href="https://fonts\.(?:googleapis|gstatic)\.com[^"]*"[^>]*>\s*','',html)
    return html

def external(html):
    """Alles, was beim Öffnen noch aus dem Netz käme (src/href auf http(s), @import, url(http…))."""
    return (re.findall(r'<(?:script|link|img|iframe|source|video|audio)\b[^>]*\s(?:src|href)="((?:https?:)?//[^"]+)"',html)
            +re.findall(r'url\(\s*["\']?(https?://[^)"\']+)',html))

if __name__=='__main__':
    bad=0
    for p in sys.argv[1:]:
        s=open(p,encoding='utf-8').read();t=make_offline(s);ext=external(t)
        if t!=s:open(p,'w',encoding='utf-8').write(t)
        if ext:bad=1;print('FEHLER: lädt noch aus dem Netz:',p,ext[:5])
        else:print('offline ok:',p,len(t),'Bytes')
    sys.exit(bad)
