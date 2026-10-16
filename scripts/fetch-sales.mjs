// Reads which countries have generated revenue from the RevenueCat API (v2) and writes
// src/data/sales.json for the /map page. Runs in CI before the build; without credentials,
// or if anything goes wrong, it leaves the existing file untouched so the deploy still works.
//
// Env: REVENUECAT_API_KEY (v2 secret key with Charts & Metrics read access)
//      REVENUECAT_PROJECT_ID (optional: found automatically when the key sees one project)
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/sales.json', import.meta.url);
const API = 'https://api.revenuecat.com/v2';
const START = '2023-01-01';

const key = process.env.REVENUECAT_API_KEY;
// Accepts the id from the dashboard URL (app.revenuecat.com/projects/<id>/...) with or without "proj".
let project = process.env.REVENUECAT_PROJECT_ID?.trim().replace(/^(?!proj)/, 'proj') || undefined;

// Keeps the existing data but flags it, so the page says the live data failed to load.
const markError = async () => {
  const data = JSON.parse(await readFile(OUT, 'utf8'));
  await writeFile(OUT, JSON.stringify({ ...data, error: true }, null, 2) + '\n');
};

if (!key) {
  console.log('::warning::No RevenueCat API key; keeping the existing sales data.');
  await markError();
  process.exit(0);
}

const request = async (path, params = {}) => {
  const url = new URL(`${API}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} on ${url.pathname}: ${body.slice(0, 500)}`);
  return JSON.parse(body);
};
const get = (path, params) => request(`/projects/${project}${path}`, params);

// Country names -> ISO alpha-2, in case segments are labelled by name rather than code.
const names = new Intl.DisplayNames(['en'], { type: 'region' });
const byName = new Map();
for (let a = 65; a <= 90; a++)
  for (let b = 65; b <= 90; b++) {
    const code = String.fromCharCode(a, b);
    const name = names.of(code);
    if (name && name !== code) byName.set(name.toLowerCase(), code);
  }

const toCode = (seg) => {
  for (const v of [seg?.id, seg?.code, seg?.display_name, seg?.name]) {
    if (typeof v !== 'string') continue;
    const code = /^[A-Z]{2}$/.test(v) ? v : byName.get(v.toLowerCase());
    // "United Kingdom" also resolves to the reserved code UK; ISO 3166 and the map use GB.
    if (code) return code === 'UK' ? 'GB' : code;
  }
  return null;
};

const toDate = (t) => {
  const d = typeof t === 'number' ? new Date(t < 1e12 ? t * 1000 : t) : new Date(t);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

try {
  if (!project) {
    const list = await request('/projects');
    const ids = (list.items ?? []).map((p) => p.id);
    if (ids.length !== 1) throw new Error(`set REVENUECAT_PROJECT_ID; the key sees ${ids.length} projects: ${ids.join(', ')}`);
    project = ids[0];
    console.log(`Using RevenueCat project ${project}.`);
  }

  const options = await get('/charts/revenue/options');
  const day = options.resolutions?.find((r) => /day/i.test(r.display_name ?? r.id))?.id ?? '0';
  if (!options.segments?.some((s) => s.id === 'country'))
    throw new Error(`revenue chart has no country segment: ${JSON.stringify(options.segments)}`);

  const chart = await get('/charts/revenue', {
    segment: 'country',
    resolution: day,
    start_date: START,
    end_date: new Date().toISOString().slice(0, 10),
    limit_num_segments: '250',
  });

  const segments = chart.segments ?? [];
  // Shape of the response, to check the parser against (country names and totals only).
  console.log(`Chart: ${segments.length} segments (${segments.slice(0, 5).map((s) => s.display_name ?? s.id).join(', ')}…), ${chart.values?.length ?? 0} values; first: ${JSON.stringify((chart.values ?? []).slice(0, 2))}`);
  const first = new Map(); // code -> earliest date with revenue

  const record = (segIndex, when, value) => {
    const seg = segments[segIndex];
    if (!seg || seg.is_total || seg.is_other || !(Number(value) > 0)) return;
    const code = toCode(seg);
    const date = toDate(when);
    if (!code || !date) return;
    if (!first.has(code) || date < first.get(code)) first.set(code, date);
  };

  for (const row of chart.values ?? []) {
    if (Array.isArray(row)) {
      // [timestamp, value for segment 0, value for segment 1, ...]
      row.slice(1).forEach((v, i) => record(i, row[0], v));
    } else if (row && typeof row === 'object') {
      // { cohort: timestamp, segment: index, measure: which metric, value }
      record(row.segment ?? row.segment_index ?? row.measure, row.cohort ?? row.date ?? row.timestamp, row.value);
    }
  }

  if (!first.size) {
    throw new Error(
      `could not read any country from the response. segments: ${JSON.stringify(segments.slice(0, 3))} values: ${JSON.stringify((chart.values ?? []).slice(0, 3))}`,
    );
  }

  const countries = [...first]
    .map(([code, since]) => ({ code, since }))
    .sort((a, b) => a.since.localeCompare(b.since));

  const data = { sample: false, updated: new Date().toISOString().slice(0, 10), countries };
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`::notice::Wrote ${countries.length} countries (${countries.map((c) => c.code).join(' ')}); latest ${countries.at(-1).code} on ${countries.at(-1).since}.`);
} catch (err) {
  console.log(`::warning::RevenueCat sales map not updated: ${err.message}`);
  await markError();
}
