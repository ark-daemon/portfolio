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

  /* ===== Partnership Kanban Board  -  drag-and-drop (HTML5 drag API) ===== */
  function initKanbanBoard() {
    var board = document.getElementById('kanban-board');
    if (!board) return;

    var draggedCard = null;
    var dropLine    = null; /* the 2px insertion indicator */

    /* --- helpers --- */
    function createDropLine() {
      var line = document.createElement('div');
      line.className = 'kanban-drop-line';
      return line;
    }

    function removeDropLine() {
      if (dropLine && dropLine.parentNode) dropLine.parentNode.removeChild(dropLine);
      dropLine = null;
    }

    /* Returns the card that the cursor is above, or null (= append to end) */
    function getInsertBefore(zone, clientY) {
      var cards = Array.from(zone.querySelectorAll('.kanban-card:not(.is-dragging)'));
      var closest = null;
      var closestOffset = Infinity;
      cards.forEach(function (card) {
        var rect   = card.getBoundingClientRect();
        var offset = clientY - (rect.top + rect.height / 2);
        if (offset < 0 && Math.abs(offset) < closestOffset) {
          closestOffset = Math.abs(offset);
          closest       = card;
        }
      });
      return closest;
    }

    function updateColCounts() {
      board.querySelectorAll('.kanban-col').forEach(function (col) {
        var count = col.querySelector('.kanban-col-count');
        if (count) count.textContent = col.querySelectorAll('.kanban-card').length;
      });
    }

    /* --- wire cards (event delegation would re-bind on drop; direct is simpler here) --- */
    function wireCard(card) {
      card.addEventListener('dragstart', function (e) {
        draggedCard = card;
        e.dataTransfer.effectAllowed = 'move';
        /* Delay the visual change so the drag ghost renders first */
        setTimeout(function () { card.classList.add('is-dragging'); }, 0);
      });

      card.addEventListener('dragend', function () {
        card.classList.remove('is-dragging');
        removeDropLine();
        board.querySelectorAll('.kanban-cards').forEach(function (z) {
          z.classList.remove('drag-over');
        });
        draggedCard = null;
      });
    }

    board.querySelectorAll('.kanban-card').forEach(wireCard);

    /* --- wire drop zones --- */
    board.querySelectorAll('.kanban-cards').forEach(function (zone) {

      zone.addEventListener('dragover', function (e) {
        if (!draggedCard) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');

        /* Position the drop-line cursor */
        removeDropLine();
        dropLine = createDropLine();
        var before = getInsertBefore(zone, e.clientY);
        if (before) {
          zone.insertBefore(dropLine, before);
        } else {
          zone.appendChild(dropLine);
        }
      });

      zone.addEventListener('dragleave', function (e) {
        /* Only clear if truly leaving the zone (not entering a child) */
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('drag-over');
          removeDropLine();
        }
      });

      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        if (!draggedCard) return;

        var before = getInsertBefore(zone, e.clientY);
        removeDropLine();
        zone.classList.remove('drag-over');

        if (before) {
          zone.insertBefore(draggedCard, before);
        } else {
          zone.appendChild(draggedCard);
        }

        updateColCounts();
      });
    });
  }

  initKanbanBoard();

  /* ===== Support Ticket Simulator  -  Experience section ===== */
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
          /* Expand  -  two-frame trick: remove hidden → rAF → add .open */
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
  }

  initGlossaryWidget();


  /* ===== Snake: full-screen ===== */
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
    var snake, dir, nextDir, food, loop, alive, score;

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
      ctx.fillRect(food.x * cell + 4, food.y * cell + 4, cell - 8, cell - 8);
      snake.forEach(function (s, i) {
        ctx.globalAlpha = i === 0 ? 1 : 0.75;
        ctx.fillRect(s.x * cell + 2, s.y * cell + 2, cell - 4, cell - 4);
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
      if (k === 'Escape') {
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
      loop = setInterval(step, 110);
    }

    document.addEventListener('keydown', onKey);
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

})();
