// Languages and pages of each app's own site (/hue9, /oraia). The first language has no URL prefix.
export const APP_PAGES = ['', 'privacy/', 'terms/'];

export const HUE9_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'zh-Hans', label: '简体中文' },
];

export const ORAIA_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

/** Static paths for every language × page of an app site. */
export const appPaths = (langs: { code: string }[]) =>
  langs.flatMap(({ code }, i) =>
    APP_PAGES.map((page) => ({
      params: { path: `${i ? `${code.toLowerCase()}/` : ''}${page}`.replace(/\/$/, '') || undefined },
      props: { lang: code, page },
    })),
  );
