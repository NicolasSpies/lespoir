// node --test tests/
// Haelt das Script-Element zu: ein CMS-Text mit "</script>" darf nicht aus dem
// JSON-LD-Block ausbrechen. Zweiter Test: keine Stelle in src/ schreibt JSON
// ohne safeJsonLd in ein <script>.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeJsonLd, escapeJsonForScript } from '../src/lib/safeJsonLd.ts';

const EVIL = '</script><img src=x onerror=alert(1)>';

test('ein "</script>" im Titel beendet das Script-Element nicht', () => {
  const text = safeJsonLd({ '@type': 'Article', name: EVIL });
  assert.ok(!/<\/script/i.test(text), 'kein schliessendes Script-Tag');
  assert.ok(!text.includes('<') && !text.includes('>'), 'keine spitzen Klammern');
  const html = `<script type="application/ld+json">${text}</script>`;
  assert.equal(html.match(/<\/script>/gi).length, 1, 'genau ein schliessendes Tag, das eigene');
});

test('der Wert bleibt fuer JSON.parse (und damit fuer Google) unveraendert', () => {
  const daten = { name: EVIL, a: 'Tom & Jerry', b: 'x\u2028y\u2029z', c: [1, null, { d: '<!-- -->' }] };
  assert.deepEqual(JSON.parse(safeJsonLd(daten)), daten);
});

test('&, U+2028 und U+2029 werden ausgeschrieben', () => {
  const text = safeJsonLd({ t: 'a&b\u2028c\u2029d' });
  assert.ok(text.includes('\\u0026') && text.includes('\\u2028') && text.includes('\\u2029'));
  assert.ok(!/[\u2028\u2029&]/.test(text));
});

test('escapeJsonForScript behandelt fertigen JSON-Text genauso', () => {
  const text = JSON.stringify({ name: EVIL, t: 'Tom & Jerry' });
  const out = escapeJsonForScript(text);
  assert.ok(!/<\/script/i.test(out) && !out.includes('<'));
  assert.deepEqual(JSON.parse(out), { name: EVIL, t: 'Tom & Jerry' });
});

test('undefined ergibt einen leeren Text statt eines Fehlers', () => {
  assert.equal(safeJsonLd(undefined), '');
});

function dateien(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? dateien(p) : /\.(astro|ts|tsx)$/.test(n) ? [p] : [];
  });
}

test('jedes <script> mit JSON-Inhalt und set:html nutzt safeJsonLd', () => {
  const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
  const verstoesse = [];
  for (const datei of dateien(src)) {
    if (datei.endsWith('safeJsonLd.ts')) continue;
    const inhalt = readFileSync(datei, 'utf8');
    for (const m of inhalt.matchAll(/<script\b[^>]*?application\/(?:ld\+)?json[^>]*?set:html=\{[\s\S]*?\}\s*(?:\/>|>)/g)) {
      if (!/safeJsonLd\(|escapeJsonForScript\(/.test(m[0])) verstoesse.push(`${datei}: ${m[0].slice(0, 90)}`);
    }
    if (/set:html=\{\s*JSON\.stringify/.test(inhalt)) verstoesse.push(`${datei}: set:html={JSON.stringify(...)}`);
  }
  assert.deepEqual(verstoesse, []);
});
