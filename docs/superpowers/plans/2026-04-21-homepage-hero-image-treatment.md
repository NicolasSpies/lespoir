# Homepage Hero Image Treatment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Soften the hero image panel's hard rectangular edges on the homepage using a subtle SVG wave overlay, and fix the Ken Burns animation snap bug on slide transitions.

**Architecture:** Two additive CSS+HTML changes to `homepage.html` only — no layout changes, no content changes, no other files touched. The SVG wave overlay sits inside `.hero-img-reveal` (which already has `overflow:hidden`), painted with the adjacent content panel's colour (`#EFE7DA`). Two variants (right-edge for desktop, bottom-edge for mobile) are toggled via CSS classes and a media query. The animation fix is a one-line CSS addition.

**Tech Stack:** Vanilla HTML/CSS inline styles + inline SVG. Static file, no build step.

---

## File Modified

- `homepage.html` — two changes:
  1. CSS `<style>` block: new `.hero-wave-right` / `.hero-wave-bottom` rules + `transition` on `.hero-slider img`
  2. HTML: two `<svg>` children inserted inside `.hero-img-reveal`

---

## Task 1: Fix Ken Burns animation snap on slide transition

**Files:**
- Modify: `/Users/nicolasspies/Desktop/antigravity test/lespoir/homepage.html` — `<style>` block, `.hero-slider img` rule (around line 398)

**Problem:** When the active slide changes, the `heroKenBurns` animation is removed from the outgoing image. Because `.hero-slider img` has no `transition` on `transform`, the scale jumps instantly from wherever the animation left it (e.g. `scale(1.07)`) back to `scale(1)`. This is the visible "position reset" snap before the next image appears.

**Fix:** Add `transition: transform 0.8s ease-out` to the non-active `.hero-slider img` rule. CSS animations take priority over transitions on the same property, so this does NOT interfere with the Ken Burns animation running on the active slide — it only applies when the animation is removed (slide transitions out).

- [ ] **Step 1: Read the current CSS rule**

  Open `/Users/nicolasspies/Desktop/antigravity test/lespoir/homepage.html` and find this block (around line 398):
  ```css
  .hero-slider img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transform: scale(1);
    transition: opacity 1.2s ease-in-out;
  }
  ```

- [ ] **Step 2: Add `transition: transform` to the rule**

  Change the rule to:
  ```css
  .hero-slider img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transform: scale(1);
    transition: opacity 1.2s ease-in-out, transform 0.8s ease-out;
  }
  ```

  Use the Edit tool — the old string is the exact 4-line block above, the new string replaces only the `transition` line.

- [ ] **Step 3: Self-check**

  Verify the `.hero-slider img.active` rule still has `animation: heroKenBurns 8s ease-out forwards` and does NOT have a `transition` override. The fix is only on the non-active rule. The active rule should remain unchanged.

- [ ] **Step 4: Commit**

  ```bash
  git -C "/Users/nicolasspies/Desktop/antigravity test/lespoir" add homepage.html
  git -C "/Users/nicolasspies/Desktop/antigravity test/lespoir" commit -m "fix(homepage): smooth Ken Burns revert on slide transition — add transform transition to non-active slides"
  ```

---

## Task 2: SVG wave overlay on hero image panel

**Files:**
- Modify: `/Users/nicolasspies/Desktop/antigravity test/lespoir/homepage.html` — `<style>` block + HTML inside `.hero-img-reveal` (around line 810)

**What this does:**
- On desktop (≥768px): an SVG painted `#EFE7DA` sits at the RIGHT edge of `.hero-img-reveal`. Its left edge is an organic wave that cuts ~50px into the image, masking the hard vertical boundary between image and content panel.
- On mobile (<768px): an SVG painted `#EFE7DA` sits at the BOTTOM of `.hero-img-reveal`. Its top edge is a horizontal wave (48px tall), matching the style of the section wave dividers.
- Both SVGs have `pointer-events:none` and `aria-hidden="true"`.
- `.hero-img-reveal` already has `overflow:hidden` — the SVGs are clipped to the panel boundary automatically.

- [ ] **Step 1: Add CSS classes to the `<style>` block**

  Find the `.hero-img-reveal` CSS block (around line 367):
  ```css
  .hero-img-reveal {
    opacity: 0;
    will-change: opacity;
  }
  ```

  After the `.hero-img-reveal.revealed { ... }` closing brace (around line 374), insert these new rules:
  ```css
  /* ── Hero image organic edge overlays ── */
  .hero-wave-right {
    display: none;
    position: absolute; top: 0; right: 0;
    width: 80px; height: 100%;
    pointer-events: none; z-index: 10;
  }
  .hero-wave-bottom {
    display: block;
    position: absolute; bottom: 0; left: 0;
    width: 100%; height: 48px;
    pointer-events: none; z-index: 10;
  }
  @media (min-width: 768px) {
    .hero-wave-right { display: block; }
    .hero-wave-bottom { display: none; }
  }
  ```

- [ ] **Step 2: Read the current `.hero-img-reveal` HTML**

  Find this line in the HTML (around line 810):
  ```html
  <div class="hero-img-reveal relative overflow-hidden">
    <div class="hero-slider">
  ```

- [ ] **Step 3: Insert the two SVG overlays**

  Insert the two SVGs as the LAST children inside `.hero-img-reveal`, just before `</div>` that closes `.hero-img-reveal` (i.e., after the `</div>` that closes `.hero-slider`). The result should be:

  ```html
  <div class="hero-img-reveal relative overflow-hidden">
    <div class="hero-slider">
      <img src="1.jpg" alt="L'Espoir asbl" class="active blur-up"/>
      <img src="2.jpg" alt="L'Espoir asbl" class="blur-up" loading="lazy"/>
      <img src="3.jpg" alt="L'Espoir asbl" class="blur-up" loading="lazy"/>
      <img src="4.jpg" alt="L'Espoir asbl" class="blur-up" loading="lazy"/>
      <div class="hero-dots" role="tablist" aria-label="Diaporama">
        <button class="active" data-slide="0" aria-label="Image 1" aria-selected="true" role="tab"></button>
        <button data-slide="1" aria-label="Image 2" aria-selected="false" role="tab"></button>
        <button data-slide="2" aria-label="Image 3" aria-selected="false" role="tab"></button>
        <button data-slide="3" aria-label="Image 4" aria-selected="false" role="tab"></button>
      </div>
    </div>
    <!-- Desktop: organic wave on right edge (masks hard vertical cut to content panel) -->
    <svg class="hero-wave-right" viewBox="0 0 80 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
      <path d="M55 0 Q10 200 45 400 Q75 600 35 800 L80 800 L80 0 Z" fill="#EFE7DA"/>
    </svg>
    <!-- Mobile: organic wave on bottom edge (masks hard horizontal cut to content panel) -->
    <svg class="hero-wave-bottom" viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 28 Q360 4 720 40 Q1080 48 1440 16 L1440 48 L0 48 Z" fill="#EFE7DA"/>
    </svg>
  </div>
  ```

  Use the Edit tool. The old string is the closing `</div>` of `.hero-slider` + the `</div>` closing `.hero-img-reveal`:
  ```html
      </div>
    </div>
  ```
  The new string inserts the two SVGs between those two closing divs:
  ```html
      </div>
      <!-- Desktop: organic wave on right edge (masks hard vertical cut to content panel) -->
      <svg class="hero-wave-right" viewBox="0 0 80 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
        <path d="M55 0 Q10 200 45 400 Q75 600 35 800 L80 800 L80 0 Z" fill="#EFE7DA"/>
      </svg>
      <!-- Mobile: organic wave on bottom edge (masks hard horizontal cut to content panel) -->
      <svg class="hero-wave-bottom" viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 28 Q360 4 720 40 Q1080 48 1440 16 L1440 48 L0 48 Z" fill="#EFE7DA"/>
      </svg>
    </div>
  ```

  **Important:** The `</div>` that closes `.hero-dots` and the `</div>` that closes `.hero-slider` already exist — do not duplicate them. Only add the two `<svg>` elements + the final `</div>` closing `.hero-img-reveal`.

- [ ] **Step 4: Self-check**

  Verify:
  - Both `<svg>` elements are INSIDE `.hero-img-reveal` but OUTSIDE `.hero-slider`
  - `.hero-wave-right` has `class="hero-wave-right"` and matches the CSS rule
  - `.hero-wave-bottom` has `class="hero-wave-bottom"` and matches the CSS rule
  - `aria-hidden="true"` on both SVGs
  - The `fill` on both SVG paths is `#EFE7DA` (the content panel's colour)
  - No duplicate closing `</div>` tags introduced

- [ ] **Step 5: Commit**

  ```bash
  git -C "/Users/nicolasspies/Desktop/antigravity test/lespoir" add homepage.html
  git -C "/Users/nicolasspies/Desktop/antigravity test/lespoir" commit -m "feat(homepage): add organic SVG wave overlay on hero image panel edges"
  ```

---

## Self-Review

**Spec coverage:**
- ✅ Ken Burns snap bug fixed (Task 1)
- ✅ Desktop right-edge wave overlay (Task 2, `.hero-wave-right`)
- ✅ Mobile bottom-edge wave overlay (Task 2, `.hero-wave-bottom`)
- ✅ Responsive toggle via media query (Task 2, CSS)
- ✅ `aria-hidden="true"` and `pointer-events:none` on decorative SVGs (Task 2)
- ✅ Scope: only `homepage.html` touched

**Placeholder scan:** None found.

**Consistency:** `.hero-wave-right` and `.hero-wave-bottom` class names used identically in CSS and HTML. `#EFE7DA` fill matches content panel `bg-[#EFE7DA]` in all usages.
