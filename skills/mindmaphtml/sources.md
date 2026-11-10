# Open 3D model sources by field

Checked sources of ready-made 3D models that mind maps can use instead of drawing figures by hand. Each field is added step by step, after its sources have been checked.

## Rules for every source

1. **Use only sources listed here.** A model from anywhere else is not used until its source has been checked and added to this list (see "Adding a source" below).
2. **Fetch while building, never while viewing.** Models are downloaded once when the mind map is built, simplified to what the topic needs and embedded into the HTML file. The finished files stay offline.
3. **Only what is needed.** Embed only the structures a topic shows, not whole collections. Keep each page small enough to open quickly on a phone.
4. **Credits on every page that uses a model.** Copy the attribution line of the source exactly as given below into the page footer and the figure legend, and state what was changed (for example "simplified, recoloured").
5. **ShareAlike.** If a source is CC BY-SA, every mind map or page that contains its models is shared under **CC BY-SA 4.0**. Say so in the footer. The skill's own code stays MIT, and model files are never stored in this repository.
6. **Never use non-commercial (NC) or no-derivatives (ND) parts**, even if the rest of a source is open.

## Medicine and anatomy

| Source | What's in it | Format | License | Assessment |
|---|---|---|---|---|
| [lucgrn3/anatomy-models](https://github.com/lucgrn3/anatomy-models) | Every bone, skeletal muscle and ligament. Each structure is a separate part named with official anatomical IDs (Terminologia Anatomica 2). Includes an index of positions, landmarks and per-part credits. | glTF 2.0, web-ready, compressed, only 8 MB in total | CC BY-SA 4.0. Two ear muscles are under a BSD-style license that only requires keeping a notice. | ⭐ Best for the musculoskeletal system. Updated October 2026, built on Z-Anatomy, BodyParts3D and NIH models. |
| [BodyParts3D](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D) (via [Anatomography](https://en.wikipedia.org/wiki/Anatomography)) | About 930 structures, including organs, vessels, nerves and the brain. | STL/OBJ, one file per structure | CC BY-SA 2.1 Japan | ⭐ Best for organs, vessels and nerves. Older data from 2011, one male body. Needs simplifying. |

### How to use them

**lucgrn3/anatomy-models: bones, muscles, ligaments**
- Files: `bones.glb`, `muscles.glb`, `ligaments.glb`. Every structure is one node named `ta2-<TA2 id>.<side>`. Find the right nodes by name or ID in `index.json` (it also gives bounds, tissue layer and landmarks).
- The meshes are meshopt-compressed and quantized. Decompress the selected nodes while building and embed them in a form the bundled Three.js version can read.
- Per-node credits are in `credits.json`. Leave out the two ear muscles from the Open Anatomy inner ear atlas, or keep the notice from `LICENSE-slicer.txt` with them.
- Attribution line: `3D models: "Anatomy 3D models" (github.com/lucgrn3/anatomy-models), CC BY-SA 4.0, based on Z-Anatomy, BodyParts3D (DBCLS) and NIH 3D. Modified.`

**BodyParts3D: organs, vessels, nerves, brain**
- One STL file per structure in `assets/BodyParts3D_data/stl/`, named `FMA<id>.stl` after the Foundational Model of Anatomy. Look up IDs and English names in `assets/BodyParts3D_data/parts_list_e.txt`; `png/` has a preview image for each structure.
- Simplify the meshes before embedding (target a few thousand triangles per structure). Structures share one coordinate system, so parts placed together stay aligned.
- Attribution line: `3D models: BodyParts3D, (c) The Database Center for Life Science, licensed under CC Attribution-Share Alike 2.1 Japan. Modified.`

**Which one to use**
- Bones, joints, muscles, ligaments: lucgrn3/anatomy-models.
- Organs, vessels, nerves, brain: BodyParts3D.
- Both in one figure is fine: they are both ShareAlike, and the page is shared under CC BY-SA 4.0 with both attribution lines.
- If neither source has a structure, build the figure by hand as usual with `figb.js` and say so in the legend.

## Biochemistry

| Source | What's in it | Format | License | Assessment |
|---|---|---|---|---|
| [RCSB Protein Data Bank](https://www.rcsb.org/pages/usage-policy) | Experimentally determined 3D structures of proteins, nucleic acids and complexes (enzymes, haemoglobin, DNA, ribosome, ATP synthase …), one entry per PDB ID | mmCIF / PDB, one file per structure (`https://files.rcsb.org/download/<ID>.cif`) | **CC0 1.0** (public domain dedication). Attribution of the original authors and the RCSB PDB is requested, not required. | ⭐ Best for proteins and other macromolecules. |
| [PubChem](https://pubchem.ncbi.nlm.nih.gov) 3D conformers | Computed 3D structures of small molecules (sugars, amino acids, nucleotides, lipids, vitamins, drugs), one per compound ID (CID) | SDF, one file per CID (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/<CID>/SDF?record_type=3d`) | **Public domain**: the 3D conformers are computed by PubChem itself (source "PubChem" on the record), and NLM states that information created by or for the US government is public domain; NLM asks to be acknowledged. | ⭐ Best for small molecules. |

### How to use them

**RCSB PDB: proteins and macromolecules**
- Download only the structures a topic needs, by PDB ID. Use model 1 only.
- Simplified view that stays small: the Cα backbone of each chain as a tube (one colour per chain), plus important hetero groups (for example haem `HEM`, ligands, cofactors) as ball-and-stick. Bonds of hetero groups are found by atom distance.
- Do not use RCSB website text, Molecule of the Month articles or other site content: those are copyrighted or under other terms. Only the structure data files are CC0.
- Attribution line: `Structure: PDB <ID> (<first authors from _audit_author>), RCSB Protein Data Bank, CC0 1.0. Simplified.`

**PubChem: small molecules**
- Download the 3D SDF by CID. Use only the 3D coordinates and bonds; do not copy descriptions, names or other annotations from third-party data sources on PubChem, which can carry their own licenses.
- Ball-and-stick with standard element colours (C grey, H white, O red, N blue, P orange, S yellow, metals brown); double bonds as two sticks.
- Group labels (for example "Adenin", "Ribose", "Triphosphat") can be placed automatically from the bonds.
- Check the exact compound: some CIDs leave stereochemistry or the anomer open (for example CID 5793 is D-glucose without a fixed anomer). Name figures accordingly or choose a more specific CID.
- Attribution line: `3D structure: PubChem, National Library of Medicine (NLM), CID <CID>, public domain.`

## Cell biology

No open source with ready-made organelle models was found that fits the rules: the Allen Cell Explorer is non-commercial only (excluded), NIH 3D and cellPACK have unclear licences per model, and EMDB (CC0) offers raw density maps rather than usable models. So cell biology uses two things:

| Source | What's in it | Format | License | Assessment |
|---|---|---|---|---|
| Own schematic figures (`figb.js` style) | Organelles and cell structures: nucleus, mitochondrion, ER, Golgi, lysosome, membrane bilayer, cytoskeleton, cell junctions | built in Three.js, no download | none needed | ⭐ Best for organelles: light, clear, no licence questions. Mark them "own schematic figure, not to scale". |
| [RCSB Protein Data Bank](https://www.rcsb.org/pages/usage-policy) (see Biochemistry) | Molecular machines of the cell | mmCIF per PDB ID | CC0 1.0 | ⭐ Best for molecular machines. |

### How to use them

- **Organelles:** build them as schematic figures with the usual helpers (labelled axes, labels in white boxes, strong colours). A cut-away view (half shells) shows inner structures, for example a mitochondrion's outer and inner membrane, cristae, matrix, mtDNA and ribosomes.
- **Molecular machines from the PDB:** same pipeline as in Biochemistry. Colour chains by subunit (entity), orient the complex along its functional axis and label the parts. Checked example IDs:
  - `5ARA` bovine mitochondrial ATP synthase (tested: F1 head, γ rotor, c-ring, peripheral stalk)
  - `1J4N` aquaporin-1 water channel
  - `3WGU` Na⁺/K⁺-ATPase
  - `1JFF` α/β-tubulin (microtubules)
  - `6KN8` human cardiac thin filament (actin, tropomyosin, troponin)
  - `1AON` GroEL/GroES chaperonin
  - `4V6X` human 80S ribosome and `7R5J` human nuclear pore complex: very large; use only the parts needed, and use phosphorus atoms instead of Cα for RNA.
- Attribution line for PDB structures: as in Biochemistry. Own figures: `Own schematic figure, not to scale.`

## Course overview and fields still to add

Course overview (medical studies). Courses without 3D use the skill's non-3D mode (simulations, more exercise types, mini quiz) and only need the student's own material.

| Course | 3D useful? | Sources | Status |
|---|---|---|---|
| Anatomy | yes | lucgrn3/anatomy-models, BodyParts3D | ✅ checked and tested (knee, heart). Open: heart chambers need BodyParts3D 4.0 from the original server. |
| Descriptive Biochemistry | yes | RCSB PDB, PubChem | ✅ checked and tested (glucose, ATP, haemoglobin). |
| Biocell (cell biology) | yes | own schematic figures + RCSB PDB | ✅ checked and tested (mitochondrion, ATP synthase, lipid bilayer). No open organelle model library found. |
| Physiology | partly | anatomy sources above; optional PhET, OpenStax figures | ⬜ Open: PhET and OpenStax licences need a direct check (terms changed recently). |
| Biophysics | yes, self-built | none needed (figures built like the EMF example) | ✅ Covered. |
| Biostatistics | no | optional open datasets (OpenIntro) or own synthetic data | ✅ Covered by non-3D mode. |
| Behavioral Science | no | student's material | ✅ Covered by non-3D mode. |
| Bioethics | no | student's material; open casebooks found are NonCommercial and therefore excluded | ✅ Covered by non-3D mode (own cases). |
| First Aid | partly | anatomy sources above; guideline content from the student's course (IFRC guidelines are copyrighted) | ✅ Covered; follow the guideline version the course uses. |

Build-time tools that were used for the tests are in `template/sources/` (`gltf_extract.mjs`, `stl_simplify.mjs`, `pack_mesh.py`, `pack_molecule.py`; Node packages in `package.json`). They are prototypes and are adapted per topic.

## Adding a source

Before a new source goes into this list:
1. Read its license file or license page directly; do not rely on summaries.
2. Note the exact attribution wording the source asks for.
3. Check for parts with stricter licenses (NC, ND, or "personal use only") and list them as excluded.
4. Check the file format, total size and whether single structures can be downloaded on their own.
5. Add a row to the table of its field, plus a "How to use" entry with file names, naming scheme and attribution line.
