# davidcafor.github.io

Personal site built with [Astro](https://astro.build) and published to GitHub Pages.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

- Apps shown on the home page live in `src/data/apps.ts`.
- Name, bio and contact links live in `src/data/site.ts`.
- `public/` is copied as-is. The app legal and support pages (`hue9-legal`, `hue9-accessibility`, `oruvi-legal`, `rolo-legal`) live there so their URLs stay the same.
- `/map` shows the countries where the apps have sold. `scripts/fetch-sales.mjs` refreshes `src/data/sales.json` from RevenueCat before each build, using the `REVENUECAT_API_KEY` and `REVENUECAT_PROJECT_ID` Actions secrets. Without them the committed sample data is used.
- Every push to `main` deploys through `.github/workflows/deploy.yml`, and it also runs daily to refresh the map.
