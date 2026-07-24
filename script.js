/* ================================================================
   Portfolio  -  Theme (system/light/dark), navigation, mobile menu, animations
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

  /* Initial apply  -  before paint to avoid flash */
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

  var lastFocused = null;

  function getFocusable(container) {
    return container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
  }

  function toggleMobileMenu(open) {
    if (typeof open !== 'boolean') {
      open = !menuToggle.classList.contains('open');
    }
    menuToggle.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastFocused = document.activeElement;
      var focusable = getFocusable(mobileMenu);
      if (focusable.length) setTimeout(function () { focusable[0].focus(); }, 50);
    } else if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () { toggleMobileMenu(); });
    mobileMenu.querySelectorAll('a').forEach(function (item) {
      item.addEventListener('click', function () { toggleMobileMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!mobileMenu.classList.contains('open')) return;
      if (e.key === 'Escape') {
        toggleMobileMenu(false);
      } else if (e.key === 'Tab') {
        var focusable = getFocusable(mobileMenu);
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
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

  /* ===== Active nav by data-page (multi-page shell) ===== */
  function markActiveNav() {
    var page = document.body.getAttribute('data-page') || '';
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      var on = el.getAttribute('data-nav') === page;
      el.classList.toggle('active', on);
      if (on) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });
  }
  markActiveNav();

  /* ===== Scroll-spy only when hash section nav exists ===== */
  var sectionNav = document.querySelectorAll('.nav-item[href^="#"]');
  if (sectionNav.length) {
    var sections = document.querySelectorAll('section[id]');
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          sectionNav.forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('href') === '#' + id);
          });
          if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ===== Prefetch other pages (hover + idle) for faster nav ===== */
  var sitePages = [
    'index.html',
    'experience.html',
    'projects.html',
    'stack.html',
    'setup.html',
    'certifications.html',
    'play.html',
    'styles.css',
    'script.js'
  ];
  var prefetched = Object.create(null);

  function prefetchHref(href) {
    if (!href || prefetched[href]) return;
    try {
      var u = new URL(href, window.location.href);
      if (u.origin !== window.location.origin) return;
      // only same-site HTML/CSS/JS
      if (!/\.(html|css|js)(\?|#|$)/i.test(u.pathname) && !/\/$/.test(u.pathname)) return;
      prefetched[href] = true;
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = u.pathname + u.search;
      link.as = /\.css$/i.test(u.pathname) ? 'style' : /\.js$/i.test(u.pathname) ? 'script' : 'document';
      document.head.appendChild(link);
    } catch (e) {}
  }

  function prefetchAllSite() {
    sitePages.forEach(function (p) { prefetchHref(p); });
  }

  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return;
    a.addEventListener('pointerenter', function () { prefetchHref(href); }, { passive: true });
    a.addEventListener('focus', function () { prefetchHref(href); });
  });

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetchAllSite, { timeout: 1500 });
  } else {
    setTimeout(prefetchAllSite, 400);
  }

  /* ===== Entrance Animations (short; above-fold instant) ===== */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    var staggerParents = document.querySelectorAll(
      '.timeline, .metrics, .capabilities-grid, .project-details, .setup-grid, .archive-list, .exp-list, .gear-grid, .catalog'
    );
    staggerParents.forEach(function (parent) {
      Array.from(parent.children).forEach(function (child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = Math.min(i * 28, 120) + 'ms';
      });
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '40px 0px 0px 0px' });

    document.querySelectorAll('.section, .hero, .cta-block, .page-header').forEach(function (el) {
      el.classList.add('reveal');
      /* paint first paint content immediately */
      if (
        el.classList.contains('hero') ||
        el.classList.contains('page-header') ||
        (el.parentElement && el.parentElement.classList.contains('main') &&
          el === el.parentElement.querySelector('.section, .hero, .page-header'))
      ) {
        el.classList.add('visible');
      } else {
        revealObserver.observe(el);
      }
    });

    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      revealObserver.observe(el);
    });

    requestAnimationFrame(function () {
      document.documentElement.classList.add('page-loaded');
    });
  } else {
    document.documentElement.classList.add('page-loaded');
  }

  /* ===== Support Triage Flow Diagram  -  Capabilities section ===== */
  function initFlowDiagram() {
    var diagram = document.getElementById('flow-diagram');
    if (!diagram) return;

    var nodes     = Array.from(diagram.querySelectorAll('.flow-node'));
    var descIndex = document.getElementById('flow-desc-index');
    var descText  = document.getElementById('flow-desc-text');

    /* One description per node, keyed by data-node value */
    var descriptions = {
      '1': { index: '01', text: 'Member posts in #support or sends a direct message to the team.' },
      '2': { index: '02', text: 'Bot surfaces the three closest FAQ entries from the knowledge base template library.' },
      '3': { index: '03', text: 'Member confirms the issue persists or asks a follow-up. The ticket escalates automatically.' },
      '4': { index: '04', text: 'Available moderator picks up the ticket with full context attached and closes the loop.' }
    };

    nodes.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Deactivate all nodes */
        nodes.forEach(function (n) {
          n.classList.remove('flow-node--active');
          n.setAttribute('aria-pressed', 'false');
        });

        /* Activate clicked node */
        btn.classList.add('flow-node--active');
        btn.setAttribute('aria-pressed', 'true');

        /* Update description bar */
        var key  = btn.getAttribute('data-node');
        var data = descriptions[key];
        if (data && descIndex && descText) {
          descIndex.textContent = data.index;
          descText.textContent  = data.text;
        }
      });
    });
  }

  initFlowDiagram();



  /* ===== Experience skill pills - expand/collapse +N ===== */
  function initSkillExpand() {
    document.querySelectorAll('[data-skill-expand]').forEach(function (wrap) {
      var btn = wrap.querySelector('[data-skill-more]');
      if (!btn) return;
      var extras = wrap.querySelectorAll('.skill-chip-extra');
      var moreLabel = btn.textContent.trim(); /* e.g. "+6 skills" */

      btn.addEventListener('click', function () {
        var expanded = wrap.classList.contains('is-expanded');
        if (expanded) {
          extras.forEach(function (el) { el.hidden = true; });
          wrap.classList.remove('is-expanded');
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = moreLabel;
        } else {
          extras.forEach(function (el) { el.hidden = false; });
          wrap.classList.add('is-expanded');
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'Show less';
        }
      });
    });
  }

  initSkillExpand();

  /* ===== Glossary Widget  -  Trading Knowledge Base project preview ===== */
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

    /* Keyboard shortcut '/' to focus search */
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== search &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        search.focus();
      }
    });
  }

  initGlossaryWidget();

  /* ===== Case Study Drawers (Projects page redesign) ===== */
  function initCaseStudyDrawers() {
    document.querySelectorAll('.case-study-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var drawerId = btn.getAttribute('aria-controls');
        var drawer = drawerId ? document.getElementById(drawerId) : null;
        if (!drawer) return;

        var isOpen = drawer.classList.contains('open');
        if (isOpen) {
          drawer.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          drawer.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
        if (typeof playClick === 'function') playClick();
      });
    });
  }

  initCaseStudyDrawers();


  /* ===== Snake: centered board on play page only ===== */
  (function initPlaySnake() {
    var stage = document.getElementById('game-stage');
    var canvas = document.getElementById('snake-canvas');
    if (!stage || !canvas || document.body.getAttribute('data-page') !== 'play') return;

    var scoreEl = document.getElementById('game-score');
    var bestEl = document.getElementById('game-best');
    var endEl = document.getElementById('game-end');
    var start = document.getElementById('snake-start');
    var ctx = canvas.getContext('2d');
    var cell = 20;
    var cols = 18;
    var rows = 18;
    var snake, dir, nextDir, food, loop, alive, score, isNavigating = false;

    function bestKey() { return 'noah-play-best-snake'; }
    function loadBest() {
      try { return parseInt(localStorage.getItem(bestKey()) || '0', 10) || 0; }
      catch (e) { return 0; }
    }
    function saveBest(n) {
      var b = loadBest();
      if (n > b) {
        try { localStorage.setItem(bestKey(), String(n)); } catch (e) {}
        b = n;
      }
      if (bestEl) bestEl.textContent = String(b);
      return b;
    }
    function setScore(n) {
      score = n;
      if (scoreEl) scoreEl.textContent = String(score);
    }
    function randFood() {
      var p;
      do {
        p = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
      } while (snake.some(function (s) { return s.x === p.x && s.y === p.y; }));
      return p;
    }
    function ink() {
      return getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#0a0a0a';
    }
    function bg() {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#fff';
    }
    function border() {
      return getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e9e9e9';
    }
    function muted() {
      return getComputedStyle(document.documentElement).getPropertyValue('--text-3').trim() || '#a3a3a3';
    }
    function draw() {
      var w = canvas.width;
      var h = canvas.height;
      ctx.fillStyle = bg();
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = border();
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w / 2 - 4, h - 2);
      ctx.strokeRect(w / 2 + 3, 1, w / 2 - 4, h - 2);
      ctx.fillStyle = muted();
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          ctx.globalAlpha = 0.15;
          ctx.fillRect(x * cell + 9, y * cell + 9, 2, 2);
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink();
      ctx.fillRect(food.x * cell + 5, food.y * cell + 5, cell - 10, cell - 10);
      snake.forEach(function (s, i) {
        ctx.globalAlpha = i === 0 ? 1 : 0.72;
        ctx.fillRect(s.x * cell + 4, s.y * cell + 4, cell - 8, cell - 8);
      });
      ctx.globalAlpha = 1;
    }
    function step() {
      if (!alive) return;
      dir = nextDir;
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows ||
          snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
        alive = false;
        if (loop) { clearInterval(loop); loop = null; }
        if (endEl) {
          endEl.hidden = false;
          endEl.textContent = 'Game over · ' + score + ' · best ' + saveBest(score);
        }
        if (start) {
          var lab = start.querySelector('span:last-child');
          if (lab) lab.textContent = 'restart';
        }
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 50);
        food = randFood();
      } else {
        snake.pop();
      }
      draw();
    }
    function onKey(e) {
      var k = e.key;
      if (k === 'Escape' || k === 'Esc' || e.keyCode === 27) {
        if (isNavigating) return;
        isNavigating = true;
        window.location.href = 'index.html';
        return;
      }
      if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        startGame();
        return;
      }
      if (!alive) return;
      var key = k.toLowerCase();
      if ((key === 'arrowup' || key === 'w') && dir.y !== 1) nextDir = { x: 0, y: -1 };
      if ((key === 'arrowdown' || key === 's') && dir.y !== -1) nextDir = { x: 0, y: 1 };
      if ((key === 'arrowleft' || key === 'a') && dir.x !== 1) nextDir = { x: -1, y: 0 };
      if ((key === 'arrowright' || key === 'd') && dir.x !== -1) nextDir = { x: 1, y: 0 };
      if (key.indexOf('arrow') === 0) e.preventDefault();
    }
    function startGame() {
      if (loop) { clearInterval(loop); loop = null; }
      setScore(0);
      if (endEl) { endEl.hidden = true; endEl.textContent = ''; }
      if (start) {
        var lab = start.querySelector('span:last-child');
        if (lab) lab.textContent = 'restart';
      }
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      dir = { x: 1, y: 0 };
      nextDir = dir;
      food = randFood();
      alive = true;
      draw();
      loop = setInterval(step, 165);
    }

    window.addEventListener('keydown', onKey);
    if (start) start.addEventListener('click', startGame);
    if (bestEl) bestEl.textContent = String(loadBest());
    snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
    food = { x: 12, y: 9 };
    dir = { x: 1, y: 0 };
    nextDir = dir;
    alive = false;
    score = 0;
    draw();
  })();

  /* ===== Sound Effects and Toggle Generator ===== */
  function initSoundEffects() {
    var audioCtx = null;

    function getAudioContext() {
      if (!audioCtx) {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playHover() {
      var muted = localStorage.getItem('sound-muted') !== 'false';
      if (muted) return;
      var ctx = getAudioContext();
      if (!ctx) return;
      try {
        var time = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, time);
        osc.frequency.exponentialRampToValueAtTime(800, time + 0.008);

        gainNode.gain.setValueAtTime(0.015, time); // extremely quiet touch tick
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.008);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.008);
      } catch (e) {}
    }

    function playClick() {
      var muted = localStorage.getItem('sound-muted') !== 'false';
      if (muted) return;
      var ctx = getAudioContext();
      if (!ctx) return;
      try {
        var time = ctx.currentTime;

        // --- transient snap ---
        var osc = ctx.createOscillator();
        var gainOsc = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, time);
        osc.frequency.exponentialRampToValueAtTime(120, time + 0.02);

        gainOsc.gain.setValueAtTime(0.04, time);
        gainOsc.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

        osc.connect(gainOsc);
        gainOsc.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.02);

        // --- bottom-out plastic clack ---
        var bufferSize = ctx.sampleRate * 0.035; // 35ms
        var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        var noise = ctx.createBufferSource();
        noise.buffer = buffer;

        var filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, time);
        filter.Q.setValueAtTime(6, time);

        var gainNoise = ctx.createGain();
        gainNoise.gain.setValueAtTime(0.025, time);
        gainNoise.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(ctx.destination);

        noise.start(time);
        noise.stop(time + 0.035);
      } catch (e) {}
    }

    // Bind click events using event delegation
    document.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target !== document.body) {
        if (target.nodeType !== 1) {
          target = target.parentNode;
          continue;
        }
        var tag = target.tagName;
        var cl  = target.classList;
        if (
          tag === 'A' ||
          tag === 'BUTTON' ||
          cl.contains('nav-item') ||
          cl.contains('mobile-nav-item') ||
          cl.contains('theme-btn') ||
          cl.contains('ticket-row') ||
          cl.contains('kanban-card') ||
          cl.contains('flow-node') ||
          cl.contains('glossary-entry') ||
          cl.contains('glossary-search')
        ) {
          // If clicked a sound toggle btn, don't play click immediately (it handles its own click)
          if (cl.contains('sound-toggle-btn')) break;
          playClick();
          break;
        }
        target = target.parentNode;
      }
    });

    // Dynamic hover listeners attachment
    function attachHoverListeners() {
      var selectors = [
        '.nav-item',
        '.mobile-nav-item',
        '.btn',
        '.theme-btn',
        '.ticket-row',
        '.kanban-card',
        '.flow-node',
        '.glossary-entry',
        '.util-btn',
        '.stack-card'
      ];
      document.querySelectorAll(selectors.join(',')).forEach(function (el) {
        if (el.dataset.hasSoundHover) return;
        el.dataset.hasSoundHover = 'true';
        el.addEventListener('mouseenter', playHover);
      });
    }

    attachHoverListeners();

    // Listen to DOM mutations to bind hover events to dynamically loaded elements
    var observer = new MutationObserver(function () {
      attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Inject sound toggle next to color theme switchers
    var themeSwitches = document.querySelectorAll('.theme-switch');
    themeSwitches.forEach(function (ts) {
      var isMobile = ts.id === 'theme-switch-mobile';
      var idSuffix = isMobile ? 'mobile' : 'desktop';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sound-toggle-btn';
      btn.id = 'sound-toggle-' + idSuffix;
      btn.title = 'Toggle sound effects';
      btn.setAttribute('aria-label', 'Toggle interface sounds');
      btn.setAttribute('role', 'switch');

      var isMuted = localStorage.getItem('sound-muted') !== 'false';
      btn.setAttribute('aria-checked', isMuted ? 'false' : 'true');

      btn.innerHTML =
        '<svg class="sound-icon-mute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="' + (isMuted ? 'display: block;' : 'display: none;') + '">' +
          '<path d="M11 5L6 9H2v6h4l5 4V5z"/>' +
          '<line x1="23" y1="9" x2="17" y2="15"/>' +
          '<line x1="17" y1="9" x2="23" y2="15"/>' +
          '</svg>' +
        '<svg class="sound-icon-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="' + (!isMuted ? 'display: block;' : 'display: none;') + '">' +
          '<path d="M11 5L6 9H2v6h4l5 4V5z"/>' +
          '<path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>' +
          '<path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>' +
          '</svg>';

      // Wrap them in a .sidebar-controls flex container so they sit on the same line
      var wrapper = document.createElement('div');
      wrapper.className = 'sidebar-controls';
      ts.parentNode.insertBefore(wrapper, ts);
      wrapper.appendChild(ts);
      wrapper.appendChild(btn);

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var currentMuted = localStorage.getItem('sound-muted') !== 'false';
        var newMuted = !currentMuted;
        localStorage.setItem('sound-muted', newMuted ? 'true' : 'false');

        // Sync toggles
        document.querySelectorAll('.sound-toggle-btn').forEach(function (otherBtn) {
          otherBtn.setAttribute('aria-checked', newMuted ? 'false' : 'true');
          otherBtn.querySelector('.sound-icon-mute').style.display = newMuted ? 'block' : 'none';
          otherBtn.querySelector('.sound-icon-on').style.display = !newMuted ? 'block' : 'none';
        });

        if (!newMuted) {
          // Play click for unmuting feedback
          setTimeout(playClick, 20);
        }
      });
    });
  }

  /* ===== Projects Fanned Stack Swapper ===== */
  function initProjectsSwapper() {
    var stack = document.querySelector('.projects-stack');
    if (!stack) return;

    var cards = stack.querySelectorAll('.stack-card');

    cards.forEach(function (card, index) {
      if (card.classList.contains('stack-card--left')) {
        card.classList.remove('stack-card--left');
        card.classList.add('is-left');
      } else if (card.classList.contains('stack-card--center')) {
        card.classList.remove('stack-card--center');
        card.classList.add('is-center');
      } else if (card.classList.contains('stack-card--right')) {
        card.classList.remove('stack-card--right');
        card.classList.add('is-right');
      } else {
        if (index === 0) card.classList.add('is-left');
        else if (index === 1) card.classList.add('is-center');
        else card.classList.add('is-right');
      }

      card.addEventListener('click', function (e) {
        if (window.innerWidth >= 640 && !card.classList.contains('is-center')) {
          e.preventDefault();
          e.stopPropagation();

          var centerCard = stack.querySelector('.stack-card.is-center');
          if (centerCard) {
            var myClass = card.classList.contains('is-left') ? 'is-left' : 'is-right';

            centerCard.classList.remove('is-center');
            centerCard.classList.add(myClass);

            card.classList.remove(myClass);
            card.classList.add('is-center');

            if (typeof playClick === 'function') {
              playClick();
            }
          }
        }
      });
    });
  }

  /* ===== Email Contact Modal Overlay ===== */
  function initEmailModal() {
    // 1. Create and inject email overlay HTML dynamically at the end of the body
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'email-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'email-overlay-title');

    overlay.innerHTML =
      '<div class="overlay-panel" style="position: relative; width: min(28rem, 100%);">' +
        '<button type="button" class="overlay-close" id="email-overlay-close" aria-label="Close modal">✕</button>' +
        '<div style="margin-bottom: 1.5rem;">' +
          '<p class="email-modal-eyebrow">GET IN TOUCH</p>' +
          '<h2 id="email-overlay-title" class="email-modal-heading">say hello</h2>' +
          '<p style="font-size: 13px; color: var(--text-2); line-height: 1.5;">For work, collabs, or just to say hi — drop me a line.</p>' +
        '</div>' +
        '<div class="email-copy-row">' +
          '<input type="text" readonly value="carpisonoah@gmail.com" id="email-copy-input" class="email-copy-input" aria-label="Email address">' +
          '<button type="button" id="email-copy-btn" class="email-copy-btn">Copy</button>' +
        '</div>' +
        '<a href="mailto:carpisonoah@gmail.com" id="email-mail-app-btn" class="email-mail-app-btn">Open mail app</a>' +
      '</div>';

    document.body.appendChild(overlay);

    var closeBtn = document.getElementById('email-overlay-close');
    var copyInput = document.getElementById('email-copy-input');
    var copyBtn = document.getElementById('email-copy-btn');
    var mailAppBtn = document.getElementById('email-mail-app-btn');

    // 2. Open / Close helper functions
    function openModal() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overlay-open');
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overlay-open');
    }

    // 3. Event listeners
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Copy logic
    copyBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navigator.clipboard.writeText(copyInput.value).then(function () {
        copyBtn.textContent = 'Copied!';
        setTimeout(function () {
          copyBtn.textContent = 'Copy';
        }, 1500);
      });
    });

    // Close when clicking main action
    mailAppBtn.addEventListener('click', function () {
      closeModal();
    });

    // 4. Global email link interceptor
    document.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target !== document.body) {
        if (target.nodeType !== 1) {
          target = target.parentNode;
          continue;
        }
        var href = target.getAttribute('href') || '';
        // If clicked any mailto link or email trigger, open the modal instead
        if (href.indexOf('mailto:carpisonoah@gmail.com') === 0 || target.classList.contains('email-modal-trigger')) {
          e.preventDefault();
          openModal();
          break;
        }
        target = target.parentNode;
      }
    });
  }

  /* ===== Screenshot Lightbox Modal (Site-Wide) ===== */
  function initScreenshotLightbox() {
    var modal = document.getElementById('screenshot-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'screenshot-modal';
      modal.id = 'screenshot-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Enlarged screenshot view');
      modal.innerHTML =
        '<div class="screenshot-modal-backdrop" data-dismiss="modal"></div>' +
        '<div class="screenshot-modal-content">' +
          '<button type="button" class="screenshot-modal-close" id="screenshot-modal-close" aria-label="Close modal" data-dismiss="modal">' +
            '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
          '</button>' +
          '<img class="screenshot-modal-img" id="screenshot-modal-img" src="" alt="Enlarged project screenshot">' +
          '<p class="screenshot-modal-caption" id="screenshot-modal-caption"></p>' +
        '</div>';
      document.body.appendChild(modal);
    }

    var modalImg = document.getElementById('screenshot-modal-img');
    var modalCaption = document.getElementById('screenshot-modal-caption');
    var closeBtn = document.getElementById('screenshot-modal-close');
    var backdrop = modal.querySelector('.screenshot-modal-backdrop');
    var triggerElement = null;

    function openLightbox(src, alt, trigger) {
      if (!modalImg) return;
      triggerElement = trigger || document.activeElement;
      modalImg.src = src;
      modalImg.alt = alt || 'Enlarged project screenshot';
      if (modalCaption) {
        modalCaption.textContent = alt || '';
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
      if (typeof playClick === 'function') playClick();
    }

    function closeLightbox() {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      }
      if (typeof playClick === 'function') playClick();
    }

    document.addEventListener('click', function (e) {
      var target = e.target;
      var shell = target ? target.closest('.browser-shell') : null;

      if (shell) {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var img = (isDark ? shell.querySelector('img.screenshot-dark') : shell.querySelector('img.screenshot-light')) ||
                  shell.querySelector('img:not(.screenshot-dark):not(.screenshot-light)') ||
                  (function() {
                    var imgs = shell.querySelectorAll('img');
                    for (var i = 0; i < imgs.length; i++) {
                      if (imgs[i].offsetParent !== null) return imgs[i];
                    }
                    return imgs[0];
                  })();
        if (img) {
          e.preventDefault();
          e.stopPropagation();
          var title = shell.getAttribute('data-lightbox') || img.alt || 'Project screenshot';
          openLightbox(img.src, title, shell);
          return;
        }
      }

      if (target && target.tagName === 'IMG') {
        var isScreenshot = target.closest('.project-screenshots') ||
                           target.closest('.featured-shots') ||
                           target.closest('.project-screenshot') ||
                           target.hasAttribute('data-zoomable') ||
                           (target.closest('.catalog-card') && (target.src.indexOf('screenshots/') !== -1 || target.src.indexOf('.png') !== -1 || target.src.indexOf('.jpg') !== -1));
        if (isScreenshot) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(target.src, target.alt, target);
        }
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });
    }
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.hasAttribute('data-dismiss')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  /* ===== Toast Notification System & Copy Email Helper ===== */
  function showToast(message) {
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('role', 'status');
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>' + message + '</span>';
    container.appendChild(toast);
    
    requestAnimationFrame(function () {
      toast.classList.add('toast--show');
    });

    setTimeout(function () {
      toast.classList.remove('toast--show');
      toast.addEventListener('transitionend', function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      });
    }, 2800);
  }

  function initEmailCopy() {
    document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var email = btn.getAttribute('data-copy-email') || 'carpisonoah@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () {
            showToast('Email copied');
            if (typeof btn.focus === 'function') btn.focus();
          }).catch(function () {
            showToast('Copy failed — carpisonoah@gmail.com');
            if (typeof btn.focus === 'function') btn.focus();
          });
        } else {
          showToast('Copy failed — carpisonoah@gmail.com');
          if (typeof btn.focus === 'function') btn.focus();
        }
      });
    });
  }

  /* ===== +6 Skills Disclosure Expander ===== */
  function initSkillExpander() {
    document.querySelectorAll('[data-skill-more]').forEach(function (btn) {
      var controlsId = btn.getAttribute('aria-controls');
      var target = controlsId ? document.getElementById(controlsId) : null;
      if (!target) return;

      function toggleSkills() {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        var newExpanded = !isExpanded;
        btn.setAttribute('aria-expanded', newExpanded ? 'true' : 'false');
        target.hidden = !newExpanded;
        btn.textContent = newExpanded ? 'Show fewer skills' : '+6 skills';
        if (typeof playClick === 'function') playClick();
      }

      btn.addEventListener('click', toggleSkills);
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSkills();
        }
      });
    });
  }

  /* ===== Case Study Accordions ===== */
  function initCaseStudyAccordions() {
    document.querySelectorAll('.case-study-toggle').forEach(function (btn) {
      var controlsId = btn.getAttribute('aria-controls');
      var target = controlsId ? document.getElementById(controlsId) : null;
      if (!target) return;

      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        var newExpanded = !isExpanded;
        btn.setAttribute('aria-expanded', newExpanded ? 'true' : 'false');
        target.hidden = !newExpanded;
        if (typeof playClick === 'function') playClick();
      });
    });
  }

  /* ===== CSP Iframe Fallback Detector ===== */
  function initIframeFallbackDetector() {
    document.querySelectorAll('.browser-content--iframe iframe').forEach(function (iframe) {
      var shell = iframe.closest('.browser-content--iframe');
      if (!shell) return;

      iframe.addEventListener('error', function () {
        shell.classList.add('has-fallback');
      });

      if (iframe.src.indexOf('sporty-desk.pages.dev') !== -1) {
        setTimeout(function() {
          try {
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc || !doc.body || doc.body.innerHTML === '') {
              shell.classList.add('has-fallback');
            }
          } catch(e) {
            shell.classList.add('has-fallback');
          }
        }, 1000);
      }
    });
  }

  /* ===== Project Tab Switcher with Arrow Key Support ===== */
  function initProjectTabs() {
    var tabList = document.getElementById('project-tabs');
    if (!tabList) return;
    var tabs = Array.from(tabList.querySelectorAll('.project-tab'));
    var panels = document.querySelectorAll('.project-panel');

    function activateTab(index) {
      if (index < 0) index = tabs.length - 1;
      if (index >= tabs.length) index = 0;

      tabs.forEach(function (t, i) {
        if (i === index) {
          t.classList.add('active');
          t.setAttribute('aria-selected', 'true');
          t.focus();
        } else {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        }
      });

      var target = tabs[index].getAttribute('data-tab');
      panels.forEach(function (panel) {
        if (panel.id === 'panel-' + target) {
          panel.hidden = false;
          panel.classList.add('active');
        } else {
          panel.hidden = true;
          panel.classList.remove('active');
        }
      });
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        activateTab(idx);
      });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          activateTab(idx - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          activateTab(idx + 1);
        }
      });
    });
  }

  /* ===== Horizontal Project Showcase Carousel Controls & Keyboard Nav ===== */
  function initProjectCarousel() {
    var carousel = document.getElementById('project-carousel');
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');

    if (!carousel || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', function () {
      var cardWidth = carousel.querySelector('.carousel-card')?.offsetWidth || 400;
      carousel.scrollBy({ left: -cardWidth * 0.85, behavior: 'smooth' });
      if (typeof playClick === 'function') playClick();
    });

    nextBtn.addEventListener('click', function () {
      var cardWidth = carousel.querySelector('.carousel-card')?.offsetWidth || 400;
      carousel.scrollBy({ left: cardWidth * 0.85, behavior: 'smooth' });
      if (typeof playClick === 'function') playClick();
    });

    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn.click();
      }
    });
  }

  initProjectTabs();
  initEmailModal();
  initScreenshotLightbox();
  initSoundEffects();
  initProjectsSwapper();
  initProjectCarousel();
  initEmailCopy();
  initSkillExpander();
  initCaseStudyAccordions();
  initIframeFallbackDetector();

})();

