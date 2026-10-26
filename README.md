# widad.ch

Personal website of Widad Jamal – a static one-page site (HTML, CSS, a little JavaScript), served by Cloudflare Workers static assets (`wrangler.jsonc`). No build step.

## Structure

```
index.html                 Page structure and the German text (default language)
assets/css/styles.css      Design system and layout (tokens at the top)
assets/js/translations.js  English text, keyed by data-i18n / data-i18n-attr
assets/js/main.js          Language switch (DE/EN) and mobile menu
assets/img/                Portrait and social preview image (og-image.png, 1200×630)
assets/fonts/              DM Serif Display and DM Sans, self-hosted (SIL OFL)
favicon.svg, favicon.ico, apple-touch-icon.png
.assetsignore              Repository files that are not published
```

## Editing text

- German lives in `index.html`. Elements with `data-i18n="key"` are translated; attributes such as `alt` or `aria-label` use `data-i18n-attr="alt:key"`.
- English lives in `assets/js/translations.js` under the same key. A missing key falls back to German and logs a warning in the browser console.
- The chosen language is remembered in `localStorage`. `https://widad.ch/?lang=en` opens the English version directly (useful in English applications).

## Local preview

```sh
python3 -m http.server 8642
# then open http://localhost:8642
```

## Deployment

Pushing to `main` may deploy automatically through the Cloudflare Git integration. Deploy only when the changes are approved.
