import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import VirtualizedDataTable, { type VirtualColumn } from './VirtualizedDataTable';
import InvoiceStatusBadge from '@/components/molecules/InvoiceStatusBadge';
import { INVOICE_STATUS } from '@/models/Invoice';

/**
 * `VirtualizedDataTable` is the high-volume sibling of `DataTable`. It
 * uses `@tanstack/react-virtual` to render only the rows currently in
 * the viewport (plus an overscan buffer of `10`), so a 10,000-row
 * dataset stays smooth and the DOM only ever carries ~30–40 `<tr>`-like
 * row elements.
 *
 * Use this component when:
 * - The list can grow into the thousands (customers, invoices, events).
 * - You don't need server-side pagination on the page in question.
 *
 * The column API mirrors `FlexpriceTable` — `fieldName` for direct
 * field reads, `render(row, index)` for custom cells.
 */
const meta: Meta<typeof VirtualizedDataTable> = {
	title: 'Molecules/VirtualizedDataTable',
	component: VirtualizedDataTable,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VirtualizedDataTable>;

interface Row {
	id: string;
	number: string;
	customer: string;
	amount: number;
	status: INVOICE_STATUS;
	date: string;
	note?: string;
}

const customerNames = [
	'Acme Corp',
	'Globex Inc',
	'Initech',
	'Hooli',
	'Stark Industries',
	'Wonka Co',
	'Pied Piper',
	'Soylent',
	'Cyberdyne',
	'Vandelay',
];
const statusValues = Object.values(INVOICE_STATUS);

const generateRows = (count: number, withNotes = false): Row[] =>
	Array.from({ length: count }, (_, i) => ({
		id: `inv_${i + 1}`,
		number: `INV-2026-${String(i + 1).padStart(6, '0')}`,
		customer: customerNames[i % customerNames.length],
		amount: 50 + (i % 47) * 137,
		status: statusValues[i % statusValues.length] as INVOICE_STATUS,
		date: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
		// Sprinkle a longer second-line note on roughly every 3rd row for the dynamic-height story.
		note: withNotes && i % 3 === 0 ? `Note: this invoice was generated automatically as part of subscription cycle #${i + 1}.` : undefined,
	}));

const formatAmount = (n: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

/**
 * 10,000 rows. Open DevTools → Elements and inspect the row container —
 * you'll see only ~30–40 row divs at any time, regardless of scroll
 * position. Drag the scrollbar to confirm scrolling stays smooth.
 */
export const TenThousandRows: Story = {
	render: () => {
		const Demo = () => {
			const rows = useMemo(() => generateRows(10_000), []);
			const columns: VirtualColumn<Row>[] = [
				{ title: 'Invoice #', fieldName: 'number', width: 200 },
				{ title: 'Customer', fieldName: 'customer' },
				{ title: 'Amount', align: 'right', render: (r) => formatAmount(r.amount), width: 120 },
				{ title: 'Status', render: (r) => <InvoiceStatusBadge status={r.status} />, width: 140 },
				{ title: 'Date', fieldName: 'date', width: 140 },
			];
			return (
				<div className='flex flex-col gap-2'>
					<p className='text-xs text-muted-foreground'>
						Rendering {rows.length.toLocaleString()} rows. Only the viewport + 10-row overscan are in the DOM.
					</p>
					<VirtualizedDataTable columns={columns} data={rows} rowHeight={44} height={520} />
				</div>
			);
		};
		return <Demo />;
	},
};

/**
 * Variable-height rows — every third row carries a longer note that
 * pushes its height up. The virtualizer measures each row after mount
 * and adjusts the scroll surface so the bar still tracks accurately.
 */
export const DynamicHeight: Story = {
	render: () => {
		const Demo = () => {
			const rows = useMemo(() => generateRows(2_000, true), []);
			const columns: VirtualColumn<Row>[] = [
				{ title: 'Invoice #', width: 200, render: (r) => <span className='font-medium'>{r.number}</span> },
				{
					title: 'Customer',
					render: (r) => (
						<div className='flex flex-col gap-0.5'>
							<span>{r.customer}</span>
							{r.note && <span className='text-xs text-muted-foreground'>{r.note}</span>}
						</div>
					),
				},
				{ title: 'Amount', align: 'right', render: (r) => formatAmount(r.amount), width: 120 },
				{ title: 'Status', render: (r) => <InvoiceStatusBadge status={r.status} />, width: 140 },
			];
			return (
				<div className='flex flex-col gap-2'>
					<p className='text-xs text-muted-foreground'>
						{rows.length.toLocaleString()} rows. Pass a function to <code>rowHeight</code> so the virtualizer can measure each row after
						mount and adjust the scrollbar to the real total height.
					</p>
					<VirtualizedDataTable
						columns={columns}
						data={rows}
						// Estimate a generous size; rows that turn out shorter or taller are measured after render.
						rowHeight={(i) => (i % 3 === 0 ? 64 : 44)}
						height={520}
					/>
				</div>
			);
		};
		return <Demo />;
	},
};
