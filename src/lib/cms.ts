// Server-side ContentCore API client for L'Espoir asbl — never imported by client code.
// Base: https://lespoir.contentcore.app/api/v1  |  single language: fr
// Every fetch uses cache:'no-store' (CFC mandatory). Visitor headers (XFF[0], UA,
// Referer) are forwarded so CC analytics attributes the real visitor, not the VPS.

const ORIGIN = (import.meta.env.CMS_ORIGIN as string | undefined) ?? 'https://lespoir.contentcore.app';
const BASE = `${ORIGIN}/api/v1`;
export const LANG = 'fr';

/** Public delivery API base — safe to expose client-side (view/click beacons). */
export const CMS_API_BASE = BASE;

export interface ImageVariant { name: string; width: number | null; height: number | null; url: string }
export interface ExpandedImage {
  id: number | string; slug: string | null; filename?: string; mimetype?: string;
  width: number | null; height: number | null; alt: string | null;
  focus_x: number | null; focus_y: number | null; variants: ImageVariant[];
}
export interface CmsSection { id: string; field_group_key: string; order?: number; data?: Record<string, unknown> }
export interface CmsEntry {
  id: number | string; entry_id?: number | string; title?: string; slug?: string;
  published_at?: string | null; excerpt?: string | null; language_code?: string;
  featured_image_id?: number | string | null; featured_image?: ExpandedImage | null;
  canonical_path?: string | null;
  content?: { body?: string; sections?: CmsSection[] };
  content_type?: { id: number; slug: string; is_simple_list: boolean; is_grid_view: boolean; has_detail_pages: boolean } | null;
  faqs?: Array<{ id: number; question: string; answer: string }>;
}

const VARIANT_WIDTHS: Record<string, number> = { xs: 480, sm: 768, md: 1024, lg: 1280, xl: 1600 };
const SRCSET_NAMES = new Set(['xs', 'sm', 'md', 'lg', 'xl']);

// ── Visitor header passthrough ────────────────────────────────────────────────
export function extractVisitorHeaders(request: Request): Record<string, string> {
  const out: Record<string, string> = {};
  const xff = request.headers.get('x-forwarded-for');
  if (xff) { const ip = xff.split(',')[0].trim(); if (ip) out['X-Forwarded-For'] = ip; }
  const ua = request.headers.get('user-agent'); if (ua) out['User-Agent'] = ua;
  const ref = request.headers.get('referer') ?? request.headers.get('referrer'); if (ref) out['Referer'] = ref;
  return out;
}

function authHeaders(): Record<string, string> {
  const token = import.meta.env.CMS_TOKEN as string | undefined;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson(
  path: string, params: Record<string, string> = {}, vis: Record<string, string> = {}, retries = 2,
): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json', ...authHeaders(), ...vis }, cache: 'no-store' });
  if (res.status === 429 && retries > 0) {
    const wait = (parseInt(res.headers.get('Retry-After') ?? '2', 10) + 1) * 1000;
    await new Promise(r => setTimeout(r, wait));
    return fetchJson(path, params, vis, retries - 1);
  }
  if (!res.ok) throw Object.assign(new Error(`CMS ${res.status} — ${path}`), { status: res.status });
  return res.json();
}

// ── Site status / data ─────────────────────────────────────────────────────────
export async function getSiteStatus(vis: Record<string, string> = {}): Promise<'live' | 'coming_soon' | 'offline'> {
  try {
    const res = await fetch(`${BASE}/site-status`, { headers: { Accept: 'application/json', ...vis }, cache: 'no-store', signal: AbortSignal.timeout(3000) });
    if (!res.ok) return import.meta.env.DEV ? 'live' : 'coming_soon';
    return ((await res.json()) as { status?: 'live' | 'coming_soon' | 'offline' }).status ?? 'coming_soon';
  } catch { return import.meta.env.DEV ? 'live' : 'coming_soon'; }
}

// ── Pages ────────────────────────────────────────────────────────────────────
export async function getPage(slug: string, vis: Record<string, string> = {}, previewToken?: string | null): Promise<CmsEntry | null> {
  const p = previewToken ? { preview_token: previewToken } : {};
  try { return (await fetchJson(`/content/page/${encodeURIComponent(slug)}`, { lang: LANG, ...p }, vis)) as CmsEntry; }
  catch { return null; }
}

export async function getHome(vis: Record<string, string> = {}, previewToken?: string | null): Promise<CmsEntry | null> {
  const p = previewToken ? { preview_token: previewToken } : {};
  try { return (await fetchJson('/home', { lang: LANG, ...p }, vis)) as CmsEntry; }
  catch { return null; }
}

// ── Custom content types (equipe, offres-demploi) ──────────────────────────────
export async function getList(type: string, vis: Record<string, string> = {}, params: Record<string, string> = {}): Promise<CmsEntry[]> {
  try {
    const data = await fetchJson(`/content/${encodeURIComponent(type)}`, { lang: LANG, ...params }, vis) as Record<string, unknown>;
    return (data?.['data'] ?? (Array.isArray(data) ? data : [])) as CmsEntry[];
  } catch { return []; }
}

export async function getEntry(type: string, slug: string, vis: Record<string, string> = {}, previewToken?: string | null): Promise<CmsEntry | null> {
  const p = previewToken ? { preview_token: previewToken } : {};
  try { return (await fetchJson(`/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`, { lang: LANG, ...p }, vis)) as CmsEntry; }
  catch { return null; }
}

// ── Site data (global settings) ────────────────────────────────────────────────
export interface SiteData {
  company_name?: string | null; address?: string | null;
  contact_email?: string | null; contact_phone?: string | null;
  footer_text?: string | null; legal_text?: string | null;
  default_og_image?: string | null; social_links?: Record<string, string>;
  // Master-defined custom Contact-tab fields (IBAN, secondary email, …) — keyed by custom slug.
  contact_custom_field_values?: Record<string, string>;
}
export async function getSiteData(vis: Record<string, string> = {}): Promise<SiteData | null> {
  try { return (await fetchJson('/site-data', {}, vis)) as SiteData; }
  catch { return null; }
}

/** Normalised org contact block from site-data (phone/address/mails/IBAN/legal). Null when unset. */
export interface OrgContact {
  phone: string | null; telHref: string | null; addressLine: string | null; addressLines: string[];
  directionMail: string | null; asmaaMail: string | null; iban: string | null; legal: string | null;
}
export async function getOrgContact(vis: Record<string, string> = {}): Promise<OrgContact> {
  const s = await getSiteData(vis);
  const phone = str(s?.contact_phone);
  const addr = str(s?.address);
  return {
    phone,
    telHref: phone ? `tel:+32${phone.replace(/\D/g, '').replace(/^0/, '')}` : null,
    addressLine: addr ? addr.replace(/\n/g, ', ') : null,
    addressLines: addr ? addr.split('\n').map(l => l.trim()).filter(Boolean) : [],
    directionMail: str(s?.contact_email),
    asmaaMail: str(s?.contact_custom_field_values?.asmaa_mail),
    iban: str(s?.contact_custom_field_values?.iban),
    legal: str(s?.legal_text),
  };
}

// ── Taxonomy terms ──────────────────────────────────────────────────────────────
export interface TaxonomyTerm { id: number; label: string; slug: string; filter_slug?: string }
export async function getTaxonomyTerms(taxonomy: string, vis: Record<string, string> = {}): Promise<TaxonomyTerm[]> {
  try {
    const data = await fetchJson(`/taxonomies/${encodeURIComponent(taxonomy)}/terms`, { lang: LANG }, vis) as unknown;
    const raw = Array.isArray(data) ? data : ((data as Record<string, unknown>)?.['terms'] ?? (data as Record<string, unknown>)?.['data'] ?? []);
    return raw as TaxonomyTerm[];
  } catch { return []; }
}

/** service slugs → brand color (team grouping, service accents). */
export function serviceColor(slug: string | null | undefined): string {
  return slug === 'srg' ? '#E58346' : slug === 'sapa' ? '#119DA4' : slug === 'sase' ? '#C04B72' : '#002626';
}

// ── Forms ────────────────────────────────────────────────────────────────────
export interface FormFieldDef {
  id: string; name: string; type: string; label: string; required: boolean;
  placeholder?: string | null;
  options?: Array<{ label: string; value: string }>;
  accept?: string | null; max_size_mb?: number | null;
  consent_label_html?: string | null;
}
export interface FormDef {
  key: string; name?: string; fields: FormFieldDef[];
  success_message?: string; redirect_url?: string | null;
  submit_button_label?: string; honeypot_field_name: string;
}
export async function getForm(key: string, vis: Record<string, string> = {}): Promise<FormDef | null> {
  try { return (await fetchJson(`/forms/${encodeURIComponent(key)}`, { lang: LANG }, vis)) as FormDef; }
  catch { return null; }
}

// ── SEO ────────────────────────────────────────────────────────────────────────
export async function getSeo(type: 'post' | 'page', slug: string, vis: Record<string, string> = {}): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${BASE}/seo/${type}/${encodeURIComponent(slug)}`, { headers: { Accept: 'application/json', ...authHeaders(), ...vis }, cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<Record<string, unknown>>;
  } catch { return null; }
}

// ── Field / section helpers ─────────────────────────────────────────────────────

/** Flat field map for a given field_group_key on an entry. */
export function sectionData(entry: CmsEntry | null | undefined, fgk: string): Record<string, unknown> {
  return (entry?.content?.sections?.find(s => s.field_group_key === fgk)?.data ?? {}) as Record<string, unknown>;
}

/** First section (any group) whose data holds `key`. Mirrors the CFC `field()` helper. */
export function field(entry: CmsEntry | null | undefined, key: string): unknown {
  return entry?.content?.sections?.find(s => s.data && key in s.data)?.data?.[key];
}

/** Rich-text body from the virtual __fallback_body__ section (Pages / post default body). */
export function bodyHtml(entry: CmsEntry | null | undefined): string {
  const b = entry?.content?.body;
  if (typeof b === 'string' && b.trim()) return b;
  const sec = entry?.content?.sections?.find(s => typeof s.data?.body === 'string' && (s.data!.body as string).trim());
  return (sec?.data?.body as string) ?? '';
}

/** Non-empty string, else null. Use so empty CMS fields fall back to hardcoded markup. */
export function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v : (typeof v === 'number' ? String(v) : null);
}

/** A list field → array of non-empty strings ([] when empty/missing). */
export function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : [];
}

/** url field → {text,url} object (tolerates legacy string form); null when empty. */
export function link(v: unknown): { text: string; url: string } | null {
  if (!v) return null;
  if (typeof v === 'string') return v.trim() ? { text: v, url: v } : null;
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const url = typeof o.url === 'string' ? o.url : '';
    if (!url.trim()) return null;
    return { text: typeof o.text === 'string' && o.text.trim() ? o.text : url, url };
  }
  return null;
}

// ── Images ───────────────────────────────────────────────────────────────────
export function asImage(raw: unknown): ExpandedImage | null {
  if (raw == null || raw === '') return null;   // empty CC image field = no image
  if (typeof raw === 'object' && Array.isArray((raw as ExpandedImage).variants)) return raw as ExpandedImage;
  const id = typeof raw === 'object' ? ((raw as Record<string, unknown>)['id'] ?? null) : raw;
  return (id != null && id !== '') ? { id: id as number | string, slug: null, alt: null, width: null, height: null, focus_x: null, focus_y: null, variants: [] } : null;
}

/** gallery field → ExpandedImage[] (already-expanded objects; raw ids tolerated). */
export function asGallery(raw: unknown): ExpandedImage[] {
  const arr = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
  return arr.map(asImage).filter((x): x is ExpandedImage => x !== null);
}

export function assetUrl(id: number | string | null, variant = 'md', slug: string | null = null): string {
  if (!id) return '';
  const mid = slug ? `${id}/${slug}` : `${id}/variants`;
  return `${BASE}/assets/${mid}/${variant}`;
}

export function imageUrl(img: ExpandedImage | null | undefined, name = 'lg'): string {
  if (!img) return '';
  if (img.slug) return `${BASE}/assets/${img.id}/${img.slug}/${name}`;
  if (img.variants?.length) {
    const v = img.variants.find(v => v.name === name) ?? img.variants.find(v => v.name === 'master') ?? img.variants.at(-1)!;
    return v.url.startsWith('http') ? v.url : `${ORIGIN}${v.url}`;
  }
  return assetUrl(img.id, name);
}

export function imageSrcSet(img: ExpandedImage | null | undefined): string {
  if (!img) return '';
  if (img.variants?.length) {
    const hasSlug = img.slug;
    return img.variants
      .filter(v => SRCSET_NAMES.has(v.name))
      .map(v => {
        const url = hasSlug ? `${BASE}/assets/${img.id}/${img.slug}/${v.name}` : (v.url.startsWith('http') ? v.url : `${ORIGIN}${v.url}`);
        return `${url} ${v.width ?? VARIANT_WIDTHS[v.name]}w`;
      }).join(', ');
  }
  return Object.entries(VARIANT_WIDTHS).map(([v, w]) => `${assetUrl(img.id, v, img.slug)} ${w}w`).join(', ');
}

export function focusPosition(x: number | null | undefined, y: number | null | undefined): string {
  if (x == null || y == null) return 'center center';
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}

export function escAttr(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
