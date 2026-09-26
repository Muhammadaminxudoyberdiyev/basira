# frontend.md — Basira One Landing Page

Project-specific companion to `SKILL.md` (Next.js Senior Frontend Engineering Standard). Everything here is specific to _this_ page; the universal rules (shadcn-first, state split, forms, code quality) still apply unchanged from `SKILL.md`.

---

## 0. Brief, restated

One page. No login, no dashboard. A visitor lands, understands what Basira One does (AI Content / AI System / Digital Build / AI Tafakkur), trusts it, and submits the audit form. The form is proxied server-side to a partner-built CRM API (Python, built by another developer) — this page does not store leads itself.

Audience: business owners in Uzbekistan looking for growth through content, AI systems, or a website — practical people, not early-adopter tech enthusiasts. The design has to read as **competent and calm**, not "startup hype." The brand's own words for this: _"Texnologiya orqali qulaylik. Tizim orqali xotirjamlik."_ — that's the feeling the page should give before a single word is read.

---

## 1. Design tokens

### Color

Avoiding the two most common AI-generated defaults (warm cream + terracotta; near-black + neon accent). This page instead uses a cool paper background with a single warm signal-amber accent — the amber reads as an indicator light on a control panel, which ties directly to the "conveyor/pipeline" idea in the process section.

| Token          | Hex       | Role                                                                              |
| -------------- | --------- | --------------------------------------------------------------------------------- |
| `--paper`      | `#F6F5F1` | Page background (light sections)                                                  |
| `--ink`        | `#12141B` | Body text, dark section background (hero, footer)                                 |
| `--ink-muted`  | `#6B6E76` | Secondary text, captions                                                          |
| `--line`       | `#DEDBD2` | Borders, dividers, the resting state of the process line                          |
| `--signal`     | `#E1A33E` | Accent — CTA, active step, links, the one "alive" color on the page               |
| `--signal-ink` | `#8A5A16` | Accent text-on-light (e.g. a link on `--paper`) — same hue, darkened for contrast |

Four engines each get a small identifying dot/label color, muted enough to stay secondary to `--signal`:

- AI Content — `#7C8B6F` (muted sage)
- AI System — `#5B6FA8` (muted indigo)
- Digital Build — `#9C6B4F` (muted clay)
- AI Tafakkur — `#6E8FA0` (muted teal-grey)

These four are for small tags/icons only — never full section backgrounds, never competing with `--signal`.

### Typography

- **Display / headings:** Space Grotesk — geometric, confident, slightly technical without being a monospace cliché
- **Body:** IBM Plex Sans — humanist, built for technical/engineering content, reads calm at length

Two families, clearly distinct roles, nothing else. Scale (base 16px, ~1.25 ratio):
`12 / 14 / 16 / 20 / 25 / 31 / 39 / 49px`. Headline weight 600, body weight 400, body line-height 1.6. Line length capped around 68–72 characters in body copy blocks.

No all-caps labels, no single-word-in-color inside headlines, no tracked-out eyebrow tags above every section — the brief's content itself (the 4 engines, the process, the numbers) is structure enough.

### Layout concept

Left-aligned, asymmetric grid — not centered/stacked-card default. Content sits in a 12-column grid with a consistent left margin that lines up across sections (hero headline, process line, form — all share the same left edge), so the page reads as one continuous "track" rather than disconnected blocks. This mirrors the brand's own pipeline diagram.

```
┌───────────────────────────────────────────┐
│ [logo]                          [Audit →]  │  ← thin sticky header, paper bg
├───────────────────────────────────────────┤
│  HERO                                      │
│  Big left-aligned headline (ink, dark bg)  │
│  One line of support copy + CTA            │
├───────────────────────────────────────────┤
│  4 ENGINES                                 │
│  4 asymmetric cards, not identical grid —  │
│  Content/AI System wider, Build/Tafakkur   │
│  narrower — avoids the "SaaS card kit" tell│
├───────────────────────────────────────────┤
│  PROCESS  (the signature moment — §2)      │
│  Left: vertical line + 6 steps             │
│  Right: sticky note describing active step │
├───────────────────────────────────────────┤
│  CASE STUDIES (KANS, Keto)                 │
│  Two wide rows, number + 1-line result     │
├───────────────────────────────────────────┤
│  PRICING  — 3 "starting from" lines,       │
│  text-first, not boxed pricing cards       │
├───────────────────────────────────────────┤
│  FORM  (same left margin as hero)          │
├───────────────────────────────────────────┤
│  FOOTER — dark (ink), contact + AI Tafakkur│
└───────────────────────────────────────────┘
```

### Principles

1. One signature motion moment (the process line, §2) — everything else stays quiet.
2. Same left edge across every section — the page feels like one track, not stacked blocks.
3. Amber (`--signal`) appears only where something is actionable or alive (links, CTA, the active step) — never decorative.
4. No numbered `01 / 02 / 03` markers anywhere _except_ the process section, because that's the one place content is genuinely sequential.

---

## 2. The signature moment — scroll-linked process line

This is exactly the effect you described: a line running down the side that "grows" as you scroll, with steps lighting up as they're reached. It becomes the page's one memorable interaction, so nothing else competes with it.

**Behavior:**

- A thin vertical line (`--line` color) runs down the left side of the 6-step process (Brief → Spec → Dev → QA → Client Test → Deploy)
- As the user scrolls through this section, the line fills from top to bottom with `--signal`, tracking scroll position within the section (not tied to time — purely scroll-driven)
- Each step's dot switches from `--line` to `--signal` and its label switches from `--ink-muted` to `--ink` the moment the fill passes it — a clear "reached" state, not a fade
- No step re-animates on scroll-up/scroll-down flicker — state is a simple threshold per step, not a spring that overshoots

**Implementation approach:** track scroll progress of the section container (`IntersectionObserver` per step for the "reached" boundary, or a single scroll listener reading the container's position — either is fine, avoid a heavy scroll-animation library for one effect). Respect `prefers-reduced-motion`: if set, render all steps as already "reached" (fully lit line, no scroll-tied animation) rather than skipping the section's meaning.

**Everywhere else, motion stays minimal:** a 150ms opacity/color transition on hover for links and the CTA button, nothing else. No fade-slide-up entrance on the engine cards, no stagger animation on the case-study numbers — per the brief, scattered per-section entrance animation is the generic tell to avoid.

---

## 3. Section-by-section content

### Hero (dark, `--ink` background)

- Headline (left-aligned, large): **"Biznesingiz uchun texnologiya — his qilinmaydigan, faqat natija beradigan."**
- Support line: **"Content, AI tizimlar va sifatli veb-yechimlar — bittasi emas, barchasi bitta tizim ichida."**
- CTA button: **"Bepul maslahat olish"** (oq, qora matn bilan — dark hero'dagi yagona yorqin element)

### 4 Engines

Each card: name, one-sentence "nima muammoni hal qiladi", small colored tag (see palette above), "Batafsil" as a plain text link with an arrow, not a button.

- **AI Content** — "Ijtimoiy tarmoqlar va kontentni tizimli boshqarish — tasodifiy post emas, oylik reja bilan."
- **AI System** — "Mijozlar bilan muloqotni, savol-javobni avtomatlashtiruvchi AI tizimlar."
- **Digital Build** — "Sayt va dasturlar — aniq texnik topshiriq asosida, boshidan oxirigacha nazorat bilan."
- **AI Tafakkur** — "AI va dasturlashni o'rgatuvchi ta'lim yo'nalishi — amaliy, guruh shaklida."

### Process (the animated section, §2)

Steps: Brief → Texnik reja → Ishlab chiqish → Sifat tekshiruvi → Mijoz tasdig'i → Joylashtirish. Each with one short line, not a paragraph — the line itself should carry the meaning, no filler.

### Case studies

KANS Shop and Keto Shop, each as a wide row: one real number (leave a placeholder marked `[raqam]` until the client supplies it) + one sentence of context. No stock photography, no generic "team celebrating" imagery — if an image is used, it should be an actual screenshot or product shot from the case study itself.

### Pricing

Plain text lines, not three boxed "pricing cards" (avoids the SaaS-card tell): _"Content — oyiga $800 dan. Sayt/dastur — $1,500 dan. AI tizim — $2,000 dan."_ One line under it: _"Aniq narx — maslahatdan keyin."_

### Form

Fields: ism, telefon, qaysi xizmat qiziqtiradi (select), qisqa izoh (optional). Submits to a Next.js Route Handler (`app/api/leads/route.ts`), which server-side forwards to the partner's CRM API — the CRM's API key/URL never reaches the browser (see §5).

### Footer (dark, `--ink`)

Contact info, social links, a distinctly separate line for AI Tafakkur (different audience — a student, not a business owner) so it doesn't get lost among the agency's business contact info.

---

## 4. Package list — trimmed for this page

Starting from the universal `SKILL.md` list, removed everything this page has no use for:

**Removed:** `@tanstack/react-table` (no tables), `recharts` (no charts — case-study numbers are static text, not graphs), `@dnd-kit/core` (no drag-and-drop anywhere on a landing page), `next-themes` (single fixed light/dark split by section, not a user-toggled theme).

**Kept, with reasoning specific to this page:**

```
next, react, react-dom, typescript
shadcn/ui (+ radix-ui)
tailwindcss
lucide-react
react-hook-form, zod, @hookform/resolvers   — the audit form
motion                                       — the one signature moment (§2) + button hover
sonner                                       — "So'rovingiz yuborildi" confirmation toast after submit
eslint, prettier, husky, lint-staged
clsx, class-variance-authority, tailwind-merge
```

**On axios — your instinct is right, but scoped:** this page makes exactly one outbound request (the form submit), and it happens **server-side**, inside the Route Handler, not from the browser. A single server-side call doesn't need a full centralized axios instance with interceptors (that pattern from `SKILL.md` §6 is for a page making many client-side calls). Plain `fetch` inside `app/api/leads/route.ts` is enough here — one function, one call, no client library needed. If the page later grows a second server-side integration (e.g. also emailing a copy), axios becomes worth adding; not yet.

**`@tanstack/react-query` — also left out**, for the same reason §6 gives in `SKILL.md`: there's no client-side data that needs refetching or caching on this page — no logged-in state, no live table. It stays in the universal standard for when a CRM/dashboard is eventually built, but has no job here.

---

## 5. The one backend piece: the Route Handler

`app/api/leads/route.ts` — the only server code on this page.

- Receives the validated form payload (validation already happened client-side via zod, re-validate here too — never trust the client alone)
- Forwards it to the CRM's endpoint (URL + API key read from environment variables, never exposed to the browser)
- Returns a simple success/failure status to the form, which triggers the `sonner` confirmation toast or an inline error

This is the exact contract that needs to be agreed with the CRM developer before building: the request shape (fields, JSON keys) and the CRM API's own auth method (header token, etc.). Worth locking that down together before this handler is written, so it isn't built twice.
