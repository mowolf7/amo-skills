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

## Fields still to add

Further fields (for example chemistry, biology, geography and geology, engineering) are added here one at a time after their sources have been checked.

## Adding a source

Before a new source goes into this list:
1. Read its license file or license page directly; do not rely on summaries.
2. Note the exact attribution wording the source asks for.
3. Check for parts with stricter licenses (NC, ND, or "personal use only") and list them as excluded.
4. Check the file format, total size and whether single structures can be downloaded on their own.
5. Add a row to the table of its field, plus a "How to use" entry with file names, naming scheme and attribution line.
