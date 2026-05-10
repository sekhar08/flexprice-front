import type { Meta, StoryObj } from '@storybook/react';
import UsageBar from './UsageBar';

/**
 * `UsageBar` visualises consumed-vs-entitled usage in a single horizontal bar.
 * The indicator color shifts from primary → amber → destructive as the
 * usage approaches and exceeds the entitled amount, so a glance is enough
 * to spot customers about to overflow their allowance.
 */
const meta: Meta<typeof UsageBar> = {
	title: 'Molecules/UsageBar',
	component: UsageBar,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	args: {
		label: 'API calls',
		used: 4200,
		entitled: 10000,
	},
	argTypes: {
		used: { control: { type: 'number', min: 0 } },
		entitled: { control: { type: 'number', min: 0 } },
		showCounts: { control: 'boolean' },
		showPercent: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div style={{ width: 360 }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof UsageBar>;

/** 42% used — comfortable green/blue zone. */
export const Default: Story = {};

/** Approaching the limit — bar turns amber. */
export const NearLimit: Story = {
	args: { label: 'GB transferred', used: 8800, entitled: 10000 },
};

/** Over the limit — destructive red, percent label highlighted. */
export const OverLimit: Story = {
	args: { label: 'Events ingested', used: 12500, entitled: 10000 },
};

/** Unlimited entitlement — primary bar at 0% with an "Unlimited" label. */
export const Unlimited: Story = {
	args: { label: 'Seats included', used: 47, entitled: null },
};

/** Used in tightly-packed tables — bar only, no label or counts. */
export const BarOnly: Story = {
	args: { label: undefined, used: 7200, entitled: 10000, showCounts: false, showPercent: false },
};

/** Side-by-side comparison of the four states. */
export const States: Story = {
	render: () => (
		<div className='flex flex-col gap-4'>
			<UsageBar label='Comfortable' used={2300} entitled={10000} />
			<UsageBar label='Near limit' used={9100} entitled={10000} />
			<UsageBar label='Over limit' used={13400} entitled={10000} />
			<UsageBar label='Unlimited' used={3400} entitled={null} />
		</div>
	),
};
