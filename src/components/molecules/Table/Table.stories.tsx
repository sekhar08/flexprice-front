import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown, MoreVertical } from 'lucide-react';
import FlexpriceTable, { type ColumnData } from './Table';
import InvoiceStatusBadge from '@/components/molecules/InvoiceStatusBadge';
import SortDropdown from '@/components/molecules/QueryBuilder/SortDropdown';
import Chip from '@/components/atoms/Chip/Chip';
import { Button } from '@/components/atoms';
import { INVOICE_STATUS } from '@/models/Invoice';
import { PAYMENT_STATUS } from '@/constants/payment';
import { SortDirection, type SortOption } from '@/types/common/QueryBuilder';

/**
 * `FlexpriceTable` is the workhorse table used on every list page. It takes
 * a `columns` array (`fieldName` *or* `render`) and a `data` array, and
 * renders a clean shadcn-styled table with optional row clicks.
 *
 * The plan refers to this as "DataTable" — same component, just the
 * Storybook-friendly title.
 *
 * Props:
 * - `columns`: per-column config (`title`, `fieldName`/`render`, `width`, `align`, `fieldVariant`, `onCellClick`)
 * - `data`: array of row objects
 * - `onRowClick`: optional row-level click handler
 * - `showEmptyRow`: render a dashed-out row when `data` is empty
 * - `variant`: `default` (bordered card) | `no-bordered` (flat — for embedded use)
 *
 * Sorting and pagination are intentionally *not* baked into the
 * component — they are composed alongside it via `SortDropdown` and a
 * pagination control, which is exactly how the production list pages work.
 *
 * The virtualised variant for tens of thousands of rows lives in
 * `VirtualizedDataTable.stories.tsx` (Block 2).
 */
const meta: Meta<typeof FlexpriceTable> = {
	title: 'Molecules/DataTable',
	component: FlexpriceTable,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FlexpriceTable>;

// -- Seed data ---------------------------------------------------------------

interface InvoiceRow {
	id: string;
	/** Empty string when the invoice has no number yet (e.g. skipped). */
	number: string;
	amount: number;
	currency: string;
	invoiceStatus: INVOICE_STATUS;
	billingEntity: string;
	paymentStatus: PAYMENT_STATUS;
	/** Empty string when no due date is set. */
	dueDate: string;
}

const rows: InvoiceRow[] = [
	{
		id: 'inv_001',
		number: 'INV-2026-0001',
		amount: 0,
		currency: 'USD',
		invoiceStatus: INVOICE_STATUS.SKIPPED,
		billingEntity: 'Acme Corp',
		paymentStatus: PAYMENT_STATUS.PENDING,
		dueDate: '2026-06-11',
	},
	{
		id: 'inv_002',
		number: 'INV-2026-0002',
		amount: 500,
		currency: 'USD',
		invoiceStatus: INVOICE_STATUS.FINALIZED,
		billingEntity: 'Globex Inc',
		paymentStatus: PAYMENT_STATUS.PENDING,
		dueDate: '2026-06-12',
	},
	{
		id: 'inv_003',
		number: 'INV-2026-0003',
		amount: 20,
		currency: 'USD',
		invoiceStatus: INVOICE_STATUS.FINALIZED,
		billingEntity: 'Initech',
		paymentStatus: PAYMENT_STATUS.SUCCEEDED,
		dueDate: '2026-06-10',
	},
	{
		id: 'inv_004',
		number: 'INV-2026-0004',
		amount: 5,
		currency: 'USD',
		invoiceStatus: INVOICE_STATUS.FINALIZED,
		billingEntity: 'Hooli',
		paymentStatus: PAYMENT_STATUS.FAILED,
		dueDate: '2026-06-10',
	},
	{
		id: 'inv_005',
		number: 'INV-2026-0005',
		amount: 0,
		currency: 'USD',
		invoiceStatus: INVOICE_STATUS.SKIPPED,
		billingEntity: 'Stark Industries',
		paymentStatus: PAYMENT_STATUS.PENDING,
		dueDate: '2026-06-10',
	},
];

// -- Cell formatters ---------------------------------------------------------

const formatAmount = (r: InvoiceRow) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: r.currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(r.amount);

const formatDueDate = (iso: string) => {
	if (!iso) return '--';
	return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
};

const PAYMENT_STATUS_VISUAL: Record<PAYMENT_STATUS, { label: string; variant: 'default' | 'success' | 'warning' | 'failed' | 'info' }> = {
	[PAYMENT_STATUS.PENDING]: { label: 'Pending', variant: 'warning' },
	[PAYMENT_STATUS.PROCESSING]: { label: 'Processing', variant: 'info' },
	[PAYMENT_STATUS.INITIATED]: { label: 'Initiated', variant: 'info' },
	[PAYMENT_STATUS.SUCCEEDED]: { label: 'Succeeded', variant: 'success' },
	[PAYMENT_STATUS.FAILED]: { label: 'Failed', variant: 'failed' },
	[PAYMENT_STATUS.REFUNDED]: { label: 'Refunded', variant: 'default' },
	[PAYMENT_STATUS.PARTIALLY_REFUNDED]: { label: 'Partially refunded', variant: 'default' },
	[PAYMENT_STATUS.OVERPAID]: { label: 'Overpaid', variant: 'warning' },
};

const PaymentStatusChip = ({ status }: { status: PAYMENT_STATUS }) => {
	const v = PAYMENT_STATUS_VISUAL[status] ?? { label: String(status), variant: 'default' as const };
	return <Chip label={v.label} variant={v.variant} />;
};

const RowActions = () => (
	<button
		type='button'
		data-interactive='true'
		aria-label='Row actions'
		className='inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring'>
		<MoreVertical className='size-4' />
	</button>
);

// -- Columns -----------------------------------------------------------------

const baseColumns: ColumnData<InvoiceRow>[] = [
	{
		title: 'Invoice Number',
		fieldVariant: 'link',
		render: (r) => (r.number ? r.number : <span className='text-muted-foreground'>--</span>),
	},
	{
		title: 'Amount',
		render: (r) => formatAmount(r),
	},
	{
		title: 'Invoice Status',
		render: (r) => <InvoiceStatusBadge status={r.invoiceStatus} />,
	},
	{
		title: 'Billing Entity',
		fieldVariant: 'link',
		render: (r) => r.billingEntity,
	},
	{
		title: 'Payment Status',
		render: (r) => <PaymentStatusChip status={r.paymentStatus} />,
	},
	{
		title: 'Due Date',
		render: (r) => (r.dueDate ? formatDueDate(r.dueDate) : <span className='text-muted-foreground'>--</span>),
	},
	{
		title: '',
		width: 56,
		align: 'center',
		fieldVariant: 'interactive',
		render: () => <RowActions />,
	},
];

// -- Stories -----------------------------------------------------------------

/** Five rows of mock invoice data showing the full column layout. */
export const Default: Story = {
	args: { columns: baseColumns, data: rows },
};

/** Empty state with `showEmptyRow` — renders a dashed placeholder row. */
export const Empty: Story = {
	args: { columns: baseColumns, data: [], showEmptyRow: true },
};

/** Loading skeleton — render-prop columns that emit Tailwind pulse blocks. */
export const Loading: Story = {
	render: () => {
		const skeletonColumns: ColumnData<{ id: number }>[] = [
			{ title: 'Invoice Number', render: () => <div className='h-4 w-24 rounded bg-muted animate-pulse' /> },
			{ title: 'Amount', render: () => <div className='h-4 w-16 rounded bg-muted animate-pulse' /> },
			{ title: 'Invoice Status', render: () => <div className='h-5 w-20 rounded-full bg-muted animate-pulse' /> },
			{ title: 'Billing Entity', render: () => <div className='h-4 w-28 rounded bg-muted animate-pulse' /> },
			{ title: 'Payment Status', render: () => <div className='h-5 w-20 rounded-full bg-muted animate-pulse' /> },
			{ title: 'Due Date', render: () => <div className='h-4 w-20 rounded bg-muted animate-pulse' /> },
			{ title: '', width: 56, render: () => <div className='h-4 w-4 rounded bg-muted animate-pulse mx-auto' /> },
		];
		const data = Array.from({ length: 5 }, (_, i) => ({ id: i }));
		return <FlexpriceTable columns={skeletonColumns} data={data} />;
	},
};

/** With a row click handler — entire rows become interactive. The 3-dot column is marked `interactive` so clicking it does not bubble to row-click. */
export const RowClick: Story = {
	render: () => {
		const Demo = () => {
			const [last, setLast] = useState<string | null>(null);
			return (
				<div className='flex flex-col gap-2'>
					<FlexpriceTable
						columns={baseColumns}
						data={rows}
						onRowClick={(r: InvoiceRow) => setLast(r.number || `(skipped — ${r.billingEntity})`)}
					/>
					<p className='text-xs text-muted-foreground'>Last clicked: {last ?? '—'}</p>
				</div>
			);
		};
		return <Demo />;
	},
};

/** `no-bordered` variant — drops the surrounding card for embedded use. */
export const FlatVariant: Story = {
	args: { columns: baseColumns.slice(0, 4), data: rows.slice(0, 3), variant: 'no-bordered' },
};

// -- Sortable -----------------------------------------------------------------

type SortableField = 'number' | 'amount' | 'billingEntity' | 'dueDate';

const SortIndicator = ({ active, dir }: { active: boolean; dir: SortDirection }) =>
	active ? (
		dir === SortDirection.ASC ? (
			<ArrowUp className='size-3' />
		) : (
			<ArrowDown className='size-3' />
		)
	) : (
		<ChevronsUpDown className='size-3 opacity-50' />
	);

const SortableHeader = ({
	label,
	field,
	current,
	onSort,
}: {
	label: string;
	field: SortableField;
	current: { field: SortableField; dir: SortDirection } | null;
	onSort: (field: SortableField) => void;
}) => {
	const active = current?.field === field;
	return (
		<button
			type='button'
			onClick={() => onSort(field)}
			data-interactive='true'
			className='inline-flex items-center gap-1.5 text-[14px] font-medium text-black hover:text-zinc-600'>
			{label}
			<SortIndicator active={active} dir={active ? current!.dir : SortDirection.ASC} />
		</button>
	);
};

/**
 * Click any column header to sort. Click again to flip direction. Click a
 * different header to switch field. Sort state lives in the story — the
 * underlying `FlexpriceTable` is unchanged.
 */
export const Sortable: Story = {
	render: () => {
		const Demo = () => {
			const [sort, setSort] = useState<{ field: SortableField; dir: SortDirection } | null>({
				field: 'dueDate',
				dir: SortDirection.DESC,
			});

			const sortedRows = useMemo(() => {
				if (!sort) return rows;
				const copy = [...rows];
				copy.sort((a, b) => {
					const av = a[sort.field];
					const bv = b[sort.field];
					if (av === bv) return 0;
					const cmp = av < bv ? -1 : 1;
					return sort.dir === SortDirection.ASC ? cmp : -cmp;
				});
				return copy;
			}, [sort]);

			const handleSort = (field: SortableField) => {
				setSort((prev) =>
					prev?.field === field
						? { field, dir: prev.dir === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC }
						: { field, dir: SortDirection.ASC },
				);
			};

			const sortableColumns: ColumnData<InvoiceRow>[] = [
				{
					children: <SortableHeader label='Invoice Number' field='number' current={sort} onSort={handleSort} />,
					fieldVariant: 'link',
					render: (r) => (r.number ? r.number : <span className='text-muted-foreground'>--</span>),
				},
				{
					children: <SortableHeader label='Amount' field='amount' current={sort} onSort={handleSort} />,
					render: (r) => formatAmount(r),
				},
				{ title: 'Invoice Status', render: (r) => <InvoiceStatusBadge status={r.invoiceStatus} /> },
				{
					children: <SortableHeader label='Billing Entity' field='billingEntity' current={sort} onSort={handleSort} />,
					fieldVariant: 'link',
					render: (r) => r.billingEntity,
				},
				{ title: 'Payment Status', render: (r) => <PaymentStatusChip status={r.paymentStatus} /> },
				{
					children: <SortableHeader label='Due Date' field='dueDate' current={sort} onSort={handleSort} />,
					render: (r) => (r.dueDate ? formatDueDate(r.dueDate) : <span className='text-muted-foreground'>--</span>),
				},
				{ title: '', width: 56, align: 'center', fieldVariant: 'interactive', render: () => <RowActions /> },
			];

			return <FlexpriceTable columns={sortableColumns} data={sortedRows} />;
		};
		return <Demo />;
	},
};

// -- With pagination ---------------------------------------------------------

/** Generates 47 rows so pagination shows multiple pages. */
const manyRows: InvoiceRow[] = Array.from({ length: 47 }, (_, i) => {
	const status = Object.values(INVOICE_STATUS)[i % 4] as INVOICE_STATUS;
	const isSkipped = status === INVOICE_STATUS.SKIPPED;
	return {
		id: `inv_${i + 1}`,
		number: isSkipped ? '' : `INV-2026-${String(i + 1).padStart(4, '0')}`,
		amount: isSkipped ? 0 : 50 + i * 47,
		currency: 'USD',
		invoiceStatus: status,
		billingEntity: ['Acme Corp', 'Globex Inc', 'Initech', 'Hooli', 'Stark Industries'][i % 5],
		paymentStatus: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUCCEEDED, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.PROCESSING][
			i % 4
		] as PAYMENT_STATUS,
		dueDate: i % 7 === 0 ? '' : `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
	};
});

/**
 * Demonstrates pagination. 47 rows / 10 per page = 5 pages. Pagination
 * state lives in the story for self-containment; in production pages this
 * is wired to `usePagination` (URL-backed).
 */
export const WithPagination: Story = {
	render: () => {
		const Demo = () => {
			const PAGE_SIZE = 10;
			const [page, setPage] = useState(1);
			const start = (page - 1) * PAGE_SIZE;
			const slice = manyRows.slice(start, start + PAGE_SIZE);
			const total = manyRows.length;
			const totalPages = Math.ceil(total / PAGE_SIZE);
			return (
				<div className='flex flex-col'>
					<FlexpriceTable columns={baseColumns} data={slice} />
					<div className='flex items-center justify-between py-3 text-sm'>
						<span className='text-muted-foreground'>
							Showing <span className='text-zinc-900'>{start + 1}</span>–
							<span className='text-zinc-900'>{Math.min(start + PAGE_SIZE, total)}</span> of <span className='text-zinc-900'>{total}</span>{' '}
							invoices
						</span>
						<div className='flex items-center gap-2'>
							<Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
								Previous
							</Button>
							<span className='text-xs text-muted-foreground'>
								Page {page} of {totalPages}
							</span>
							<Button
								variant='outline'
								size='sm'
								disabled={page === totalPages}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
								Next
							</Button>
						</div>
					</div>
				</div>
			);
		};
		return <Demo />;
	},
};

// -- WithToolbar (matches assignment design) ---------------------------------

const sortFieldOptions: SortOption[] = [
	{ field: 'number', label: 'Invoice Number' },
	{ field: 'amount', label: 'Amount' },
	{ field: 'billingEntity', label: 'Billing Entity' },
	{ field: 'dueDate', label: 'Due Date' },
];

/**
 * Production list-page composition: a card header, a Sort toolbar that
 * mirrors the FlexPrice app design, the table, and a 3-dot actions column.
 *
 * Uses the existing `SortDropdown` molecule so the sort popover behaves
 * exactly like in the live app.
 */
export const WithToolbar: Story = {
	parameters: { layout: 'fullscreen' },
	decorators: [(Story) => <div className='p-6 bg-white min-h-screen'>{Story()}</div>],
	render: () => {
		const Demo = () => {
			const [sorts, setSorts] = useState<SortOption[]>([{ field: 'dueDate', label: 'Due Date', direction: SortDirection.DESC }]);

			const sortedRows = useMemo(() => {
				if (sorts.length === 0) return rows;
				const copy = [...rows];
				copy.sort((a, b) => {
					for (const s of sorts) {
						const field = s.field as keyof InvoiceRow;
						const av = a[field];
						const bv = b[field];
						if (av === bv) continue;
						const cmp = av < bv ? -1 : 1;
						return s.direction === SortDirection.ASC ? cmp : -cmp;
					}
					return 0;
				});
				return copy;
			}, [sorts]);

			return (
				<div className='flex flex-col gap-4'>
					<h2 className='text-2xl font-semibold text-zinc-900'>Invoices</h2>
					<div className='flex items-center gap-2'>
						<SortDropdown options={sortFieldOptions} value={sorts} onChange={setSorts} />
					</div>
					<FlexpriceTable columns={baseColumns} data={sortedRows} />
				</div>
			);
		};
		return <Demo />;
	},
};
