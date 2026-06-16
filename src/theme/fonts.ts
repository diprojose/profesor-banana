/**
 * Fuentes de títulos disponibles. Se cargan desde Google Fonts en
 * index.html y se exponen como la variable CSS --head.
 */

export const headingFonts = {
  'Baloo 2': "'Baloo 2', system-ui, sans-serif",
  Quicksand: "'Quicksand', system-ui, sans-serif",
  'Comic Neue': "'Comic Neue', system-ui, sans-serif",
} as const;

export type HeadingFontName = keyof typeof headingFonts;

export const headingFontNames = Object.keys(headingFonts) as HeadingFontName[];

export const defaultHeadingFont: HeadingFontName = 'Baloo 2';
