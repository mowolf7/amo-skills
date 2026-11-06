# Changelog

All notable changes to this marketplace. Versions follow [Semantic Versioning](https://semver.org).

## Unreleased

- Live demo of the EMF-1 example on GitHub Pages: https://mowolf7.github.io/amo-skills/
- `sources.md`: checked open 3D model sources per field, starting with medicine (lucgrn3/anatomy-models for bones, muscles and ligaments; BodyParts3D for organs, vessels and nerves), with usage and attribution rules. The skill checks this list before building figures by hand.

## 1.0.0

First public release.

- **`mindmaphtml` skill:** interactive learning mind map with a 2D concept map, a side panel per concept and exercise pages with exam-style solutions worked out step by step.
- **Always offline:** d3, Three.js and OrbitControls ship with the skill and are embedded into every generated page; `offline.py` checks that nothing loads from the internet.
- **Any subject:** 3D models and figures where they help; otherwise a simulation of the solution path, more exercise types (multiple choice, matching, fill in the blanks, ordering, free text with model answer) and a mini quiz per concept.
- **Markdown first:** uploaded material is converted to Markdown once, to save tokens.
- **Checked solutions:** compared with the official model solution when one exists, and checked independently.
- Offline example (EMF 1) with 9 exercise pages, README in English and German, MIT license.
- Automatic check on every pull request: plugin validation, offline check, example build and a browser test with network blocked.
