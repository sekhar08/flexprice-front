import type { Meta, StoryObj } from '@storybook/react';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { INVOICE_STATUS } from '@/models/Invoice';

/**
 * `InvoiceStatusBadge` is the single source of truth for how an invoice
 * status looks across the FlexPrice UI. Pass one of the four
 * `INVOICE_STATUS` values and it renders the right chip variant + label.
 *
 * Pass `labelOverride` only when you need a localised or shortened label.
 *
 * Status → colour mapping:
 * - `DRAFT` → info (blue)
 * - `FINALIZED` → success (green)
 * - `VOIDED` → default (grey)
 * - `SKIPPED` → default (grey)
 */
const meta: Meta<typeof InvoiceStatusBadge> = {
	title: 'Molecules/InvoiceStatusBadge',
	component: InvoiceStatusBadge,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		status: INVOICE_STATUS.FINALIZED,
	},
	argTypes: {
		status: {
			control: 'select',
			options: Object.values(INVOICE_STATUS),
		},
	},
};

export default meta;
type Story = StoryObj<typeof InvoiceStatusBadge>;

/** Default — the canonical "finalized" badge. */
export const Default: Story = {};

/** Every `INVOICE_STATUS` value side-by-side. */
export const AllStatuses: Story = {
	render: () => (
		<div className='flex flex-wrap gap-2'>
			{Object.values(INVOICE_STATUS).map((s) => (
				<InvoiceStatusBadge key={s} status={s} />
			))}
		</div>
	),
};

/** A label override — useful for compact tables or i18n. */
export const WithLabelOverride: Story = {
	args: { status: INVOICE_STATUS.FINALIZED, labelOverride: 'Issued' },
};
