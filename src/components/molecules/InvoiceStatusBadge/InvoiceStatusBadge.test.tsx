import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { INVOICE_STATUS } from '@/models/Invoice';

describe('InvoiceStatusBadge', () => {
	it.each([
		[INVOICE_STATUS.DRAFT, 'Draft'],
		[INVOICE_STATUS.FINALIZED, 'Finalized'],
		[INVOICE_STATUS.VOIDED, 'Voided'],
		[INVOICE_STATUS.SKIPPED, 'Skipped'],
	])('renders the right label for status %s', (status, label) => {
		render(<InvoiceStatusBadge status={status} />);
		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it('renders distinct background colours for different status variants', () => {
		const { container: draftCt } = render(<InvoiceStatusBadge status={INVOICE_STATUS.DRAFT} />);
		const { container: finalizedCt } = render(<InvoiceStatusBadge status={INVOICE_STATUS.FINALIZED} />);
		const draftBg = (draftCt.firstChild as HTMLElement).style.backgroundColor;
		const finalizedBg = (finalizedCt.firstChild as HTMLElement).style.backgroundColor;
		expect(draftBg).toBeTruthy();
		expect(finalizedBg).toBeTruthy();
		expect(draftBg).not.toBe(finalizedBg);
	});

	it('lets labelOverride win over the mapped label', () => {
		render(<InvoiceStatusBadge status={INVOICE_STATUS.DRAFT} labelOverride='Pending review' />);
		expect(screen.getByText('Pending review')).toBeInTheDocument();
		expect(screen.queryByText('Draft')).not.toBeInTheDocument();
	});

	it('falls back to String(status) for unknown statuses', () => {
		render(<InvoiceStatusBadge status={'UNKNOWN' as INVOICE_STATUS} />);
		expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
	});

	it('forwards className to the rendered Chip', () => {
		const { container } = render(<InvoiceStatusBadge status={INVOICE_STATUS.FINALIZED} className='custom-class' />);
		expect(container.firstChild).toHaveClass('custom-class');
	});
});
