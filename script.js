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

  /* ===== Play: mini workflow builder ===== */
  (function initWorkflowBuilder() {
    var root = document.getElementById('workflow-builder');
    if (!root) return;
    var btn = document.getElementById('workflow-generate');
    var result = document.getElementById('workflow-result');
    var list = document.getElementById('workflow-result-steps');
    if (!btn || !result || !list) return;

    var labels = {
      trigger: {
        'member-joins': 'When a new member joins',
        'ticket-opens': 'When a support ticket opens',
        'partner-reply': 'When a partner replies'
      },
      action: {
        'auto-faq': 'send the auto-FAQ / onboarding message',
        'tag-role': 'assign the correct role or tag',
        'log-sheet': 'log the event to a sheet'
      },
      notify: {
        'mod-channel': 'notify the mods channel',
        'dm-user': 'DM the member with next steps',
        'escalate': 'escalate to a human for review'
      }
    };

    btn.addEventListener('click', function () {
      var tEl = root.querySelector('input[name="trigger"]:checked');
      var aEl = root.querySelector('input[name="action"]:checked');
      var nEl = root.querySelector('input[name="notify"]:checked');
      if (!tEl || !aEl || !nEl) return;
      var steps = [
        labels.trigger[tEl.value],
        'Then ' + labels.action[aEl.value],
        'Then ' + labels.notify[nEl.value]
      ];
      list.innerHTML = '';
      steps.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
      result.hidden = false;
    });
  })();

})();
