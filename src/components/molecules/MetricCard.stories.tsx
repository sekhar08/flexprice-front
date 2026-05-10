import type { Meta, StoryObj } from '@storybook/react';
import MetricCard from './MetricCard';

/**
 * `MetricCard` is the canonical KPI tile shown on the dashboard. It formats
 * the `value` according to the supplied `currency` / `isPercent` props and
 * optionally renders a trending arrow.
 *
 * Props:
 * - `title`: caption above the value
 * - `value`: numeric KPI (formatted with thousands separators + 2 decimals)
 * - `currency`: ISO 4217 code — flips the formatter to render the matching symbol
 * - `isPercent`: render as a percentage instead of currency
 * - `showChangeIndicator`: turns on the trending arrow
 * - `isNegative`: paints the arrow red and flips it down
 */
const SingleCard: import('@storybook/react').Decorator = (Story) => (
	<div style={{ width: 280 }}>
		<Story />
	</div>
);

const meta: Meta<typeof MetricCard> = {
	title: 'Molecules/MetricCard',
	component: MetricCard,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	args: {
		title: 'Active subscriptions',
		value: 1842,
	},
	argTypes: {
		isPercent: { control: 'boolean' },
		showChangeIndicator: { control: 'boolean' },
		isNegative: { control: 'boolean' },
		currency: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

/** Plain numeric KPI. */
export const Numeric: Story = { decorators: [SingleCard] };

/** USD currency formatting. */
export const Currency: Story = {
	decorators: [SingleCard],
	args: { title: 'MRR', value: 184250.32, currency: 'USD' },
};

/** Percentage value. */
export const Percent: Story = {
	decorators: [SingleCard],
	args: { title: 'Conversion rate', value: 12.4, isPercent: true },
};

/** Positive trend — arrow up, green. */
export const PositiveTrend: Story = {
	decorators: [SingleCard],
	args: { title: 'Monthly active customers', value: 4283, showChangeIndicator: true },
};

/** Negative trend — arrow down, red. */
export const NegativeTrend: Story = {
	decorators: [SingleCard],
	args: { title: 'Churn', value: 3.2, isPercent: true, showChangeIndicator: true, isNegative: true },
};

/** Dashboard row of four — typical layout. Renders full-width inside the iframe. */
export const DashboardRow: Story = {
	render: () => (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			<MetricCard title='MRR' value={184250.32} currency='USD' showChangeIndicator />
			<MetricCard title='Active subscriptions' value={1842} showChangeIndicator />
			<MetricCard title='Churn' value={3.2} isPercent showChangeIndicator isNegative />
			<MetricCard title='Conversion rate' value={12.4} isPercent showChangeIndicator />
		</div>
	),
};
