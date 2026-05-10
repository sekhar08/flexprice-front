# FlexPrice — Frontend Intern Take-Home Assignment

**Deadline:** Sunday, 10th May 2025 — 11:59 PM IST  
**Stack:** React · TypeScript · Storybook · Vercel  
**Deliverables:** GitHub repo + hosted Storybook URL

---

## Context

FlexPrice is an open-source usage-based billing and pricing infrastructure platform. The frontend ([github.com/flexprice/flexprice-front](https://github.com/flexprice/flexprice-front)) is a React + TypeScript + Vite application that helps businesses manage pricing plans, customer subscriptions, usage metering, invoicing, and credits.

You'll spend the day doing two things: **understanding a real production codebase**, and **building a component library** from what you find there.

---

## What You'll Build

A hosted **Storybook component library** extracted from the FlexPrice app. Think of it as the design system and interactive documentation for the FlexPrice UI — similar to how PostHog does it at [storybook.dev.posthog.dev](https://storybook.dev.posthog.dev/).

---

## Step 1 — Explore the App (30–60 min)

1. Sign up at **[admin.flexprice.io](https://admin.flexprice.io)** and walk through the product.
2. Explore: Dashboard, Plans, Customers, Subscriptions, Invoices, Credits, Usage charts.
3. Take note of every distinct UI element you see — buttons, tables, badges, modals, form inputs, charts, empty states, sidebar nav, etc.
4. Also browse the source at [github.com/flexprice/flexprice-front](https://github.com/flexprice/flexprice-front) — the `src/components/` directory is already structured into `atoms/`, `molecules/`, and `organisms/`.

---

## Step 2 — Build the Storybook (Core Requirement)

Fork the repo and implement Storybook stories for **at least 15 components** across all three tiers. The Storybook infrastructure is already installed — just run `npm run storybook`.

### Required components (minimum, pick more if time allows)

**Atoms (basic building blocks)**
- `Button` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg; states: default, loading, disabled
- `Badge` / `StatusChip` — for plan status (active, archived), invoice status (paid, draft, void), subscription status
- `Input` — text, number, with label, with error state, with currency prefix (e.g. `$`)
- `Select` / `Dropdown` — single select, with search
- `Tooltip` — informational, with delay
- `Spinner` / `LoadingState`

**Molecules (composed UI units)**
- `MetricCard` — the KPI cards on the dashboard (label, value, trend indicator)
- `DataTable` — sortable columns, loading skeleton, empty state, pagination controls. Must demonstrate the **virtual list** capability (see Advanced Challenge below)
- `InvoiceStatusBadge` — maps invoice status strings to coloured chips with icons
- `UsageBar` / `MeterProgress` — a labelled progress bar showing used vs. entitled units
- `DateRangePicker` — used for analytics filtering
- `SearchBar` — with debounce, clear button

**Organisms (feature-level sections)**
- `SidebarNav` — collapsible, with active-route highlighting and icon+label items
- `PricingTierTable` — displays tiered or graduated pricing in a readable table
- `EmptyState` — full-page empty state with icon, headline, subtext, and CTA button

### Story requirements for each component

Every story file must include:

1. **Default** story — the happy-path usage.
2. **Variants** — cover all meaningful visual states (loading, error, empty, disabled, etc.).
3. **Controls** — use Storybook `args` and `argTypes` so reviewers can tweak props live in the Controls panel.
4. **Docs** — a JSDoc comment block on the component explaining its props and usage.
5. **At least one interaction test** (using `@storybook/test` play functions) for any interactive component (buttons, inputs, forms).

---

## Step 3 — Advanced Challenges (Differentiators)

These are not required for a passing submission, but they separate good candidates from great ones. Implement as many as you can.

### Challenge A — Filter Persistence (without URL bloat)

The FlexPrice tables have multi-dimensional filters (date range, status, plan, customer search, sort column, sort direction). A naive implementation serialises all filter state into the URL query string — which becomes unwieldy for large filter objects and wastes CPU on every render for URL parsing/serialisation.

**Build a `useFilterStore` hook** (using Zustand) that:
- Persists the active filter state for each page in `sessionStorage` keyed by route (e.g. `filters:invoices`, `filters:customers`).
- Exposes a clean API: `setFilter(key, value)`, `resetFilters()`, `getFilters()`.
- Syncs *only a shallow fingerprint* (e.g. a hash or a count) to the URL so the page is bookmarkable/shareable without bloating the URL.
- Write a Storybook story that demonstrates the `DataTable` component wired up to `useFilterStore`.

### Challenge B — Virtualised List

The Customers and Invoices pages can contain tens of thousands of rows. Rendering them all in the DOM at once kills performance.

**Extend your `DataTable` component** to support virtualisation using `@tanstack/react-virtual`:
- Only render the rows currently in the viewport plus an overscan buffer.
- Demonstrate it in a story with **10,000 mock rows** — it should scroll smoothly.
- Show row height estimation and dynamic height support.

### Challenge C — Configurable TanStack Query Caching

FlexPrice uses `@tanstack/react-query` (v5) for all server state. A common mistake is using `useQuery` everywhere with default settings, creating an inconsistent caching experience.

**Build a `createQueryConfig` utility** that:
- Sets a **global default** of `staleTime: 5 * 60 * 1000` (5 minutes) and `gcTime: 10 * 60 * 1000` (10 minutes).
- Allows each call site to override `staleTime` / `gcTime` declaratively (e.g. `useInvoices({ staleTime: 0 })` for real-time data).
- Exports pre-defined query config presets: `REALTIME` (staleTime 0), `DEFAULT` (5 min), `STATIC` (30 min) — for things like plan definitions that rarely change.
- Write a story or a `vitest` test that documents the caching behaviour.

---

## Step 4 — Tests

Write unit tests with Vitest (`npm run test`) for:
- At least 3 utility functions (e.g. currency formatting, status-to-label mapping, tier price calculation).
- At least 2 component render tests using `@testing-library/react`.

---

## Step 5 — Deploy

1. Push your fork to a **public GitHub repo** under your own account.
2. Deploy the built Storybook (`npm run build-storybook`) to **Vercel** (free tier is fine).
3. Make sure the Vercel URL is publicly accessible without login.

---

## Submission

Submit via the form at **[FORM LINK](https://binary.so/mZbCJzs)**

**Deadline:** Sunday, 10th May 2025 — End of Day (11:59 PM IST).

---

## Evaluation Criteria (what we look at)

| Area | Weight |
|---|---|
| Component coverage & fidelity to FlexPrice UI | 25% |
| Storybook quality (stories, controls, docs, tests) | 20% |
| Code quality (TypeScript strictness, component APIs, naming) | 20% |
| Advanced challenges (filter store, virtualisation, query config) | 20% |
| Tests (vitest unit tests + interaction tests) | 10% |
| Deployment & repo hygiene | 5% |

---

## Rules & Notes

- **You may use AI tools** (Cursor, Copilot, Claude, etc.) — we do this at work. What we're evaluating is your architectural judgment, not your typing speed. Code you cannot explain in a follow-up call will count against you.
- Do not copy the FlexPrice source files wholesale. Build components from scratch, inspired by what you see in the app. The point is to show you understand the patterns.
- You do not need a backend — use mock data and Storybook decorators everywhere.
- The Storybook infrastructure (`npm run storybook`, `npm run build-storybook`) is already wired up in the repo. Don't spend time on tooling setup.
- Keep the scope tight. 15 well-done components beat 30 half-baked ones.

---

## Tips

- Use the existing design tokens — check `tailwind.config.js` and `components.json` in the repo for the colour system.
- The repo already uses `shadcn/ui` patterns on top of Radix primitives — your components should feel consistent with that.
- Look at the `.storybook/` directory in the repo — there may already be some story stubs you can build on.
- Check `src/components/atoms/` for existing atoms you can document rather than re-implement.

Good luck. We're excited to see what you build.

— The FlexPrice Team
