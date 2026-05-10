import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import SearchBar from './SearchBar';

/**
 * `SearchBar` is a debounced search input. It exposes a fast `onChange`
 * callback (every keystroke) and a debounced `onSearch` callback (fires
 * once after the user stops typing). Used across the customers, invoices,
 * and plans pages to drive table filtering without spamming the API.
 */
const meta: Meta<typeof SearchBar> = {
	title: 'Molecules/SearchBar',
	component: SearchBar,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	args: {
		placeholder: 'Search customers…',
		debounceMs: 300,
		onSearch: fn(),
		onChange: fn(),
	},
	argTypes: {
		debounceMs: { control: { type: 'number', min: 0, step: 50 } },
		disabled: { control: 'boolean' },
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
type Story = StoryObj<typeof SearchBar>;

/** Default uncontrolled bar — type to see the clear button appear. */
export const Default: Story = {};

/** With an initial value pre-filled. */
export const WithValue: Story = {
	args: { defaultValue: 'acme corp' },
};

/** Disabled — cannot type or clear. */
export const Disabled: Story = {
	args: { defaultValue: 'frozen', disabled: true },
};

/** Debounce visualisation: shows the last debounced value alongside live keystrokes. */
export const DebounceDemo: Story = {
	render: () => {
		const Demo = () => {
			const [live, setLive] = useState('');
			const [debounced, setDebounced] = useState('');
			return (
				<div className='flex flex-col gap-3 text-sm'>
					<SearchBar onChange={setLive} onSearch={setDebounced} debounceMs={500} placeholder='Type and pause…' />
					<div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
						<span>
							Live: <span className='text-zinc-900'>{live || '∅'}</span>
						</span>
						<span>
							Debounced (500ms): <span className='text-zinc-900'>{debounced || '∅'}</span>
						</span>
					</div>
				</div>
			);
		};
		return <Demo />;
	},
};

/**
 * Interaction test: typing "abc" with a 0ms debounce should fire `onSearch`
 * once per keystroke with the cumulative value, ending in `abc`.
 */
export const TypingFiresOnSearch: Story = {
	args: { debounceMs: 0, onSearch: fn(), placeholder: 'type here' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('type here');
		await userEvent.type(input, 'abc');
		await waitFor(() => expect(args.onSearch).toHaveBeenLastCalledWith('abc'));
	},
};
