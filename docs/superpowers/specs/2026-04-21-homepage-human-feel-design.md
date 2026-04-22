# Homepage — Human Feel Design
**Date:** 2026-04-21  
**Scope:** `homepage.html` only  
**Status:** Approved by user

---

## Problem

The homepage looks polished and correct but feels like a WordPress theme or AI-generated template. Every section is a clean rectangular block, strictly grid-aligned, with hard colour cuts between sections. Nothing breaks the pattern, nothing feels hand-made.

The content and tone are already good. Stock photos will be replaced separately. This spec addresses **visual structure only**.

---

## Direction: Subtle C+A (Handcrafted + Organic)

A light decorative layer on top of the existing layout — nothing is moved, rewritten, or restructured. The changes are purely additive (CSS + inline SVG). The goal is that the page *feels* different before the user consciously notices why.

---

## 5 Changes

### 1. Organic Blob Shapes — 4 sections

Soft, irregular colour blobs placed as `position: absolute` elements inside section containers. They sit behind all content (`z-index: 0`, content at `z-index: 1`). Very low opacity so they read as a colour suggestion, not a graphic.

| Section | Blob colour | Size | Position |
|---|---|---|---|
| Hero (`#002626` bg) | `rgba(139,173,59, 0.12)` | 280×280px | top-right, clipped |
| Hero (`#002626` bg) | `rgba(229,88,18, 0.08)` | 200×200px | bottom-left, clipped |
| Stats (`#fbf9f8` bg) | `rgba(139,173,59, 0.06)` | 300×300px | top-right, clipped |
| Quote (`#002626` bg) | `rgba(17,157,164, 0.10)` | 250×250px | bottom-right, clipped |
| Don CTA (`#EFE7DA` bg) | `rgba(229,88,18, 0.08)` | 220×220px | top-left, clipped |

**CSS border-radius pattern** (organic, not circular):  
`border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%`  
Each blob gets a slightly different set of values for variety.

**Implementation note:** Add `overflow: hidden` to each section container to clip blobs at edges. Use `pointer-events: none` on blobs.

---

### 2. Organic Wave Dividers — 4 transitions

Replace the hard colour-cut between sections with a smooth SVG wave. Each wave is a `<svg>` absolutely positioned at the bottom of the upper section, bleeding into the lower section's background colour.

**Transitions:**
1. Hero (`#002626`) → Services (`#EFE7DA`)
2. Services (`#EFE7DA`) → Stats/About (`#fbf9f8`)
3. Stats/About (`#fbf9f8`) → Quote (`#002626`)
4. Quote (`#002626`) → Don CTA (`#EFE7DA`)

**Pattern per divider:**
```html
<!-- placed at bottom of upper section, overflow:visible on parent -->
<svg viewBox="0 0 1440 48" preserveAspectRatio="none"
     style="position:absolute;bottom:-1px;left:0;width:100%;height:48px;">
  <path d="M0 0 Q360 48 720 24 Q1080 0 1440 36 L1440 48 L0 48 Z"
        fill="[lower-section-bg-colour]"/>
</svg>
```
Each wave path is slightly different (Q control-point values vary ±30%) so no two transitions look identical.

**Height:** 48px on desktop, 32px on mobile (`@media (max-width: 768px)`).

---

### 3. SVG Hand-drawn Underlines — 2 locations

A thin, slightly wobbly SVG path drawn under a specific word or phrase. Renders as a `position: absolute` SVG below the text element.

**Locations:**
1. **Hero title** — under the word `jeunes` in "Accompagner les jeunes depuis 1985." Colour: `#8BAD3B`, stroke-width: 2.5px.
2. **Services section title** — under "Nos services". Colour: `#8BAD3B`, stroke-width: 2px.

**SVG path template** (viewBox width matches the word's approximate em-width; `width:100%` makes it auto-fit):
```svg
<svg viewBox="0 0 100 10" fill="none"
     style="position:absolute;bottom:-4px;left:0;width:100%;height:10px;">
  <path d="M1 7 Q25 2 50 7 Q75 12 99 5"
        stroke="#8BAD3B" stroke-width="2.5" stroke-linecap="round"/>
</svg>
```
The parent `<span>` needs `position: relative; display: inline-block`. Because `width: 100%` is used, the viewBox proportions are irrelevant — the path always stretches to match the text width.

---

### 4. Stat Card Rotations — 4 cards

Each of the four `.stat-card` elements on the homepage gets a different small CSS rotation, alternating direction. This breaks the rigid 2×2 grid alignment without changing layout.

| Card | Rotation |
|---|---|
| Jeunes accompagnés (orange) | `rotate(-1.2deg)` |
| Membres de l'équipe (green) | `rotate(0.7deg)` |
| Services spécialisés (teal) | `rotate(-0.5deg)` |
| Année de création (dark) | `rotate(1deg)` |

Applied via `transform: rotate(Xdeg)` inline or via nth-child CSS selectors. Hover state already handles `transform: translateY(-6px)` — this must be combined: `transform: rotate(Xdeg) translateY(-6px)` on hover (to avoid resetting the rotation).

**Important:** The `.stat-card.revealed:hover` override added in the previous session must be updated to include the rotation value, otherwise hover will snap the card to `rotate(0)`.

---

### 5. Dashed Ellipse Around CTA — 1 location

A dashed SVG ellipse drawn around the "Faire un don" button in the Don CTA section. Adds a hand-circled feeling to the primary action.

```html
<div style="position:relative;display:inline-block;">
  [existing button HTML]
  <!-- viewBox sized to fit any button; the SVG is sized via CSS to extend 10px beyond button edges -->
  <svg viewBox="0 0 160 50" fill="none"
       style="position:absolute;top:-8px;left:-10px;width:calc(100% + 20px);height:calc(100% + 16px);pointer-events:none;">
    <ellipse cx="80" cy="25" rx="76" ry="22"
             stroke="#E55812" stroke-width="1.8" stroke-dasharray="5 3" fill="none"/>
  </svg>
</div>
```

Colour: `#E55812` (brand orange). Stroke-dasharray: `5 3`. No fill.

---

## What Does NOT Change

- Layout structure (grid, flexbox, column counts)
- Typography (font sizes, weights, families)
- Colour system (all existing brand colours kept)
- Content (no words, headings, or copy changed)
- Navigation, footer
- All other pages (scope is homepage only)
- Hover effects from previous session (all preserved)

---

## Files Touched

- `homepage.html` — inline `<style>` block + HTML for blobs, waves, underlines, dashed ellipse; `transform` updates on stat cards

---

## Acceptance Criteria

- No hard rectangular cut visible between any two sections
- Stat cards visibly (but subtly) off-axis
- Hand-drawn underline visible under "jeunes" in hero
- Hand-drawn underline visible under "Nos services" title
- Dashed orange ellipse around "Faire un don" CTA in don section
- Hover on stat cards still lifts smoothly (rotation preserved)
- No layout shift on mobile
- Works in Safari, Chrome, Firefox
