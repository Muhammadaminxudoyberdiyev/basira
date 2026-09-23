# Next.js Senior Frontend Engineering Standard (SKILL.md)

**This document is PROJECT-INDEPENDENT, a universal template.** It applies unchanged to any new Next.js project. Project-specific names/screens are NOT in this file — they belong in a separate project-specific document (`frontend.md`).

**Strict rule:** All features in the project must follow this standard. Exceptions are only introduced when explicitly approved by the project lead — never silently. No other UI library (e.g. Material UI, Ant Design) or state manager (e.g. Redux) is ever added without explicit approval.

**Charts and Drag & Drop are no longer part of the base standard** (removed — see the note at the end of this file). Add them back as an explicit, project-specific decision in that project's `frontend.md` if a dashboard/kanban module genuinely needs them.

---

## 0. THE MOST IMPORTANT RULE — Before creating any component

**Never hand-write a plain `<button>`, `<select>`, `<table>`, or `<input>` if an equivalent already exists in shadcn/ui.**

Whenever a UI element is needed, the process is:

1. First — check whether shadcn/ui already has it (`npx shadcn@latest add {component}`)
2. If it exists — use **only that**, never a hand-rolled or raw HTML version
3. If shadcn doesn't have it (a genuinely project-specific, complex widget) — only then write a new component, built on Radix primitives and Tailwind, following shadcn's conventions (`cn()`, `cva`)

**Enforcement rule:** Before every PR/commit, check the codebase for hand-written `<button>`, `<input>`, `<table>`, `<select>` tags — these are almost always mistakes and should be replaced with `Button`, `Input`, `Table`, `Select` (shadcn).

---

## 1. CORE SETUP

- **Next.js (App Router) + TypeScript** — the standard starting point; Pages Router is never used on new projects
- File extensions: components — `.tsx`, plain functions/types — `.ts`
- **Server Components by default.** A file only gets `"use client"` when it genuinely needs interactivity, browser APIs, hooks, or a context provider — not by default, not "just in case"
- Each component lives in its own folder if it has related sub-parts (hook, type): `components/LessonCard/index.tsx`, `components/LessonCard/useLessonCard.ts`
- Route segments follow Next's App Router conventions: `app/(marketing)/page.tsx`, `app/products/[slug]/page.tsx`, `loading.tsx`/`error.tsx`/`not-found.tsx` are used per-segment instead of hand-rolled loading/error state where a route boundary is the natural fit

---

## 2. STATE MANAGEMENT — the clear split (the most commonly confused area)

**This is the most important rule here — never violated:**

| Type of data                                           | Tool used                                                                                                 | Example                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Any data coming from the server** (via API)          | **TanStack Query** (client-fetched) or a direct `fetch` in a Server Component — never copied into Zustand | User profile, lesson list, progress                              |
| **UI-only, transient state**                           | **Zustand**                                                                                               | Sidebar open/closed, selected tab, modal visibility, wizard step |
| **State scoped to one component, needed nowhere else** | **`useState`**                                                                                            | A form field's transient value, hover state                      |

**Strict rule:** Server-fetched data is **never** copied into Zustand (not even "for caching") — this creates a two-source-of-truth sync problem. TanStack Query already manages its own cache; this is never reimplemented.

**Server Component vs. TanStack Query:** if data is needed only for the initial render of a page and doesn't need client-side refetching/mutation, fetch it directly in the Server Component (`page.tsx`) and pass it down as props — don't reach for TanStack Query by default. TanStack Query is for data that needs client-side caching, background refetch, or mutation (cart totals refreshing after checkout, admin tables, infinite scroll).

**E-commerce exception, explicitly scoped:** the cart is the one case where Zustand legitimately holds data that _looks_ server-like (product id, qty, price snapshot) — see §18. This is not a general license to put server data in Zustand elsewhere.

---

## 3. SERVER STATE — TanStack Query conventions

- Used for **client-side** data needs only (see §2 for the Server Component vs. Query decision)
- One hook per resource: `useUser()`, `useLessons()`, `useLessonById(id)` — in `hooks/queries/`
- Query keys as consistent arrays: `['lessons', levelId]`, `['user', 'me']`
- Mutations (`useMutation`) invalidate the relevant query via `invalidateQueries` on success — state is never updated manually
- Errors — a global `onError` (at the QueryClient level) plus component-level handling where needed
- `QueryClientProvider` lives in a single `"use client"` wrapper (`providers/query-provider.tsx`), mounted once near the root layout

---

## 4. GLOBAL STATE — Zustand conventions

- Each "store" has one clear responsibility: `useUIStore` (sidebar, modal), `useAuthStore` (token, current user ID — **client state only**, not the user's actual data)
- Stores live in `stores/`, one file each
- A store **never** makes an API call directly — that's TanStack Query's job (or a Server Action, per §7a)
- Any component reading a Zustand store must be a Client Component (`"use client"`) — Zustand cannot be read from Server Components

---

## 5. FORMS

- **react-hook-form + zod** — always used together. Each form has its own `schema.ts` (zod validation schema)
- shadcn's **Form** component (`useFormField`, `FormField`) is the standard for every form — no hand-written `<form>`
- Error messages appear below the input, via shadcn's `FormMessage`
- Form submission goes through a **Server Action** where the mutation is simple and doesn't need optimistic UI or client cache invalidation (§7a); it goes through a TanStack Query mutation calling an API route/external API when the flow needs client-side state (loading spinners tied to a store, optimistic updates, retry logic)

---

## 6. API LAYER

- **Axios** — one centralized instance: `lib/api.ts`, with `baseURL` and headers configured there, used for client-side calls (inside TanStack Query hooks) and for calls made from Server Components/Route Handlers to an external backend
- **Interceptor** — automatically attaches the token to every request (if present); on a 401 response — automatic logout/token refresh
- Each endpoint has its own function (`getLessons()`, `getLessonById()` in `api/lessons.ts`) — components never call `axios.get()` directly; these functions are called from within TanStack Query hooks or Server Components
- On a page with only a single, server-side outbound call (no client-side data fetching at all), a bare `fetch` inside the Route Handler is enough and the centralized instance can be skipped — document that exception in the project's `frontend.md` when it applies, since it's a deviation from the default

## 7a. SERVER ACTIONS & ROUTE HANDLERS

- **Server Actions** (`"use server"`) are the default for form mutations that don't need client-side cache management: contact forms, simple create/update flows, anything where a redirect or `revalidatePath`/`revalidateTag` after success is enough
- **Route Handlers** (`app/api/.../route.ts`) are used when the frontend needs a real HTTP endpoint — webhooks (payment providers, §21), or when a third-party client-side SDK needs to call back into the app, or when the page needs to proxy a request server-side to an external partner API without exposing its credentials to the browser
- Server Actions live in `actions/`, one file per resource (`actions/order.ts`), never inlined ad hoc inside a component file for anything beyond a trivial one-off

---

## 7. ROUTING

- **App Router file-based routing** — route structure is defined by the `app/` folder itself; there is no separate central route config file the way `react-router-dom` would need
- Protected pages — via **middleware** (`middleware.ts`) checking auth (cookie/session), redirecting unauthenticated requests before the page even renders — not a client-side `ProtectedRoute` wrapper
- Route-level code splitting is automatic per route segment; `next/dynamic` is used only for genuinely heavy client-only widgets that shouldn't be in the initial bundle

---

## 8. STYLING

- **Tailwind CSS v4** — all styling goes through this; a separate `.css` file is only for global variables (color, font)
- **`cn()` utility** (clsx + tailwind-merge) — always used for conditional classes; classes are never manually concatenated with template strings
- **`class-variance-authority` (cva)** — used whenever a component has multiple visual variants (e.g. Button's `primary`/`secondary`/`danger`)

---

## 9. ICONS

- **lucide-react only**. No other icon library or hand-placed SVG (unless a genuinely unique, project-specific icon is needed)

---

## 10. TABLES

- **TanStack Table (headless) + shadcn Table (presentation)** — used together. Any complex table (sort, filter, pagination) uses this combination — no other table library is added. Skip this dependency entirely on projects with no table UI (document that in the project's `frontend.md`)

---

## 11. ANIMATION

- **motion (Framer Motion)** — only in **meaningful** places: state transitions (modal open/close), list item add/remove, success animations, one signature scroll-driven moment where the brief calls for it. Animation is **not** added to every minor hover/transition, and not scattered as a fade-slide-up entrance on every section — that's excessive, reads as generic, and slows things down

---

## 12. NOTIFICATIONS

- **sonner** — all toasts/notifications go through this; no other method (e.g. `alert()`) is ever used

---

## 13. DATE/TIME

- **date-fns** — all date formatting/calculation goes through this; no manual `Date` method arithmetic

---

## 14. THEME

- **next-themes** — the standard for Light/Dark mode switching, **when the project actually has a user-toggled theme**. A page with a fixed, designed-per-section light/dark split (e.g. a dark hero and footer with light body sections) is a design decision, not a theme toggle — don't add next-themes just because dark colors appear somewhere; only add it when the visitor can switch modes themselves

---

## 15. IMAGES

- **`next/image`** for every image — no raw `<img>` tags. Remote product/CMS images are registered under `images.remotePatterns` in `next.config`
- Priority images above the fold (hero, first product image) get `priority`; everything else lazy-loads by default

---

## 16. CODE QUALITY

- **eslint + prettier** — run automatically before every commit (via **husky + lint-staged**)
- Code with formatting/lint errors is never committed (the pre-commit hook blocks it)

---

## 17. Folder structure (standard)

```
app/
  (routes)/       — route segments (page.tsx, layout.tsx, loading.tsx, error.tsx)
  api/            — Route Handlers (webhooks, external callbacks, server-side proxies)
actions/          — Server Actions, one file per resource
api/              — axios functions for client-side calls, organized by endpoint
components/       — reusable UI components
components/ui/    — shadcn/ui components (auto-generated, never hand-edited)
hooks/
  queries/        — TanStack Query hooks
stores/           — Zustand stores
providers/        — client providers (QueryClientProvider, ThemeProvider, etc.)
lib/              — utility functions (cn, api instance)
types/            — shared TypeScript types
middleware.ts     — auth/route protection
```

---

# E-COMMERCE MODULE ADDITIONS (single-vendor store)

Everything below is **additive** — sections 0–17 above still apply unchanged. These sections only exist to remove ambiguity for the store-specific parts that a generic app doesn't have. This block should not be copied into non-e-commerce projects.

## 18. CART STATE

- **Zustand + `persist` middleware**, `useCartStore` — one file, `stores/cart.ts`, always accessed from Client Components
- Store shape: array of line items `{ productId, variantId?, name, price, image, qty }` — a **snapshot** of price/name at add-time, not a live server reference
- Cart is **guest-first**: works with no auth, persisted to `localStorage` via `persist`
- On login, a one-time **merge step** runs (a Server Action or Route Handler call): local cart items are sent to the server, server returns the merged cart, Zustand store is overwritten with the merged result — never a manual item-by-item diff in the frontend
- Derived values (subtotal, item count) are computed via a selector inside the store, not recalculated ad hoc in components
- The cart store **never** calls the API directly for stock/price validation — that check happens server-side at checkout (§20); the store is a UI-convenience copy, not the source of truth for the final order
- The cart icon/count in the header is a Client Component reading the store — the rest of the header (logo, nav links) stays a Server Component

## 19. PRODUCT CATALOG

- Product list/detail pages are **Server Components by default**: fetched directly in `page.tsx` via `fetch`/the backend API, so the first paint is server-rendered with real data and is crawlable/SEO-friendly — this matters for a storefront in a way it doesn't for an internal dashboard
- Client-side refetching (e.g. "load more", live filter updates without full navigation) uses TanStack Query on top of an initial server-fetched page, or `useInfiniteQuery` for the catalog grid
- Filters (category, price range, sort, in-stock) live in the **URL search params** — read via `useSearchParams` in Client Components, or `searchParams` prop directly in Server Component pages — not in a Zustand store; this keeps filtered views shareable/bookmarkable, SSR-able, and avoids a second source of truth
- Pagination: **infinite scroll** via TanStack Query's `useInfiniteQuery` for the main catalog grid (progressive enhancement on top of a server-rendered first page); classic paged `Table` (§10 combo) only in admin/back-office product management screens
- Product image galleries — shadcn's `Carousel` (Embla-based, already a shadcn dependency) — no separate carousel library is added
- Product detail pages use `generateMetadata` for per-product SEO (title, description, OG image) and, where the catalog is largely static, `generateStaticParams` + ISR (`revalidate`) instead of fully dynamic rendering on every request

## 20. CHECKOUT FLOW

- Multi-step checkout (address → delivery → payment → review) is a Client Component tree under a single route; step index and per-step draft data live in a `useCheckoutStore` (Zustand, **not persisted** — checkout state resets on refresh for security/consistency, unlike the cart)
- Each step is its own `react-hook-form` + zod schema (§5); moving to the next step validates only that step's schema
- The order itself is created via a **Server Action** (`actions/order.ts`) fired at final confirmation — never multiple partial API calls per step
- Final price/stock is **always re-verified server-side** on order creation; the frontend cart snapshot (§18) is treated as intent, not fact
- On success: `useCartStore` is cleared, user is redirected (`redirect()` from the Server Action, or `router.push` from the client) to an order-confirmation route keyed by order ID (never by relying on in-memory state alone, in case of refresh)

## 21. PAYMENT INTEGRATION

- Local providers (e.g. Payme, Click) are **redirect/webhook-based**: the frontend's only job is (1) trigger order creation via the Server Action, (2) redirect to the provider's hosted checkout URL returned by the backend, (3) render a status page that polls order status via TanStack Query (`refetchInterval`) until the backend confirms payment
- Provider **webhooks** land on a Route Handler (`app/api/webhooks/payment/route.ts`) — never a Server Action, since Server Actions aren't meant to be called by external services
- The frontend **never** handles raw card data or provider secrets — that stays backend-only, consistent with the backend Service/Repository standard
- Payment status on the confirmation page: `pending` / `paid` / `failed` — driven entirely by server state, no client-side assumption of success

## 22. WISHLIST / FAVORITES

- Same pattern as cart (§18): `useWishlistStore`, Zustand + `persist`, guest-first with a login-time merge
- Kept as a **separate store from cart** — different lifecycle (wishlist survives purchase, cart doesn't) and different merge semantics (dedupe by productId only, no qty)

---

## Standard package list (starting point for every project)

```
next, react, react-dom, typescript
shadcn/ui (+ radix-ui)
tailwindcss (v4)
lucide-react
react-hook-form, zod, @hookform/resolvers
axios
@tanstack/react-query
@tanstack/react-table
zustand
motion
next-themes
sonner
date-fns
clsx, class-variance-authority, tailwind-merge
eslint, prettier, husky, lint-staged
```

## Added only when the project has that specific need

```
recharts              — only once a project has an actual dashboard/KPI screen to chart
@dnd-kit/core          — only once a project has an actual reorderable/kanban UI
```

## Additional packages (single-vendor e-commerce)

```
use-debounce         — debouncing catalog search/filter inputs
embla-carousel-react — already pulled in transitively via shadcn Carousel; listed explicitly since the catalog depends on it directly
```

---

### Note on this revision

`recharts` and `@dnd-kit/core` were moved out of the default package list and out of the numbered standard (they were §11–§12 in the previous version). They're not deleted from the standard's _vocabulary_ — a project that genuinely builds a chart or a kanban board still uses exactly these two libraries, no others — but they're no longer installed or documented by default on a project that has no chart or drag-and-drop UI, such as a landing page. Add them back explicitly, with a one-line reason, in that project's `frontend.md` when a module actually needs them.

_This is a project-independent, universal standard, with an additive e-commerce module for store-specific concerns. How these principles apply to a specific project (concrete page/component names, custom business rules) is documented separately, per-project, in `frontend.md`._
