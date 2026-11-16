# mindmaphtml

Builds an interactive learning mind map from your course material as offline HTML files: a 2D concept map, a side panel for each concept with a mini 3D figure or a mini quiz, and one exercise page per task with an interactive 3D model or simulation, practice questions and an exam-style solution worked out step by step.

**Live demo:** https://mowolf7.github.io/amo-skills/ (EMF-1 example, in German)

## What it does

- **Works offline.** Every generated page is a plain HTML file with its libraries embedded. Nothing is loaded from the internet when you open it.
- **Fits any subject.** 3D models and figures where they help; otherwise simulations of the solution path, more exercise types (multiple choice, matching, fill in the blanks, ordering, free text) and a mini quiz per concept.
- **Real 3D models where they exist.** A checked list of open-licensed sources per field (anatomy, biochemistry, cell biology, physiology), with credits added to every page that uses them.
- **Checked solutions.** Each solution is compared with the official model solution when one exists, and checked independently.
- **Delivered for your device.** At the start Claude asks whether you want an online link or a ZIP of offline files, and recommends one.

## How to use

Ask Claude for a mind map and attach your material, for example: "mindmaphtml for my anatomy course, topic knee joint, here are my slides". In Claude Code you can also type `/mindmaphtml`.

## What it needs

- Building, previews and tests: Python 3, Node.js and Playwright with Chromium.
- For subjects that use open 3D models: internet access while building, to download the model data (RCSB PDB, PubChem, GitHub). The finished pages need no internet.
- No API keys, accounts or personal data. Your material is only processed in your own session.

## Notes

- The bundled libraries (d3, Three.js, OrbitControls) are in `skills/mindmaphtml/template/vendor/` with their licenses. They are embedded into generated pages.
- The template and its labels are in German; Claude answers in your language and translates the labels.
- Source, example and issue tracker: https://github.com/mowolf7/amo-skills

## License

MIT. Bundled libraries keep their own licenses: d3 (ISC) and Three.js (MIT).
