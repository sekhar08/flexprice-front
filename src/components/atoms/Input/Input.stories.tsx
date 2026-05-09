import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import Input from './Input';

/**
 * Input is the canonical text/number field used across forms in the app.
 *
 * Props:
 * - `variant`: `text` | `number` | `formatted-number` (auto thousands separators) | `integer`
 * - `label`, `description`, `error`: built-in surrounding text — no need for an external `<Label>`
 * - `inputPrefix` / `suffix`: ReactNode slots inside the input frame (e.g. `$`, `USD`)
 * - `onChange(value: string)`: receives the *unformatted* string for number variants
 * - `formatOptions`: separator / decimals / negative configuration (number variants only)
 * - `size`: shared `SizeVariant` token
 * - `disabled`: standard disabled state
 */
const meta: Meta<typeof Input> = {
	title: 'Atoms/Input',
	component: Input,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		placeholder: 'Type here…',
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['text', 'number', 'formatted-number', 'integer'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg'],
		},
		disabled: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Input>;

const Controlled = (props: React.ComponentProps<typeof Input>) => {
	const [value, setValue] = useState((props.value as string) ?? '');
	return <Input {...props} value={value} onChange={(v) => setValue(v)} />;
};

/** Plain text input with a placeholder. */
export const Default: Story = {
	render: (args) => <Controlled {...args} />,
};

/** Inputs render their own label above the field. */
export const WithLabel: Story = {
	args: { label: 'Email', placeholder: 'jane@flexprice.io' },
	render: (args) => <Controlled {...args} />,
};

/** Errors render in destructive style below the field. */
export const WithError: Story = {
	args: { label: 'Email', error: "That doesn't look like a valid email", value: 'not-an-email' },
	render: (args) => <Controlled {...args} />,
};

/** A leading `$` prefix is the canonical price-input look. */
export const CurrencyPrefix: Story = {
	args: {
		label: 'Amount',
		variant: 'formatted-number',
		inputPrefix: <span className='text-muted-foreground'>$</span>,
		suffix: 'USD',
		placeholder: '0.00',
	},
	render: (args) => <Controlled {...args} value='1234567.89' />,
};

/** Integer-only — pattern blocks decimals at the keystroke level. */
export const IntegerOnly: Story = {
	args: { label: 'Quantity', variant: 'integer', placeholder: '0' },
	render: (args) => <Controlled {...args} />,
};

/** Disabled inputs use a muted text colour and ignore typing. */
export const Disabled: Story = {
	args: { label: 'Locked field', value: 'cannot edit', disabled: true },
	render: (args) => <Controlled {...args} />,
};

/**
 * Interaction test: typing into the input must call `onChange`
 * once per keystroke with the cumulative text-variant value.
 */
export const TypingFiresOnChange: Story = {
	args: {
		placeholder: 'type here',
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('type here');
		await userEvent.type(input, 'abc');
		await expect(args.onChange).toHaveBeenCalledTimes(3);
		await expect(args.onChange).toHaveBeenLastCalledWith('abc');
	},
};
