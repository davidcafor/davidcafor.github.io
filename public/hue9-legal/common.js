const supportedLanguages = ["en", "es", "de", "fr", "ja", "zh-Hans"];

const commonTranslations = {
  en: {
    skip: "Skip to content",
    navLabel: "Legal navigation",
    languageLabel: "Language",
    brand: "Hue9 Legal",
    navHome: "Legal",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    navAccessibility: "Accessibility",
    footerTagline: "Clear rules for a game of pure logic.",
    support: "Support",
    appStore: "App Store",
    copyright: "© Hue9",
    tableOfContents: "On this page",
    contactTitle: "Questions about Hue9?",
    contactBody: "For privacy, legal or support requests, contact Hue9 through the official support channel.",
    contactButton: "Contact support"
  },
  es: {
    skip: "Saltar al contenido",
    navLabel: "Navegación legal",
    languageLabel: "Idioma",
    brand: "Legal de Hue9",
    navHome: "Legal",
    navPrivacy: "Privacidad",
    navTerms: "Términos",
    navAccessibility: "Accesibilidad",
    footerTagline: "Reglas claras para un juego de lógica pura.",
    support: "Soporte",
    appStore: "App Store",
    copyright: "© Hue9",
    tableOfContents: "En esta página",
    contactTitle: "¿Tienes alguna pregunta sobre Hue9?",
    contactBody: "Para consultas de privacidad, legales o de soporte, contacta con Hue9 mediante el canal oficial.",
    contactButton: "Contactar con soporte"
  },
  de: {
    skip: "Zum Inhalt springen",
    navLabel: "Rechtliche Navigation",
    languageLabel: "Sprache",
    brand: "Hue9 Rechtliches",
    navHome: "Rechtliches",
    navPrivacy: "Datenschutz",
    navTerms: "Bedingungen",
    navAccessibility: "Barrierefreiheit",
    footerTagline: "Klare Regeln für ein Spiel aus reiner Logik.",
    support: "Support",
    appStore: "App Store",
    copyright: "© Hue9",
    tableOfContents: "Auf dieser Seite",
    contactTitle: "Fragen zu Hue9?",
    contactBody: "Wende dich bei Datenschutz-, Rechts- oder Supportanfragen über den offiziellen Supportkanal an Hue9.",
    contactButton: "Support kontaktieren"
  },
  fr: {
    skip: "Aller au contenu",
    navLabel: "Navigation juridique",
    languageLabel: "Langue",
    brand: "Mentions légales Hue9",
    navHome: "Mentions légales",
    navPrivacy: "Confidentialité",
    navTerms: "Conditions",
    navAccessibility: "Accessibilité",
    footerTagline: "Des règles claires pour un jeu de pure logique.",
    support: "Assistance",
    appStore: "App Store",
    copyright: "© Hue9",
    tableOfContents: "Sur cette page",
    contactTitle: "Une question sur Hue9 ?",
    contactBody: "Pour toute demande relative à la confidentialité, aux aspects juridiques ou à l’assistance, contactez Hue9 via le canal officiel.",
    contactButton: "Contacter l’assistance"
  },
  ja: {
    skip: "本文へ移動",
    navLabel: "法的情報ナビゲーション",
    languageLabel: "言語",
    brand: "Hue9 法的情報",
    navHome: "法的情報",
    navPrivacy: "プライバシー",
    navTerms: "利用規約",
    navAccessibility: "アクセシビリティ",
    footerTagline: "純粋なロジックのゲームに、明確なルールを。",
    support: "サポート",
    appStore: "App Store",
    copyright: "© Hue9",
    tableOfContents: "このページの内容",
    contactTitle: "Hue9についてご質問がありますか？",
    contactBody: "プライバシー、法的事項、サポートに関するお問い合わせは、公式サポート窓口からHue9へご連絡ください。",
    contactButton: "サポートに連絡"
  },
  "zh-Hans": {
    skip: "跳到正文",
    navLabel: "法律信息导航",
    languageLabel: "语言",
    brand: "Hue9 法律信息",
    navHome: "法律信息",
    navPrivacy: "隐私",
    navTerms: "条款",
    navAccessibility: "辅助功能",
    footerTagline: "为纯粹逻辑的游戏提供清晰规则。",
    support: "支持",
    appStore: "App Store",
    copyright: "© Hue9",
    tableOfContents: "本页内容",
    contactTitle: "对 Hue9 有疑问？",
    contactBody: "如有隐私、法律或支持请求，请通过官方支持渠道联系 Hue9。",
    contactButton: "联系支持"
  }
};

function normalizeLanguage(language) {
  if (!language) return "en";
  if (language.toLowerCase().startsWith("zh")) return "zh-Hans";
  const short = language.split("-")[0];
  return supportedLanguages.includes(short) ? short : "en";
}

function selectedLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  return normalizeLanguage(queryLanguage || localStorage.getItem("hue9-language") || navigator.language);
}

function applyLanguage(language) {
  const selected = normalizeLanguage(language);
  const pageTranslations = window.HUE9_PAGE_TRANSLATIONS?.[selected] || {};
  const strings = { ...commonTranslations[selected], ...pageTranslations };

  document.documentElement.lang = selected === "es" ? "es-ES" : selected;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = strings[element.dataset.i18n];
    if (value) element.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = strings[element.dataset.i18nAria];
    if (value) element.setAttribute("aria-label", value);
  });

  if (strings.pageTitle) document.title = strings.pageTitle;
  if (strings.pageDescription) {
    document.querySelector('meta[name="description"]')?.setAttribute("content", strings.pageDescription);
  }

  document.querySelectorAll("a[data-preserve-language]").forEach((link) => {
    const url = new URL(link.href, window.location.href);
    url.searchParams.set("lang", selected);
    link.href = url.toString();
  });

  const selector = document.getElementById("language-select");
  if (selector) selector.value = selected;
  localStorage.setItem("hue9-language", selected);
}

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("language-select");
  selector?.addEventListener("change", (event) => applyLanguage(event.target.value));
  applyLanguage(selectedLanguage());
});
