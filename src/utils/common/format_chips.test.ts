import { describe, it, expect } from 'vitest';
import formatChips from './format_chips';
import { ENTITY_STATUS } from '@/models';

describe('formatChips', () => {
	it('maps PUBLISHED to "Active"', () => {
		expect(formatChips(ENTITY_STATUS.PUBLISHED)).toBe('Active');
	});

	it('maps ARCHIVED to "Inactive"', () => {
		expect(formatChips(ENTITY_STATUS.ARCHIVED)).toBe('Inactive');
	});

	it('maps DELETED to "Inactive"', () => {
		expect(formatChips(ENTITY_STATUS.DELETED)).toBe('Inactive');
	});

	it('returns "Inactive" for an unknown status', () => {
		expect(formatChips('something_else')).toBe('Inactive');
	});

	it('returns "Inactive" for an empty string', () => {
		expect(formatChips('')).toBe('Inactive');
	});

	it('is case-sensitive (uppercase PUBLISHED is not matched)', () => {
		// Enum values are lowercase ('published'); the SCREAMING_CASE name
		// should fall through to the default branch.
		expect(formatChips('PUBLISHED')).toBe('Inactive');
	});
});
