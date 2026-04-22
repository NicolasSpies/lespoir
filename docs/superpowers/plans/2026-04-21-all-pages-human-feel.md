# All Pages — Human-Feel Decorations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the same organic/handcrafted decorations from `homepage.html` to all 9 remaining pages — blob shapes, wave section dividers, and one SVG hand-drawn underline per page.

**Architecture:** Pure CSS+HTML additions — no layout changes, no JS, no content changes. Each task touches exactly one file. All changes are additive (blob CSS block + blob divs + wave divs + one `<span>` wrapper for underline).

**Tech Stack:** Vanilla HTML/CSS inline styles + inline SVG. No build step. Files served as static HTML.

---

## Shared Design Rules (READ THIS FIRST)

### Blob CSS block
Add to the end of the `<style>` block (before `</style>`) in every file:
```css
/* ── Organic blobs ── */
.blob { position:absolute; border-radius:60% 40% 70% 30% / 50% 60% 40% 50%; pointer-events:none; z-index:0; }
.blob-parent > :not(.blob) { position:relative; z-index:1; }
.blob-parent { position:relative; overflow:hidden; }
```

### How to add blobs to a section
1. Add class `blob-parent` to the `<section>` element (append to existing classes)
2. Insert blob `<div>` elements as the FIRST children inside the `<section>` tag, before any other content

**Critical blob positioning rule:** Blobs must NEVER overflow vertically past the section boundary. Only clip on left/right. Use:
- `top: 20px` (not negative)
- `bottom: 30px` or `bottom: 40px` (not negative)
- Negative left/right values are fine (e.g., `right:-80px`)

### Blob HTML templates
Green blob top-right (opacity 10%):
```html
<div class="blob" aria-hidden="true" style="width:280px;height:280px;background:rgba(139,173,59,0.10);top:20px;right:-80px;border-radius:60% 40% 70% 30% / 50% 60% 40% 50%;"></div>
```

Green blob top-right dark sections (opacity 12%):
```html
<div class="blob" aria-hidden="true" style="width:300px;height:300px;background:rgba(139,173,59,0.12);top:20px;right:-80px;border-radius:55% 45% 65% 35% / 45% 55% 45% 55%;"></div>
```

Orange blob bottom-left (opacity 8%):
```html
<div class="blob" aria-hidden="true" style="width:220px;height:220px;background:rgba(229,88,18,0.08);bottom:30px;left:-60px;border-radius:40% 60% 35% 65% / 55% 35% 65% 45%;"></div>
```

Orange blob top-left (opacity 7%):
```html
<div class="blob" aria-hidden="true" style="width:200px;height:200px;background:rgba(229,88,18,0.07);top:20px;left:-50px;border-radius:45% 55% 40% 60% / 60% 40% 60% 40%;"></div>
```

Teal blob top-right (opacity 9%):
```html
<div class="blob" aria-hidden="true" style="width:240px;height:240px;background:rgba(17,157,164,0.09);top:20px;right:-60px;border-radius:50% 50% 70% 30% / 40% 60% 40% 60%;"></div>
```

Teal blob bottom-right (opacity 9%):
```html
<div class="blob" aria-hidden="true" style="width:240px;height:240px;background:rgba(17,157,164,0.09);bottom:40px;right:-60px;border-radius:50% 50% 70% 30% / 40% 60% 40% 60%;"></div>
```

Green blob bottom-right (opacity 8%):
```html
<div class="blob" aria-hidden="true" style="width:260px;height:260px;background:rgba(139,173,59,0.08);bottom:40px;right:-80px;border-radius:65% 35% 55% 45% / 50% 50% 50% 50%;"></div>
```

### Wave divider pattern
Wave dividers go BETWEEN section tags — placed as a standalone `<div>` after `</section>` and before the next `<section>`. Background = upper section's bg color. SVG fill = lower section's bg color.

Height: 48px desktop. Add a `@media (max-width: 768px)` override to 32px if needed (inline style cannot do this — use a named class in the style block, or just use height:48px everywhere for simplicity).

**Each wave uses a DIFFERENT Q-curve path** so no two transitions look identical:

Wave A (dark→cream `#002626`→`#EFE7DA`):
```html
<div aria-hidden="true" style="background:#002626;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 8 Q360 48 720 20 Q1080 0 1440 32 L1440 48 L0 48 Z" fill="#EFE7DA"/></svg></div>
```

Wave B (cream→surface `#EFE7DA`→`#fbf9f8`):
```html
<div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 12 Q360 0 720 36 Q1080 48 1440 20 L1440 48 L0 48 Z" fill="#fbf9f8"/></svg></div>
```

Wave C (surface→dark `#fbf9f8`→`#002626`):
```html
<div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 24 Q480 48 720 16 Q1080 0 1440 40 L1440 48 L0 48 Z" fill="#002626"/></svg></div>
```

Wave D (surface→cream `#fbf9f8`→`#EFE7DA`):
```html
<div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 36 Q360 0 720 40 Q1080 48 1440 12 L1440 48 L0 48 Z" fill="#EFE7DA"/></svg></div>
```

Wave E (cream→dark `#EFE7DA`→`#002626`):
```html
<div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 20 Q240 48 720 24 Q1080 4 1440 36 L1440 48 L0 48 Z" fill="#002626"/></svg></div>
```

Wave F (dark→surface `#002626`→`#fbf9f8`):
```html
<div aria-hidden="true" style="background:#002626;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 32 Q360 8 720 44 Q1080 48 1440 16 L1440 48 L0 48 Z" fill="#fbf9f8"/></svg></div>
```

Wave G (dark→cream, variant `#002626`→`#EFE7DA` — different path from A):
```html
<div aria-hidden="true" style="background:#002626;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 40 Q360 16 720 44 Q1080 48 1440 8 L1440 48 L0 48 Z" fill="#EFE7DA"/></svg></div>
```

Wave H (cream→surface, variant `#EFE7DA`→`#fbf9f8`):
```html
<div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 28 Q480 4 720 40 Q960 48 1440 20 L1440 48 L0 48 Z" fill="#fbf9f8"/></svg></div>
```

Wave I (surface→dark, variant `#fbf9f8`→`#002626`):
```html
<div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 16 Q360 48 720 12 Q1080 0 1440 44 L1440 48 L0 48 Z" fill="#002626"/></svg></div>
```

Wave J (dark→surface, variant `#002626`→`#fbf9f8`):
```html
<div aria-hidden="true" style="background:#002626;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 44 Q480 0 720 36 Q1200 48 1440 24 L1440 48 L0 48 Z" fill="#fbf9f8"/></svg></div>
```

Wave K (cream→dark, variant `#EFE7DA`→`#002626`):
```html
<div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 4 Q360 48 720 8 Q1080 0 1440 40 L1440 48 L0 48 Z" fill="#002626"/></svg></div>
```

Wave L (surface→cream, variant `#fbf9f8`→`#EFE7DA`):
```html
<div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 8 Q240 48 720 20 Q1200 0 1440 36 L1440 48 L0 48 Z" fill="#EFE7DA"/></svg></div>
```

Wave M (cream→surface, variant 3 `#EFE7DA`→`#fbf9f8`):
```html
<div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 44 Q360 16 720 36 Q1080 48 1440 8 L1440 48 L0 48 Z" fill="#fbf9f8"/></svg></div>
```

Wave N (surface→dark, variant 3 `#fbf9f8`→`#002626`):
```html
<div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 40 Q480 12 720 44 Q960 48 1440 16 L1440 48 L0 48 Z" fill="#002626"/></svg></div>
```

Wave O (dark→cream, variant 3 `#002626`→`#EFE7DA`):
```html
<div aria-hidden="true" style="background:#002626;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 16 Q360 48 720 8 Q1200 0 1440 44 L1440 48 L0 48 Z" fill="#EFE7DA"/></svg></div>
```

Wave P (white→cream `#fff`→`#EFE7DA`):
```html
<div aria-hidden="true" style="background:#fff;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 24 Q360 48 720 16 Q1080 0 1440 36 L1440 48 L0 48 Z" fill="#EFE7DA"/></svg></div>
```

Wave Q (cream→white `#EFE7DA`→`#fff`):
```html
<div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;"><path d="M0 36 Q480 0 720 40 Q960 48 1440 12 L1440 48 L0 48 Z" fill="#fff"/></svg></div>
```

### SVG underline pattern
Wrap the target word in a `<span>`, append the SVG inside that span:
```html
<span style="position:relative;display:inline-block;">TARGET_WORD<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span>
```
The `<span>` replaces the plain text inline — don't add extra wrapping divs.

---

## Task 1: actualites.html

**File:** `actualites.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Projets actifs | `#EFE7DA` | (none) |
| News | `#fbf9f8` | (none) |
| Newsletter | `#EFE7DA` | (none) |
| Don CTA | `#002626` | don |

**Wave transitions to add (in order, between the indicated sections):**
1. After Hero `</section>`, before Projets actifs `<section>`: **Wave A** (`#002626`→`#EFE7DA`)
2. After Projets actifs `</section>`, before News `<section>`: **Wave B** (`#EFE7DA`→`#fbf9f8`)
3. After News `</section>`, before Newsletter `<section>`: **Wave D** (`#fbf9f8`→`#EFE7DA`)
4. After Newsletter `</section>`, before Don CTA `<section>`: **Wave E** (`#EFE7DA`→`#002626`)

**Blobs to add:**
- Hero section (already has `overflow-hidden` + `relative`): add `blob-parent` class, insert **green blob top-right dark** + **orange blob bottom-left** as first children inside `<section>`
- Newsletter section (`bg-[#EFE7DA]`): add `blob-parent` class, insert **green blob top-right** as first child

**SVG underline:** In the hero `<h1>`, wrap the word `vit` in the underline span:
- Find: `ce qu'on vit`
- Replace: `ce qu'on <span style="position:relative;display:inline-block;">vit<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span>`

- [ ] **Step 1: Read the file**
  ```bash
  cat -n "/Users/nicolasspies/Desktop/antigravity test/lespoir/actualites.html" | head -20
  ```
  Use the Read tool: `/Users/nicolasspies/Desktop/antigravity test/lespoir/actualites.html`

- [ ] **Step 2: Add blob CSS to `<style>` block**
  Find the closing `</style>` tag and insert the blob CSS block immediately before it.

- [ ] **Step 3: Add blob-parent class to Hero section**
  The hero section opens: `<section class="relative bg-[#002626] pt-16 pb-14 md:pt-24 md:pb-20 px-6 md:px-8 overflow-hidden">`
  Change to: `<section class="relative bg-[#002626] pt-16 pb-14 md:pt-24 md:pb-20 px-6 md:px-8 overflow-hidden blob-parent">`
  Then insert the green dark + orange blobs as first children inside the section (before the existing radial gradient divs).

- [ ] **Step 4: Add blob-parent class + blob to Newsletter section**
  Find: `<section class="py-16 md:py-20 px-6 md:px-8 bg-[#EFE7DA]">` (the one containing `newsletter-block`)
  Change to: `<section class="py-16 md:py-20 px-6 md:px-8 bg-[#EFE7DA] blob-parent">`
  Insert green blob top-right as first child.

- [ ] **Step 5: Add wave dividers between sections**
  Insert the 4 wave divs at the correct locations between `</section>` and `<section>` tags.

- [ ] **Step 6: Add SVG underline in hero h1**
  Wrap `vit` in the hero h1 with the underline span.

- [ ] **Step 7: Self-review**
  - Blob CSS block present in `<style>`
  - Hero section has `blob-parent` class + 2 blob divs
  - Newsletter section has `blob-parent` class + 1 blob div
  - 4 wave dividers present between sections
  - SVG underline on `vit`
  - No negative top/bottom values on blobs

- [ ] **Step 8: Commit**
  ```bash
  git add "actualites.html"
  git commit -m "feat(actualites): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 2: apropos.html

**File:** `apropos.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Notre histoire | `#fbf9f8` | histoire |
| Missions & Valeurs | `#002626` | missions |
| Notre équipe | `#EFE7DA` | equipe |
| Partenaires | `#fbf9f8` | partenaires |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before histoire: **Wave F** (`#002626`→`#fbf9f8`)
2. After histoire `</section>`, before missions: **Wave C** (`#fbf9f8`→`#002626`)
3. After missions `</section>`, before equipe: **Wave G** (`#002626`→`#EFE7DA`)
4. After equipe `</section>`, before partenaires: **Wave H** (`#EFE7DA`→`#fbf9f8`)
5. After partenaires `</section>`, before don: **Wave I** (`#fbf9f8`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden relative`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left**
- histoire section (`bg-surface`): add `blob-parent`, insert **orange blob top-left** as first child (inside section, before the inner max-w-7xl div)
- equipe section (`bg-[#EFE7DA]`): add `blob-parent`, insert **teal blob bottom-right** as first child
- partenaires section (`bg-surface`): add `blob-parent`, insert **green blob top-right** as first child

**SVG underline:** In the hero h1 `"Une association au service<br class="hidden sm:block"/> des jeunes depuis 1985"`, wrap `jeunes`:
- Find: `des jeunes depuis`
- Replace: `des <span style="position:relative;display:inline-block;">jeunes<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span> depuis`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/apropos.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to histoire section**
- [ ] **Step 5: Add blob-parent + blob to equipe section**
- [ ] **Step 6: Add blob-parent + blob to partenaires section**
- [ ] **Step 7: Add 5 wave dividers between sections**
- [ ] **Step 8: Add SVG underline around `jeunes` in hero h1**
- [ ] **Step 9: Self-review** (same checks as Task 1)
- [ ] **Step 10: Commit**
  ```bash
  git add "apropos.html"
  git commit -m "feat(apropos): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 3: contact.html

**File:** `contact.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Contact form | `#EFE7DA` | (none) |
| Services cards | `#fbf9f8` | (none) |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before form: **Wave A** (`#002626`→`#EFE7DA`)
2. After form `</section>`, before services: **Wave B** (`#EFE7DA`→`#fbf9f8`)
3. After services `</section>`, before don: **Wave C** (`#fbf9f8`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** as first child
- Form section (`bg-[#EFE7DA]`): add `blob-parent`, insert **teal blob top-right** as first child
- Services section (`bg-surface`): add `blob-parent`, insert **orange blob bottom-left** as first child

**SVG underline:** In the hero h1 `"On est là pour vous répondre"`, wrap `là`:
- Find: `est là pour`
- Replace: `est <span style="position:relative;display:inline-block;">là<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span> pour`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/contact.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blob to Hero section**
- [ ] **Step 4: Add blob-parent + blob to form section**
- [ ] **Step 5: Add blob-parent + blob to services section**
- [ ] **Step 6: Add 3 wave dividers between sections**
- [ ] **Step 7: Add SVG underline around `là` in hero h1**
- [ ] **Step 8: Self-review**
- [ ] **Step 9: Commit**
  ```bash
  git add "contact.html"
  git commit -m "feat(contact): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 4: don.html

**File:** `don.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Impact | `#EFE7DA` | (none) |
| Méthodes | `#ffffff` | methodes |
| FAQ | `#EFE7DA` | comment |
| Don CTA | `#002626` | (none) |

**Wave transitions to add:**
1. After Hero `</section>`, before Impact: **Wave A** (`#002626`→`#EFE7DA`)
2. After Impact `</section>`, before Méthodes: **Wave Q** (`#EFE7DA`→`#fff`)
3. After Méthodes `</section>`, before FAQ: **Wave P** (`#fff`→`#EFE7DA`)
4. After FAQ `</section>`, before Don CTA: **Wave K** (`#EFE7DA`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left** as first children
- Impact section (`bg-[#EFE7DA]`): add `blob-parent`, insert **teal blob bottom-right** as first child
- FAQ section (`bg-[#EFE7DA]`): add `blob-parent`, insert **green blob top-right** as first child

**SVG underline:** In the hero h1 `"Votre don, leur avenir."`, wrap `avenir`:
- Find: `leur avenir.`
- Replace: `leur <span style="position:relative;display:inline-block;">avenir<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span>.`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/don.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to Impact section**
- [ ] **Step 5: Add blob-parent + blob to FAQ section**
- [ ] **Step 6: Add 4 wave dividers between sections**
- [ ] **Step 7: Add SVG underline around `avenir` in hero h1**
- [ ] **Step 8: Self-review**
- [ ] **Step 9: Commit**
  ```bash
  git add "don.html"
  git commit -m "feat(don): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 5: emploi.html

**File:** `emploi.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Pourquoi nous | `#EFE7DA` | (none) |
| Offres | `#fbf9f8` | offres |
| Profils | `#002626` | (none) |
| Candidature | `#EFE7DA` | candidature |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before Pourquoi: **Wave A** (`#002626`→`#EFE7DA`)
2. After Pourquoi `</section>`, before Offres: **Wave B** (`#EFE7DA`→`#fbf9f8`)
3. After Offres `</section>`, before Profils: **Wave C** (`#fbf9f8`→`#002626`)
4. After Profils `</section>`, before Candidature: **Wave G** (`#002626`→`#EFE7DA`)
5. After Candidature `</section>`, before Don CTA: **Wave E** (`#EFE7DA`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left** as first children
- Pourquoi section (`bg-[#EFE7DA]`): add `blob-parent`, insert **teal blob top-right** as first child
- Candidature section (`bg-[#EFE7DA]`): add `blob-parent`, insert **green blob bottom-right** as first child

**SVG underline:** In the hero h1 `"Travailler ici,<br/> ça a du sens"`, wrap `sens`:
- Find: `du sens`
- Replace: `du <span style="position:relative;display:inline-block;">sens<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span>`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/emploi.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to Pourquoi section**
- [ ] **Step 5: Add blob-parent + blob to Candidature section**
- [ ] **Step 6: Add 5 wave dividers between sections**
- [ ] **Step 7: Add SVG underline around `sens` in hero h1**
- [ ] **Step 8: Self-review**
- [ ] **Step 9: Commit**
  ```bash
  git add "emploi.html"
  git commit -m "feat(emploi): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 6: sapa.html

**File:** `sapa.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Concept | `#fbf9f8` | concept |
| Publics | `#002626` | publics |
| Bénévole | `#EFE7DA` | benevole |
| Orientation | `#002626` | orientation |
| Autres services | `#fbf9f8` | (none) |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before Concept: **Wave F** (`#002626`→`#fbf9f8`)
2. After Concept `</section>`, before Publics: **Wave C** (`#fbf9f8`→`#002626`)
3. After Publics `</section>`, before Bénévole: **Wave G** (`#002626`→`#EFE7DA`)
4. After Bénévole `</section>`, before Orientation: **Wave K** (`#EFE7DA`→`#002626`)
5. After Orientation `</section>`, before Autres services: **Wave J** (`#002626`→`#fbf9f8`)
6. After Autres services `</section>`, before Don: **Wave N** (`#fbf9f8`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left** as first children
- Concept section (`bg-surface`): add `blob-parent`, insert **teal blob top-right** as first child
- Bénévole section (`bg-[#EFE7DA]`): add `blob-parent`, insert **orange blob bottom-left** as first child

**SVG underline:** In the hero h1 `"Un lien privilégié, une présence bénévole"`, wrap `lien`:
- Find: `Un lien privilégié`
- Replace: `Un <span style="position:relative;display:inline-block;">lien<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span> privilégié`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/sapa.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to Concept section**
- [ ] **Step 5: Add blob-parent + blob to Bénévole section**
- [ ] **Step 6: Add 6 wave dividers between sections**
- [ ] **Step 7: Add SVG underline around `lien` in hero h1**
- [ ] **Step 8: Self-review**
- [ ] **Step 9: Commit**
  ```bash
  git add "sapa.html"
  git commit -m "feat(sapa): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 7: sase.html

**File:** `sase.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Pour qui | `#fbf9f8` | pour-qui |
| Approche | `#002626` | approche |
| Équipe | `#fbf9f8` | equipe |
| Orientation | `#EFE7DA` | orientation |
| Autres services | `#fbf9f8` | (none) |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before Pour qui: **Wave F** (`#002626`→`#fbf9f8`)
2. After Pour qui `</section>`, before Approche: **Wave I** (`#fbf9f8`→`#002626`)
3. After Approche `</section>`, before Équipe: **Wave J** (`#002626`→`#fbf9f8`)
4. After Équipe `</section>`, before Orientation: **Wave L** (`#fbf9f8`→`#EFE7DA`)
5. After Orientation `</section>`, before Autres services: **Wave M** (`#EFE7DA`→`#fbf9f8`)
6. After Autres services `</section>`, before Don: **Wave N** (`#fbf9f8`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left** as first children
- Approche section (`bg-[#002626]`): add `blob-parent`, insert **teal blob top-right** as first child
- Orientation section (`bg-[#EFE7DA]`): add `blob-parent`, insert **green blob bottom-right** as first child

**SVG underline:** In the hero h1 `"Un soutien éducatif, au cœur de chaque famille"`, wrap `famille`:
- Find: `chaque famille`
- Replace: `chaque <span style="position:relative;display:inline-block;">famille<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span>`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/sase.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to Approche section**
- [ ] **Step 5: Add blob-parent + blob to Orientation section**
- [ ] **Step 6: Add 6 wave dividers between sections**
- [ ] **Step 7: Add SVG underline around `famille` in hero h1**
- [ ] **Step 8: Self-review**
- [ ] **Step 9: Commit**
  ```bash
  git add "sase.html"
  git commit -m "feat(sase): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 8: services.html

**File:** `services.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| SRG | `#fbf9f8` | srg |
| SASE | `#EFE7DA` | sase |
| SAPA | `#fbf9f8` | sapa |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before SRG: **Wave F** (`#002626`→`#fbf9f8`)
2. After SRG `</section>`, before SASE: **Wave D** (`#fbf9f8`→`#EFE7DA`)
3. After SASE `</section>`, before SAPA: **Wave H** (`#EFE7DA`→`#fbf9f8`)
4. After SAPA `</section>`, before Don: **Wave C** (`#fbf9f8`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left** as first children
- SRG section (`bg-surface`): add `blob-parent`, insert **orange blob top-left** as first child
- SASE section (`bg-[#EFE7DA]`): add `blob-parent`, insert **teal blob bottom-right** as first child

**SVG underline:** In the hero h1 `"Trois services, un engagement commun"`, wrap `engagement`:
- Find: `un engagement commun`
- Replace: `un <span style="position:relative;display:inline-block;">engagement<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span> commun`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/services.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to SRG section**
- [ ] **Step 5: Add blob-parent + blob to SASE section**
- [ ] **Step 6: Add 4 wave dividers between sections**
- [ ] **Step 7: Add SVG underline around `engagement` in hero h1**
- [ ] **Step 8: Self-review**
- [ ] **Step 9: Commit**
  ```bash
  git add "services.html"
  git commit -m "feat(services): add organic blobs, wave dividers, SVG underline"
  ```

---

## Task 9: srg.html

**File:** `srg.html`

**Section map:**
| Section | bg color | id |
|---|---|---|
| Hero | `#002626` | (none) |
| Pour qui | `#fbf9f8` | pour-qui |
| Approche | `#002626` | approche |
| Maisons | `#EFE7DA` | maisons |
| Équipe | `#fbf9f8` | equipe |
| Orientation | `#EFE7DA` | orientation |
| Autres services | `#fbf9f8` | (none) |
| Don CTA | `#002626` | don |

**Wave transitions to add:**
1. After Hero `</section>`, before Pour qui: **Wave F** (`#002626`→`#fbf9f8`)
2. After Pour qui `</section>`, before Approche: **Wave C** (`#fbf9f8`→`#002626`)
3. After Approche `</section>`, before Maisons: **Wave O** (`#002626`→`#EFE7DA`)
4. After Maisons `</section>`, before Équipe: **Wave H** (`#EFE7DA`→`#fbf9f8`)
5. After Équipe `</section>`, before Orientation: **Wave D** (`#fbf9f8`→`#EFE7DA`)
6. After Orientation `</section>`, before Autres services: **Wave M** (`#EFE7DA`→`#fbf9f8`)
7. After Autres services `</section>`, before Don: **Wave N** (`#fbf9f8`→`#002626`)

**Blobs to add:**
- Hero section (already `overflow-hidden`): add `blob-parent`, insert **green dark blob top-right** + **orange blob bottom-left** as first children
- Approche section (`bg-[#002626]`): add `blob-parent`, insert **teal blob top-right** as first child
- Maisons section (`bg-[#EFE7DA]`): add `blob-parent`, insert **green blob bottom-right** as first child
- Orientation section (`bg-[#EFE7DA]`): add `blob-parent`, insert **orange blob top-left** as first child

**SVG underline:** In the hero h1 `"Un foyer sécurisant pour grandir ensemble"`, wrap `grandir`:
- Find: `pour grandir ensemble`
- Replace: `pour <span style="position:relative;display:inline-block;">grandir<svg viewBox="0 0 100 10" fill="none" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span> ensemble`

- [ ] **Step 1: Read the file** — `/Users/nicolasspies/Desktop/antigravity test/lespoir/srg.html`
- [ ] **Step 2: Add blob CSS to `<style>` block**
- [ ] **Step 3: Add blob-parent + blobs to Hero section**
- [ ] **Step 4: Add blob-parent + blob to Approche section**
- [ ] **Step 5: Add blob-parent + blob to Maisons section**
- [ ] **Step 6: Add blob-parent + blob to Orientation section**
- [ ] **Step 7: Add 7 wave dividers between sections**
- [ ] **Step 8: Add SVG underline around `grandir` in hero h1**
- [ ] **Step 9: Self-review**
- [ ] **Step 10: Commit**
  ```bash
  git add "srg.html"
  git commit -m "feat(srg): add organic blobs, wave dividers, SVG underline"
  ```

---

## Acceptance Criteria (all pages)

- [ ] No hard rectangular colour cuts between any two sections on any page
- [ ] Each blob stays visually within its section (no hard horizontal clip lines)
- [ ] SVG underline visible under the correct word in each hero
- [ ] No layout shift, no broken typography on any page
- [ ] Blob CSS block present in `<style>` on all 9 pages
- [ ] Works in Safari, Chrome, Firefox
