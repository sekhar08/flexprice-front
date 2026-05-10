import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from '@/components/atoms/DatePicker/DatePicker';

/**
 * Storybook entry for the **date-range pattern** used across the FlexPrice
 * app — two side-by-side `DatePicker` primitives wired to `Start Date` /
 * `End Date` state, with bounds logic that prevents the user from picking
 * an end date on or before the start (and vice-versa).
 *
 * Notes:
 * - There is no "X" clear affordance. Clicking an already-selected day in
 *   the popover deselects it (this is `react-day-picker`'s native
 *   `mode='single'` behaviour, which `DatePicker` propagates as
 *   `setDate(undefined)`).
 * - When start ≥ end, the end auto-advances by one day (and the mirror
 *   case auto-recedes the start). Same logic as
 *   `CustomerAnalyticsTab.tsx:236-256`.
 *
 * The `meta.component` is set to `DatePicker` (the primitive that's
 * actually rendered) so Storybook's autodocs panel reflects what's on
 * screen.
 */
const meta: Meta<typeof DatePicker> = {
	title: 'Molecules/DateRangePicker',
	component: DatePicker,
	// `padded` (not `centered`) so the triggers sit near the top of the
	// iframe and the calendar popover always has room to open *below* them.
	// In `centered` mode the trigger ends up vertically centred, leaving
	// only ~150px below it, which makes Radix flip the calendar to the top.

	parameters: { layout: 'padded' },
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

interface RangeState {
	startDate?: Date;
	endDate?: Date;
}

interface RangeProps {
	initial?: RangeState;
	disabled?: boolean;
	startLabel?: string;
	endLabel?: string;
}

/**
 * Reusable composition of two `DatePicker`s driving a `{startDate, endDate}`
 * range. Mirrors `src/pages/customer/tabs/CustomerAnalyticsTab.tsx:324-344`
 * including the +/- 1-day auto-adjust so the picker can never enter an
 * inverted state.
 */
const DateRange = ({ initial, disabled, startLabel = 'Start Date', endLabel = 'End Date' }: RangeProps) => {
	const [startDate, setStartDate] = useState<Date | undefined>(initial?.startDate);
	const [endDate, setEndDate] = useState<Date | undefined>(initial?.endDate);

	const handleStartDateChange = (date: Date | undefined) => {
		setStartDate(date);
		if (date && endDate && endDate <= date) {
			const newEndDate = new Date(date);
			newEndDate.setDate(newEndDate.getDate() + 1);
			setEndDate(newEndDate);
		}
	};

	const handleEndDateChange = (date: Date | undefined) => {
		setEndDate(date);
		if (date && startDate && startDate >= date) {
			const newStartDate = new Date(date);
			newStartDate.setDate(newStartDate.getDate() - 1);
			setStartDate(newStartDate);
		}
	};

	const minEndDate = startDate ? new Date(new Date(startDate).setDate(startDate.getDate() + 1)) : undefined;
	const maxStartDate = endDate ? new Date(new Date(endDate).setDate(endDate.getDate() - 1)) : undefined;

	return (
		<div className='flex flex-wrap items-end gap-4'>
			{/* Start Date Picker */}
			<div className='min-w-[200px]'>
				<DatePicker
					date={startDate}
					setDate={handleStartDateChange}
					placeholder='Select start date'
					label={startLabel}
					maxDate={maxStartDate}
					disabled={disabled}
				/>
			</div>

			{/* End Date Picker */}
			<div className='min-w-[200px]'>
				<DatePicker
					date={endDate}
					setDate={handleEndDateChange}
					placeholder='Select end date'
					label={endLabel}
					minDate={minEndDate}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

/** Default empty range. Click either picker to pick a date; click the same day again to clear it. */
export const Default: Story = {
	render: () => <DateRange />,
};

/** Pre-selected range — start of the current month to today. */
export const PreSelected: Story = {
	render: () => {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), 1);
		return <DateRange initial={{ startDate: start, endDate: now }} />;
	},
};

/**
 * Demonstrates the bounds: end can't be on or before start, start can't be
 * on or after end. The two pickers' `minDate` / `maxDate` are derived from
 * each other in real time.
 */
export const BoundedToEachOther: Story = {
	render: () => {
		const start = new Date('2026-04-10');
		const end = new Date('2026-04-20');
		return <DateRange initial={{ startDate: start, endDate: end }} />;
	},
};

/** Disabled — both pickers locked. */
export const Disabled: Story = {
	render: () => {
		const start = new Date('2026-04-01');
		const end = new Date('2026-04-30');
		return <DateRange initial={{ startDate: start, endDate: end }} disabled />;
	},
};
