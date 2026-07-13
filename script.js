/* ================================================================
   Portfolio — Theme toggle, navigation, animations
   ================================================================ */

(function () {
  'use strict';

  /* ===== Theme Management ===== */
  const themes = ['light', 'dark', 'system'];
  const themeIcons = { light: '☀', dark: '☾', system: '◐' };
  const STORAGE_KEY = 'noah-portfolio-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    updateToggleUI(theme);
  }

  function updateToggleUI(theme) {
    const labels = document.querySelectorAll('.theme-label');
    const icons = document.querySelectorAll('.theme-icon');
    labels.forEach(function (el) {
      el.textContent = theme;
    });
    icons.forEach(function (el) {
      el.textContent = themeIcons[theme] || '◐';
    });
  }

  function cycleTheme() {
    const current = getStoredTheme();
    const nextIndex = (themes.indexOf(current) + 1) % themes.length;
    const next = themes[nextIndex];
    storeTheme(next);
    applyTheme(next);
  }

  /* ===== Initialize Theme ===== */
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);

  /* Listen for system theme changes (when in system mode) */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (getStoredTheme() === 'system') {
      /* CSS handles it via media query, just ensure no data-theme attribute */
    }
  });

  /* ===== Theme Toggle Buttons ===== */
  const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  themeToggles.forEach(function (btn) {
    btn.addEventListener('click', cycleTheme);
  });

  /* ===== Mobile Menu ===== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMobileMenu(open) {
    if (typeof open === 'boolean') {
      menuToggle.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    } else {
      const isOpen = menuToggle.classList.contains('open');
      toggleMobileMenu(!isOpen);
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      toggleMobileMenu();
    });

    /* Close menu when a nav item is clicked */
    mobileMenu.querySelectorAll('.mobile-nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        toggleMobileMenu(false);
      });
    });

    /* Close menu on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* ===== Active Nav Highlighting ===== */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(function (item) {
            const isActive = item.getAttribute('href') === '#' + id;
            item.classList.toggle('active', isActive);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ===== Entrance Animations (Reveal) ===== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            const delay = Math.min(index * 70, 330);
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* If reduced motion, show everything immediately */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ===== Dynamic Year ===== */
  const year = new Date().getFullYear();
  const heroYear = document.getElementById('hero-year');
  const footerYear = document.getElementById('footer-year');
  if (heroYear) heroYear.textContent = year;
  if (footerYear) footerYear.textContent = '© ' + year;

})();
