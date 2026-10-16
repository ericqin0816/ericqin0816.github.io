# Eric Qin

My personal portfolio website: projects, athletics, and a little life outside the browser.

Website: https://ericqin0816.github.io/

## Run locally

No build or dependencies are required. From this repository:

```sh
python3 -m http.server 4173
```

Open http://localhost:4173/.

## Publish

GitHub Pages serves the root of the `main` branch. Pushing changes to `main` automatically publishes the website. Keep `.nojekyll` so the static files are served without Jekyll processing.

## Files

- `index.html`: homepage and the illustrated scene.
- `work/`: Builds and For fun & curiosity.
- `about/`: personal context, athletics, and experience.
- `contact/`: contact links.
- `climbiq/`: engineering case study.
- `styles.css`, `quiet.css`, and `portal.css`: styles and responsive layouts.
- `characters.js` and `motion.mjs`: animated climbing, swimming, and the sleeping Snorlax frames; respects pause and reduced-motion preferences.
- `assets/`: EQ logo and user-selected Snorlax animation; see `assets/CREDITS.md`.
- `fonts/`: bundled fonts and their original license files.
- `Eric-Qin-Resume.pdf`: résumé.

The EQ logo was supplied by Eric. The SVG people are decorative illustrations. The Snorlax artwork is a third-party asset credited separately, and is not offered under a new license by this repository.


## October 2026 content refresh

The Projects page groups Research, Builds, and For fun. `/crux-rnn/` and `/robustdrive/` contain research stories, measured results, original repository figures, and methods/report links. `/climbiq/` explains the climbing project in the same conversational style. About contains the education, work, service, athletics, skills, and language details from Eric’s supplied CV. `editorial.css` handles the shared reading layout.
