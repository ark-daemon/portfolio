# Portfolio Multi-Page Hybrid Redesign — Design Spec

**Date:** 2026-07-13  
**Site:** https://noah-carpiso.pages.dev/  
**Source:** `C:\ADULTING\portfolio\` (vanilla HTML/CSS/JS → Cloudflare Pages)  
**Status:** Approved in brainstorming (Approach A)

---

## 1. Goal

Rebuild Noah Carpiso’s portfolio from a single long page into a **multi-page, product-like site** that:

1. Positions him for **remote ops / community / coordination roles** *and* an **AI automation / systems-building** path (hybrid, equal weight).
2. Uses **bryl-minimal craft** (monochrome, type, sidebar, restraint) without **copying Bryl Lim’s product surface** (shop, blog, live chat, typing test, AI ask-anything).
3. Stays **static vanilla** HTML/CSS/JS, deployable to Cloudflare Pages with no build step.

**One-liner (hero / identity):**  
> I run remote community & partnership operations — and I build AI-assisted tools and automation so that work scales.

---

## 2. Audience & success

| Priority | Audience |
|----------|----------|
| Primary | Recruiters / hiring managers for remote ops, community, VA-adjacent, junior automation-adjacent roles |
| Secondary | Anyone evaluating side projects as proof of resourcefulness |

**Not optimizing for:** Pure customer-support “helpdesk portfolio” roles (most CS jobs don’t need a portfolio; over-indexing on ticket cosplay is the wrong bet).

**Success criteria (v1):**

- Hybrid story clear on Home in **&lt;30 seconds**
- Multi-page feels intentional (not empty stubs)
- Clearly **not** a Bryl clone
- Automation story **honest** (projects + learning n8n/Make; room for real workflows later)
- Still static deploy to Pages

---

## 3. Positioning

| Decision | Choice |
|----------|--------|
| Identity | **B — Remote ops + automation hybrid** |
| Automation volume on day one | **Equal weight** with ops (not pure automation brand, not ops-only) |
| Day-one automation proof | **D — Mix:** vibe-coded systems stand in for “automation mindset”; Stack shows n8n/Make as *Learning*; real workflow cards added later without blocking launch |
| Approach | **A — Split & restyle** (keep best content/widgets; split pages; finish monochrome craft; reposition copy) |

### Dial up / dial down

| Dial down | Dial up |
|-----------|---------|
| Customer service / helpdesk cosplay as the whole site | Ops, partnerships, coordination language |
| Ticket sim as hero | Systems built (Trading KB, Codex, scrapers, etc.) |
| Bryl gimmicks | Noah-unique Play (workflow thinking) |
| Fake “expert” automation claims | Honest learning path + shipped projects |

### Experience framing

Degen Homes and freelance community work stay, framed as **operations, partnerships, campaigns, coordination** — not “customer service specialist portfolio.” Interactive demos on Experience illustrate **process**, not that the site is a CS demo reel.

---

## 4. Site map

### In v1

| Page | File | Job |
|------|------|-----|
| Home | `index.html` | Identity, equal-weight proof row, teasers for Experience / Projects / Stack, inverted CTA |
| Experience | `experience.html` | Full timeline + ticket sim + partnership pipeline (process demos) |
| Projects | `projects.html` | Trading KB, Codex Manager, Esports platform, Falco / sports list |
| Stack | `stack.html` | Ops tools, productivity, AI-assisted building, automation (learning) |
| Setup | `setup.html` | Remote readiness checklist |
| Certifications | `certifications.html` | Honest in-progress cert cards |
| Play | `play.html` | 1 primary Noah-unique interactive (mini workflow builder) |

### Out of v1

- Shop, Blog, Consulting, Collabs pages  
- Live community chat  
- Generic typing test (Bryl clone risk)  
- AI “ask anything” with backend  
- Standalone long About page (short bio stays on Home only)  
- Live n8n backend integrations  

### Later (post-v1)

- Real n8n/Make workflow cards with screenshots/exports  
- Additional Play demos  
- Blog only if Noah actually writes  
- Photo polish if desired  

---

## 5. Visual system

Follow **bryl-minimal** craft rules applied to this project:

- **Palette:** Strict monochrome (background, ink, gray ramp). No blue/colored metric accents. Dark mode = token remap.
- **Type:** Geist (UI body) · Geist Mono (micro-labels, nav, tags) · Geist Pixel Square (sidebar name, page titles, big stats) · Source Serif 4 only if long-form appears later.
- **Layout:** Fixed left sidebar ≥1024px (~14rem); content column ~42–48rem; mobile sticky header + full-screen menu.
- **Components:** Hairline gray-200 borders; radii 16/12/8/6; soft low-alpha shadows; mono uppercase micro-labels.
- **Texture:** One fixed corner halftone/dot-grid with mask fade (not wallpaper).
- **Theme:** Light / dark / system (three icon buttons).
- **Motion:** Short entrance stagger, ~200ms micro-interactions, honor `prefers-reduced-motion`.

**Inspiration rule:** Steal craft and restraint from [bryllim.com](https://bryllim.com/); do **not** replicate his IA extras or signature toys.

---

## 6. Page designs

### 6.1 Shared shell

Every page:

- Sidebar identity: **Noah Carpiso** · subtitle **Remote Ops · Automation**
- Nav links to all seven destinations; **active** item marked
- Footer: Resume download · LinkedIn · Email · theme switch
- Mobile: same destinations in overlay menu
- Page title: Geist Pixel, lowercase (`experience`, `projects`, `play`, …)

**Vanilla constraint:** No build step → shell markup is duplicated per HTML file. Mitigate with shared class names in `styles.css` / `script.js` and an edit checklist when changing nav.

### 6.2 Home (`index.html`)

1. **Identity block** — optional photo or monogram; name; hybrid one-liner; LinkedIn / Email / Resume  
2. **Proof row (equal weight)** — hairline grid, e.g. members supported · partnerships · systems built · automation learning (not CS-only stats)  
3. **01 — Experience** teaser + “full history →”  
4. **02 — Projects** teaser (2–3 cards) + “all projects →”  
5. **03 — Stack** chip row + “view stack →”  
6. **CTA** — inverted panel (“Let’s work together”) with Email / LinkedIn  

Short about only; no essay.

### 6.3 Experience (`experience.html`)

- Timeline entries (Degen Homes; freelance multi-community)  
- Language: ops / partnerships / coordination  
- **Keep** support ticket simulator and partnership kanban as process demos  
- Tools lines under roles  

### 6.4 Projects (`projects.html`)

| Project | Treatment |
|---------|-----------|
| Trading Knowledge Base | Glossary widget + real screenshots from `screenshots/` |
| Codex Manager | Finished; two-tone line-art icon if no screenshot |
| Esports Data Platform | Scrapers done / dashboard WIP; line-art or screenshots |
| Falco, sports models | Compact “also working on” list |

Card pattern: problem · what it does · contribution (AI-assisted building, product direction, testing).  
This page carries much of the **automation equal weight** until n8n demos exist.

### 6.5 Stack (`stack.html`)

Groups:

- Community & ops tools  
- Productivity / communication  
- AI-assisted building  
- **Automation (Learning)** — n8n, Make, etc. with clear Learning tags  

No fake expertise badges.

### 6.6 Setup (`setup.html`)

Remote hire checklist: connection (+ backup), dual monitors, machine specs, typing WPM, timezone flexibility. Quiet and factual.

### 6.7 Certifications (`certifications.html`)

Keep category cards (Service & Support, Marketing, Productivity, Automation). **IN PROGRESS** until verified; Verify links only when real.

### 6.8 Play (`play.html`)

| | Spec |
|---|------|
| **Primary (v1)** | **Mini workflow builder** — client-side only: pick trigger → action → notify (e.g. New member joins → Auto-FAQ → Escalate to human). Proves automation *thinking* without live n8n. |
| **Optional secondary** | Partnership pipeline sandbox *or* light ops judgment — only if primary is solid; must not turn Play into a CS arcade |
| **Never v1** | Live community chat · AI ask-anything backend · generic typing test |

Do not put Play in the nav as a dead link; ship the primary demo with the page.

---

## 7. Content inheritance

Reuse and reframe existing assets from the current single-page site:

- Proof metrics, about copy (shortened/reframed), experience bullets  
- Ticket simulator, partnership pipeline, glossary widget, automation flow idea  
- Certifications block, setup/remote readiness, closing CTA pattern  
- Resume PDF, Trading KB screenshots  

**Supersedes as primary instruction set:** earlier step checklist in `C:\ADULTING\portfolio-redesign-claude-code.md` is largely **already implemented** as widgets; this spec is the **next** plan (multi-page hybrid rebuild), not a redo of that checklist from zero.

---

## 8. Implementation order

1. **Shared shell + monochrome polish** — tokens, sidebar, theme, type roles  
2. **Split into multi-page** — move sections; Home becomes teasers  
3. **Reposition copy** — hybrid one-liner, ops language, equal-weight metrics  
4. **Projects polish** — wire screenshots; SVG icons where needed  
5. **Play v1** — mini workflow builder  
6. **QA + deploy** — mobile, theme, internal links, Pages  

### Explicit non-goals for this implementation cycle

- Framework migration (Astro/Next)  
- Backend, auth, live multiplayer chat  
- Copying Bryl feature set  
- Fabricating n8n workflow screenshots  

---

## 9. Technical constraints

| Item | Choice |
|------|--------|
| Stack | Multi-page vanilla HTML + `styles.css` + `script.js` |
| Hosting | Cloudflare Pages (`noah-carpiso.pages.dev`) |
| Build | None required |
| Interactivity | Client-side only (existing widgets + Play workflow builder) |

---

## 10. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Duplicated shell HTML drifts | Shared CSS/JS; nav edit checklist; visual pass all pages |
| Empty Play | Ship demo with page or omit until ready |
| CS positioning drift | Ticket sim secondary on Experience; hybrid hero on Home |
| Scope creep | Hard v1 exclusions list (§4 Out of v1) |
| Dishonest automation claims | Learning tags; projects as systems proof; no fake expert copy |

---

## 11. Open items for implementation (resolved enough to build)

| Item | Decision |
|------|----------|
| Photo on Home | Optional monogram if no photo preferred |
| Proof row exact four stats | Final numbers/labels at copy pass; must mix ops + systems/learning |
| Play secondary demo | Defer unless primary is done early |
| n8n public demos | Post-v1 when real |

---

## 12. Approval record

Brainstorming decisions locked with user:

- Audience: mostly job-first, projects as proof  
- Scope: multi-page bigger rebuild  
- Pages: Home, Experience, Projects, Setup, Stack, Certs, Play  
- Positioning: hybrid ops + automation  
- Automation weight: equal  
- Day-one automation proof: mix (D)  
- Tech: vanilla multi-page  
- Approach: Split & restyle (A)  
- Design sections §1–§4: approved  

---

*Next step after user reviews this file: writing-plans skill → implementation plan at `docs/superpowers/plans/`.*
