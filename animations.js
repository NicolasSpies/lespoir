/* ═══════════════════════════════════════════════════════════════
   Animations · L'Espoir asbl micro-interactions
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Curly underline draw-in (IntersectionObserver) ──
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var curlies = document.querySelectorAll('.curly-svg');
    if (curlies.length > 0) {
      var curlyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            setTimeout(function() {
              entry.target.classList.add('curly-drawn');
            }, 200);
            curlyObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      curlies.forEach(function(svg) { curlyObserver.observe(svg); });

      setTimeout(function() {
        document.querySelectorAll('.curly-svg:not(.curly-drawn)').forEach(function(svg) {
          svg.classList.add('curly-drawn');
        });
      }, 1800);
    }
  } else {
    document.querySelectorAll('.curly-svg').forEach(function(svg) {
      svg.classList.add('curly-drawn');
    });
  }

  // ── 2. Touch · auto-active hover state when card is centered in viewport ──
  // (no hover on touch devices · simulate it via .in-view class)
  if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    var touchCards = document.querySelectorAll(
      '.service-card, .stat-card, .actu-card, .maison-feature, .quick-card, ' +
      '.info-card, .method-card, .don-card, .service-contact-card, ' +
      '.service-img-wrap, .tilt-img, ' +
      // Extended set (consistency across all card-like surfaces)
      '.value-pill, .why-item, .person-card, .valeur-card, .impact-card, ' +
      '.featured-card, .featured-article, .timeline-item'
    );
    if (touchCards.length > 0) {
      var touchObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.intersectionRatio >= 0.6) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      }, { threshold: [0, 0.6, 0.9], rootMargin: '-25% 0px -25% 0px' });
      touchCards.forEach(function(card) { touchObs.observe(card); });
    }
  }

  // ── 3. Timeline · stagger-reveal each item as user scrolls past ──
  //   (line draws in, dot pops, content slides) · uses .timeline-revealed class
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      // Group items by their parent so we stagger correctly across the timeline
      var parents = new Map();
      timelineItems.forEach(function(el) {
        var p = el.parentElement;
        if (!parents.has(p)) parents.set(p, []);
        parents.get(p).push(el);
      });

      var timelineObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // Compute stagger delay based on item's index in its parent group
            var siblings = parents.get(el.parentElement) || [el];
            var idx = siblings.indexOf(el);
            // Only stagger on initial reveal (when scrolling down from above)
            setTimeout(function() {
              el.classList.add('timeline-revealed');
            }, idx === 0 ? 0 : 120);
            timelineObs.unobserve(el);
          }
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

      timelineItems.forEach(function(el) { timelineObs.observe(el); });

      // Safety: after 2.5s, reveal anything still hidden
      setTimeout(function() {
        document.querySelectorAll('.timeline-item:not(.timeline-revealed)').forEach(function(el) {
          el.classList.add('timeline-revealed');
        });
      }, 2500);
    }
  } else {
    // Reduced motion or no IO support: reveal all immediately
    document.querySelectorAll('.timeline-item').forEach(function(el) {
      el.classList.add('timeline-revealed');
    });
  }

  // ── 4. Form validation messages in French ──
  var translations = {
    valueMissing:      'Ce champ est obligatoire.',
    typeMismatch:      'Veuillez saisir une adresse correcte.',
    typeMismatchEmail: 'Veuillez saisir une adresse e-mail valide.',
    patternMismatch:   'Le format saisi n’est pas valide.',
    tooShort:          'Veuillez saisir au moins {minLength} caractères.',
    tooLong:           'Veuillez saisir au maximum {maxLength} caractères.',
    rangeUnderflow:    'La valeur doit être supérieure ou égale à {min}.',
    rangeOverflow:     'La valeur doit être inférieure ou égale à {max}.',
    badInput:          'Veuillez saisir une valeur valide.'
  };
  function setMessage(input) {
    var v = input.validity;
    var msg = '';
    if (v.valueMissing)                                 msg = translations.valueMissing;
    else if (v.typeMismatch && input.type === 'email')  msg = translations.typeMismatchEmail;
    else if (v.typeMismatch)                            msg = translations.typeMismatch;
    else if (v.patternMismatch)                         msg = translations.patternMismatch;
    else if (v.tooShort)                                msg = translations.tooShort.replace('{minLength}', input.minLength);
    else if (v.tooLong)                                 msg = translations.tooLong.replace('{maxLength}', input.maxLength);
    else if (v.rangeUnderflow)                          msg = translations.rangeUnderflow.replace('{min}', input.min);
    else if (v.rangeOverflow)                           msg = translations.rangeOverflow.replace('{max}', input.max);
    else if (v.badInput)                                msg = translations.badInput;
    input.setCustomValidity(msg);
  }
  document.querySelectorAll('input, textarea, select').forEach(function(input) {
    input.addEventListener('invalid', function() { setMessage(input); });
    input.addEventListener('input',   function() { input.setCustomValidity(''); });
    input.addEventListener('change',  function() { input.setCustomValidity(''); });
  });

})();
