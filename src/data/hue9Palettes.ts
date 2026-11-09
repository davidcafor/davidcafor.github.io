// Hue9's four game palettes, copied from the app's asset catalog
// (Hue9/Resources/Assets.xcassets/<Theme>/game_1…9, bg_main, grid_thin, grid_thick).
type Palette = { bg: string; thin: string; thick: string; empty: string; game: string[] };

export const PALETTES: Record<'rams' | 'vanguard' | 'obsidian' | 'spectrum', { light: Palette; dark: Palette }> = {
  rams: {
    light: { bg: '#d9d4c7', thin: '#b5b0a3', thick: '#4a4a48', empty: '#e5e0d5', game: ['#ffffff', '#f2bd1b', '#b86a8a', '#e36b2c', '#9494b8', '#2f7f6a', '#3d5a80', '#4a4a48', '#d00000'] },
    dark: { bg: '#1a1a1b', thin: '#333333', thick: '#d1d1d1', empty: '#2a2a2a', game: ['#ebe8e0', '#e0b840', '#c47a98', '#d96638', '#8c8cc7', '#389e85', '#4c7abf', '#7c8087', '#c73333'] },
  },
  vanguard: {
    light: { bg: '#f9f8e6', thin: '#dedede', thick: '#c2c2c2', empty: '#efefef', game: ['#ff006e', '#00e0b2', '#8338ec', '#ffb60b', '#fb5607', '#14adff', '#1f57f2', '#cc00ff', '#8ce61f'] },
    dark: { bg: '#0d0d15', thin: '#2c2c3e', thick: '#d1d1d1', empty: '#1a1a2e', game: ['#ff177b', '#1aebbd', '#944cff', '#ffc333', '#ff6b1c', '#2ebaff', '#336bfa', '#d921ff', '#9ef038'] },
  },
  obsidian: {
    light: { bg: '#f2f2f2', thin: '#ededed', thick: '#000000', empty: '#ebebeb', game: ['#dbdbdb', '#c4c4c4', '#adadad', '#969696', '#808080', '#696969', '#525252', '#3b3b3b', '#242424'] },
    dark: { bg: '#000000', thin: '#171719', thick: '#d1d1d1', empty: '#111111', game: ['#ebebeb', '#d6d6d6', '#c2c2c2', '#adadad', '#999999', '#858585', '#707070', '#5c5c5c', '#474747'] },
  },
  spectrum: {
    light: { bg: '#f5f5f7', thin: '#e9e9e9', thick: '#1c1c1e', empty: '#e8e8ea', game: ['#0072b2', '#2ed1e6', '#009e73', '#e69f00', '#f0e442', '#fa6924', '#ad78f5', '#3359d9', '#fa479e'] },
    dark: { bg: '#1c1c1e', thin: '#4c4c4f', thick: '#d1d1d1', empty: '#2c2c2e', game: ['#338cf2', '#29e6db', '#33c759', '#fae040', '#fa9e26', '#ff731f', '#a380ff', '#3359d9', '#ff3894'] },
  },
};

export type PaletteName = keyof typeof PALETTES;
