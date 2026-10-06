# Portfolio

My personal site. One file, no build step.

## Edit it

Everything is in `index.html`. Open it on GitHub, press the pencil icon, change the text and commit.

- Intro text: search for `class="lead"`
- Jobs and projects: each one is an `<article class="entry">` block. Copy a block to add another.
- Colors: the `:root` block at the top of the `<style>` section

## Put it online

The site is published by GitHub Actions. The workflow in `.github/workflows/pages.yml` runs on every push to `main`.

One-time setup: in the repo, go to Settings, then Pages, and set Source to "GitHub Actions". If the repo is named `SBaksa.github.io`, the site appears at https://sbaksa.github.io.
