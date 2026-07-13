# Portfolio Multi-Page Hybrid Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single-page portfolio into a multi-page hybrid site (remote ops + AI automation), monochrome craft, no Bryl clones, static vanilla deploy to Cloudflare Pages.

**Architecture:** Shared `styles.css` + `script.js` across seven HTML pages. Shell (sidebar, mobile nav, theme) is duplicated per page with identical class names; active nav is path-based. Home becomes teasers; full sections move to dedicated pages. Play ships a client-side mini workflow builder.

**Tech Stack:** Vanilla HTML/CSS/JS, Cloudflare Pages, existing widgets (ticket sim, kanban, glossary).

**Spec:** `docs/superpowers/specs/2026-07-13-portfolio-multipage-hybrid-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `index.html` | Home only: identity, proof row, teasers, CTA |
| `experience.html` | Timeline + ticket sim + partnership kanban |
| `projects.html` | All project cards + glossary widget |
| `stack.html` | Capabilities → Stack (ops + AI + automation learning) |
| `setup.html` | Remote readiness |
| `certifications.html` | Cert cards |
| `play.html` | Mini workflow builder |
| `styles.css` | Tokens, shell, all components, Play UI |
| `script.js` | Theme, mobile menu, scroll/active nav, widgets, Play logic |
| `screenshots/*` | Existing Trading KB images to wire |

**Do not create:** shop, blog, chat, typing test, AI ask-anything.

---

## Shell contract (use on every page)

### Sidebar nav (desktop)

```html
<nav class="sidebar-nav" aria-label="Site">
  <a href="index.html" class="nav-item" data-nav="home">Home</a>
  <a href="experience.html" class="nav-item" data-nav="experience">Experience</a>
  <a href="projects.html" class="nav-item" data-nav="projects">Projects</a>
  <a href="stack.html" class="nav-item" data-nav="stack">Stack</a>
  <a href="setup.html" class="nav-item" data-nav="setup">Setup</a>
  <a href="certifications.html" class="nav-item" data-nav="certifications">Certifications</a>
  <a href="play.html" class="nav-item" data-nav="play">Play</a>
</nav>
```

### Identity (every page)

```html
<h2 class="sidebar-name">Noah Carpiso</h2>
<p class="sidebar-role">Remote Ops · Automation</p>
```

### Mobile nav

Mirror the same seven links with `class="mobile-nav-item"` and matching `href`s.

### Active page

On each page, add `aria-current="page"` and class `active` to the matching nav item (desktop + mobile). Also set `document.body` `data-page` for script:

```html
<body data-page="home">
<!-- experience | projects | stack | setup | certifications | play -->
```

### Page title pattern (inner pages)

```html
<header class="page-header">
  <h1 class="page-title">experience</h1>
  <p class="page-lede">One sentence describing this page.</p>
</header>
```

---

### Task 1: Path-based active nav + body data-page in script

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Replace scroll-spy section active logic for multi-page**

Find the block that highlights `.nav-item` based on scroll/`#` hashes (search for `nav-item` / `IntersectionObserver` / `hash`). Keep mobile menu + theme. Add path-based activation:

```javascript
  /* ===== Active nav by page ===== */
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
```

- [ ] **Step 2: Guard scroll-spy so it only runs when `#` section nav exists**

```javascript
  var sectionNav = document.querySelectorAll('.nav-item[href^="#"]');
  if (sectionNav.length) {
    // existing intersection / scroll spy code stays here
  }
```

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: path-based active nav for multi-page shell"
```

---

### Task 2: Shell CSS — page title, active nav, monochrome proof row polish

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Ensure active nav styles**

```css
.nav-item.active,
.mobile-nav-item.active {
  color: var(--ink);
  font-weight: 500;
}
.nav-item.active::before,
.sidebar-nav .nav-item.active {
  /* if design already uses a leading arrow/marker, keep it; else: */
}
```

If a leading arrow already exists for “current section”, reuse that pattern for `.active`.

- [ ] **Step 2: Add page header + pixel page title**

```css
.page-header {
  margin-bottom: 2.5rem;
}
.page-title {
  font-family: "Geist Pixel Square", "Geist Mono", monospace;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: lowercase;
  color: var(--ink);
  margin: 0 0 0.75rem;
}
.page-lede {
  font-size: 0.9375rem;
  color: var(--gray-500);
  max-width: 36rem;
  margin: 0;
  line-height: 1.6;
}
```

- [ ] **Step 3: Proof/metrics hairline grid (no colored boxes)**

Ensure `.metrics` uses dividers not filled blue cards:

```css
.metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
}
@media (min-width: 640px) {
  .metrics { grid-template-columns: repeat(4, 1fr); }
}
.metric {
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  background: transparent;
  box-shadow: none;
}
.metric-value {
  font-family: "Geist Pixel Square", "Geist Mono", monospace;
  color: var(--ink); /* not accent blue */
}
```

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "style: page titles, active nav, monochrome metrics grid"
```

---

### Task 3: Create `experience.html` from current Experience section

**Files:**
- Create: `experience.html`
- Reference: `index.html` (copy shell + `#experience` body)

- [ ] **Step 1: Duplicate `index.html` → `experience.html`**

```bash
cp index.html experience.html
```

(Windows: `Copy-Item index.html experience.html`)

- [ ] **Step 2: Set document meta + body**

In `experience.html` `<head>`:

- `title`: `Experience | Noah Carpiso`
- `meta description`: ops/partnerships focused (not “customer support portfolio”)

```html
<body data-page="experience">
```

- [ ] **Step 3: Replace sidebar + mobile nav** with the Shell contract seven links; mark Experience `active` + `aria-current="page"`.

Update role text:

```html
<p class="sidebar-role">Remote Ops · Automation</p>
```

- [ ] **Step 4: Replace `<main>` content** with page header + **only** the experience timeline block (including ticket-sim and partnership kanban) moved from `index.html` `#experience`.

Remove hero, proof, about, projects, capabilities, certs, setup, education, contact from this file.

Page header:

```html
<header class="page-header">
  <h1 class="page-title">experience</h1>
  <p class="page-lede">Community and partnership operations — how campaigns, support queues, and collabs actually ran.</p>
</header>
```

- [ ] **Step 5: Reframe job titles/copy lightly** if they say “Customer Support” as the primary identity — prefer “Community & Partnerships Ops” / “Community Operations” while keeping factual bullets.

- [ ] **Step 6: Verify widgets**

Open `experience.html` in browser:

- Ticket expand/collapse works  
- Kanban drag works  
- Theme + mobile menu work  

- [ ] **Step 7: Commit**

```bash
git add experience.html
git commit -m "feat: add experience page with process demos"
```

---

### Task 4: Create `projects.html`

**Files:**
- Create: `projects.html`
- Modify: wire screenshots

- [ ] **Step 1: Copy shell from `experience.html` → `projects.html`**

```bash
# Windows PowerShell
Copy-Item experience.html projects.html
```

- [ ] **Step 2: Set `data-page="projects"`, title `Projects | Noah Carpiso`, active nav Projects**

- [ ] **Step 3: Main content = full `#projects` section from `index.html`** including glossary widget and all project cards.

Page header:

```html
<header class="page-header">
  <h1 class="page-title">projects</h1>
  <p class="page-lede">Systems I planned and assembled with AI-assisted tools — product direction, research, and testing.</p>
</header>
```

- [ ] **Step 4: Wire Trading KB screenshots**

Replace the Trading Knowledge Base `.screenshot-placeholder` (if still a placeholder in the full project card area) with:

```html
<div class="project-screenshots">
  <img src="screenshots/trading-kb-1.png" alt="Trading Knowledge Base library view" width="800" height="500" loading="lazy">
  <img src="screenshots/trading-kb-2.png" alt="Trading Knowledge Base curriculum" width="800" height="500" loading="lazy">
</div>
```

Add CSS if missing:

```css
.project-screenshots {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.project-screenshots img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--gray-200);
}
```

Use 1–2 images in the card; keep 3–4 available if a small gallery fits.

- [ ] **Step 5: Codex + Esports icons**

If placeholders remain, replace with inline SVG monochrome icons (account-switch motif; grid/network motif). Keep ink/background only.

- [ ] **Step 6: Browser check** — glossary search filters terms; images load.

- [ ] **Step 7: Commit**

```bash
git add projects.html styles.css
git commit -m "feat: add projects page with screenshots and glossary"
```

---

### Task 5: Create `stack.html` (from Capabilities)

**Files:**
- Create: `stack.html`

- [ ] **Step 1: Copy shell → `stack.html`, `data-page="stack"`**

- [ ] **Step 2: Move `#capabilities` content; rename framing to Stack**

Page header:

```html
<header class="page-header">
  <h1 class="page-title">stack</h1>
  <p class="page-lede">Tools for community ops, AI-assisted building, and automation I’m learning in public.</p>
</header>
```

- [ ] **Step 3: Restructure groups** (HTML):

1. Community & ops  
2. Productivity & communication  
3. AI-assisted building  
4. **Automation (Learning)** — n8n, Make.com with muted tag:

```html
<span class="tag tag-muted">Learning</span>
```

- [ ] **Step 4: Keep triage/automation flow diagram** if present under technical resourcefulness — it supports the automation story. Place under AI-assisted building or Automation group.

- [ ] **Step 5: Commit**

```bash
git add stack.html
git commit -m "feat: add stack page with honest automation learning tags"
```

---

### Task 6: Create `setup.html` and `certifications.html`

**Files:**
- Create: `setup.html`, `certifications.html`

- [ ] **Step 1: `setup.html`** — shell + `#setup` content from index

```html
<body data-page="setup">
...
<header class="page-header">
  <h1 class="page-title">setup</h1>
  <p class="page-lede">Remote work readiness — connection, hardware, and availability.</p>
</header>
```

Include education block at bottom of setup **or** omit education from v1 multi-page (spec does not require a dedicated education page). Prefer a small Education subsection at the end of Setup so Mapúa leave status remains visible.

- [ ] **Step 2: `certifications.html`** — shell + `#certifications` content

```html
<body data-page="certifications">
...
<header class="page-header">
  <h1 class="page-title">certifications</h1>
  <p class="page-lede">In progress — verify links appear when credentials are complete.</p>
</header>
```

Keep IN PROGRESS tags; no fake Verify links.

- [ ] **Step 3: Commit**

```bash
git add setup.html certifications.html
git commit -m "feat: add setup and certifications pages"
```

---

### Task 7: Rebuild `index.html` as Home (teasers only)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update head meta**

```html
<title>Noah Carpiso | Remote Ops · Automation</title>
<meta name="description" content="Remote community and partnership operations, plus AI-assisted tools and automation. Based in Metro Manila, available worldwide.">
```

Update OG title/description to match hybrid positioning.  
JSON-LD `jobTitle`: `Remote Ops & Automation`

- [ ] **Step 2: `data-page="home"` + full multi-page shell nav**

- [ ] **Step 3: Replace hero with hybrid identity**

```html
<section id="hero" class="hero">
  <p class="hero-eyebrow">Based in Metro Manila · available worldwide</p>
  <h1 class="hero-heading">Remote ops and AI-assisted systems that keep communities and work moving.</h1>
  <p class="hero-body">I run community and partnership operations — and I build tools and automation so that work scales. Looking for remote ops, community, or automation-adjacent roles.</p>
  <div class="hero-actions">
    <a href="mailto:carpisonoah@gmail.com" class="btn btn-primary">Email me</a>
    <a href="Noah-David-Carpiso-Resume.pdf" download class="btn btn-secondary">Download resume</a>
  </div>
  <div class="hero-links">
    <a href="https://www.linkedin.com/in/noah-carpiso" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
    <span aria-hidden="true">·</span>
    <a href="projects.html">View projects</a>
    <span aria-hidden="true">·</span>
    <a href="play.html">Play</a>
  </div>
  <div class="hero-status">
    <span class="status-dot" aria-hidden="true"></span>
    Available for remote work
  </div>
</section>
```

- [ ] **Step 4: Equal-weight proof metrics**

```html
<section id="proof" class="section">
  <div class="section-label">
    <span class="section-number">01</span>
    <span class="section-dash">—</span>
    <span>Proof</span>
  </div>
  <div class="metrics">
    <div class="metric">
      <span class="metric-value">500+</span>
      <span class="metric-label">community members supported</span>
    </div>
    <div class="metric">
      <span class="metric-value">100+</span>
      <span class="metric-label">partnerships coordinated</span>
    </div>
    <div class="metric">
      <span class="metric-value">6</span>
      <span class="metric-label">systems &amp; tools built</span>
    </div>
    <div class="metric">
      <span class="metric-value">n8n</span>
      <span class="metric-label">automation — learning</span>
    </div>
  </div>
  <p class="trust-statement">Ops experience you can verify in Experience · systems you can open in Projects · automation path on Stack.</p>
</section>
```

- [ ] **Step 5: Short about (keep 1–2 paragraphs, hybrid end line)**

End with looking for remote ops / community / automation-adjacent roles — not only “support role.”

- [ ] **Step 6: Experience teaser**

One role summary (Degen Homes) + link:

```html
<a href="experience.html" class="text-link">Full history →</a>
```

Do **not** embed full ticket sim / kanban on Home.

- [ ] **Step 7: Projects teaser**

2–3 cards (Trading KB, Codex, Esports) condensed + `projects.html` link.

- [ ] **Step 8: Stack chip teaser**

```html
<div class="stack-chips">
  <span class="tag">Discord</span>
  <span class="tag">n8n <em>learning</em></span>
  <span class="tag">Make <em>learning</em></span>
  <span class="tag">AI-assisted building</span>
  <!-- more -->
</div>
<a href="stack.html" class="text-link">View stack →</a>
```

- [ ] **Step 9: Keep inverted CTA + contact block**

Point buttons to email/LinkedIn/resume. Remove dependency on long single-page anchors that no longer exist.

- [ ] **Step 10: Delete full experience/projects/capabilities/certs/setup/education sections from Home** (content now on other pages).

- [ ] **Step 11: Open `index.html` — confirm no broken `#` nav; all sidebar links hit real pages.**

- [ ] **Step 12: Commit**

```bash
git add index.html
git commit -m "feat: rebuild home as hybrid multi-page hub"
```

---

### Task 8: Play page — mini workflow builder

**Files:**
- Create: `play.html`
- Modify: `styles.css`, `script.js`

- [ ] **Step 1: Create `play.html` shell** (`data-page="play"`)

```html
<header class="page-header">
  <h1 class="page-title">play</h1>
  <p class="page-lede">Build a tiny automation path — the same thinking behind n8n-style workflows, client-side only.</p>
</header>

<section class="workflow-builder" id="workflow-builder" aria-label="Mini workflow builder">
  <p class="workflow-hint">Pick one option in each column. Then generate the flow.</p>

  <div class="workflow-columns">
    <div class="workflow-col" data-step="trigger">
      <h2 class="workflow-col-title">01 — Trigger</h2>
      <label class="workflow-option"><input type="radio" name="trigger" value="member-joins" checked> New member joins</label>
      <label class="workflow-option"><input type="radio" name="trigger" value="ticket-opens"> Support ticket opens</label>
      <label class="workflow-option"><input type="radio" name="trigger" value="partner-reply"> Partner replies</label>
    </div>
    <div class="workflow-col" data-step="action">
      <h2 class="workflow-col-title">02 — Action</h2>
      <label class="workflow-option"><input type="radio" name="action" value="auto-faq" checked> Send auto-FAQ</label>
      <label class="workflow-option"><input type="radio" name="action" value="tag-role"> Assign role / tag</label>
      <label class="workflow-option"><input type="radio" name="action" value="log-sheet"> Log to sheet</label>
    </div>
    <div class="workflow-col" data-step="notify">
      <h2 class="workflow-col-title">03 — Notify</h2>
      <label class="workflow-option"><input type="radio" name="notify" value="mod-channel" checked> Alert mods channel</label>
      <label class="workflow-option"><input type="radio" name="notify" value="dm-user"> DM the member</label>
      <label class="workflow-option"><input type="radio" name="notify" value="escalate"> Escalate to human</label>
    </div>
  </div>

  <button type="button" class="btn btn-primary" id="workflow-generate">Generate flow</button>

  <div class="workflow-result" id="workflow-result" hidden>
    <p class="workflow-result-label">Your flow</p>
    <ol class="workflow-result-steps" id="workflow-result-steps"></ol>
    <p class="workflow-result-note">This is a thinking demo — not a live n8n run. Real workflows will land on Stack/Projects when ready.</p>
  </div>
</section>
```

- [ ] **Step 2: CSS for workflow builder**

```css
.workflow-builder { margin-top: 1rem; }
.workflow-hint { color: var(--gray-500); font-size: 0.875rem; margin-bottom: 1.25rem; }
.workflow-columns {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 900px) {
  .workflow-columns { grid-template-columns: repeat(3, 1fr); }
}
.workflow-col {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 1rem;
  background: var(--gray-50, transparent);
}
.workflow-col-title {
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-400);
  margin: 0 0 0.75rem;
  font-weight: 500;
}
.workflow-option {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: var(--ink);
}
.workflow-result {
  margin-top: 1.5rem;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 1.25rem;
}
.workflow-result-label {
  font-family: "Geist Mono", monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-400);
}
.workflow-result-steps {
  margin: 0.75rem 0;
  padding-left: 1.25rem;
  line-height: 1.6;
}
.workflow-result-note {
  font-size: 0.8125rem;
  color: var(--gray-500);
  margin: 0;
}
```

- [ ] **Step 3: JS generate handler in `script.js`**

```javascript
  /* ===== Play: mini workflow builder ===== */
  (function initWorkflowBuilder() {
    var root = document.getElementById('workflow-builder');
    if (!root) return;
    var btn = document.getElementById('workflow-generate');
    var result = document.getElementById('workflow-result');
    var list = document.getElementById('workflow-result-steps');
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
      var t = root.querySelector('input[name="trigger"]:checked').value;
      var a = root.querySelector('input[name="action"]:checked').value;
      var n = root.querySelector('input[name="notify"]:checked').value;
      list.innerHTML = '';
      [labels.trigger[t], 'Then ' + labels.action[a], 'Then ' + labels.notify[n]].forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
      result.hidden = false;
    });
  })();
```

- [ ] **Step 4: Manual test**

- Change selections → Generate → ordered list updates  
- Works in light/dark  
- No console errors  

- [ ] **Step 5: Commit**

```bash
git add play.html styles.css script.js
git commit -m "feat: add play page mini workflow builder"
```

---

### Task 9: Cross-page QA + link audit

**Files:** all HTML pages

- [ ] **Step 1: Link checklist**

From every page:

| Link | Expected |
|------|----------|
| Home | `index.html` |
| Experience | `experience.html` |
| Projects | `projects.html` |
| Stack | `stack.html` |
| Setup | `setup.html` |
| Certifications | `certifications.html` |
| Play | `play.html` |
| Resume PDF | downloads |
| LinkedIn | external |
| Email | `mailto:carpisonoah@gmail.com` |

- [ ] **Step 2: Remove dead `#proof` / `#contact` etc. from any remaining shell**

- [ ] **Step 3: Mobile**

- Menu opens/closes  
- Nav routes correctly  
- Workflow columns stack  

- [ ] **Step 4: Theme**

- System / light / dark persist across page navigations (localStorage)

- [ ] **Step 5: Content tone pass**

Search for over-CS phrases on Home (`customer support specialist` as sole identity). Prefer hybrid ops + automation wording per spec.

- [ ] **Step 6: Commit fixes if any**

```bash
git add -u
git commit -m "fix: cross-page links, nav, and hybrid copy pass"
```

---

### Task 10: Local preview + deploy notes

- [ ] **Step 1: Serve locally**

```bash
# from portfolio/
npx --yes serve -l 5500
# or: python -m http.server 5500
```

Open `http://localhost:5500` and click every nav item.

- [ ] **Step 2: Deploy**

Push to the repo connected to Cloudflare Pages (only when user asks to push):

```bash
git push origin main
```

Confirm https://noah-carpiso.pages.dev/ shows multi-page nav.

- [ ] **Step 3: Final commit if deploy config needed** (usually none for static).

---

## Shell edit checklist (ongoing)

When changing nav, update **all seven** HTML files:

1. `index.html`  
2. `experience.html`  
3. `projects.html`  
4. `stack.html`  
5. `setup.html`  
6. `certifications.html`  
7. `play.html`  

Desktop sidebar + mobile menu both.

---

## Self-review vs spec

| Spec requirement | Task |
|------------------|------|
| Multi-page IA (7 pages) | Tasks 3–8 |
| Hybrid equal-weight Home | Task 7 |
| Experience process demos | Task 3 |
| Projects + screenshots | Task 4 |
| Stack learning tags | Task 5 |
| Setup + certs | Task 6 |
| Play workflow builder | Task 8 |
| Vanilla no build | Entire plan |
| No Bryl clones | Task 8 exclusions; no chat/typing/ask AI tasks |
| Monochrome craft | Task 2 |
| Path-based nav | Task 1 |

**Placeholder scan:** No TBD steps. Play secondary demos intentionally omitted (post-v1).

---

## Out of scope (do not implement in this plan)

- Astro/Next migration  
- Live n8n embeds  
- Community chat, typing test, AI ask-anything  
- Shop/blog/consulting pages  
- Fabricated automation screenshots  
