import { describe, it, expect } from 'vitest';
import formatNumber, { formatCompactNumber } from './format_number';

describe('formatNumber', () => {
	it('formats with default 0 decimals and en-US thousands separator', () => {
		expect(formatNumber(1234)).toBe('1,234');
	});

	it('formats with explicit decimals (rounds to nearest)', () => {
		expect(formatNumber(1234.567, 2)).toBe('1,234.57');
	});

	it('formats negative numbers', () => {
		expect(formatNumber(-1234.5, 1)).toBe('-1,234.5');
	});

	it('returns "-" for 0 (falsy guard)', () => {
		expect(formatNumber(0)).toBe('-');
		expect(formatNumber(0, 2)).toBe('-');
	});

	it('returns "-" for undefined input', () => {
		expect(formatNumber(undefined as unknown as number)).toBe('-');
	});

	it('clamps negative decimals up to 0 without throwing', () => {
		expect(() => formatNumber(1234, -5)).not.toThrow();
		expect(formatNumber(1234, -5)).toBe('1,234');
	});

	it('clamps decimals above 20 down to 20 without throwing', () => {
		expect(() => formatNumber(1234, 99)).not.toThrow();
	});
});

describe('formatCompactNumber', () => {
	it('uses toLocaleString fallback for values below 1,000', () => {
		expect(formatCompactNumber(500)).toBe('500');
	});

	it('formats thousands with k suffix', () => {
		expect(formatCompactNumber(1500)).toBe('1.5k');
	});

	it('strips trailing .0 (1,000 → "1k")', () => {
		expect(formatCompactNumber(1000)).toBe('1k');
	});

	it('formats millions with M suffix', () => {
		expect(formatCompactNumber(1_000_000)).toBe('1M');
		expect(formatCompactNumber(2_500_000)).toBe('2.5M');
	});

	it('formats billions with B suffix', () => {
		expect(formatCompactNumber(2_000_000_000)).toBe('2B');
	});
});
