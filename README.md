# Ruian He · Personal website

Source for [ryanhe312.github.io](https://ryanhe312.github.io/). A responsive, dependency-free academic homepage inspired by the typography, generous spacing, restrained navigation, and editorial presentation of OpenAI's website. The page opens directly with the biography and uses the original color portrait.

## Preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. The committed `index.html` also opens directly in a browser. All papers remain readable without JavaScript; JavaScript enhances search and year filtering.

## Update content

- Edit career, education, and page sections in `index.template.html`.
- Edit paper records in `data/publications.json`. `status` is either `published` or `preprint`; the build keeps the two lists separate.
- Rebuild the committed homepage and BibTeX export with `node scripts/build.mjs` (Node.js 18+; no package installation needed).
- Styling: `stylesheet.css`. Progressive filtering: `site.js`.

GitHub Pages can serve these static files directly from the repository root. No application server or framework build is required for deployment.

## Sources and assets

Career information was checked against LinkedIn, and the 23-paper list against Google Scholar on November 10, 2026. See `SOURCES.md` for manuscript discrepancies and provenance.

Research figures and the portrait are retained from the previous site. The FMIRAgent illustration is from the author's [FMIRAgent repository](https://github.com/ryanhe312/FMIRAgent).

The previous version was based on [Jon Barron's academic website](https://jonbarron.info/).
