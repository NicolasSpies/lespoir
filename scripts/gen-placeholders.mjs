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

// Neutral placeholder: warm-grey bg + centred logo mark (from logo-mark.svg), low opacity.
function neutralSvg() {
  const raw = readFileSync(join(pub, 'logo-mark.svg'), 'utf8');
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '')
    .replace(/currentColor/g, '#002626');
  const S = 1000;
  // logo-mark viewBox: 261.46 × 293.98 → scale to ~300px tall, centre it.
  const scale = 300 / 293.98;
  const w = 261.46 * scale, h = 293.98 * scale;
  const tx = (S - w) / 2, ty = (S - h) / 2;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="#EAE9E5"/>
  <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(4)})" opacity="0.16">${inner}</g>
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
