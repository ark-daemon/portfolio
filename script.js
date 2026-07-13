/* ================================================================
   Portfolio — Theme toggle, navigation, mobile menu, animations
   ================================================================ */

(function () {
  'use strict';

  /* ===== Theme (light / dark toggle) ===== */
  var STORAGE_KEY = 'noah-portfolio-theme';

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY) || 'light'; }
    catch (e) { return 'light'; }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleUI(theme);
  }

  function updateToggleUI(theme) {
    var labels = document.querySelectorAll('.theme-label');
    labels.forEach(function (el) {
      el.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }

  applyTheme(getStoredTheme());

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    applyTheme(next);
  }

  document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });

  /* ===== Mobile Menu ===== */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function toggleMobileMenu(open) {
    if (typeof open !== 'boolean') {
      open = !menuToggle.classList.contains('open');
    }
    menuToggle.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () { toggleMobileMenu(); });
    mobileMenu.querySelectorAll('a').forEach(function (item) {
      item.addEventListener('click', function () { toggleMobileMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* ===== Active Nav Highlighting ===== */
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-item');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(function (s) { observer.observe(s); });

  /* ===== Entrance Animations ===== */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section, .hero').forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

})();
