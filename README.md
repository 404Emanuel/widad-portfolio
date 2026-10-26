# widad.ch

Personal website of Widad Jamal – a static one-page site (HTML, CSS, a little JavaScript), served by Cloudflare Workers static assets (`wrangler.jsonc`). No build step.

## Structure

```
index.html                 Page structure and the German text (default language)
assets/css/styles.css      Design system and layout (tokens at the top)
assets/js/translations.js  English, Italian and French text, keyed by data-i18n / data-i18n-attr
assets/js/main.js          Language switch (DE/EN/IT/FR) and mobile menu
assets/img/                Portrait and social preview image (og-image.png, 1200×630)
assets/fonts/              DM Serif Display and DM Sans, self-hosted (SIL OFL)
favicon.svg, favicon.ico, apple-touch-icon.png
.assetsignore              Repository files that are not published
```

## Editing text

- German lives in `index.html`. Elements with `data-i18n="key"` are translated; attributes such as `alt` or `aria-label` use `data-i18n-attr="alt:key"`.
- English, Italian and French live in `assets/js/translations.js` under the same key. A missing key falls back to German and logs a warning in the browser console.
- Widad writes in the first person (feminine forms in Italian and French) and addresses employers formally (Sie / Lei / vous).
- The chosen language is remembered in `localStorage`. `https://widad.ch/?lang=en` (or `it`, `fr`) opens that version directly – useful for applications in that language.

## Local preview

```sh
python3 -m http.server 8642
# then open http://localhost:8642
```

## Deployment

Pushing to `main` may deploy automatically through the Cloudflare Git integration. Deploy only when the changes are approved.
