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

  // ── 4. Checklist · sequential item reveal on scroll ──
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var checklists = document.querySelectorAll('.checklist');
    if (checklists.length > 0) {
      var checklistObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            checklistObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      checklists.forEach(function(cl) { checklistObs.observe(cl); });
      // Safety reveal after 2s in case scroll never triggers
      setTimeout(function() {
        document.querySelectorAll('.checklist:not(.revealed)').forEach(function(cl) {
          cl.classList.add('revealed');
        });
      }, 2200);
    }
  } else {
    document.querySelectorAll('.checklist').forEach(function(cl) {
      cl.classList.add('revealed');
    });
  }

  // ── 5. FAQ <details> · smooth height animation on open/close ──
  // Native <details> snaps; we hook the toggle event and animate .faq-body height.
  (function() {
    var items = document.querySelectorAll('.faq-item');
    if (items.length === 0) return;

    items.forEach(function(item) {
      var body = item.querySelector('.faq-body');
      if (!body) return;

      // Set initial height to 0 if not open
      if (!item.open) body.style.height = '0px';
      else body.style.height = 'auto';

      // Intercept the user click on summary so we control the animation timing
      var summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function(e) {
        e.preventDefault();
        if (prefersReducedMotion) {
          item.open = !item.open;
          body.style.height = item.open ? 'auto' : '0px';
          return;
        }

        if (item.open) {
          // ── CLOSE ──
          // Lock current height, flip [open] attr (chevron rotates immediately),
          // then animate height to 0. Content's opacity transition is CSS-controlled.
          var startH = body.scrollHeight;
          body.style.height = startH + 'px';
          body.offsetHeight; // reflow
          item.open = false;
          // Re-set height=0 in next frame so [open] removal doesn't snap-close
          requestAnimationFrame(function() {
            body.style.height = '0px';
          });
        } else {
          // ── OPEN ──
          // Set [open] attr first (chevron + content becomes visible),
          // measure target height, then animate from 0 → target.
          item.open = true;
          var endH = body.scrollHeight;
          body.style.height = '0px';
          body.offsetHeight; // reflow
          requestAnimationFrame(function() {
            body.style.height = endH + 'px';
          });
          var onEnd = function(ev) {
            if (ev.propertyName !== 'height') return;
            body.removeEventListener('transitionend', onEnd);
            body.style.height = 'auto';
          };
          body.addEventListener('transitionend', onEnd);
        }
      });
    });
  })();

  // ── 4b. Parallax · subtle vertical drift on [data-parallax] elements ──
  // Decorative blobs etc. that drift at fractional scroll-speed for depth.
  // Skipped on touch (no scroll-driven feel), reduced-motion, small viewports.
  if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion && window.innerWidth >= 1024) {
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length > 0) {
      var pTicking = false;
      function updateParallax() {
        var scrollY = window.scrollY;
        parallaxEls.forEach(function(el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
          var rect = el.getBoundingClientRect();
          // Only update if element is in/near viewport
          if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
            var offset = scrollY * speed;
            el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
          }
        });
        pTicking = false;
      }
      window.addEventListener('scroll', function() {
        if (!pTicking) {
          requestAnimationFrame(updateParallax);
          pTicking = true;
        }
      }, { passive: true });
      updateParallax();
    }
  }

  // ── 5a. Reading progress bar · for long-form pages (article/legal) ──
  var progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    var ticking = false;
    function updateProgress() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progressBar.style.width = pct + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  // ── 5b. Number counters · animate from 0 to target when in viewport ──
  if ('IntersectionObserver' in window) {
    var counters = document.querySelectorAll('.counter[data-counter]');
    if (counters.length > 0) {
      var counterObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-counter'), 10);
            if (prefersReducedMotion) {
              el.textContent = target;
            } else {
              var duration = Math.min(1200 + target * 15, 1800);
              var start = performance.now();
              function tick(now) {
                var t = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
                el.textContent = Math.round(target * eased);
                if (t < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
            }
            counterObs.unobserve(el);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function(c) { counterObs.observe(c); });
    }
  }

  // ── 6. Vanilla-Tilt · subtle 3D parallax on key cards (desktop only) ──
  // Skip on touch devices (they use .in-view CSS), reduced-motion, or missing lib.
  if (window.matchMedia('(hover: hover)').matches
      && !prefersReducedMotion
      && typeof VanillaTilt !== 'undefined') {
    var tiltTargets = document.querySelectorAll(
      '.service-card, .maison-feature, .impact-card, .featured-card'
    );
    if (tiltTargets.length > 0) {
      VanillaTilt.init(tiltTargets, {
        max: 5,                  // very subtle · asbl-soft not corporate-pop
        perspective: 2400,       // low intensity
        speed: 700,              // slow, soothing return
        scale: 1,                // no scale — translateY on hover handles depth
        glare: false,            // matte, no shiny corporate-y reflection
        reset: true,
        'reset-to-start': true,
        gyroscope: false         // mobile is handled by in-view CSS instead
      });
    }
  }

  // ── 7. Form validation messages in French ──
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
