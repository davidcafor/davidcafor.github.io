import { geoBounds, geoCentroid, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import atlas from 'world-atlas/countries-50m.json';

countries.registerLocale(en);

// A monospace character cell is twice as tall as it is wide, so rows cover
// twice as many degrees as columns to keep the map's proportions.
export const GRID = {
  lonStep: 1.5,
  latStep: 3,
  west: -180,
  east: 180,
  north: 84,
  south: -57, // Antarctica is left out
};

export const COLS = Math.round((GRID.east - GRID.west) / GRID.lonStep);
export const ROWS = Math.round((GRID.north - GRID.south) / GRID.latStep);

/** Grid cell (column, row) holding a longitude/latitude. */
export const toCell = (lon: number, lat: number) => ({
  col: Math.min(COLS - 1, Math.max(0, Math.floor((lon - GRID.west) / GRID.lonStep))),
  row: Math.min(ROWS - 1, Math.max(0, Math.floor((GRID.north - lat) / GRID.latStep))),
});

export const countryName = (code: string) => countries.getName(code, 'en') ?? code;

/**
 * ROWS x COLS matrix of ISO 3166-1 alpha-2 codes ('' for sea). A cell belongs to the
 * country under its centre; countries too small to cover a centre get the cell at
 * their centroid (or a neighbouring one), see below.
 */
export function buildGrid(): string[][] {
  const topo = atlas as any;
  const shapes = (feature(topo, topo.objects.countries) as any).features
    .map((f: any) => ({
      f,
      // Kosovo has no ISO numeric id in the atlas; XK is its user-assigned alpha-2 code.
      code: f.properties?.name === 'Kosovo' ? 'XK' : (countries.numericToAlpha2(String(f.id ?? '')) ?? ''),
      bounds: geoBounds(f),
    }))
    .filter((s: any) => s.code);

  const inBounds = ([[w, s], [e, n]]: number[][], lon: number, lat: number) =>
    lat >= s && lat <= n && (w <= e ? lon >= w && lon <= e : lon >= w || lon <= e);

  const grid = Array.from({ length: ROWS }, () => Array<string>(COLS).fill(''));
  const found = new Set<string>();

  for (let row = 0; row < ROWS; row++) {
    const lat = GRID.north - (row + 0.5) * GRID.latStep;
    for (let col = 0; col < COLS; col++) {
      const lon = GRID.west + (col + 0.5) * GRID.lonStep;
      const hit = shapes.find((s: any) => inBounds(s.bounds, lon, lat) && geoContains(s.f, [lon, lat]));
      if (hit) {
        grid[row][col] = hit.code;
        found.add(hit.code);
      }
    }
  }

  // Small countries take their centroid's cell, or the nearest cell around it, even from a
  // larger neighbour (one that keeps other cells), so every country is on the map.
  const cells = new Map<string, number>();
  for (const code of grid.flat()) if (code) cells.set(code, (cells.get(code) ?? 0) + 1);
  const placed = new Set<string>();
  const ring = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (const s of shapes) {
    if (found.has(s.code)) continue;
    const [lon, lat] = geoCentroid(s.f);
    if (lat < GRID.south || lat > GRID.north) continue;
    const { col, row } = toCell(lon, lat);
    for (const [dr, dc] of ring) {
      const r = row + dr;
      const c = (col + dc + COLS) % COLS;
      if (r < 0 || r >= ROWS) continue;
      const owner = grid[r][c];
      if (owner && (placed.has(owner) || (cells.get(owner) ?? 0) < 2)) continue;
      if (owner) cells.set(owner, cells.get(owner)! - 1);
      grid[r][c] = s.code;
      found.add(s.code);
      placed.add(s.code);
      break;
    }
  }

  return grid;
}
