import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within } from '@storybook/test';
import { Inbox, Receipt, Search, Plus } from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * `EmptyState` is the canonical empty-page placeholder used when a list,
 * table, or page has no data to render. It exposes a four-prop API
 * (`icon`, `headline`, `subtext`, `cta`) and centres everything inside
 * its container.
 *
 * Use it for:
 * - Tables with zero rows after a filter
 * - First-run pages where the user hasn't created their first record
 * - Search pages with no results
 */
const meta: Meta<typeof EmptyState> = {
	title: 'Organisms/EmptyState',
	component: EmptyState,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	args: {
		icon: <Receipt size={24} />,
		headline: 'No invoices yet',
		subtext: 'When you finalise your first invoice it will show up here.',
		cta: { label: 'Create invoice', onClick: fn() },
	},
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Default — icon, headline, subtext, and a CTA. */
export const Default: Story = {};

/** No CTA — purely informational. */
export const NoCTA: Story = {
	args: {
		icon: <Search size={24} />,
		headline: 'No matches',
		subtext: 'Try adjusting your filters or search query.',
		cta: undefined,
	},
};

/** A custom icon — useful for first-run / onboarding pages. */
export const CustomIcon: Story = {
	args: {
		icon: <Inbox size={24} />,
		headline: 'Your inbox is empty',
		subtext: 'Notifications about plan changes, invoices, and customer events will land here.',
		cta: { label: 'Send a test event', onClick: fn() },
	},
};

/** Subtext omitted — when the headline is enough on its own. */
export const HeadlineOnly: Story = {
	args: {
		icon: <Plus size={24} />,
		headline: 'Add your first plan',
		subtext: undefined,
		cta: { label: 'New plan', onClick: fn() },
	},
};

/**
 * Interaction test: clicking the CTA must invoke `cta.onClick` exactly
 * once. Disabled / no-CTA cases are covered by the other stories.
 */
export const CTAClickFiresHandler: Story = {
	args: {
		icon: <Receipt size={24} />,
		headline: 'No invoices yet',
		subtext: 'When you finalise your first invoice it will show up here.',
		cta: { label: 'Create invoice', onClick: fn() },
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /create invoice/i });
		await userEvent.click(button);
		await expect(args.cta!.onClick).toHaveBeenCalledOnce();
	},
};
