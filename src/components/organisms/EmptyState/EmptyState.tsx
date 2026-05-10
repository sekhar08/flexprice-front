import { FC, ReactNode } from 'react';
import Button from '@/components/atoms/Button/Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
	/** Visual — typically a lucide icon, sized 24px or so. */
	icon: ReactNode;
	/** Primary message. */
	headline: string;
	/** Optional supporting copy. */
	subtext?: string;
	/** Optional call-to-action button. */
	cta?: { label: string; onClick: () => void };
	className?: string;
}

/**
 * Generic full-page empty placeholder used when a list, table, or page
 * has no data to show.
 *
 * Layout: vertically centred column with an iconified soft-circle badge,
 * a headline, optional subtext, and an optional CTA button. The whole
 * block stretches to fill its container so it sits naturally inside a
 * page or card body.
 */
const EmptyState: FC<EmptyStateProps> = ({ icon, headline, subtext, cta, className }) => {
	return (
		<div className={cn('flex flex-col items-center justify-center text-center py-12 px-6 gap-3', className)}>
			<div className='flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground'>{icon}</div>
			<h2 className='text-lg font-semibold text-zinc-900'>{headline}</h2>
			{subtext && <p className='text-sm text-muted-foreground max-w-sm'>{subtext}</p>}
			{cta && (
				<div className='pt-2'>
					<Button onClick={cta.onClick}>{cta.label}</Button>
				</div>
			)}
		</div>
	);
};

export default EmptyState;
