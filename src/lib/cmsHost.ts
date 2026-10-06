// Where ContentCore lives — the ONE place, for both server and browser.
//
// The address is resolved at RUNTIME from `process.env.CMS_HOST`, not at build
// time. Previously it was baked into the build (`import.meta.env.CMS_ORIGIN`,
// which Vite inlines as a fixed string, plus a hardcoded CMS_API in BaseLayout).
// A host change then needed a rebuild — and rebuilding without the env var set
// silently fell back to the default host. Now a host change is just `.env` + a
// restart. (The value stays https://lespoir.contentcore.app for now; only the
// resolution moved to runtime.)
//
// Deliberately `process.env`, NOT `import.meta.env`: Vite replaces
// `import.meta.env` at build time with a literal — which is exactly what we are
// moving away from.
//
// Its own module, separate from cms.ts: cms.ts is the server client and must
// never reach the browser. The view/click beacons only need the address, which
// is handed to them server-side via `define:vars`. This module is safe on both
// sides (the browser has no `process`, hence the `typeof` guard).
//
// Three sources, in order:
//   1. Server: `process.env.CMS_HOST` (from /var/www/lespoir/.env, loaded via
//      `node --env-file-if-exists`, see deploy/ecosystem.config.cjs)
//   2. Browser: `<meta name="cc-api-host">`, written by the server on every
//      request (BaseLayout). The browser has no `process.env`.
//   3. Fallback: today's value. A missing or broken setting must never take the
//      site down.
//
// `CMS_HOST_SOURCE` is exposed as `data-source` on the meta tag — externally
// checkable, so we can see whether the setting arrives or it silently falls back.

const FALLBACK_HOST = 'https://lespoir.contentcore.app';

export type CmsHostSource = 'env' | 'meta' | 'fallback';

/** https origin only — a path or typo falls back. */
function normalize(value: unknown): string | null {
  try {
    const url = new URL(String(value).trim());
    return url.protocol === 'https:' ? url.origin : null;
  } catch {
    return null;
  }
}

function resolveHost(): { host: string; source: CmsHostSource } {
  // `typeof` guard: the browser has no `process` — a bare access would kill the
  // beacons with a ReferenceError.
  if (typeof process !== 'undefined' && process.env && process.env.CMS_HOST) {
    const host = normalize(process.env.CMS_HOST);
    if (host) return { host, source: 'env' };
    console.warn('[cmsHost] CMS_HOST is invalid, using the fallback:', process.env.CMS_HOST);
  }
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="cc-api-host"]');
    const host = meta ? normalize(meta.getAttribute('content')) : null;
    if (host) return { host, source: 'meta' };
  }
  return { host: FALLBACK_HOST, source: 'fallback' };
}

const resolved = resolveHost();

export const CMS_HOST: string = resolved.host;
export const CMS_HOST_SOURCE: CmsHostSource = resolved.source;
export const CMS_API_BASE: string = `${CMS_HOST}/api/v1`;
