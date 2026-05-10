import { FC } from 'react';
import { cn } from '@/lib/utils';

export type PricingModel = 'tiered' | 'graduated' | 'volume';

export interface Tier {
	from: number;
	/** `null` means "and above" (infinity). */
	to: number | null;
	unitPrice: number;
	flatFee?: number;
}

interface PricingTierTableProps {
	tiers: Tier[];
	pricingModel: PricingModel;
	/** Currency prefix, defaults to `$`. */
	currency?: string;
	/** Index of the tier to visually highlight, e.g. where current usage falls. */
	highlightedTierIndex?: number;
	className?: string;
}

const PRICING_MODEL_LABEL: Record<PricingModel, string> = {
	tiered: 'Tiered pricing',
	graduated: 'Graduated pricing',
	volume: 'Volume pricing',
};

const formatCount = (n: number) => new Intl.NumberFormat('en-US').format(n);

/**
 * Formats the inclusive lower bound of a tier. The first tier starts at
 * its raw `from` value; subsequent tiers display `from + 1` so the
 * visible ranges are non-overlapping ("0 – 10,000" / "10,001 – 50,000").
 */
const formatRange = (tier: Tier, index: number) => {
	const lowerInclusive = index === 0 ? tier.from : tier.from + 1;
	const upperLabel = tier.to === null ? '∞' : formatCount(tier.to);
	return `${formatCount(lowerInclusive)} – ${upperLabel} units`;
};

const formatUnitPrice = (price: number, currency: string) => `${currency}${price.toFixed(3)} / unit`;

const formatFlatFee = (fee: number | undefined, currency: string) => {
	if (!fee || fee === 0) return '—';
	return `${currency}${formatCount(fee)}`;
};

/**
 * `PricingTierTable` displays the pricing rules for a tiered,
 * graduated, or volume-based pricing model.
 *
 * Pure presentation — this component does not compute what a customer
 * would owe; it only renders the rule table.
 *
 * Props:
 * - `tiers`: ordered list of tiers. Each tier carries `from`, `to`
 *   (`null` for "and above"), `unitPrice`, and an optional `flatFee`.
 * - `pricingModel`: how the tiers apply.
 *   - `tiered` — entire usage is billed at the rate of whichever bucket
 *     total usage falls into.
 *   - `graduated` — each tier only applies to units within that band,
 *     like income-tax brackets.
 *   - `volume` — entire usage is billed at the rate of the highest tier
 *     reached, often combined with a per-tier flat fee.
 * - `currency`: prefix symbol, default `$`.
 * - `highlightedTierIndex`: optional index to highlight visually (e.g.
 *   the tier where current usage falls). The row gets a subtle
 *   `var(--color-background-secondary)` background.
 */
const PricingTierTable: FC<PricingTierTableProps> = ({ tiers, pricingModel, currency = '$', highlightedTierIndex, className }) => {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<span className='text-xs uppercase tracking-wide font-medium text-muted-foreground'>{PRICING_MODEL_LABEL[pricingModel]}</span>
			<div className='overflow-hidden rounded-md border border-border'>
				<table className='w-full text-sm'>
					<thead className='bg-muted text-left text-[14px] font-medium text-zinc-700'>
						<tr>
							<th className='px-4 py-3 font-medium'>Usage range</th>
							<th className='px-4 py-3 font-medium'>Unit price</th>
							<th className='px-4 py-3 font-medium'>Flat fee / month</th>
						</tr>
					</thead>
					<tbody>
						{tiers.map((tier, i) => {
							const isHighlighted = highlightedTierIndex === i;
							return (
								<tr
									key={i}
									className={cn(
										'border-t border-border text-zinc-700',
										isHighlighted && 'bg-[var(--color-background-secondary,theme(colors.zinc.50))]',
									)}
									aria-current={isHighlighted ? 'true' : undefined}>
									<td className='px-4 py-3'>{formatRange(tier, i)}</td>
									<td className='px-4 py-3 tabular-nums'>{formatUnitPrice(tier.unitPrice, currency)}</td>
									<td className='px-4 py-3 tabular-nums'>{formatFlatFee(tier.flatFee, currency)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PricingTierTable;
