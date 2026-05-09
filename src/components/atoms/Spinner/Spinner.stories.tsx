import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

/**
 * Spinner is a lightweight inline loading indicator. It inherits color from
 * `currentColor`, so wrap it in a coloured element to tint it.
 *
 * Props:
 * - `size`: pixel size of the SVG (default 24)
 * - `className`: extra Tailwind classes — typically used to set color
 */
const meta: Meta<typeof Spinner> = {
	title: 'Atoms/Spinner',
	component: Spinner,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: { type: 'number', min: 8, max: 96, step: 2 } },
	},
	args: { size: 24 },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

/** Default 24px spinner inheriting current color. */
export const Default: Story = {};

/** A spread of common sizes. */
export const Sizes: Story = {
	render: () => (
		<div className='flex items-end gap-6 text-zinc-700'>
			<div className='flex flex-col items-center gap-2'>
				<Spinner size={16} />
				<span className='text-xs text-muted-foreground'>16</span>
			</div>
			<div className='flex flex-col items-center gap-2'>
				<Spinner size={24} />
				<span className='text-xs text-muted-foreground'>24</span>
			</div>
			<div className='flex flex-col items-center gap-2'>
				<Spinner size={40} />
				<span className='text-xs text-muted-foreground'>40</span>
			</div>
			<div className='flex flex-col items-center gap-2'>
				<Spinner size={64} />
				<span className='text-xs text-muted-foreground'>64</span>
			</div>
		</div>
	),
};

/** Tinted via a wrapping color. */
export const Tinted: Story = {
	render: () => (
		<div className='flex items-center gap-4'>
			<span className='text-emerald-600'>
				<Spinner size={28} />
			</span>
			<span className='text-blue-600'>
				<Spinner size={28} />
			</span>
			<span className='text-rose-600'>
				<Spinner size={28} />
			</span>
		</div>
	),
};
