import { FC, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import Input from '@/components/atoms/Input/Input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
	/** Initial search value (uncontrolled) or controlled value. */
	value?: string;
	/** Default value for uncontrolled mode. */
	defaultValue?: string;
	/**
	 * Called once per debounce window with the latest input. Pass `0` as
	 * `debounceMs` to fire on every keystroke for testing.
	 */
	onSearch: (value: string) => void;
	/** Optional fast callback that fires on every keystroke (no debounce). */
	onChange?: (value: string) => void;
	/** Debounce window in ms. Default 300ms. */
	debounceMs?: number;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	'aria-label'?: string;
}

/**
 * `SearchBar` wraps `Input` with a leading magnifier glass, a clear button,
 * and a debounced `onSearch` callback. It can be used controlled (pass
 * `value`) or uncontrolled (pass `defaultValue` — the bar manages its own
 * state). Use `onChange` for keystroke-level updates and `onSearch` for the
 * debounced fire that should hit your data layer.
 */
const SearchBar: FC<SearchBarProps> = ({
	value: controlledValue,
	defaultValue = '',
	onSearch,
	onChange,
	debounceMs = 300,
	placeholder = 'Search…',
	disabled,
	className,
	'aria-label': ariaLabel = 'Search',
}) => {
	const [internalValue, setInternalValue] = useState<string>(defaultValue);
	const value = controlledValue ?? internalValue;

	// Track the latest onSearch in a ref so the debounce timer keeps using it
	const onSearchRef = useRef(onSearch);
	useEffect(() => {
		onSearchRef.current = onSearch;
	}, [onSearch]);

	// Debounce — fire onSearch `debounceMs` after the last keystroke.
	const lastFiredRef = useRef<string>(defaultValue);
	useEffect(() => {
		if (value === lastFiredRef.current) return;
		if (debounceMs <= 0) {
			lastFiredRef.current = value;
			onSearchRef.current(value);
			return;
		}
		const timer = window.setTimeout(() => {
			lastFiredRef.current = value;
			onSearchRef.current(value);
		}, debounceMs);
		return () => window.clearTimeout(timer);
	}, [value, debounceMs]);

	const handleChange = (next: string) => {
		if (controlledValue === undefined) setInternalValue(next);
		onChange?.(next);
	};

	const handleClear = () => {
		handleChange('');
	};

	return (
		<div className={cn('relative w-full', className)}>
			<Input
				aria-label={ariaLabel}
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				disabled={disabled}
				inputPrefix={<Search size={16} className='text-muted-foreground' />}
				suffix={
					value ? (
						<button
							type='button'
							aria-label='Clear search'
							onClick={handleClear}
							disabled={disabled}
							className='inline-flex items-center justify-center rounded-sm p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50'>
							<X size={14} />
						</button>
					) : undefined
				}
			/>
		</div>
	);
};

export default SearchBar;
