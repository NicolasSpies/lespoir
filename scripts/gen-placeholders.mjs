// One-off: generate the two kinds of image placeholders as WebP (public/).
//  1) placeholder-equipe-<service>.webp — 1:1, service-coloured bg + white person icon.
//  2) placeholder.webp — neutral warm-grey, centred L'Espoir logo mark, works at any
//     aspect ratio via object-fit:cover. Replaces the SVG-mask placeholder that broke
//     on non-1:1 formats.
// Run: node scripts/gen-placeholders.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Service taxonomy → brand colour (matches serviceColor() in src/lib/cms.ts).
const SERVICES = {
  direction: '#002626',
  srg: '#E58346',
  sase: '#C04B72',
  sapa: '#119DA4',
};

// Simple centred person silhouette (head + shoulders) on a 600×600 canvas.
const personSvg = (bg) => `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${bg}"/>
  <g fill="#ffffff" fill-opacity="0.9">
    <circle cx="300" cy="238" r="92"/>
    <path d="M300 356c-94 0-170 63-185 152a13 13 0 0 0 13 15h344a13 13 0 0 0 13-15c-15-89-91-152-185-152z"/>
  </g>
</svg>`;

// Neutral placeholder: a clean "image coming" tile — warm mid-grey + a simple
// centred picture icon (no wordmark/text), reads clearly at any crop.
function neutralSvg() {
  const S = 1000, bg = '#D7D5CE', ink = '#ADA99E';
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${bg}"/>
  <g fill="none" stroke="${ink}" stroke-width="24" stroke-linejoin="round" stroke-linecap="round">
    <rect x="330" y="360" width="340" height="280" rx="28"/>
  </g>
  <circle cx="425" cy="452" r="34" fill="${ink}"/>
  <path d="M356 636 L470 512 L548 588 L628 500 L644 516 L644 616 a20 20 0 0 1 -20 20 H356 Z" fill="${ink}"/>
</svg>`;
}

async function toWebp(svg, out) {
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(join(pub, out));
  console.log('  wrote', out);
}

for (const [name, color] of Object.entries(SERVICES)) {
  await toWebp(personSvg(color), `placeholder-equipe-${name}.webp`);
}
await toWebp(neutralSvg(), 'placeholder.webp');
console.log('done.');
