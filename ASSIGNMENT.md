# FlexPrice Frontend Intern Take-Home — Submission

This document explains what was built, where to find it, and what was deliberately left out. The full assignment brief lives at [`assignment/flexprice_intern_assignment.md`](./assignment/flexprice_intern_assignment.md). The original FlexPrice marketing readme is untouched at [`README.md`](./README.md).

- **Branch:** `flexpay-assignment`
- **Commit range:** `8a23cadb` → `3301ae12` (6 commits)
- **Live Storybook:** https://flexprice-front-storybook-gamma.vercel.app

---

## TL;DR

| Requirement | Status | Notes |
|---|---|---|
| Storybook stories for ≥15 components | ✅ Done | 6 atoms + 6 molecules + 3 organisms = **15** |
| Story shape (Default + variants + Controls + Docs + interaction test) | ✅ Done | Play tests on every interactive atom + on `EmptyState` and `SearchBar` |
| Challenge A — `useFilterStore` (Zustand + sessionStorage + URL fingerprint) | ❌ Not done | Approach sketched below |
| Challenge B — Virtualised `DataTable` | ✅ Done | `VirtualizedDataTable` with 10,000-row demo, ~22 DOM rows |
| Challenge C — `createQueryConfig` presets | ❌ Not done | Approach sketched below |
| Tests — 3 utility + 2 component | ✅ Done | 5 test files added |
| Vercel deploy of `npm run build-storybook` | ✅ Done | [flexprice-front-storybook-gamma.vercel.app](https://flexprice-front-storybook-gamma.vercel.app) |

---

## How to run locally

```bash
npm install
npm run storybook        # http://localhost:6006
npx vitest run           # one-shot test pass
```

---

## Approach & decisions

### 1. Build on the existing component tree, don't fork it

The repo already has `src/components/{atoms,molecules,organisms}` with shadcn/Radix-flavoured primitives in place. The assignment's tip #4 says "document existing atoms rather than re-implement," so:

- **Atoms (6):** all six atom stories wrap existing components (`Button`, `Chip`, `Input`, `Select`, `Tooltip`, `Spinner`). Zero new atom source files — just `*.stories.tsx`.
- **Molecules (6):** three stories wrap existing molecules (`MetricCard`, `Table`/DataTable, `DateRangePicker`); three are newly built because they didn't exist as discrete components (`InvoiceStatusBadge`, `UsageBar`, `SearchBar`).
- **Organisms (3):** all newly built (`SidebarNav`, `PricingTierTable`, `EmptyState`) because the production app composes these inline rather than as reusable units.

This keeps the diff focused on documentation rather than parallel implementations a reviewer would have to mentally diff against the originals.

### 2. Standardised story shape

Every story file follows the same pattern:

1. A **Default** export — happy-path props.
2. **Variants** — meaningful visual states (sizes, loading, error, empty, disabled, etc.).
3. **`argTypes`-driven Controls** so reviewers can tweak props live.
4. **JSDoc** on the component itself, surfaced via Storybook autodocs.
5. **A `play` function** for every interactive component. The atoms commit ships four (Button click, Button disabled-no-fire, Input typing onChange, Select option pick). The molecules and organisms commits add one for `SearchBar` (debounced cumulative onSearch) and one for `EmptyState` (CTA onClick fires).

### 3. Bug fix found while writing the DateRangePicker story

While building [`DateRangePicker.stories.tsx`](src/components/atoms/DateRangePicker/DateRangePicker.stories.tsx), the partial-selection state was wiping itself: clicking the first date triggered the props-sync `useEffect`, which reset internal state before the second click could land. Fixed in [`DateRangePicker.tsx`](src/components/atoms/DateRangePicker/DateRangePicker.tsx) by keeping partial picks in internal state and only firing `onChange` once both endpoints are chosen. The story switched from a single-popover range calendar to two side-by-side `DatePicker` primitives with `min`/`max` bounds derived from each other — the same pattern the production `CustomerAnalyticsTab` uses.

### 4. Virtualisation choice

For Challenge B we picked `@tanstack/react-virtual` over `react-window`:

- It's headless, so the column API of [`VirtualizedDataTable`](src/components/molecules/Table/VirtualizedDataTable.tsx) matches the existing `FlexpriceTable` — a future production migration is "swap the import."
- Supports both fixed and dynamic row heights out of the box.
- No DOM coupling, no inline-style scaffolding to fight.

---

## Component inventory

### Atoms — 6

| Component | Story file | Coverage |
|---|---|---|
| `Button` | [`atoms/Button/Button.stories.tsx`](src/components/atoms/Button/Button.stories.tsx) | All variants (primary/secondary/ghost/danger), sizes (sm/md/lg), states (default/loading/disabled). Play tests: click, disabled-no-fire |
| `Chip` (Badge) | [`atoms/Chip/Chip.stories.tsx`](src/components/atoms/Chip/Chip.stories.tsx) | Status variants for plan/invoice/subscription states |
| `Input` | [`atoms/Input/Input.stories.tsx`](src/components/atoms/Input/Input.stories.tsx) | Text, number, label, error state, currency prefix. Play test: typing fires onChange |
| `Select` | [`atoms/Select/Select.stories.tsx`](src/components/atoms/Select/Select.stories.tsx) | Single select, with search. Play test: option pick |
| `Tooltip` | [`atoms/Tooltip/Tooltip.stories.tsx`](src/components/atoms/Tooltip/Tooltip.stories.tsx) | Informational, with delay |
| `Spinner` | [`atoms/Spinner/Spinner.stories.tsx`](src/components/atoms/Spinner/Spinner.stories.tsx) | Loading state, sizes |

### Molecules — 6

| Component | Story file | Coverage |
|---|---|---|
| `MetricCard` | [`molecules/MetricCard.stories.tsx`](src/components/molecules/MetricCard.stories.tsx) | KPI card — label, value, trend indicator |
| `DataTable` (Table) | [`molecules/Table/Table.stories.tsx`](src/components/molecules/Table/Table.stories.tsx) | 8 stories: title + Filter/Sort toolbar, sortable columns, loading skeleton, empty state, pagination, row clicks, flat variant. Wired to existing `SortDropdown` molecule |
| `InvoiceStatusBadge` | [`molecules/InvoiceStatusBadge/InvoiceStatusBadge.stories.tsx`](src/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge.stories.tsx) | Maps the 4 `INVOICE_STATUS` values to flat coloured chips, matching production invoice tables |
| `UsageBar` | [`molecules/UsageBar/UsageBar.stories.tsx`](src/components/molecules/UsageBar/UsageBar.stories.tsx) | Progress with primary/amber/destructive bands keyed off percent used, plus an unlimited indicator |
| `DateRangePicker` | [`atoms/DateRangePicker/DateRangePicker.stories.tsx`](src/components/atoms/DateRangePicker/DateRangePicker.stories.tsx) | Two side-by-side `DatePicker` primitives with cross-bounded `min`/`max`. Toggle-clear comes from react-day-picker's deselect-on-reclick |
| `SearchBar` | [`molecules/SearchBar/SearchBar.stories.tsx`](src/components/molecules/SearchBar/SearchBar.stories.tsx) | Magnifier prefix, clear button, debounced `onSearch` (300ms default). Play test asserts cumulative debounced value |

### Organisms — 3

| Component | Story file | Coverage |
|---|---|---|
| `SidebarNav` | [`organisms/SidebarNav/SidebarNav.stories.tsx`](src/components/organisms/SidebarNav/SidebarNav.stories.tsx) | Composes shadcn `Sidebar` primitives — collapsible, active-route highlighting, icon+label items, header/footer slots. Story wires it into a `SidebarProvider`/`SidebarInset` shell with a `UserChip` footer that opens a Settings/Logout dropdown |
| `PricingTierTable` | [`organisms/PricingTierTable/PricingTierTable.stories.tsx`](src/components/organisms/PricingTierTable/PricingTierTable.stories.tsx) | Pure-display table for tiered / graduated / volume pricing rules with optional row highlighting |
| `EmptyState` | [`organisms/EmptyState/EmptyState.stories.tsx`](src/components/organisms/EmptyState/EmptyState.stories.tsx) | Canonical icon + headline + subtext + CTA placeholder. Play test asserts CTA `onClick` fires |

---

## Advanced challenges

### A — Filter persistence (NOT IMPLEMENTED)

What the assignment asks for: a `useFilterStore` Zustand hook that persists per-page filter state in `sessionStorage` keyed by route, exposes `setFilter` / `resetFilters` / `getFilters`, and syncs only a shallow fingerprint (hash or count) to the URL — plus a story showing `DataTable` wired to it.

Approach we'd take with another day:

- A Zustand store created per route via a factory: `createFilterStore('invoices')` → returns a hook bound to the `filters:invoices` storage key.
- Use Zustand's `persist` middleware with `createJSONStorage(() => sessionStorage)` so the persistence is declarative, not hand-rolled.
- A small `useFilterUrlFingerprint()` hook that hashes the active filter object (e.g. `xxhash` or a simple stringify+djb2) and writes a single `?f=<hash>` query param via `useSearchParams`. On mount, if the URL hash matches the stored fingerprint we trust sessionStorage; if it doesn't, we drop the stored filters and start fresh — bookmarkability without the per-render serialise cost.
- Demo story: `DataTable` decorated with a `MemoryRouter` and the store, plus a "reset" button.

### B — Virtualised list (DONE)

- Component: [`molecules/Table/VirtualizedDataTable.tsx`](src/components/molecules/Table/VirtualizedDataTable.tsx)
- Stories: [`VirtualizedDataTable.stories.tsx`](src/components/molecules/Table/VirtualizedDataTable.stories.tsx)
  - **Fixed-height demo:** 10,000 mock rows, scrolls smoothly.
  - **Variable-height demo:** 2,000 rows with dynamic row sizing.
- Built on `@tanstack/react-virtual` with overscan 10 and a sticky header. The column API matches the non-virtualised `FlexpriceTable` so swapping is a one-line change. Regardless of dataset size, the DOM only holds ~22 rendered rows (viewport + overscan).

### C — Configurable TanStack Query caching (NOT IMPLEMENTED)

What the assignment asks for: a `createQueryConfig` utility with a global default of `staleTime: 5min` / `gcTime: 10min`, declarative per-call overrides, and `REALTIME` / `DEFAULT` / `STATIC` presets — plus a story or vitest spec documenting the behaviour.

Approach we'd take with another day:

```ts
export const QUERY_PRESETS = {
  REALTIME: { staleTime: 0,            gcTime: 60_000 },
  DEFAULT:  { staleTime: 5 * 60_000,   gcTime: 10 * 60_000 },
  STATIC:   { staleTime: 30 * 60_000,  gcTime: 60 * 60_000 },
} as const;

export function createQueryConfig<T extends UseQueryOptions>(
  preset: keyof typeof QUERY_PRESETS,
  overrides?: Partial<T>,
): Partial<T> {
  return { ...QUERY_PRESETS[preset], ...overrides } as Partial<T>;
}
```

- Set the `DEFAULT` preset on the root `QueryClient` so callers that don't opt in still get sane behaviour.
- A vitest spec uses `vi.useFakeTimers()` + a mock fetcher to assert that `staleTime: 0` re-fetches on remount and `STATIC` does not.
- Plan definitions, currency/locale lists → `STATIC`. Invoices, usage counters → `REALTIME`. Everything else → `DEFAULT`.

---

## Tests (Step 4)

Five files committed in `3301ae12`:

- [`src/utils/common/format_number.test.ts`](src/utils/common/format_number.test.ts) — currency formatting (cents → display, locale, zero/negative cases).
- [`src/utils/common/format_chips.test.ts`](src/utils/common/format_chips.test.ts) — status-string-to-display-label mapping.
- [`src/utils/common/formatBillingPeriod.test.ts`](src/utils/common/formatBillingPeriod.test.ts) — billing-period (DAILY/WEEKLY/MONTHLY/...) → human label.
- [`src/components/molecules/MetricCard.test.tsx`](src/components/molecules/MetricCard.test.tsx) — render test: label, value, trend up/down/flat.
- [`src/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge.test.tsx`](src/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge.test.tsx) — render test: each `INVOICE_STATUS` value renders the right colour + label.

Run with `npx vitest run`.

---

## Repo hygiene

- Branch: `flexpay-assignment`. Six commits, conventional-commits style, linear history.
- `storybook-static/` is gitignored ([`8a23cadb`](https://github.com/`)) — Storybook builds get deployed to Vercel separately, no need to track them.
- The original FlexPrice `README.md` is untouched.

---

## Outstanding work

If we had another day on this, in priority order:

1. **Challenge A** — `useFilterStore` per the sketch above. Highest perceived value because the assignment calls it out as a real pain point in the production app.
2. **Challenge C** — `createQueryConfig` + presets + vitest spec. Smaller in scope than A; worth doing for the full advanced-challenge sweep.
