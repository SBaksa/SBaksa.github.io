# Portfolio

My personal site. Plain HTML with no build step, plus one 3D model in the intro.

## Edit it

Everything is in `index.html`. Open it on GitHub, press the pencil icon, change the text and commit.

- Intro text: search for `class="lead"`
- Jobs and projects: each one is an `<article class="entry">` block. Copy a block to add another.
- Colors: the `:root` block at the top of the `<style>` section

## The 3D head

- `models/head.glb` is the model, exported from Blender and compressed for the web.
- `src/head.js` is the viewer code. The page loads the bundled copy, `assets/head.js`, which includes three.js so nothing is fetched from another site.
- After editing `src/head.js`, rebuild with: `npm install three@0.160.0 esbuild` then `npx esbuild src/head.js --bundle --minify --format=iife --target=es2018 --alias:three/addons=./node_modules/three/examples/jsm --outfile=assets/head.js`

## Put it online

The site is published by GitHub Actions. The workflow in `.github/workflows/pages.yml` runs on every push to `main`.

One-time setup: in the repo, go to Settings, then Pages, and set Source to "GitHub Actions". If the repo is named `SBaksa.github.io`, the site appears at https://sbaksa.github.io.
