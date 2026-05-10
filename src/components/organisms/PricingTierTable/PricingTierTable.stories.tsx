import type { Meta, StoryObj } from '@storybook/react';
import PricingTierTable, { type Tier } from './PricingTierTable';

/**
 * `PricingTierTable` is a pure-display organism for pricing rules. It
 * renders a `Usage range / Unit price / Flat fee / month` table for a
 * `tiered`, `graduated`, or `volume` pricing model and optionally
 * highlights one row to mark the active tier.
 *
 * Pricing models:
 * - **Tiered** — entire usage is billed at the rate of whichever bucket
 *   total usage falls into.
 * - **Graduated** — each tier only applies to units within that band,
 *   like income-tax brackets.
 * - **Volume** — entire usage is billed at the rate of the highest tier
 *   reached. Commonly combined with a per-tier flat fee.
 *
 * Use the Controls panel below the canvas to change `pricingModel`,
 * `currency`, and `highlightedTierIndex` live.
 *
 * This component does **not** compute what a customer owes — it only
 * displays the rule table.
 */
const meta: Meta<typeof PricingTierTable> = {
	title: 'Organisms/PricingTierTable',
	component: PricingTierTable,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		pricingModel: {
			control: 'select',
			options: ['tiered', 'graduated', 'volume'],
			description: 'How the tiers apply to total usage.',
		},
		currency: {
			control: 'text',
			description: 'Currency prefix symbol — defaults to "$".',
		},
		highlightedTierIndex: {
			control: { type: 'number', min: 0, step: 1 },
			description: 'Optional row to visually highlight (e.g. where current usage falls).',
		},
		tiers: { control: false },
	},
};

export default meta;
type Story = StoryObj<typeof PricingTierTable>;

const tieredData: Tier[] = [
	{ from: 0, to: 10_000, unitPrice: 0.05 },
	{ from: 10_000, to: 50_000, unitPrice: 0.03 },
	{ from: 50_000, to: null, unitPrice: 0.01 },
];

const volumeData: Tier[] = [
	{ from: 0, to: 10_000, unitPrice: 0.05, flatFee: 0 },
	{ from: 10_000, to: 50_000, unitPrice: 0.03, flatFee: 49 },
	{ from: 50_000, to: null, unitPrice: 0.01, flatFee: 199 },
];

const manyTiers: Tier[] = [
	{ from: 0, to: 1_000, unitPrice: 0.1 },
	{ from: 1_000, to: 10_000, unitPrice: 0.08 },
	{ from: 10_000, to: 50_000, unitPrice: 0.05 },
	{ from: 50_000, to: 250_000, unitPrice: 0.03 },
	{ from: 250_000, to: 1_000_000, unitPrice: 0.015 },
	{ from: 1_000_000, to: null, unitPrice: 0.005 },
];

/**
 * Tiered pricing — entire usage billed at the rate of whichever bucket
 * total usage falls into. The middle tier is highlighted to show where
 * the customer's current usage sits.
 */
export const Tiered: Story = {
	args: {
		tiers: tieredData,
		pricingModel: 'tiered',
		currency: '$',
		highlightedTierIndex: 1,
	},
};

/** Graduated pricing — each tier applies independently to units within its band. */
export const Graduated: Story = {
	args: {
		tiers: tieredData,
		pricingModel: 'graduated',
		currency: '$',
		highlightedTierIndex: undefined,
	},
};

/**
 * Volume pricing — like tiered, but each tier carries a flat monthly
 * fee in addition to the per-unit rate. The third tier is highlighted.
 */
export const Volume: Story = {
	args: {
		tiers: volumeData,
		pricingModel: 'volume',
		currency: '$',
		highlightedTierIndex: 2,
	},
};

/** Six tiers — sanity check for how the table looks with more rows. */
export const ManyTiers: Story = {
	args: {
		tiers: manyTiers,
		pricingModel: 'graduated',
		currency: '$',
		highlightedTierIndex: undefined,
	},
};
