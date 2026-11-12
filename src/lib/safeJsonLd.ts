/**
 * JSON fuer ein <script>-Element: JSON-LD und Datenbloecke.
 *
 * set:html schreibt den Text unveraendert in die Seite, und JSON.stringify
 * laesst spitze Klammern stehen. Enthaelt ein CMS-Feld "</script>", endet das
 * Element dort, der Rest ist wieder HTML: darueber laesst sich fremdes Markup
 * einschleusen (XSS auf der oeffentlichen Seite).
 *
 * < > & sowie U+2028/U+2029 werden als \u-Escapes geschrieben. Innerhalb einer
 * JSON-Zeichenkette ist das dasselbe Zeichen: JSON.parse, Google und jeder
 * Browser lesen den Wert unveraendert. Immer diese Funktion benutzen, nie
 * JSON.stringify direkt in ein <script> schreiben.
 */
export function safeJsonLd(data: unknown): string {
  return escapeJsonForScript(JSON.stringify(data) ?? '');
}

/**
 * Wie safeJsonLd, fuer JSON, das schon als Text vorliegt (BaseLayout bekommt
 * die JSON-LD-Bloecke der Seiten als fertige Zeichenketten). Die Zeichen
 * kommen in gueltigem JSON nur innerhalb von Zeichenketten vor.
 */
export function escapeJsonForScript(json: string): string {
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
