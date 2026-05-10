import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
	it('renders the title and a number value formatted with two decimals', () => {
		render(<MetricCard title='Total Revenue' value={12345} />);
		expect(screen.getByText('Total Revenue')).toBeInTheDocument();
		expect(screen.getByText('12,345.00')).toBeInTheDocument();
	});

	it('renders 0 as "-" because formatNumber treats falsy values as empty', () => {
		render(<MetricCard title='Customers' value={0} />);
		expect(screen.getByText('-')).toBeInTheDocument();
	});

	it('appends a percent sign when isPercent is true', () => {
		render(<MetricCard title='Conversion' value={75.5} isPercent />);
		expect(screen.getByText('75.50%')).toBeInTheDocument();
	});

	it('prefixes the currency symbol when currency is provided', () => {
		const { container } = render(<MetricCard title='MRR' value={1000} currency='USD' />);
		// `getCurrencySymbol('USD')` resolves via iso-country-currency; assert the
		// number is rendered alongside any non-numeric symbol prefix.
		expect(container.textContent).toMatch(/\D\s1,000\.00$/);
	});

	it('shows the upward trend icon when showChangeIndicator is set and not negative', () => {
		const { container } = render(<MetricCard title='MRR' value={100} showChangeIndicator />);
		expect(container.querySelector('.lucide-trending-up')).toBeInTheDocument();
		expect(container.querySelector('.lucide-trending-down')).not.toBeInTheDocument();
	});

	it('shows the downward trend icon when isNegative is set', () => {
		const { container } = render(<MetricCard title='Churn' value={5} showChangeIndicator isNegative />);
		expect(container.querySelector('.lucide-trending-down')).toBeInTheDocument();
		expect(container.querySelector('.lucide-trending-up')).not.toBeInTheDocument();
	});

	it('hides both trend icons by default', () => {
		const { container } = render(<MetricCard title='Active Plans' value={42} />);
		expect(container.querySelector('.lucide-trending-up')).not.toBeInTheDocument();
		expect(container.querySelector('.lucide-trending-down')).not.toBeInTheDocument();
	});
});
