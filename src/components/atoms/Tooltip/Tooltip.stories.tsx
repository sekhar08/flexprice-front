import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';
import Button from '../Button/Button';
import { Info } from 'lucide-react';

/**
 * Tooltip wraps Radix's tooltip primitives with the FlexPrice content style.
 * It owns its own `TooltipProvider` so it can be dropped in anywhere without
 * having to wire up a global provider per story.
 *
 * Props:
 * - `content`: ReactNode shown inside the tooltip body
 * - `side`: which side of the trigger to render on (`top` default)
 * - `align`: alignment along the trigger edge (`start` | `center` | `end`)
 * - `delayDuration`: hover delay in ms before the tooltip appears
 * - `sideOffset`: pixel gap between trigger and tooltip
 */
const meta: Meta<typeof Tooltip> = {
	title: 'Atoms/Tooltip',
	component: Tooltip,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
		align: { control: 'select', options: ['start', 'center', 'end'] },
		delayDuration: { control: { type: 'number', min: 0, step: 50 } },
		sideOffset: { control: { type: 'number', min: 0, step: 2 } },
	},
	args: {
		content: 'Helpful context goes here',
		side: 'top',
		align: 'center',
		children: <Button variant='outline'>Hover me</Button>,
	},
	decorators: [
		(Story) => (
			<div style={{ padding: 80 }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Default tooltip on top, hover the button to see it. */
export const Default: Story = {
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover me</Button>
		</Tooltip>
	),
};

/** All four sides shown together. */
export const Sides: Story = {
	render: (args) => (
		<div className='grid grid-cols-2 gap-12'>
			<Tooltip {...args} side='top' content='Top tooltip'>
				<Button variant='outline'>Top</Button>
			</Tooltip>
			<Tooltip {...args} side='right' content='Right tooltip'>
				<Button variant='outline'>Right</Button>
			</Tooltip>
			<Tooltip {...args} side='bottom' content='Bottom tooltip'>
				<Button variant='outline'>Bottom</Button>
			</Tooltip>
			<Tooltip {...args} side='left' content='Left tooltip'>
				<Button variant='outline'>Left</Button>
			</Tooltip>
		</div>
	),
};

/** A 600ms delay — useful when the tooltip would otherwise feel too eager. */
export const WithDelay: Story = {
	args: { delayDuration: 600, content: 'Showed after 600ms hover' },
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Slow tooltip</Button>
		</Tooltip>
	),
};

/** Tooltips can wrap any element — here, an inline icon. */
export const OnIcon: Story = {
	args: { content: 'This is an informational tooltip' },
	render: (args) => (
		<Tooltip {...args}>
			<span className='inline-flex items-center gap-1 text-muted-foreground cursor-help'>
				<Info size={16} /> Hover the icon
			</span>
		</Tooltip>
	),
};

/** Long content wraps within the tooltip's max-width. */
export const LongContent: Story = {
	args: {
		content: 'When this entitlement runs out the customer is moved to overage pricing at the rate defined on the active plan tier.',
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover for the long version</Button>
		</Tooltip>
	),
};
