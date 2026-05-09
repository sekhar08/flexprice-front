import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import Select, { type SelectOption } from './Select';
import SearchableSelect from './SearchableSelect';

/**
 * Select renders a single-select dropdown built on top of Radix Select.
 *
 * Props:
 * - `options`: list of `{ value, label, description?, disabled?, prefixIcon?, suffixIcon? }`
 * - `value` / `onChange(value)`: controlled API
 * - `label`, `required`, `description`, `error`: surrounding form chrome
 * - `isRadio`: render options with a radio indicator instead of a checkmark
 * - `noOptionsText`: shown when `options` is empty
 * - `trigger`: replace the default trigger content with custom JSX
 *
 * The companion `SearchableSelect` component (same folder) layers a
 * Command-based search input on top of the same option model.
 */
const meta: Meta<typeof Select> = {
	title: 'Atoms/Select',
	component: Select,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		disabled: { control: 'boolean' },
		isRadio: { control: 'boolean' },
		required: { control: 'boolean' },
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
type Story = StoryObj<typeof Select>;

const planOptions: SelectOption[] = [
	{ value: 'starter', label: 'Starter', description: 'Up to 1k events / mo' },
	{ value: 'growth', label: 'Growth', description: 'Up to 100k events / mo' },
	{ value: 'scale', label: 'Scale', description: 'Up to 10M events / mo' },
	{ value: 'enterprise', label: 'Enterprise', description: 'Custom — talk to sales', disabled: true },
];

const Controlled = (props: React.ComponentProps<typeof Select>) => {
	const [value, setValue] = useState(props.value ?? '');
	return (
		<Select
			{...props}
			value={value}
			onChange={(next) => {
				setValue(next);
				props.onChange?.(next);
			}}
		/>
	);
};

/** Default checkmark-style select. */
export const Default: Story = {
	args: { options: planOptions, label: 'Plan', placeholder: 'Choose a plan' },
	render: (args) => <Controlled {...args} />,
};

/** Radio-style indicator instead of a checkmark. */
export const RadioMode: Story = {
	args: { options: planOptions, label: 'Plan', placeholder: 'Choose a plan', isRadio: true },
	render: (args) => <Controlled {...args} />,
};

/** Required + error state. */
export const WithError: Story = {
	args: {
		options: planOptions,
		label: 'Plan',
		placeholder: 'Choose a plan',
		required: true,
		error: 'A plan is required to continue',
	},
	render: (args) => <Controlled {...args} />,
};

/** Disabled select cannot be opened. */
export const Disabled: Story = {
	args: { options: planOptions, label: 'Plan', placeholder: 'Choose a plan', disabled: true, value: 'growth' },
	render: (args) => <Controlled {...args} />,
};

/**
 * `SearchableSelect` is the typeahead variant — useful when the option list
 * grows large (customers, plans, features). It accepts the same option shape.
 */
export const Searchable: StoryObj<typeof SearchableSelect> = {
	render: () => {
		const Demo = () => {
			const [value, setValue] = useState('');
			return (
				<div style={{ width: 320 }}>
					<SearchableSelect label='Plan' placeholder='Search plans…' options={planOptions} value={value} onChange={setValue} />
				</div>
			);
		};
		return <Demo />;
	},
};

/**
 * Interaction test: open the trigger, click an option, expect onChange fired
 * with the option's value.
 */
export const SelectingOptionFiresOnChange: Story = {
	args: {
		options: planOptions,
		label: 'Plan',
		placeholder: 'Choose a plan',
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox');
		await userEvent.click(trigger);
		// Radix Select renders options into a portal at document.body, not within canvas.
		const option = await waitFor(() => within(document.body).getByText('Growth'));
		await userEvent.click(option);
		await waitFor(() => expect(args.onChange).toHaveBeenCalledWith('growth'));
	},
};
