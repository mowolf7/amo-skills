---
name: "mindmaphtml"
description: "Use when the user says „mindmaphtml“ or wants an interactive HTML learning mind map (2D map, concept panel with 3D figure or mini quiz) that links interactive exercise pages, built from the bundled template as offline-ready HTML files (example: EMF-1)."
---

# mindmaphtml — Lern-Mindmap als eine HTML-Datei

Vorlage ist die fertige EMF-1-Mindmap mit ihren Aufgaben-Seiten 01–09 (siehe `examples/emf1/` im Repository). Antworte in der Sprache des Nutzers, kurz, eine Sache nach der anderen. Die Vorlage selbst ist deutsch; Beschriftungen bei Bedarf übersetzen.

## Immer zuerst: hochgeladene Dateien in Markdown umwandeln

Jedes hochgeladene oder genannte Material (PDF, Word, PowerPoint, Excel, Bilder mit Text …) wird **einmal am Anfang** in eine Markdown-Datei umgewandelt (z. B. `material/<name>.md`, eine Datei pro Quelle). Danach wird nur noch mit diesen `.md`-Dateien gearbeitet: gezielt suchen und die passenden Abschnitte lesen, statt die Originale immer wieder komplett zu öffnen. Das spart viele Tokens und macht die Arbeit genauer.
- Zum Umwandeln die passenden Skills und Werkzeuge nutzen, wenn verfügbar (z. B. den `pdf`-, `docx`-, `pptx`- oder `xlsx`-Skill), sonst Kommandozeilen-Werkzeuge.
- Formeln, Tabellen, Aufgabennummern und Seitenzahlen beim Umwandeln erhalten, damit Quellen später genannt werden können.
- Auch sonst Skills nutzen, wenn sie die Arbeit besser oder günstiger machen.

## Immer offline

Mindmap und Aufgaben-Seiten müssen **ohne Internet** funktionieren: alle Bibliotheken eingebettet, nichts wird aus dem Netz nachgeladen (keine CDNs, keine Web-Schriften, keine Bilder von außen).
- `build.py` bettet d3, Three.js und OrbitControls aus `template/vendor/` automatisch in die Mindmap ein.
- Jede fertige Aufgaben-Seite danach mit `python3 -I offline.py <Seite.html> …` behandeln. Das Skript bettet die Bibliotheken ein, entfernt Web-Schriften (Systemschriften übernehmen) und meldet einen Fehler, wenn noch etwas aus dem Netz käme.
- Die Muster-Seiten im Ordner `template/` binden die Bibliotheken noch per Link ein, damit sie klein und schnell lesbar bleiben. Erst die fertigen Dateien werden eingebettet.

## Grundprinzip: Standard bleibt, Inhalt ist immer neu

**Bleibt immer gleich (Standard, nicht neu erfinden):**
- Farben, Schriftarten, Hell/Dunkel-Modus, Bruch-Darstellung `.fr`, `.warn`, `.memo`, `.btn`
- Größe und Aufteilung der großen Felder: 2D-Karte, Seitenfenster, Kopfbereich, Suche, Bereichsfilter, Ecke „✓ Immer machen“, Knopf „3D-Ansicht“
- Bedienung: Zoom/Verschieben, Klick hebt Nachbarn hervor, Overlay mit der Aufgaben-Seite, Sprungmarken
- Aufbau jeder Aufgaben-Seite (siehe „Aufgaben-Seiten“ unten)
- 3D-Standard jeder Figur und jedes Modells (wo 3D benutzt wird): kräftige, kontrastreiche Farben (hell und dunkel sichtbar), beschriftetes x-y-z-Koordinatensystem, z nach oben, Beschriftungen als Sprites mit weißem Kästchen, Kamera der Mini-Figuren etwa bei (2.9, 2.3, 3.8)

Dieser Standard steckt in den Bausteinen im Ordner `template/` neben dieser Datei (`tpl.html`, `map.js`, `panel.js`, `fig.js`, `net3d.js`, `build.py`, `offline.py`, den Hilfsfunktionen in `figb.js` für Achsen, Beschriftungen, Kamera, und den Seitengerüsten `aufgabe_muster.html` und `aufgabe_muster_ohne3d.html`). Er wird übernommen, nicht neu programmiert und nicht in den Chat ausgegeben. Das spart Tokens.

**Ist bei jeder neuen Mindmap komplett neu:**
- alle Inhalte: Titel, Bereiche, Themen, Konzepte, Formeln, Erklärungen, Fallen, Merksätze, Analogien (`data.js`)
- **die Aufgaben** mit Aufgabenstellung, 3D-Modell oder Simulation, Vorhersagen/Testen/Beweisen, Übungen, Lösung, Lösungsweg und Erklärung (eigene Seite je Aufgabe)
- **alle 3D-Figuren und 3D-Modelle** bzw. **alle Mini-Quizze**, passend zum neuen Thema. Figuren oder Fragen aus anderen Fächern nicht einfach wiederverwenden.
- Diese Inhalte werden **ohne Nachfrage** erstellt; nicht auf einen Befehl warten.
- **Qualitätsmaßstab:** mindestens so gut wie EMF-1 (Seiten 01–09 und Figuren huelle, pillbox, umlauf, dreibein, zylkoord, aufquell), gern besser: aussagekräftig, sauber beschriftet, fachlich richtig.

## Fächer und Themen, in denen 3D nicht passt

Nicht jedes Fach braucht 3D. Bei theoretischen Fächern, bei Fragen mit langen Antworten in eigenen Worten, bei rechnerischen Aufgaben ohne räumlichen Bezug oder überall dort, wo eine 3D-Darstellung nichts erklärt, wird **kein 3D erzwungen**. Stattdessen:
- **Mehr Aufgaben und mehr Aufgabentypen** auf jeder Aufgaben-Seite, im Bereich „Üben wie in der Klausur“: Multiple Choice, Zuordnen, Lückentext, Reihenfolge, Freitext mit Musterantwort und Kernpunkten zum Abhaken. Passt ein fachtypischer Aufgabentyp besser (z. B. eine Antwort aus Bausteinen zusammensetzen), wird er im gleichen Stil ergänzt.
- **Simulationen von Rechen- und Denkwegen** statt des 3D-Modells: Eingaben ändern, und der Lösungsweg wird Schritt für Schritt neu aufgebaut (Tabelle, Zwischenwerte, Ergebnis, Probe).
- **Mini-Quiz im Seitenfenster** statt der 3D-Figur: 2–4 kurze Fragen pro Konzept mit Erklärung zur richtigen Antwort (`quiz:` im Datenschema).
- Gerüst dafür: `template/aufgabe_muster_ohne3d.html`. Alle Bausteine (Vorhersagen, Simulation, Übungstypen, Klausurlösung, Sprungmarken) sind dort fertig; nur der Datenteil am Ende der Seite wird neu geschrieben.
- Gemischt ist erlaubt: Themen mit räumlichem Bezug bekommen 3D, die anderen Simulation und Quiz. Das Kennzeichen am Themen-Kästchen der Karte passt man mit `badge` an (Standard „3D“).
- Der Qualitätsmaßstab bleibt gleich: Jede Übung hat eine Erklärung zur richtigen Antwort, die Zahlen in Simulation und Klausurlösung kommen aus derselben Funktion.

## Fertige 3D-Modelle aus offenen Quellen

Für manche Fächer gibt es geprüfte, frei lizenzierte 3D-Modelle, zum Beispiel echte Anatomie statt selbst gezeichneter Formen. Die Liste steht in `sources.md` neben dieser Datei, sortiert nach Fach.
- **Vor dem Bauen eigener Figuren** in `sources.md` nachsehen, ob es für das Fach eine Quelle gibt. Wenn ja, deren Modelle nehmen; nur was fehlt, selbst bauen.
- Nur Quellen aus `sources.md` benutzen und ihre Regeln einhalten: beim Bauen herunterladen, auf das Nötige reduzieren und einbetten (die Dateien bleiben offline), Quellenangabe auf jeder Seite, ShareAlike-Lizenz der fertigen Seiten angeben, keine NC- oder ND-Teile.
- Neue Quellen erst nach Prüfung der Lizenz in `sources.md` eintragen (Abschnitt „Adding a source“ dort).

## Aufgaben-Seiten (Standard-Aufbau wie EMF-1)

Jede Aufgabe ist eine eigene HTML-Seite im Gerüst von `template/aufgabe_muster.html` (mit 3D) oder `template/aufgabe_muster_ohne3d.html` (ohne 3D). Design, Abschnitte, Klassen und IDs bleiben gleich, der Inhalt ist neu:

1. **Kopf:** Titel und `class="lede"` mit der Aufgabenstellung in Alltagssprache: was gegeben ist, was gesucht ist, welcher Ansatz passt und warum (z. B. „Gauß hilft hier nicht, weil …“).
2. **Interaktives 3D-Modell** der Aufgabe mit Bedienhinweis (ziehen = drehen, Mausrad = zoomen, rechts ziehen = verschieben), Auto-Drehen, Ansicht zurücksetzen, Legende; bei mehreren Fällen Tabs (`div.tabs`). **Ohne 3D:** Simulation des Rechen- oder Denkwegs (`section.stage.sim`), gesperrt bis die Vorhersagen getippt sind.
3. **Drei Lernschritte** (`div.steps`, `section.step#s1`–`#s3`, die späteren `locked`, bis der vorige erledigt ist):
   - **1 Vorhersagen:** kurze Fragen mit Auswahl, bevor gerechnet wird, mit Erklärung zur richtigen Antwort
   - **2 Testen:** Regler am 3D-Modell bzw. Eingaben der Simulation, mit Text, was man beobachten soll
   - **3 Beweisen:** der Weg zur Formel bzw. Aussage in eigenen Worten
   - **Üben wie in der Klausur** (`section.practice#practice`, bei Seiten ohne 3D Pflicht, sonst empfohlen): Tabs mit Multiple Choice, Zuordnen, Lückentext, Reihenfolge, Freitext
4. **Klausurlösung** (`section.solution#loesung`) im 3-Schritt-Format:
   - **Kurz erklärt:** einfache Erklärung in Alltagssprache
   - **Fachbegriffe:** Begriff → Bedeutung bzw. Formel
   - **Rechnung Schritt für Schritt:** `ol.calc#sol-steps`, jeder `li` ein Minischritt mit Titel, Formel (als HTML, kein rohes LaTeX) und Erklärung, warum dieser Schritt gemacht wird; ohne Rückfragen nachvollziehbar
   - **Das musst du beachten:** `div.memo` (Merksatz/Eselsbrücke) und `div.warn` (typische Fallen)
   - Hinweis zur Prüfung: womit die Lösung abgeglichen und wie sie numerisch geprüft wurde
5. Am Ende das `template/sprungmarke_snippet.html`.

**Woher die Aufgaben kommen:**
- Zuerst aus dem Material des Nutzers: Aufgabensammlung, Übungsblätter, Altklausuren, Musterlösungen (hochgeladen oder im Projektordner). Aufgaben, die oft in Altklausuren kommen, zuerst.
- Gibt es kein Material zu einem wichtigen Thema: eigene Aufgabe im Klausurstil erstellen und auf der Seite als „eigene Aufgabe (keine Musterlösung)“ kennzeichnen.
- Bestehende fertige Aufgaben-Seiten des Fachs wiederverwenden statt neu bauen.
- Aufgabentexte in eigenen Worten formulieren, nicht wörtlich aus fremdem Material kopieren.

**Lösungen prüfen (Pflicht):**
- Jede Lösung mit der Musterlösung abgleichen, wenn es eine gibt (Gleichungsnummern nennen).
- Jede Endformel zusätzlich unabhängig prüfen: symbolisch (z. B. SymPy) oder numerisch (direkte Integration, Grenzfälle, Einheiten). Abweichungen nicht stillschweigend glätten, sondern dem Nutzer melden.
- Die Zahlen im 3D-Modell bzw. in der Simulation und in der Rechnung kommen aus derselben Formel.

## Vorlage

Alle Bausteine liegen im Ordner `template/` neben dieser `SKILL.md`. Nur diese Vorlage benutzen.

- In einen Arbeitsordner kopieren, dort bauen. Die Vorlage im Skill-Ordner nicht verändern.
- Stil-Quelle für `build.py` und Gerüst für neue Aufgaben-Seiten: `aufgabe_muster.html` bzw. `aufgabe_muster_ohne3d.html`. Gibt es im Fach schon eigene fertige Seiten, deren Stil nehmen.
- `template/vendor/` (eingebettete Bibliotheken) nicht lesen, nur von `build.py`/`offline.py` benutzen lassen. Das spart Tokens.
- Ein vollständiges fertiges Beispiel (Mindmap + 9 Aufgaben-Seiten) liegt im Repository unter `examples/emf1/`.

### Bausteine
- `tpl.html` Gerüst (Platzhalter `/*BASECSS*/ /*REUSECSS*/ /*DATA*/ /*MAP*/ /*PANEL*/ /*FIGB*/ /*FIG*/ /*NET3D*/`, Daten-Block zwischen `<!-- MM:DATA -->` und `<!-- /MM:DATA -->`)
- `map.js` 2D-Karte (d3 7.8.5): feste Plätze, Zonen je Bereich, Zoom/Verschieben, Klick hebt Nachbarn hervor, API `window.MMmap` (select, focus, filter, fit)
- `panel.js` Seitenfenster (Thema/Konzept mit 3D-Figur oder Mini-Quiz), Overlay-iframe mit der Aufgaben-Seite, Ecke „✓ Immer machen“, Suche, Bereichsfilter
- `figb.js` Mini-3D-Figuren. **Hilfsfunktionen (Achsen, Sprites, Kamera, Farben) bleiben, die Figuren selbst werden pro Mindmap neu geschrieben** und unter neuen Schlüsseln ergänzt.
- `fig.js` hängt eine Figur ins Seitenfenster und räumt beim Wechsel auf
- `net3d.js` Knopf „3D-Ansicht“: dasselbe Netz in 3D (Three.js r128 + OrbitControls)
- `build.py` baut alles zu EINER offline nutzbaren Datei: `python3 -I build.py <data.js> <Seitenordner> <Stil-Seite> <Ausgabe.html>`. Übernimmt Farben, Schriften, Hell/Dunkel, Bruch `.fr`, `.warn`, `.memo`, `.btn` 1:1 aus der Stil-Seite und die `class="lede"`-Einleitungen aus den verlinkten Seiten, bettet die Bibliotheken ein
- `offline.py` macht fertige Aufgaben-Seiten offline nutzbar: `python3 -I offline.py <Seite.html> …` (bettet Bibliotheken ein, entfernt Web-Schriften, meldet alles, was noch aus dem Netz käme)
- `vendor/` d3 7.8.5, Three.js r128 und OrbitControls mit Lizenzen (wird eingebettet, nicht lesen)
- `sources.md` (liegt neben `SKILL.md`, nicht in `template/`): geprüfte offene 3D-Modell-Quellen nach Fach, mit Lizenz, Nutzung und Quellenangabe
- `data_beispiel_EMF1.js` vollständiges Datenbeispiel (nur als Muster für die Form, nicht für den Inhalt)
- `aufgabe_muster.html` fertige Aufgaben-Seite mit 3D als Gerüst und Stil-Quelle
- `aufgabe_muster_ohne3d.html` Aufgaben-Seite ohne 3D: Simulation, Vorhersagen, Üben (Multiple Choice, Zuordnen, Lückentext, Reihenfolge, Freitext), Klausurlösung; Inhalt sind Platzhalter
- `sprungmarke_snippet.html` wird ans Ende jeder Aufgaben-Seite gehängt (in beiden Mustern schon enthalten)
- `test_komplett.js` + `test_route.js` Playwright-Test. `test_route.js` blockt jede Anfrage ins Netz, so zeigt der Test auch, dass alles offline läuft. Seiten in `pages/`, Dateiname der Mindmap im Skript anpassen

## Ablauf (immer in dieser Reihenfolge)

0. **Material in Markdown umwandeln** (Abschnitt oben), bevor irgendetwas gelesen oder geplant wird.
1. **Verstehen und planen, bevor gebaut wird.** Kurz bestätigen, welches Fach/Thema die Mindmap abdeckt und welches Material es gibt. Entscheiden, wo 3D passt und wo Simulation und Quiz besser sind. Liste der geplanten Aufgaben (Titel + Quelle + mit/ohne 3D) nennen.
2. **Aufgaben-Seiten bauen** (Abschnitt „Aufgaben-Seiten“): fehlende Seiten neu im passenden Standard-Gerüst, vorhandene wiederverwenden. Jede Lösung prüfen (Musterlösung + symbolisch/numerisch).
3. **Konzepte aus den Seiten ziehen, nicht erfinden.** Die Seiten per Playwright öffnen, jeden Tab anklicken und `#sol-steps > li` samt Titel und Formel auslesen. Daraus kommen die Konzepte und die exakten Schrittnummern für die Sprünge.
4. **Sprungmarken:** `sprungmarke_snippet.html` ans Ende jeder Aufgaben-Seite (nur einmal, vorher prüfen). URL-Format `datei.html#schritt-N` oder `datei.html#tab-<id>/schritt-N`. Das Snippet klickt den Tab, scrollt zum Schritt und markiert ihn gelb.
5. **`data.js` komplett neu schreiben** (Schema unten).
6. **Neue Mini-3D-Figuren bauen – ohne auf einen Befehl zu warten.** Zuerst in `sources.md` prüfen, ob es für das Fach fertige offene Modelle gibt, und diese bevorzugen. Für jedes Konzept, bei dem 3D hilft (Felder, Flächen, Körper, Koordinaten, Bewegungen, Vektoren: fast immer), eine neue Figur zum Inhalt dieses Themas entwerfen, mit den Standard-Hilfsfunktionen aus `figb.js`. Alle neuen Figuren gemeinsam zeigen und selbst prüfen: richtig, lesbar, Achsen beschriftet, hell und dunkel sichtbar. Zum Zeigen einen Three.js-Viewer-Connector nehmen, falls verfügbar (Raster, gemeinsame Kamera), sonst Playwright-Screenshots. Dann in `figb.js` übernehmen und per `fig:` verknüpfen. **Wo 3D nicht passt:** stattdessen pro Konzept ein Mini-Quiz (`quiz:`) mit 2–4 Fragen schreiben.
7. **Bauen, offline machen und Vorschau:** `build.py` für die Mindmap, `offline.py` für alle Aufgaben-Seiten. Mit Playwright Screenshots hell, dunkel, mit einem ausgewählten Knoten (Seitenfenster mit neuer Figur bzw. Quiz) und von einer neuen Aufgaben-Seite (3D-Modell bzw. Simulation + Lösung) machen und dem Nutzer zeigen. Auf Freigabe warten.
8. **Testen** (siehe Checkliste), dann speichern und kurz berichten.

## Datenschema (`window.MM`)

```js
window.MM = {
  meta:{title, eyebrow, lede, search},          // Kopftexte und Platzhalter der Suche
  layout:{mid:[900,560]},                        // Mitte der Karte (virtuelle Fläche ~1800×1100)
  hitsLabel:'Treffer in Altklausuren',           // Text hinter dem Häufigkeitsbalken
  tabNames:{voll:'Vollkugel', …},                // Anzeige-Namen der Tabs in „Schritt N · …“
  areas:{KEY:{name, col:'--gauss'|'--field'|'--charge'|'--ok'|'--neg'|'--kappa', center:true?}},
                                                 // center:true = Werkzeug-Bereich in der Mitte
  badge?:'3D',                                   // Kennzeichen an allen Themen-Kästchen ('' = keins)
  topics:[{id, nr, name, area, file, pos:[x,y]?, facts:[[Label,Wert]], hits?, noSolution?, lede?, badge?}],
                                                 // eine Aufgabe = ein Topic; ohne pos: automatisch im Bogen je Bereich
  concepts:[{id, name, area, f:'Formel-HTML', k:'Kurz erklärt (Alltagssprache)', w:'Falle für ⚠ Achtung', m?:'Merksatz',
             fig?:'figb-Schlüssel', quiz?:[{q:'Frage', o:['Antwort', …], r:IndexRichtig, why:'Erklärung'}],
             use:{topicId:'tab-x/schritt-N' | ''}}],   // fig ODER quiz; hat ein Konzept beides, gewinnt fig
  always?:{name, items:[[Titel,Text]], use:{topicId:hash}},   // Ecke „✓ Immer machen“, ohne Linien
  analog:[[conceptA, conceptB, 'Warum analog']]  // lila gestrichelt
};
```

- Formeln als HTML im Stil der Seiten: `fr(z,n)` für Brüche, `<b>r</b>` für Vektoren, `<sub>/<sup>`, Unicode (ε₀, ∯, ∮, ∭). Kein rohes LaTeX.
- Konzepte, die an fast allem hängen (z. B. Probe & Grenzfälle), nicht als Knoten anlegen, sondern als `always`. Konzepte mit ≥ 5 Themen werden automatisch blass gezeichnet, bis man sie anklickt.
- Die Bereichsfarben (`col`) kommen aus den festen CSS-Variablen; neue Fächer ordnen ihre Bereiche diesen Variablen zu, statt neue Farben zu erfinden.
- `noSolution:true` nur für Aufgaben ohne Musterlösung; eigene Aufgaben zusätzlich im `lede` kennzeichnen.

## Gestaltungsregeln

- **Karte in 2D** mit festen Plätzen wie eine Landkarte: Bereiche als Zonen, gemeinsame Konzepte liegen zwischen ihren Themen, Werkzeuge in der Mitte. 3D gehört in die Inhalte (Figuren, Aufgaben-Seiten), wo es passt. Das 3D-Netz gibt es nur als Zusatzknopf.
- **3D (wo benutzt):** kräftige, kontrastreiche Farben, die hell und dunkel sichtbar sind; **immer ein beschriftetes x-y-z-Koordinatensystem**; z nach oben; Beschriftungen als Sprites mit weißem Kästchen.
- Hell/Dunkel über die CSS-Variablen der Stil-Seite; Handy ohne waagrechtes Scrollen.
- Erklärungen in Alltagssprache, kurze Eselsbrücken, ⚠-Falle pro Konzept und pro Aufgabe; formale Symbolschrift (Quantoren, ε-δ) erst in Alltagssprache übersetzen.

## Test-Checkliste (vor dem Speichern)

- Jeden Knoten anklicken → Seitenfenster hat einen Titel.
- **Jedes** Sprungziel öffnen und prüfen, dass `#sol-steps > li.mm-hit` existiert.
- **Jede Aufgaben-Seite:** 3D-Modell rendert bzw. Simulation rechnet, Regler und Eingaben funktionieren, Schritte 1–3 lassen sich nacheinander freischalten, jeder Übungs-Tab lässt sich lösen und zeigt Erklärungen, Klausurlösung vollständig (Kurz erklärt, Fachbegriffe, Schritte, Beachten), Zahlen im Modell bzw. in der Simulation = Zahlen in der Rechnung.
- **Jede neue Figur** rendert (Canvas nicht leer), Achsen und Beschriftungen sichtbar; **jedes Mini-Quiz** zeigt nach einer Antwort richtig/falsch und die Erklärung; 3D-Ansicht an und wieder aus (der Knopf muss über dem 3D-Canvas liegen, `.mapctl{z-index:2}`).
- **Offline:** Alle Seiten mit blockiertem Netz öffnen (`test_route.js`); es darf keine einzige Anfrage nach außen geben, und `offline.py` meldet bei jeder Datei „offline ok“.
- Keine Konsolenfehler hell und dunkel; `scrollWidth − innerWidth = 0` bei 390 px, auch auf den Aufgaben-Seiten.
- Den Screenshot selbst ansehen: Zonen-Beschriftungen nicht verdeckt, Labels lesbar, Design gleich wie bei EMF-1.
- Testskripte schreiben Ergebnisse sofort weg (`console.log` je Zeile), damit ein Absturz keine Ergebnisse verschluckt; lange Läufe mit `timeout` laufen lassen.

## Speichern

- Mindmap und Aufgaben-Seiten nummeriert in denselben Ordner legen (z. B. `00_<Fach>_Mindmap.html`, `01_<Aufgabe>.html` …), damit die relativen Links und das Overlay-iframe unter `file://` funktionieren.
- Arbeitet die Sitzung nicht direkt im Ordner des Nutzers (z. B. Cloud-Sitzung), die fertigen Dateien mit den verfügbaren Datei-Werkzeugen dorthin übertragen; bereits vorhandene Seiten nur ändern, wenn nötig (Sprungmarke), und vorher den aktuellen Stand lesen.
- Optional, wenn das Artifact-Werkzeug verfügbar ist: als **privates** Artifact veröffentlichen, die Aufgaben-Seiten als `files` daneben, damit alles auch online komplett läuft. Nur auf Wunsch des Nutzers teilen.
- Alt- oder Varianten-Dateien des Nutzers nicht anfassen.
- Geliefert werden nur die offline gemachten Dateien (nach `build.py` bzw. `offline.py`).
- Abschluss: 1–2 Sätze, was drin ist (Anzahl Aufgaben, Konzepte, neue Figuren bzw. Quizze) und was getestet wurde, plus offene Entscheidungen oder Abweichungen zur Musterlösung. Kein Schritt-Protokoll.

## Bekannte Stolpersteine

- Kraft-Simulation für das 2D-Layout ergibt Knäuel: Lieber die regelbasierte Platzierung in `map.js` nehmen (eigene Konzepte im Bogen um ihr Thema, gemeinsame im Mittel der Themen, danach Rechteck-Überlappungen auflösen).
- Die Zone des Mitte-Bereichs nur aus seinen eigenen Konzepten bilden, sonst überdeckt sie alles.
- Overlay-Elemente in der Karte (Ecke „Immer machen“) unten links platzieren, oben verdecken sie Zonen-Beschriftungen.
- Mini-Figur-Kamera etwa bei (2.9, 2.3, 3.8); 3D-Netz-Kamera etwa bei (0, 50, 280).
- Artifact-`files` brauchen Quellpfade im Arbeits- oder Scratchpad-Ordner; .py/.html-Bausteine als `.txt` mit `contentType: text/plain` ablegen.
