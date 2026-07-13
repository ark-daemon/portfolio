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

  /* ===== Support Triage Flow Diagram — Capabilities section ===== */
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
      '3': { index: '03', text: 'Member confirms the issue persists or asks a follow-up — ticket escalates automatically.' },
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

  /* ===== Partnership Kanban Board — drag-and-drop (HTML5 drag API) ===== */
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

  /* ===== Sidebar overlays: FAQ + Typing (Bryl-style utilities) ===== */
  (function initOverlays() {
    var WORD_BANK = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
      'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
      'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
      'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
      'support', 'remote', 'discord', 'community', 'partner', 'campaign', 'process',
      'ticket', 'queue', 'member', 'channel', 'template', 'ops', 'timezone'
    ];

    function pickWords(n) {
      var out = [];
      for (var i = 0; i < n; i++) {
        out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
      }
      return out.join(' ');
    }

    var root = document.getElementById('site-overlays');
    if (!root) {
      root = document.createElement('div');
      root.id = 'site-overlays';
      root.innerHTML =
        '<div class="overlay" id="overlay-faq" role="dialog" aria-modal="true" aria-labelledby="faq-title" hidden>' +
          '<div class="overlay-shell">' +
            '<button type="button" class="overlay-close" data-close-overlay>esc close</button>' +
            '<div class="overlay-panel">' +
              '<h2 class="overlay-title" id="faq-title">what do you want to know?</h2>' +
              '<p class="overlay-sub">Quick answers — no chatbot required.</p>' +
              '<div class="faq-list">' +
                '<div class="faq-item"><button type="button" class="faq-q">What roles are you open to?</button>' +
                '<div class="faq-a">Remote community support/ops, partnership coordination, virtual assistance, and junior automation / systems roles. Happy where ops experience and tool-building both matter.</div></div>' +
                '<div class="faq-item"><button type="button" class="faq-q">What timezone / hours?</button>' +
                '<div class="faq-a">Based in Metro Manila (PHT). Flexible schedule and open to international time zones and night shifts when needed.</div></div>' +
                '<div class="faq-item"><button type="button" class="faq-q">Web3 only, or general support/ops?</button>' +
                '<div class="faq-a">Web3 experience is deep (Discord/Telegram/allowlists/partnerships), but the same ops muscle applies to any remote community or support team.</div></div>' +
                '<div class="faq-item"><button type="button" class="faq-q">Can you build tools?</button>' +
                '<div class="faq-a">Yes — independently shipped a trading knowledge base, account utilities, screener demos, and more. Studying n8n/Make to automate ops patterns I used to run by hand.</div></div>' +
                '<div class="faq-item"><button type="button" class="faq-q">How do I reach you?</button>' +
                '<div class="faq-a">Email carpisonoah@gmail.com · LinkedIn · resume download in the sidebar.</div></div>' +
              '</div>' +
              '<p class="faq-footer">Still stuck? <a href="mailto:carpisonoah@gmail.com">Email me</a> · <a href="play.html">Play games ↗</a></p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="overlay" id="overlay-typing" role="dialog" aria-modal="true" aria-labelledby="typing-title" hidden>' +
          '<div class="overlay-shell">' +
            '<button type="button" class="overlay-close" data-close-overlay>esc close</button>' +
            '<div class="overlay-panel">' +
              '<h2 class="overlay-title" id="typing-title">typing test</h2>' +
              '<p class="overlay-sub">Client-side only. Click the text and type.</p>' +
              '<div class="typing-stats">' +
                '<div class="typing-stat"><span class="typing-stat-value" id="typing-wpm">0</span><span class="typing-stat-label">wpm</span></div>' +
                '<div class="typing-stat"><span class="typing-stat-value" id="typing-acc">100</span><span class="typing-stat-label">acc %</span></div>' +
                '<div class="typing-stat"><span class="typing-stat-value" id="typing-time">0</span><span class="typing-stat-label">time s</span></div>' +
              '</div>' +
              '<div class="typing-prompt" id="typing-prompt" tabindex="0"></div>' +
              '<input class="typing-input" id="typing-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Type here">' +
              '<div class="typing-actions">' +
                '<button type="button" class="btn btn-secondary" id="typing-restart">Restart</button>' +
                '<button type="button" class="btn btn-secondary" data-close-overlay>Close</button>' +
              '</div>' +
              '<p class="typing-hint">tab restart · esc close</p>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(root);
    }

    var faq = document.getElementById('overlay-faq');
    var typing = document.getElementById('overlay-typing');
    var promptEl = document.getElementById('typing-prompt');
    var inputEl = document.getElementById('typing-input');
    var wpmEl = document.getElementById('typing-wpm');
    var accEl = document.getElementById('typing-acc');
    var timeEl = document.getElementById('typing-time');
    var target = '';
    var startedAt = null;
    var timer = null;
    var done = false;

    function openOverlay(id) {
      var el = id === 'faq' ? faq : typing;
      if (!el) return;
      el.hidden = false;
      requestAnimationFrame(function () { el.classList.add('is-open'); });
      document.body.classList.add('overlay-open');
      if (id === 'typing') {
        resetTyping();
        setTimeout(function () { if (inputEl) inputEl.focus(); }, 50);
      }
    }

    function closeOverlays() {
      [faq, typing].forEach(function (el) {
        if (!el) return;
        el.classList.remove('is-open');
        el.hidden = true;
      });
      document.body.classList.remove('overlay-open');
      if (timer) { clearInterval(timer); timer = null; }
    }

    function resetTyping() {
      target = pickWords(28);
      startedAt = null;
      done = false;
      if (inputEl) inputEl.value = '';
      if (wpmEl) wpmEl.textContent = '0';
      if (accEl) accEl.textContent = '100';
      if (timeEl) timeEl.textContent = '0';
      if (timer) { clearInterval(timer); timer = null; }
      renderPrompt('');
    }

    function renderPrompt(typed) {
      if (!promptEl) return;
      var html = '';
      for (var i = 0; i < target.length; i++) {
        var ch = target[i];
        if (i < typed.length) {
          if (typed[i] === ch) html += '<span class="typed">' + escapeHtml(ch) + '</span>';
          else html += '<span class="wrong">' + escapeHtml(ch === ' ' ? '·' : ch) + '</span>';
        } else if (i === typed.length) {
          html += '<span class="caret"></span><span>' + escapeHtml(ch) + '</span>';
        } else {
          html += escapeHtml(ch);
        }
      }
      if (typed.length >= target.length) html += '<span class="caret"></span>';
      promptEl.innerHTML = html;
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function updateStats(typed) {
      var correct = 0;
      for (var i = 0; i < typed.length && i < target.length; i++) {
        if (typed[i] === target[i]) correct++;
      }
      var acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
      if (accEl) accEl.textContent = String(acc);
      if (!startedAt) return;
      var secs = (Date.now() - startedAt) / 1000;
      if (timeEl) timeEl.textContent = String(Math.floor(secs));
      var wpm = secs > 0 ? Math.round((correct / 5) / (secs / 60)) : 0;
      if (wpmEl) wpmEl.textContent = String(Math.max(0, wpm));
    }

    if (promptEl) {
      promptEl.addEventListener('click', function () {
        if (inputEl) inputEl.focus();
      });
    }
    if (inputEl) {
      inputEl.addEventListener('input', function () {
        if (done) return;
        var typed = inputEl.value;
        if (!startedAt && typed.length) {
          startedAt = Date.now();
          timer = setInterval(function () {
            if (!startedAt) return;
            var secs = Math.floor((Date.now() - startedAt) / 1000);
            if (timeEl) timeEl.textContent = String(secs);
            updateStats(inputEl.value);
          }, 250);
        }
        renderPrompt(typed);
        updateStats(typed);
        if (typed.length >= target.length) {
          done = true;
          if (timer) { clearInterval(timer); timer = null; }
          updateStats(typed);
        }
      });
    }
    var restart = document.getElementById('typing-restart');
    if (restart) {
      restart.addEventListener('click', function () {
        resetTyping();
        if (inputEl) inputEl.focus();
      });
    }

    document.addEventListener('click', function (e) {
      var openBtn = e.target.closest('[data-open-overlay]');
      if (openBtn) {
        e.preventDefault();
        openOverlay(openBtn.getAttribute('data-open-overlay'));
        return;
      }
      if (e.target.closest('[data-close-overlay]')) {
        closeOverlays();
        return;
      }
      if (e.target.classList && e.target.classList.contains('overlay')) {
        closeOverlays();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (document.body.classList.contains('overlay-open')) {
          closeOverlays();
          e.preventDefault();
        }
        return;
      }
      if (e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        openOverlay('faq');
      }
      if (e.altKey && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        openOverlay('typing');
      }
      if (e.key === 'Tab' && typing && typing.classList.contains('is-open')) {
        e.preventDefault();
        resetTyping();
        if (inputEl) inputEl.focus();
      }
    });

    root.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        if (!item) return;
        var open = item.classList.contains('is-open');
        root.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('is-open'); });
        if (!open) item.classList.add('is-open');
      });
    });
  })();

  /* ===== Play hub: Queue Clear · Falco Pulse · Monitor Snake ===== */
  (function initPlayGames() {
    var picker = document.getElementById('game-picker');
    var stage = document.getElementById('game-stage');
    if (!picker || !stage) return;

    var titleEl = document.getElementById('game-stage-title');
    var scoreEl = document.getElementById('game-score');
    var bestEl = document.getElementById('game-best');
    var endEl = document.getElementById('game-end');
    var panels = {
      queue: document.getElementById('panel-queue'),
      falco: document.getElementById('panel-falco'),
      snake: document.getElementById('panel-snake')
    };
    var titles = {
      queue: 'Queue Clear',
      falco: 'Falco Pulse',
      snake: 'Monitor Snake'
    };
    var active = null;
    var score = 0;
    var stopFns = [];

    function bestKey(g) { return 'noah-play-best-' + g; }
    function loadBest(g) {
      try { return parseInt(localStorage.getItem(bestKey(g)) || '0', 10) || 0; }
      catch (e) { return 0; }
    }
    function saveBest(g, n) {
      var b = loadBest(g);
      if (n > b) {
        try { localStorage.setItem(bestKey(g), String(n)); } catch (e) {}
        b = n;
      }
      if (bestEl) bestEl.textContent = String(b);
      return b;
    }
    function setScore(n) {
      score = n;
      if (scoreEl) scoreEl.textContent = String(score);
    }
    function stopAll() {
      stopFns.forEach(function (fn) { try { fn(); } catch (e) {} });
      stopFns = [];
    }
    function showEnd(msg) {
      if (!endEl) return;
      endEl.hidden = false;
      endEl.textContent = msg;
      saveBest(active, score);
    }
    function openGame(g) {
      stopAll();
      active = g;
      setScore(0);
      if (endEl) { endEl.hidden = true; endEl.textContent = ''; }
      picker.hidden = true;
      stage.hidden = false;
      Object.keys(panels).forEach(function (k) {
        if (panels[k]) panels[k].hidden = k !== g;
      });
      if (titleEl) titleEl.textContent = titles[g] || g;
      if (bestEl) bestEl.textContent = String(loadBest(g));
      if (g === 'queue') initQueue();
      if (g === 'falco') initFalco();
      if (g === 'snake') initSnake();
    }
    function backToPicker() {
      stopAll();
      active = null;
      stage.hidden = true;
      picker.hidden = false;
    }

    document.getElementById('game-back').addEventListener('click', backToPicker);
    picker.querySelectorAll('[data-game]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openGame(btn.getAttribute('data-game'));
      });
    });

    /* ----- A: Queue Clear ----- */
    var TICKETS = [
      { t: 'Allowlist still pending. Did my wallet go through?', a: 'resolve', ch: 'DM' },
      { t: 'Someone posted a fake mint link in #general', a: 'ban', ch: '#general' },
      { t: 'Partner said 10 spots but list only has 8 names', a: 'escalate', ch: 'Partners' },
      { t: 'How do I join the next giveaway?', a: 'resolve', ch: '#support' },
      { t: 'DM me for free WL I swear not a scam', a: 'ban', ch: 'DM' },
      { t: 'Role not showing after verification bot', a: 'resolve', ch: '#verify' },
      { t: 'Legal threat if we do not pay allocation', a: 'escalate', ch: 'DM' },
      { t: 'Is the official Twitter this one? [random link]', a: 'ban', ch: '#general' },
      { t: 'Can you re-run the raffle I missed it', a: 'resolve', ch: 'DM' },
      { t: 'Collab manager needs signed deal PDF', a: 'escalate', ch: 'Telegram' },
      { t: 'Bot is down, cannot claim role', a: 'escalate', ch: '#support' },
      { t: 'Free nitro if you enter seed phrase here', a: 'ban', ch: 'DM' }
    ];
    var qRun = false;
    var qTicket = null;
    var qTimer = null;
    var qLeft = 0;

    function initQueue() {
      var start = document.getElementById('queue-start');
      var text = document.getElementById('queue-text');
      var meta = document.getElementById('queue-meta');
      var fb = document.getElementById('queue-feedback');
      qRun = false;
      qTicket = null;
      if (text) text.textContent = 'Press Start run.';
      if (meta) meta.textContent = '#000 · —';
      if (fb) fb.textContent = '';
      if (start) start.hidden = false;

      function nextTicket() {
        qTicket = TICKETS[Math.floor(Math.random() * TICKETS.length)];
        if (meta) meta.textContent = '#' + (100 + Math.floor(Math.random() * 800)) + ' · ' + qTicket.ch;
        if (text) text.textContent = qTicket.t;
        if (fb) fb.textContent = qLeft + 's left';
      }
      function answer(act) {
        if (!qRun || !qTicket) return;
        if (act === qTicket.a) {
          setScore(score + 100);
          if (fb) fb.textContent = 'Correct · +100 · ' + qLeft + 's';
        } else {
          setScore(Math.max(0, score - 40));
          if (fb) fb.textContent = 'Wrong (needed ' + qTicket.a + ') · ' + qLeft + 's';
        }
        nextTicket();
      }
      function endRun() {
        qRun = false;
        if (qTimer) { clearInterval(qTimer); qTimer = null; }
        if (start) start.hidden = false;
        showEnd('Queue done. Score ' + score + '. Best ' + saveBest('queue', score) + '.');
      }
      function startRun() {
        stopAll();
        setScore(0);
        if (endEl) endEl.hidden = true;
        qRun = true;
        qLeft = 45;
        if (start) start.hidden = true;
        nextTicket();
        qTimer = setInterval(function () {
          qLeft -= 1;
          if (fb && qTicket) fb.textContent = qLeft + 's left';
          if (qLeft <= 0) endRun();
        }, 1000);
        stopFns.push(function () {
          qRun = false;
          if (qTimer) { clearInterval(qTimer); qTimer = null; }
        });
      }
      if (start) {
        start.onclick = startRun;
      }
      stage.querySelectorAll('[data-queue-act]').forEach(function (btn) {
        btn.onclick = function () { answer(btn.getAttribute('data-queue-act')); };
      });
      function onKey(e) {
        if (active !== 'queue' || !qRun) return;
        if (e.key === '1') answer('resolve');
        if (e.key === '2') answer('escalate');
        if (e.key === '3') answer('ban');
      }
      document.addEventListener('keydown', onKey);
      stopFns.push(function () { document.removeEventListener('keydown', onKey); });
    }

    /* ----- B: Falco Pulse ----- */
    function initFalco() {
      var arena = document.getElementById('falco-arena');
      var blip = document.getElementById('falco-blip');
      var label = document.getElementById('falco-label');
      var start = document.getElementById('falco-start');
      var run = false;
      var timer = null;
      var spawn = null;
      var left = 0;
      var kind = null; // green | red | null
      var armUntil = 0;

      function clearBlip() {
        kind = null;
        if (blip) {
          blip.className = 'falco-blip';
          blip.style.left = '50%';
          blip.style.top = '50%';
        }
      }
      function spawnBlip() {
        if (!run || !blip) return;
        kind = Math.random() < 0.62 ? 'green' : 'red';
        blip.className = 'falco-blip is-' + kind + ' is-on';
        blip.style.left = (12 + Math.random() * 76) + '%';
        blip.style.top = (18 + Math.random() * 64) + '%';
        armUntil = Date.now() + (kind === 'green' ? 750 : 900);
        setTimeout(function () {
          if (!run) return;
          if (kind === 'green' && blip.classList.contains('is-on')) {
            // missed green
            setScore(Math.max(0, score - 25));
            if (label) label.textContent = 'Missed green · ' + left + 's';
          }
          clearBlip();
        }, kind === 'green' ? 780 : 920);
      }
      function hit() {
        if (!run || !kind || !blip || !blip.classList.contains('is-on')) return;
        if (Date.now() > armUntil + 50) return;
        if (kind === 'green') {
          setScore(score + 80);
          if (label) label.textContent = 'Hit · +80 · ' + left + 's';
        } else {
          setScore(Math.max(0, score - 50));
          if (label) label.textContent = 'Red! · ' + left + 's';
        }
        clearBlip();
      }
      function endRun() {
        run = false;
        if (timer) { clearInterval(timer); timer = null; }
        if (spawn) { clearInterval(spawn); spawn = null; }
        clearBlip();
        if (start) start.hidden = false;
        if (label) label.textContent = 'Run over';
        showEnd('Falco done. Score ' + score + '. Best ' + saveBest('falco', score) + '.');
      }
      function startRun() {
        stopAll();
        setScore(0);
        if (endEl) endEl.hidden = true;
        run = true;
        left = 30;
        if (start) start.hidden = true;
        if (label) label.textContent = '30s · green only';
        if (arena) arena.focus();
        spawnBlip();
        spawn = setInterval(spawnBlip, 1100);
        timer = setInterval(function () {
          left -= 1;
          if (label && kind === null) label.textContent = left + 's';
          if (left <= 0) endRun();
        }, 1000);
        stopFns.push(function () {
          run = false;
          if (timer) clearInterval(timer);
          if (spawn) clearInterval(spawn);
          timer = spawn = null;
          clearBlip();
        });
      }
      if (start) start.onclick = startRun;
      if (arena) {
        arena.onclick = hit;
        arena.onkeydown = function (e) {
          if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            hit();
          }
        };
      }
    }

    /* ----- C: Monitor Snake ----- */
    function initSnake() {
      var canvas = document.getElementById('snake-canvas');
      var start = document.getElementById('snake-start');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var cell = 20;
      var cols = 18;
      var rows = 18;
      var snake, dir, nextDir, food, loop, alive;

      function randFood() {
        var p;
        do {
          p = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        } while (snake.some(function (s) { return s.x === p.x && s.y === p.y; }));
        return p;
      }
      function draw() {
        var w = canvas.width;
        var h = canvas.height;
        // dual-monitor frame
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e9e9e9';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, w / 2 - 4, h - 2);
        ctx.strokeRect(w / 2 + 3, 1, w / 2 - 4, h - 2);
        // grid dots subtle
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-3').trim() || '#a3a3a3';
        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols; x++) {
            ctx.globalAlpha = 0.15;
            ctx.fillRect(x * cell + 9, y * cell + 9, 2, 2);
          }
        }
        ctx.globalAlpha = 1;
        // food
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#0a0a0a';
        ctx.fillRect(food.x * cell + 4, food.y * cell + 4, cell - 8, cell - 8);
        // snake
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
          showEnd('Snake over. Score ' + score + '. Best ' + saveBest('snake', score) + '.');
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
        if (active !== 'snake' || !alive) return;
        var k = e.key.toLowerCase();
        if ((k === 'arrowup' || k === 'w') && dir.y !== 1) nextDir = { x: 0, y: -1 };
        if ((k === 'arrowdown' || k === 's') && dir.y !== -1) nextDir = { x: 0, y: 1 };
        if ((k === 'arrowleft' || k === 'a') && dir.x !== 1) nextDir = { x: -1, y: 0 };
        if ((k === 'arrowright' || k === 'd') && dir.x !== -1) nextDir = { x: 1, y: 0 };
      }
      function startGame() {
        stopAll();
        setScore(0);
        if (endEl) endEl.hidden = true;
        snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
        dir = { x: 1, y: 0 };
        nextDir = dir;
        food = randFood();
        alive = true;
        draw();
        loop = setInterval(step, 110);
        document.addEventListener('keydown', onKey);
        stopFns.push(function () {
          alive = false;
          if (loop) clearInterval(loop);
          loop = null;
          document.removeEventListener('keydown', onKey);
        });
      }
      if (start) start.onclick = startGame;
      // idle board
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      food = { x: 12, y: 9 };
      dir = { x: 1, y: 0 };
      nextDir = dir;
      alive = false;
      draw();
    }
  })();

})();
