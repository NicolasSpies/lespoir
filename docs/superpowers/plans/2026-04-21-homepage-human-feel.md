# Homepage Human Feel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five layers of subtle organic/handcrafted decoration to `homepage.html` to break the rigid block-template feel without touching layout, content, or other pages.

**Architecture:** All changes are additive — new CSS in the existing `<style>` block and new HTML elements (blobs, wave dividers, SVG accents). No existing elements are removed or restructured. Wave dividers are standalone `<div>` elements inserted between `<section>` tags; blobs are absolutely-positioned `<div>`s inside existing sections.

**Tech Stack:** Vanilla HTML/CSS/SVG — no dependencies, no build step, no JS.

---

## File Map

- **Modify:** `homepage.html` — `<style>` block (new CSS rules appended) + `<body>` HTML (new elements inserted at specific line numbers)

---

## Task 1: Blob shapes — Hero + Quote sections

**Files:**
- Modify: `homepage.html` — `<style>` block, lines ~73–680 (append CSS); line 796 and line 812 (insert HTML)

**Background:** Four faint, organic-shaped `<div>`s placed absolutely inside sections. They use `border-radius` with eight values to create irregular shapes. Sections need `position: relative; overflow: hidden` to clip blobs at edges.

- [ ] **Step 1: Add blob CSS to the `<style>` block**

Find the line `/* ── Scroll-reveal hover fix` near the bottom of the `<style>` block (just before `</style>`). Insert this block immediately before it:

```css
  /* ── Organic blob decorations ── */
  .blob {
    position: absolute;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    pointer-events: none;
    z-index: 0;
  }
  /* Ensure content inside blob-parent sections stays above blobs */
  .blob-parent > * { position: relative; z-index: 1; }
  .blob-parent { position: relative; overflow: hidden; }
```

- [ ] **Step 2: Add blobs to the Hero text panel**

Find in `homepage.html` (around line 796):
```html
    <div class="bg-[#EFE7DA] flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-20 py-14 md:py-20">
```
Add `blob-parent` to that div's class, and insert two blob divs as the FIRST children:
```html
    <div class="blob-parent bg-[#EFE7DA] flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-20 py-14 md:py-20">
      <div class="blob" style="width:320px;height:320px;background:rgba(139,173,59,0.09);top:-100px;right:-80px;border-radius:60% 40% 70% 30% / 50% 60% 40% 50%;"></div>
      <div class="blob" style="width:200px;height:200px;background:rgba(229,88,18,0.07);bottom:-60px;left:-40px;border-radius:30% 70% 40% 60% / 60% 30% 70% 40%;"></div>
```

- [ ] **Step 3: Add a blob to the Quote section**

Find (around line 812):
```html
  <section class="quote-section bg-[#EFE7DA] py-14 md:py-20 px-6 md:px-8 border-b border-[#002626]/10">
```
Change to add `blob-parent` and remove the `border-b` (the upcoming wave divider replaces it):
```html
  <section class="quote-section blob-parent bg-[#EFE7DA] py-14 md:py-20 px-6 md:px-8">
```
Then insert a blob as the FIRST child of that section (before `<div class="max-w-3xl mx-auto text-center">`):
```html
    <div class="blob" style="width:260px;height:260px;background:rgba(17,157,164,0.09);bottom:-80px;right:-40px;border-radius:40% 60% 50% 50% / 55% 45% 60% 40%;"></div>
```

- [ ] **Step 4: Open `homepage.html` in a browser and verify**

Expected: faint colour smudges visible in the hero right panel (top-right green, bottom-left orange) and in the quote section (bottom-right teal). They should be barely noticeable and not overlap any text.

- [ ] **Step 5: Commit**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git add homepage.html
git commit -m "feat(homepage): add organic blob shapes to hero + quote sections"
```

---

## Task 2: Blob shapes — Stats + Don sections

**Files:**
- Modify: `homepage.html` — lines ~877 (about/stats section) and ~1007 (don section)

- [ ] **Step 1: Add blob to the About/Stats section**

Find (around line 877):
```html
  <section id="about" class="bg-[#EFE7DA] py-16 md:py-24 px-6 md:px-8">
```
Change to:
```html
  <section id="about" class="blob-parent bg-[#EFE7DA] py-16 md:py-24 px-6 md:px-8">
```
Insert as FIRST child (before `<div class="max-w-7xl mx-auto grid..."`):
```html
    <div class="blob" style="width:340px;height:340px;background:rgba(139,173,59,0.07);top:-80px;right:-100px;border-radius:55% 45% 60% 40% / 40% 60% 45% 55%;"></div>
```

- [ ] **Step 2: Add blob to the Don section**

The Don section already has `overflow-hidden` from Tailwind. We only need `position:relative` which it already inherits from being a block. The blob will be clipped by the existing `overflow-hidden`.

Find (around line 1007):
```html
  <section id="don" class="bg-[#002626] py-16 md:py-24 px-6 md:px-8 overflow-hidden">
```
Insert as FIRST child (before `<div class="max-w-7xl mx-auto flex..."`):
```html
    <div class="blob" style="width:280px;height:280px;background:rgba(229,88,18,0.09);top:-60px;left:-60px;border-radius:50% 50% 40% 60% / 45% 55% 50% 50%;pointer-events:none;z-index:0;position:absolute;"></div>
```
Also ensure the existing content div stays above: the Don section's `<div class="max-w-7xl mx-auto flex...">` should get `style="position:relative;z-index:1;"` added:
```html
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16" style="position:relative;z-index:1;">
```

- [ ] **Step 3: Browser verify**

Expected: subtle blob visible behind the stats grid (top-right area) and behind the don section text (left side). Don section blob uses orange tint on dark background — should be very faint.

- [ ] **Step 4: Commit**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git add homepage.html
git commit -m "feat(homepage): add organic blob shapes to stats + don sections"
```

---

## Task 3: Wave dividers between sections

**Files:**
- Modify: `homepage.html` — 5 insertion points between `</section>` and `<section>` tags

**Background:** Each wave is a standalone `<div aria-hidden="true">` inserted between two `<section>` tags. The div's background colour matches the UPPER section; the SVG path fill matches the LOWER section. This creates an organic transition. `margin-bottom: -1px` prevents a 1px gap at the seam.

The 5 transitions and their colours:

| Between | Upper bg | Lower bg |
|---|---|---|
| Quote → Services | `#EFE7DA` | `#fbf9f8` |
| Services → About | `#fbf9f8` | `#EFE7DA` |
| About → Actualités | `#EFE7DA` | `#fbf9f8` |
| Actualités → Partners | `#fbf9f8` | `#EFE7DA` |
| Partners → Don | `#EFE7DA` | `#002626` |

- [ ] **Step 1: Insert wave between Quote and Services**

Find (around line 827–828):
```html
  </section>

  <!-- ── SERVICES (V2, farbige Cards) ── -->
  <section id="services"
```
Insert between `</section>` and the comment:
```html
  <!-- Wave: Quote → Services -->
  <div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;">
    <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;">
      <path d="M0 8 Q360 48 720 20 Q1080 0 1440 32 L1440 48 L0 48 Z" fill="#fbf9f8"/>
    </svg>
  </div>
```

- [ ] **Step 2: Insert wave between Services and About**

Find (around line 874–877):
```html
  </section>

  <!-- ── ABOUT (stats) ── -->
  <section id="about"
```
Insert:
```html
  <!-- Wave: Services → About -->
  <div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;">
    <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;">
      <path d="M0 32 Q360 0 720 28 Q1080 48 1440 16 L1440 48 L0 48 Z" fill="#EFE7DA"/>
    </svg>
  </div>
```

- [ ] **Step 3: Insert wave between About and Actualités**

Find (around line 911–914):
```html
  </section>

  <!-- ── ACTUALITÉS (V3 Bento) ── -->
  <section id="actualites"
```
Insert:
```html
  <!-- Wave: About → Actualités -->
  <div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;">
    <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;">
      <path d="M0 20 Q360 48 720 12 Q1080 -8 1440 36 L1440 48 L0 48 Z" fill="#fbf9f8"/>
    </svg>
  </div>
```

- [ ] **Step 4: Insert wave between Actualités and Partners**

Find (around line 983–986):
```html
  </section>

  <!-- ── PARTENAIRES ── -->
  <section id="partenaires"
```
Insert:
```html
  <!-- Wave: Actualités → Partners -->
  <div aria-hidden="true" style="background:#fbf9f8;line-height:0;display:block;margin-bottom:-1px;">
    <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;">
      <path d="M0 36 Q360 8 720 36 Q1080 56 1440 20 L1440 48 L0 48 Z" fill="#EFE7DA"/>
    </svg>
  </div>
```

- [ ] **Step 5: Insert wave between Partners and Don**

Find (around line 1004–1007):
```html
  </section>

  <section id="don" class="bg-[#002626]
```
Insert:
```html
  <!-- Wave: Partners → Don -->
  <div aria-hidden="true" style="background:#EFE7DA;line-height:0;display:block;margin-bottom:-1px;">
    <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:48px;">
      <path d="M0 16 Q360 48 720 24 Q1080 4 1440 40 L1440 48 L0 48 Z" fill="#002626"/>
    </svg>
  </div>
```

- [ ] **Step 6: Browser verify — scroll the full page**

Expected: no hard horizontal colour cuts between any two sections. Each transition curves gently into the next. Check on a narrow window (mobile) too — `preserveAspectRatio="none"` ensures waves stretch correctly.

- [ ] **Step 7: Commit**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git add homepage.html
git commit -m "feat(homepage): add organic wave dividers between all section transitions"
```

---

## Task 4: SVG hand-drawn underlines on two headings

**Files:**
- Modify: `homepage.html` — hero h1 (~line 798) and services h2 (~line 833)

- [ ] **Step 1: Underline "sécurité" in the hero h1**

Find (around line 798–799):
```html
      <h1 class="hero-reveal text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-[#002626] leading-[1.1] tracking-tight mb-6 md:mb-8">
        Parce que chaque enfant mérite un endroit pour grandir en sécurité
      </h1>
```
Replace with (wrapping only "sécurité"):
```html
      <h1 class="hero-reveal text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-[#002626] leading-[1.1] tracking-tight mb-6 md:mb-8">
        Parce que chaque enfant mérite un endroit pour grandir en <span style="position:relative;display:inline-block;">sécurité<svg viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 2 50 7 Q75 12 99 5" stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/></svg></span>
      </h1>
```

- [ ] **Step 2: Underline "une mission" in the services h2**

Find (around line 833):
```html
        <h2 class="text-3xl md:text-4xl font-bold text-[#002626]">Trois services, une mission</h2>
```
Replace with:
```html
        <h2 class="text-3xl md:text-4xl font-bold text-[#002626]">Trois services, <span style="position:relative;display:inline-block;">une mission<svg viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;bottom:-3px;left:0;width:100%;height:10px;" aria-hidden="true"><path d="M1 7 Q25 3 50 8 Q75 11 99 4" stroke="#8BAD3B" stroke-width="2" stroke-linecap="round"/></svg></span></h2>
```

- [ ] **Step 3: Browser verify**

Expected: a thin, slightly wobbly green line under "sécurité" in the hero heading and under "une mission" in the services section. Lines should follow the text width exactly and not clip at the edge. Check on mobile — text wraps so "sécurité" appears on its own line, underline should still fit.

- [ ] **Step 4: Commit**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git add homepage.html
git commit -m "feat(homepage): add SVG hand-drawn underlines to hero + services headings"
```

---

## Task 5: Stat card rotations with hover fix

**Files:**
- Modify: `homepage.html` — `<style>` block (new CSS rules)

**Background:** Each of the 4 stat cards gets a small rotation. Because `.scroll-reveal.revealed { transform: translateY(0) }` has specificity (0,2,0) and our previous fix `.stat-card.revealed:hover { transform: translateY(-6px) }` has specificity (0,3,0), we need the rotation hover rules to use an ID-anchored selector (specificity 1,x,x) so they always win.

Rotations: card 1 → `−1.2deg`, card 2 → `+0.7deg`, card 3 → `−0.5deg`, card 4 → `+1deg`.

- [ ] **Step 1: Add rotation + hover CSS**

Find the line `/* ── Scroll-reveal hover fix` in the `<style>` block. Insert this block BEFORE it (so it appears just before the scroll-reveal hover fix section):

```css
  /* ── Stat card rotations (subtle handmade feel) ── */
  /* Base rotations — each card slightly off-axis */
  #about .grid .stat-card:nth-child(1) { transform: rotate(-1.2deg); }
  #about .grid .stat-card:nth-child(2) { transform: rotate(0.7deg); }
  #about .grid .stat-card:nth-child(3) { transform: rotate(-0.5deg); }
  #about .grid .stat-card:nth-child(4) { transform: rotate(1deg); }

  /* Hover — lift + preserve rotation (specificity beats .scroll-reveal.revealed) */
  #about .grid .stat-card:nth-child(1):hover,
  #about .grid .stat-card:nth-child(1).revealed:hover { transform: rotate(-1.2deg) translateY(-6px); box-shadow: 0 14px 30px rgba(0,38,38,0.10); }
  #about .grid .stat-card:nth-child(2):hover,
  #about .grid .stat-card:nth-child(2).revealed:hover { transform: rotate(0.7deg) translateY(-6px); box-shadow: 0 14px 30px rgba(0,38,38,0.10); }
  #about .grid .stat-card:nth-child(3):hover,
  #about .grid .stat-card:nth-child(3).revealed:hover { transform: rotate(-0.5deg) translateY(-6px); box-shadow: 0 14px 30px rgba(0,38,38,0.10); }
  #about .grid .stat-card:nth-child(4):hover,
  #about .grid .stat-card:nth-child(4).revealed:hover { transform: rotate(1deg) translateY(-6px); box-shadow: 0 14px 30px rgba(0,38,38,0.10); }
```

- [ ] **Step 2: Browser verify**

Expected: the 2×2 stat card grid is slightly irregular — each card tilted a few degrees in alternating directions. Hover each card: it should lift upward while maintaining its tilt (not snap to upright). The effect is subtle at these angles — zoom into the grid on desktop to confirm.

- [ ] **Step 3: Commit**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git add homepage.html
git commit -m "feat(homepage): add subtle rotation to stat cards with hover fix"
```

---

## Task 6: Dashed ellipse around "Faire un don" CTA

**Files:**
- Modify: `homepage.html` — Don section, around line 1018

**Background:** Wrap the primary CTA button in a `position:relative` container and place an SVG ellipse behind it using `position:absolute`. The ellipse extends 10px beyond the button's edges.

- [ ] **Step 1: Wrap the CTA button with the ellipse**

Find (around line 1017–1021):
```html
        <div class="flex flex-col sm:flex-row flex-wrap gap-4">
          <a href="don.html" class="btn btn-accent btn-lg w-full sm:w-auto">
            <span class="material-symbols-outlined" style="font-size:20px;">favorite</span>
            Faire un don maintenant
          </a>
```
Replace with:
```html
        <div class="flex flex-col sm:flex-row flex-wrap gap-4">
          <div style="position:relative;display:inline-block;align-self:flex-start;">
            <a href="don.html" class="btn btn-accent btn-lg w-full sm:w-auto">
              <span class="material-symbols-outlined" style="font-size:20px;">favorite</span>
              Faire un don maintenant
            </a>
            <svg viewBox="0 0 200 58" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;top:-8px;left:-10px;width:calc(100% + 20px);height:calc(100% + 16px);pointer-events:none;">
              <ellipse cx="100" cy="29" rx="96" ry="25" stroke="rgba(139,173,59,0.5)" stroke-width="1.8" stroke-dasharray="5 3"/>
            </svg>
          </div>
```
Close the wrapping div after `</a>` before the second button:
```html
          </div>
          <a href="don.html#comment" class="btn btn-outline-light btn-lg w-full sm:w-auto">
```

**Note:** The ellipse colour is changed to `rgba(139,173,59,0.5)` (green, semi-transparent) rather than the orange from the spec mockup — green reads better on the dark `#002626` background against the green `btn-accent` button. Adjust to `rgba(239,231,218,0.4)` (cream) if preferred.

- [ ] **Step 2: Browser verify**

Expected: a dashed ellipse ring surrounds the "Faire un don maintenant" button on the Don section. The ellipse does not clip — it extends slightly beyond the button edges. On mobile (full-width button), the ellipse stretches to match. The second button "Comment ça marche ?" is unaffected.

- [ ] **Step 3: Commit**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git add homepage.html
git commit -m "feat(homepage): add dashed ellipse accent around primary CTA button"
```

---

## Task 7: Final review + push

- [ ] **Step 1: Full-page scroll on desktop** — verify all 5 changes visible and cohesive

- [ ] **Step 2: Full-page scroll on mobile** (resize browser to 390px) — check waves don't create gaps, blobs don't overflow visibly, underlines don't clip, rotated cards don't cause layout shift

- [ ] **Step 3: Check `prefers-reduced-motion`** — in DevTools, enable reduced motion. Blobs, waves, and underlines are static so they should be fine. Stat card rotations are CSS `transform` properties, not animations, so they remain at rest correctly.

- [ ] **Step 4: Push**

```bash
cd "/Users/nicolasspies/Desktop/antigravity test/lespoir"
git push origin main
```

---

## Self-Review

**Spec coverage:**
- ✅ Blob shapes: Tasks 1 + 2 (all 5 blob locations from spec table)
- ✅ Wave dividers: Task 3 (all 5 transitions)
- ✅ SVG underlines: Task 4 (hero "sécurité", services "une mission")
- ✅ Stat card rotations: Task 5 (all 4 cards, hover fix included)
- ✅ Dashed ellipse CTA: Task 6

**Spec discrepancy noted:** The spec says underline "jeunes" in the hero, but the actual hero h1 reads "Parce que chaque enfant mérite un endroit pour grandir en sécurité" — no "jeunes" there. Plan uses "sécurité" instead, which is the semantically strongest word in the sentence.

**Placeholder scan:** No TBD, TODO, or "implement later" patterns. All CSS and HTML is fully written out.

**Type consistency:** All class names match the existing codebase: `.stat-card`, `.blob`, `#about`, `#don`, `.btn`, `.btn-accent`. No invented names.
