import { geoBounds, geoCentroid, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import atlas from 'world-atlas/countries-50m.json';

countries.registerLocale(en);

export const GRID = {
  step: 2, // degrees between dots
  west: -180,
  east: 180,
  north: 84,
  south: -58, // Antarctica is left out
};

export const COLS = Math.round((GRID.east - GRID.west) / GRID.step);
export const ROWS = Math.round((GRID.north - GRID.south) / GRID.step);

export type Dot = { x: number; y: number; code: string };

/** Map a longitude/latitude to grid coordinates (column, row). */
export const toGrid = (lon: number, lat: number) => ({
  x: (lon - GRID.west) / GRID.step,
  y: (GRID.north - lat) / GRID.step,
});

export const countryName = (code: string) => countries.getName(code, 'en') ?? code;

/** One dot per grid cell that falls on land, tagged with its ISO 3166-1 alpha-2 country code. */
export function buildDots(): Dot[] {
  const topo = atlas as any;
  const shapes = (feature(topo, topo.objects.countries) as any).features
    .map((f: any) => ({
      f,
      code: countries.numericToAlpha2(String(f.id ?? '')) ?? '',
      bounds: geoBounds(f),
    }))
    .filter((s: any) => s.code);

  const inBounds = ([[w, s], [e, n]]: number[][], lon: number, lat: number) =>
    lat >= s && lat <= n && (w <= e ? lon >= w && lon <= e : lon >= w || lon <= e);

  const dots: Dot[] = [];
  const found = new Set<string>();

  for (let row = 0; row < ROWS; row++) {
    const lat = GRID.north - (row + 0.5) * GRID.step;
    for (let col = 0; col < COLS; col++) {
      const lon = GRID.west + (col + 0.5) * GRID.step;
      const hit = shapes.find((s: any) => inBounds(s.bounds, lon, lat) && geoContains(s.f, [lon, lat]));
      if (hit) {
        dots.push({ x: col + 0.5, y: row + 0.5, code: hit.code });
        found.add(hit.code);
      }
    }
  }

  // Countries too small to catch a grid point still get one dot, at their centre.
  for (const s of shapes) {
    if (found.has(s.code)) continue;
    const [lon, lat] = geoCentroid(s.f);
    if (lat < GRID.south || lat > GRID.north) continue;
    dots.push({ ...toGrid(lon, lat), code: s.code });
    found.add(s.code);
  }

  return dots;
}
