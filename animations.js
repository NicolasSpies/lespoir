/* ═══════════════════════════════════════════════════════════════
   Animations · L'Espoir asbl micro-interactions
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── 2. Curly underline draw-in (IntersectionObserver) ──
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var curlies = document.querySelectorAll('.curly-svg');
    if (curlies.length > 0) {
      var curlyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            // small delay so headline appears first
            setTimeout(function() {
              entry.target.classList.add('curly-drawn');
            }, 200);
            curlyObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      curlies.forEach(function(svg) { curlyObserver.observe(svg); });

      // Safeguard for tall viewports
      setTimeout(function() {
        document.querySelectorAll('.curly-svg:not(.curly-drawn)').forEach(function(svg) {
          svg.classList.add('curly-drawn');
        });
      }, 1800);
    }
  } else {
    // No observer support or reduced motion → show all immediately
    document.querySelectorAll('.curly-svg').forEach(function(svg) {
      svg.classList.add('curly-drawn');
    });
  }

})();
