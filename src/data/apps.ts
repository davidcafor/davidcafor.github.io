export type App = {
  name: string;
  tagline: string;
  description: string;
  platforms: string;
  icon: string;
  appStore: string;
};

export const apps: App[] = [
  {
    name: 'Hue9',
    tagline: 'Color Sudoku',
    description:
      'Sudoku with nine colors instead of digits. Symbol Mode, VoiceOver and calmer motion make sure color is never the only way to play.',
    platforms: 'iOS',
    icon: '/hue9-legal/assets/hue9-icon.png',
    appStore: 'https://apps.apple.com/app/hue9-sudoku-de-colores/id6758043250',
  },
];

// Apps that are out but not announced here yet. Only the count is shown.
export const secretApps = 2;
