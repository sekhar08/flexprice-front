import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within } from '@storybook/test';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';
import Button from './Button';

/**
 * Button is the primary call-to-action element across the FlexPrice app.
 *
 * Props:
 * - `variant`: visual style — `default` (brand navy), `black`, `destructive`, `outline`, `secondary`, `ghost`, `link`
 * - `size`: `default` | `sm` | `lg` | `icon` | `xs`
 * - `isLoading`: replaces children with a spinner and disables interaction
 * - `disabled`: standard disabled state
 * - `prefixIcon` / `suffixIcon`: ReactNodes rendered before/after the label
 * - All standard `<button>` HTML attributes are passed through.
 */
const meta = {
	title: 'Atoms/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		children: 'Click me',
		onClick: fn(),
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'black', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon', 'xs'],
		},
		isLoading: { control: 'boolean' },
		disabled: { control: 'boolean' },
		children: { control: 'text' },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Happy-path button. Click events are captured in the Actions panel. */
export const Default: Story = {};

/** All seven semantic variants side-by-side. */
export const Variants: Story = {
	render: (args) => (
		<div className='flex flex-wrap items-center gap-3'>
			<Button {...args} variant='default'>
				Default
			</Button>
			<Button {...args} variant='black'>
				Black
			</Button>
			<Button {...args} variant='destructive'>
				Destructive
			</Button>
			<Button {...args} variant='outline'>
				Outline
			</Button>
			<Button {...args} variant='secondary'>
				Secondary
			</Button>
			<Button {...args} variant='ghost'>
				Ghost
			</Button>
			<Button {...args} variant='link'>
				Link
			</Button>
		</div>
	),
};

/** All five sizes, from `xs` to `lg` plus square `icon`. */
export const Sizes: Story = {
	render: (args) => (
		<div className='flex flex-wrap items-center gap-3'>
			<Button {...args} size='xs'>
				xs
			</Button>
			<Button {...args} size='sm'>
				sm
			</Button>
			<Button {...args} size='default'>
				default
			</Button>
			<Button {...args} size='lg'>
				lg
			</Button>
			<Button {...args} size='icon' aria-label='add'>
				<Plus />
			</Button>
		</div>
	),
};

/** Loading swaps children for a spinner and makes the button non-interactive. */
export const Loading: Story = {
	args: { isLoading: true, children: 'Saving…' },
};

/** Disabled buttons drop opacity and ignore pointer events. */
export const Disabled: Story = {
	args: { disabled: true, children: 'Unavailable' },
};

/** Buttons can carry leading / trailing icons. */
export const WithIcons: Story = {
	args: {
		prefixIcon: <Plus />,
		suffixIcon: <ArrowRight />,
		children: 'Create plan',
	},
};

/** Destructive variant with a trash icon — typical "delete" affordance. */
export const Destructive: Story = {
	args: {
		variant: 'destructive',
		prefixIcon: <Trash2 />,
		children: 'Delete forever',
	},
};

/**
 * Interaction test: clicking the button fires `onClick`, while the same
 * click on a disabled or loading button must not.
 */
export const ClickFiresOnClick: Story = {
	args: { children: 'Click test', onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /click test/i });
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalledOnce();
	},
};

/**
 * Disabled buttons should not invoke their onClick. We bypass userEvent's
 * `pointer-events: none` guard since the disabled style sets that — the
 * real assertion is that React's native `disabled` attribute swallows the
 * handler call.
 */
export const DisabledDoesNotFire: Story = {
	args: { children: 'Disabled test', disabled: true, onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /disabled test/i });
		await userEvent.click(button, { pointerEventsCheck: 0 });
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
