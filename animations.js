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

  // ── Touch · auto-active hover state when card is centered in viewport ──
  if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    var touchCards = document.querySelectorAll(
      '.service-card, .stat-card, .actu-card, .maison-feature, .quick-card, ' +
      '.info-card, .method-card, .don-card, .service-contact-card, ' +
      '.service-img-wrap, .tilt-img'
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

  // ── Form validation messages in French ──
  var translations = {
    valueMissing:    'Ce champ est obligatoire.',
    typeMismatch:    'Veuillez saisir une adresse correcte.',
    typeMismatchEmail: 'Veuillez saisir une adresse e-mail valide.',
    patternMismatch: 'Le format saisi n’est pas valide.',
    tooShort:        'Veuillez saisir au moins {minLength} caractères.',
    tooLong:         'Veuillez saisir au maximum {maxLength} caractères.',
    rangeUnderflow:  'La valeur doit être supérieure ou égale à {min}.',
    rangeOverflow:   'La valeur doit être inférieure ou égale à {max}.',
    badInput:        'Veuillez saisir une valeur valide.'
  };
  function setMessage(input) {
    var v = input.validity;
    var msg = '';
    if (v.valueMissing)       msg = translations.valueMissing;
    else if (v.typeMismatch && input.type === 'email') msg = translations.typeMismatchEmail;
    else if (v.typeMismatch)  msg = translations.typeMismatch;
    else if (v.patternMismatch) msg = translations.patternMismatch;
    else if (v.tooShort)      msg = translations.tooShort.replace('{minLength}', input.minLength);
    else if (v.tooLong)       msg = translations.tooLong.replace('{maxLength}', input.maxLength);
    else if (v.rangeUnderflow) msg = translations.rangeUnderflow.replace('{min}', input.min);
    else if (v.rangeOverflow)  msg = translations.rangeOverflow.replace('{max}', input.max);
    else if (v.badInput)      msg = translations.badInput;
    input.setCustomValidity(msg);
  }
  document.querySelectorAll('input, textarea, select').forEach(function(input) {
    input.addEventListener('invalid', function() { setMessage(input); });
    input.addEventListener('input',   function() { input.setCustomValidity(''); });
    input.addEventListener('change',  function() { input.setCustomValidity(''); });
  });

})();
