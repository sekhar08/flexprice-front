import { FC } from 'react';
import Progress from '@/components/atoms/Progress/Progress';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/utils/common';

interface UsageBarProps {
	/** What the usage represents — e.g. "API calls", "GB transferred". */
	label?: string;
	/** Units consumed so far in the period. */
	used: number;
	/** Total units entitled. Pass `Infinity` or `null` for unlimited. */
	entitled: number | null;
	/** Show the consumed/entitled count under the bar. Defaults to true. */
	showCounts?: boolean;
	/** Show the percent on the right of the label row. Defaults to true. */
	showPercent?: boolean;
	className?: string;
}

const formatCount = (n: number) => {
	if (!Number.isFinite(n)) return '∞';
	if (Math.abs(n) >= 1000) return formatCompactNumber(n);
	return String(n);
};

/**
 * `UsageBar` shows how much of an entitlement has been consumed.
 *
 * Visual rules:
 * - 0–80% — primary blue
 * - 80–99% — warning orange
 * - 100%+ — destructive red (clamped to 100% bar width but the label shows the raw percent)
 * - `entitled` of `null` or `Infinity` renders an unlimited indicator.
 */
const UsageBar: FC<UsageBarProps> = ({ label, used, entitled, showCounts = true, showPercent = true, className }) => {
	const isUnlimited = entitled === null || entitled === Infinity || entitled === 0;
	const rawPercent = isUnlimited ? 0 : (used / (entitled as number)) * 100;
	const clampedPercent = Math.min(Math.max(rawPercent, 0), 100);

	const indicatorColor = isUnlimited
		? 'bg-primary'
		: rawPercent >= 100
			? 'bg-destructive'
			: rawPercent >= 80
				? 'bg-amber-500'
				: 'bg-primary';

	const percentLabel = isUnlimited ? 'Unlimited' : `${Math.round(rawPercent)}%`;
	const countLabel = isUnlimited ? `${formatCount(used)} used` : `${formatCount(used)} / ${formatCount(entitled as number)}`;

	return (
		<div className={cn('w-full flex flex-col gap-1.5', className)}>
			{(label || showPercent) && (
				<div className='flex items-baseline justify-between text-xs'>
					{label ? <span className='font-medium text-zinc-700'>{label}</span> : <span />}
					{showPercent && (
						<span className={cn('font-medium tabular-nums', rawPercent >= 100 && !isUnlimited && 'text-destructive')}>{percentLabel}</span>
					)}
				</div>
			)}
			<Progress value={clampedPercent} indicatorColor={indicatorColor} className='h-2' />
			{showCounts && <span className='text-xs text-muted-foreground tabular-nums'>{countLabel}</span>}
		</div>
	);
};

export default UsageBar;
