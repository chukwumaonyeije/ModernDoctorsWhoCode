import { fontProviders } from 'astro/config';
import dmSansRanges from '@fontsource/dm-sans/unicode.json' with { type: 'json' };
import syneRanges from '@fontsource/syne/unicode.json' with { type: 'json' };

/** Preserve the installed Fontsource faces and Unicode coverage without network resolution. */
function variants(packageName, ranges, faces) {
  return faces.flatMap(([weight, style]) => Object.entries(ranges).map(([subset, range]) => ({
    weight,
    style,
    unicodeRange: range.split(','),
    src: [`@fontsource/${packageName}/files/${packageName}-${subset}-${weight}-${style}.woff2`],
  })));
}

export const fonts = [
  {
    name: 'DM Sans', cssVariable: '--font-body', provider: fontProviders.local(),
    fallbacks: ['sans-serif'], display: 'swap',
    options: { variants: variants('dm-sans', dmSansRanges, [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal']]) },
  },
  {
    name: 'Syne', cssVariable: '--font-display', provider: fontProviders.local(),
    fallbacks: ['sans-serif'], display: 'swap',
    options: { variants: variants('syne', syneRanges, [[700, 'normal'], [800, 'normal']]) },
  },
];
