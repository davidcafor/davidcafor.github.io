const hubKeys = [
  "pageTitle", "pageDescription", "heroEyebrow", "heroTitle", "heroIntro",
  "plainLanguage", "sixLanguages", "currentVersion",
  "privacyTitle", "privacyBody", "privacyLink",
  "termsTitle", "termsBody", "termsLink",
  "accessTitle", "accessBody", "accessLink"
];

const hubTranslations = {
  en: [
    "Hue9 Legal", "Privacy, terms and accessibility information for Hue9.", "Hue9 · Legal",
    "Clear rules.<br>Nothing hidden.", "Privacy and terms should be as understandable as the game itself. Here is everything in one place.",
    "Written in plain language", "Available in six languages", "Reflects the current version of Hue9",
    "Privacy, made visible.", "What Hue9 processes, which services are involved and the choices available to you.", "Read the privacy policy →",
    "Terms, clearly stated.", "The rules for using Hue9, buying premium and taking part in online challenges.", "Read the terms →",
    "Designed beyond color.", "See how symbols, VoiceOver, adaptable text and calmer motion make Hue9 more accessible.", "Explore accessibility →"
  ],
  es: [
    "Información legal de Hue9", "Privacidad, términos y accesibilidad de Hue9.", "Hue9 · Legal",
    "Reglas claras.<br>Nada oculto.", "La privacidad y los términos deberían entenderse tan bien como el propio juego. Aquí está todo, en un mismo sitio.",
    "Escrito en lenguaje claro", "Disponible en seis idiomas", "Refleja la versión actual de Hue9",
    "Privacidad, a la vista.", "Qué trata Hue9, qué servicios intervienen y qué opciones tienes.", "Leer la política de privacidad →",
    "Términos, sin letra pequeña.", "Las reglas para usar Hue9, comprar prémium y participar en retos en línea.", "Leer los términos →",
    "Diseñado más allá del color.", "Descubre cómo los símbolos, VoiceOver, el texto adaptable y un movimiento más calmado hacen Hue9 más accesible.", "Explorar la accesibilidad →"
  ],
  de: [
    "Hue9 Rechtliches", "Datenschutz, Bedingungen und Barrierefreiheit von Hue9.", "Hue9 · Rechtliches",
    "Klare Regeln.<br>Nichts verborgen.", "Datenschutz und Bedingungen sollten so verständlich sein wie das Spiel selbst. Hier findest du alles an einem Ort.",
    "Klar und verständlich", "In sechs Sprachen", "Entspricht der aktuellen Hue9-Version",
    "Datenschutz, sichtbar gemacht.", "Was Hue9 verarbeitet, welche Dienste beteiligt sind und welche Wahlmöglichkeiten du hast.", "Datenschutzerklärung lesen →",
    "Bedingungen, klar formuliert.", "Die Regeln für Hue9, Premium und die Teilnahme an Online-Herausforderungen.", "Bedingungen lesen →",
    "Über Farbe hinaus gedacht.", "Erfahre, wie Symbole, VoiceOver, anpassbarer Text und ruhigere Bewegung Hue9 barrierefreier machen.", "Barrierefreiheit entdecken →"
  ],
  fr: [
    "Mentions légales Hue9", "Confidentialité, conditions et accessibilité de Hue9.", "Hue9 · Mentions légales",
    "Des règles claires.<br>Rien de caché.", "La confidentialité et les conditions doivent être aussi simples à comprendre que le jeu. Tout est réuni ici.",
    "Rédigé clairement", "Disponible en six langues", "Reflète la version actuelle de Hue9",
    "La confidentialité, en toute transparence.", "Ce que Hue9 traite, les services concernés et les choix à votre disposition.", "Lire la politique de confidentialité →",
    "Des conditions, clairement énoncées.", "Les règles d’utilisation de Hue9, de l’achat premium et des défis en ligne.", "Lire les conditions →",
    "Conçu au-delà de la couleur.", "Découvrez comment les symboles, VoiceOver, le texte adaptable et les mouvements apaisés rendent Hue9 plus accessible.", "Explorer l’accessibilité →"
  ],
  ja: [
    "Hue9 法的情報", "Hue9のプライバシー、利用規約、アクセシビリティ情報。", "Hue9 · 法的情報",
    "明確なルール。<br>隠しごとはなし。", "プライバシーと利用規約も、ゲームと同じようにわかりやすく。必要な情報を一か所にまとめました。",
    "わかりやすい表現", "6言語に対応", "現在のHue9バージョンに対応",
    "プライバシーを、見える形に。", "Hue9が扱う情報、利用するサービス、選択できる設定をご案内します。", "プライバシーポリシーを読む →",
    "利用規約を、わかりやすく。", "Hue9の利用、プレミアム購入、オンラインチャレンジのルールです。", "利用規約を読む →",
    "色だけに頼らない設計。", "シンボル、VoiceOver、可変テキスト、穏やかな動きによるアクセシビリティをご覧ください。", "アクセシビリティを見る →"
  ],
  "zh-Hans": [
    "Hue9 法律信息", "Hue9 的隐私、条款和辅助功能信息。", "Hue9 · 法律信息",
    "规则清晰。<br>毫不隐藏。", "隐私和条款也应像游戏本身一样易于理解。所有信息都汇集于此。",
    "以清晰语言编写", "提供六种语言", "反映 Hue9 当前版本",
    "隐私，清楚呈现。", "Hue9 处理哪些信息、涉及哪些服务以及您有哪些选择。", "阅读隐私政策 →",
    "条款，清楚说明。", "使用 Hue9、购买高级版和参与在线挑战的规则。", "阅读条款 →",
    "超越色彩的设计。", "了解符号、旁白、可调文字和更舒缓的动效如何让 Hue9 更易使用。", "探索辅助功能 →"
  ]
};

window.HUE9_PAGE_TRANSLATIONS = Object.fromEntries(
  Object.entries(hubTranslations).map(([language, values]) => [
    language,
    Object.fromEntries(hubKeys.map((key, index) => [key, values[index]]))
  ])
);
