import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Check, AlertTriangle, X, Info, Circle, Sparkles } from 'lucide-react';
import Chip from './Chip';

/**
 * Chip is a small pill that conveys status (subscription state, invoice state,
 * plan state, etc.). It supports five semantic variants, a leading icon,
 * a trailing slot (`childrenAfter`), and an optional click handler.
 *
 * Props:
 * - `label`: chip body
 * - `variant`: `default` | `success` | `warning` | `failed` | `info`
 * - `icon` / `childrenAfter`: leading / trailing slots
 * - `onClick`: when provided, the chip becomes keyboard-activatable (Enter/Space)
 * - `disabled`: dims the chip and disables click/keyboard activation
 * - `bgColor` / `textColor` / `borderColor`: per-instance overrides
 */
const meta: Meta<typeof Chip> = {
	title: 'Atoms/Chip',
	component: Chip,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		label: 'Active',
		variant: 'success',
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'success', 'warning', 'failed', 'info'],
		},
		disabled: { control: 'boolean' },
		onClick: { action: 'clicked' },
	},
};

export default meta;
type Story = StoryObj<typeof Chip>;

/** Default success chip. */
export const Default: Story = {};

/** Every semantic variant. Useful for cross-checking color tokens. */
export const Variants: Story = {
	render: (args) => (
		<div className='flex flex-wrap gap-3'>
			<Chip {...args} label='Default' variant='default' />
			<Chip {...args} label='Active' variant='success' />
			<Chip {...args} label='Pending' variant='warning' />
			<Chip {...args} label='Failed' variant='failed' />
			<Chip {...args} label='Info' variant='info' />
		</div>
	),
};

/** Chips can carry a leading icon to reinforce meaning. */
export const WithIcons: Story = {
	render: (args) => (
		<div className='flex flex-wrap gap-3'>
			<Chip {...args} label='Paid' variant='success' icon={<Check size={14} />} />
			<Chip {...args} label='Pending' variant='warning' icon={<AlertTriangle size={14} />} />
			<Chip {...args} label='Failed' variant='failed' icon={<X size={14} />} />
			<Chip {...args} label='Draft' variant='info' icon={<Info size={14} />} />
			<Chip {...args} label='Archived' variant='default' icon={<Circle size={14} />} />
		</div>
	),
};

/** A trailing slot is useful for counts or close affordances. */
export const WithTrailingSlot: Story = {
	args: {
		label: 'Premium',
		variant: 'info',
		icon: <Sparkles size={14} />,
		childrenAfter: <span className='text-xs font-medium'>×3</span>,
	},
};

/** Disabled chips drop opacity and ignore clicks. */
export const Disabled: Story = {
	args: {
		label: 'Disabled',
		variant: 'success',
		disabled: true,
		onClick: fn(),
	},
};

/** Clickable chips behave like buttons (Enter/Space activate). */
export const Clickable: Story = {
	args: {
		label: 'Click me',
		variant: 'info',
		onClick: fn(),
	},
};
