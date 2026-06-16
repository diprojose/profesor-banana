/**
 * Paletas de color de la app, portadas del prototipo original.
 * Cada paleta es un conjunto de tokens que luego se exponen como
 * variables CSS (--bg, --accent, ...) sobre el contenedor raíz.
 */

export interface Palette {
  bg: string;
  bg2: string;
  mint: string;
  yellow: string;
  coral: string;
  lilac: string;
  ink: string;
  accent: string;
  coralInk: string;
}

export const palettes = {
  Tropical: {
    bg: '#CFEAF7',
    bg2: '#8FCFE9',
    mint: '#BCE8CB',
    yellow: '#FBE4A0',
    coral: '#F7B3A8',
    lilac: '#DBC9F2',
    ink: '#38505E',
    accent: '#4FAEDB',
    coralInk: '#E08672',
  },
  Sorbete: {
    bg: '#FCE7DA',
    bg2: '#F2B6A6',
    mint: '#CFE9BD',
    yellow: '#FBE2A0',
    coral: '#F6B7CC',
    lilac: '#D9C7EF',
    ink: '#5C4750',
    accent: '#E79B8C',
    coralInk: '#D77FA0',
  },
  Laguna: {
    bg: '#D6EFEA',
    bg2: '#84CFC2',
    mint: '#BFE8D2',
    yellow: '#EAEFB0',
    coral: '#BFC9F2',
    lilac: '#CDBFF0',
    ink: '#33514F',
    accent: '#4FB6A6',
    coralInk: '#7E89D6',
  },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

export const paletteNames = Object.keys(palettes) as PaletteName[];

export const defaultPalette: PaletteName = 'Tropical';

/** Convierte una paleta en el mapa de variables CSS que usa la UI. */
export function paletteToCssVars(p: Palette): Record<string, string> {
  return {
    '--bg': p.bg,
    '--bg2': p.bg2,
    '--mint': p.mint,
    '--yellow': p.yellow,
    '--coral': p.coral,
    '--lilac': p.lilac,
    '--ink': p.ink,
    '--accent': p.accent,
    '--coralInk': p.coralInk,
  };
}
