import { describe, it, expect } from 'vitest';
import { formatBillingModel, formatBillingPeriodForDisplay } from './helper_functions';

describe('formatBillingModel', () => {
	it.each([
		['FLAT_FEE', 'Flat Fee'],
		['PACKAGE', 'Package'],
		['TIERED', 'Tiered'],
	])('maps %s to %s', (input, expected) => {
		expect(formatBillingModel(input)).toBe(expected);
	});

	it('is case-insensitive', () => {
		expect(formatBillingModel('flat_fee')).toBe('Flat Fee');
		expect(formatBillingModel('Package')).toBe('Package');
	});

	it('returns "--" for unknown models', () => {
		expect(formatBillingModel('NOT_A_MODEL')).toBe('--');
		expect(formatBillingModel('')).toBe('--');
	});
});

describe('formatBillingPeriodForDisplay', () => {
	it.each([
		['DAILY', 'Daily'],
		['WEEKLY', 'Weekly'],
		['MONTHLY', 'Monthly'],
		['ANNUAL', 'Annually'],
		['QUARTERLY', 'Quarterly'],
		['HALF_YEARLY', 'Half Yearly'],
		['ONETIME', 'One-time'],
	])('maps %s to %s', (input, expected) => {
		expect(formatBillingPeriodForDisplay(input)).toBe(expected);
	});

	it('is case-insensitive', () => {
		expect(formatBillingPeriodForDisplay('monthly')).toBe('Monthly');
		expect(formatBillingPeriodForDisplay('Annual')).toBe('Annually');
	});

	it('returns "--" for unknown periods', () => {
		expect(formatBillingPeriodForDisplay('FORTNIGHTLY')).toBe('--');
		expect(formatBillingPeriodForDisplay('')).toBe('--');
	});
});
