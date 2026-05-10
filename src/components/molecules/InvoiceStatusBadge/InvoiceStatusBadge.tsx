import { FC } from 'react';
import Chip from '@/components/atoms/Chip/Chip';
import { INVOICE_STATUS } from '@/models/Invoice';

interface StatusVisual {
	label: string;
	variant: 'default' | 'success' | 'warning' | 'failed' | 'info';
}

const STATUS_MAP: Record<INVOICE_STATUS, StatusVisual> = {
	[INVOICE_STATUS.DRAFT]: { label: 'Draft', variant: 'info' },
	[INVOICE_STATUS.FINALIZED]: { label: 'Finalized', variant: 'success' },
	[INVOICE_STATUS.VOIDED]: { label: 'Voided', variant: 'default' },
	[INVOICE_STATUS.SKIPPED]: { label: 'Skipped', variant: 'default' },
};

interface InvoiceStatusBadgeProps {
	/** One of the four `INVOICE_STATUS` values. */
	status: INVOICE_STATUS;
	/** Override the default human-readable label. */
	labelOverride?: string;
	className?: string;
}

/**
 * Renders the right Chip variant for an invoice status. Centralises the
 * status → colour mapping so every table, list, and detail page agrees on
 * what "Voided" or "Finalized" looks like.
 *
 * Matches the FlexPrice product UI: a flat coloured pill with the status
 * label only — no leading icon.
 */
const InvoiceStatusBadge: FC<InvoiceStatusBadgeProps> = ({ status, labelOverride, className }) => {
	const visual = STATUS_MAP[status];
	if (!visual) {
		return <Chip label={labelOverride ?? String(status)} variant='default' className={className} />;
	}
	return <Chip label={labelOverride ?? visual.label} variant={visual.variant} className={className} />;
};

export default InvoiceStatusBadge;
