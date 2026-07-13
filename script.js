/* ================================================================
   Portfolio — Theme (system/light/dark), navigation, mobile menu, animations
   bryl-minimal: defaults to system preference, persists choice
   ================================================================ */

(function () {
  'use strict';

  /* ===== Three-way theme: system | light | dark ===== */
  var STORAGE_KEY = 'noah-portfolio-theme';
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredPref() {
    try { return localStorage.getItem(STORAGE_KEY) || 'system'; }
    catch (e) { return 'system'; }
  }

  /* Resolve 'system' to an actual data-theme value */
  function resolveTheme(pref) {
    if (pref === 'system') return mq.matches ? 'dark' : 'light';
    return pref;
  }

  function applyPref(pref) {
    var resolved = resolveTheme(pref);
    document.documentElement.setAttribute('data-theme', resolved);
    updateSwitchUI(pref);
  }

  function updateSwitchUI(activePref) {
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-val') === activePref);
    });
  }

  /* Initial apply — before paint to avoid flash */
  var currentPref = getStoredPref();
  applyPref(currentPref);

  /* Wire up every theme button */
  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pref = btn.getAttribute('data-theme-val');
      try { localStorage.setItem(STORAGE_KEY, pref); } catch (e) {}
      currentPref = pref;
      applyPref(pref);
    });
  });

  /* Re-apply when OS preference changes (only matters when pref === 'system') */
  mq.addEventListener('change', function () {
    if (getStoredPref() === 'system') applyPref('system');
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

  /* ===== Smooth Scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== Active Nav Highlighting ===== */
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-item');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(function (s) { navObserver.observe(s); });

  /* ===== Entrance Animations — bryl-minimal spec ===== */
  /* 400ms fast ease-out, 60ms stagger between list items, 6px lift */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    /* Stagger direct children of timeline, project lists, capabilities, metrics */
    var staggerParents = document.querySelectorAll(
      '.timeline, .metrics, .capabilities-grid, .project-details, .setup-grid, .archive-list'
    );
    staggerParents.forEach(function (parent) {
      Array.from(parent.children).forEach(function (child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
      });
    });

    /* Section-level fade-up */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.section, .hero, .cta-block').forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    /* Also observe pre-staggered children */
    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ===== Support Ticket Simulator — Experience section ===== */
  function initTicketSim() {
    var sim = document.getElementById('ticket-sim');
    if (!sim) return;

    sim.querySelectorAll('.ticket-row').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen  = btn.getAttribute('aria-expanded') === 'true';
        var bodyId  = btn.getAttribute('aria-controls');
        var body    = bodyId ? document.getElementById(bodyId) : null;
        var badge   = btn.querySelector('.ticket-badge');
        if (!body) return;

        if (isOpen) {
          /* Collapse */
          body.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          if (badge) {
            badge.textContent = 'Open';
            badge.className   = 'ticket-badge ticket-badge--open';
          }
          /* Re-hide after transition so it's removed from tab order */
          body.addEventListener('transitionend', function onEnd() {
            body.removeEventListener('transitionend', onEnd);
            if (!body.classList.contains('open')) body.hidden = true;
          });
        } else {
          /* Expand — two-frame trick: remove hidden → rAF → add .open */
          body.hidden = false;
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              body.classList.add('open');
            });
          });
          btn.setAttribute('aria-expanded', 'true');
          if (badge) {
            badge.textContent = 'Resolved';
            badge.className   = 'ticket-badge ticket-badge--resolved';
          }
        }
      });
    });
  }

  initTicketSim();

  /* ===== Glossary Widget — Trading Knowledge Base project preview ===== */
  function initGlossaryWidget() {
    var search  = document.getElementById('glossary-search');
    var list    = document.getElementById('glossary-list');
    var empty   = document.getElementById('glossary-empty');
    var count   = document.getElementById('glossary-count');
    if (!search || !list) return;

    var entries = Array.from(list.querySelectorAll('.glossary-entry'));
    var total   = entries.length;

    function filter() {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      entries.forEach(function (entry) {
        /* data-term pre-concatenates synonyms (e.g. "risk reward ratio rr") */
        var haystack = (entry.getAttribute('data-term') || '') + ' ' +
                       (entry.querySelector('.glossary-term') ? entry.querySelector('.glossary-term').textContent : '');
        var match = !q || haystack.toLowerCase().indexOf(q) !== -1;
        entry.hidden = !match;
        if (match) visible++;
      });
      /* Update live count */
      count.textContent = q
        ? visible + ' of ' + total + ' term' + (total !== 1 ? 's' : '')
        : total + ' term' + (total !== 1 ? 's' : '');
      /* Show/hide empty state */
      if (empty) empty.hidden = visible > 0;
    }

    search.addEventListener('input', filter);
  }

  initGlossaryWidget();

})();
