import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface BaseColumn {
	title: ReactNode;
	width?: number | string;
	align?: 'left' | 'center' | 'right';
	className?: string;
}

interface FieldColumn<T> extends BaseColumn {
	fieldName: keyof T;
	render?: never;
}

interface RenderColumn<T> extends BaseColumn {
	fieldName?: never;
	render: (row: T, index: number) => ReactNode;
}

export type VirtualColumn<T> = FieldColumn<T> | RenderColumn<T>;

interface VirtualizedDataTableProps<T> {
	columns: VirtualColumn<T>[];
	data: T[];
	/**
	 * Either a fixed height (in px) for every row, or a function
	 * `(index) => height` for variable-height rows. Defaults to `40`.
	 */
	rowHeight?: number | ((index: number) => number);
	/** Visible-area height in CSS units. Defaults to `480px`. */
	height?: number | string;
	/** Number of extra rows to render above/below the viewport. Defaults to `10`. */
	overscan?: number;
	/** Optional row click handler. */
	onRowClick?: (row: T, index: number) => void;
	className?: string;
}

const cellAlignClass = (align?: 'left' | 'center' | 'right') =>
	align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

/**
 * `VirtualizedDataTable` is a performant table for large datasets — it
 * uses `@tanstack/react-virtual` to render only the rows currently in
 * the viewport (plus an overscan buffer). For 10k rows the DOM only
 * carries ~30–40 `<tr>` nodes at any time, keeping scroll smooth and
 * memory usage flat.
 *
 * The column API matches `FlexpriceTable`'s shape: each column carries a
 * title, plus either a `fieldName` (read straight off the row) or a
 * `render(row, index)` function. Columns may declare `width`, `align`,
 * and a `className`.
 *
 * Pass a fixed `rowHeight` (number) for uniform rows or a function for
 * variable heights — the virtualizer measures dynamic rows after mount
 * and adjusts the scroll surface accordingly.
 *
 * Layout notes:
 * - The header is `position: sticky; top: 0` inside the scroll
 *   container so it stays visible during scroll.
 * - The scroll container itself owns the height. Set `height` to a
 *   number (px) or any CSS dimension; the rows fill the rest.
 */
function VirtualizedDataTable<T>({
	columns,
	data,
	rowHeight = 40,
	height = 480,
	overscan = 10,
	onRowClick,
	className,
}: VirtualizedDataTableProps<T>) {
	const parentRef = useRef<HTMLDivElement | null>(null);

	const estimateSize = typeof rowHeight === 'function' ? rowHeight : () => rowHeight;

	const virtualizer = useVirtualizer({
		count: data.length,
		getScrollElement: () => parentRef.current,
		estimateSize,
		overscan,
	});

	const totalSize = virtualizer.getTotalSize();
	const items = virtualizer.getVirtualItems();

	// Total flex weight is used when a column doesn't declare a width — each
	// flex column gets `1 / (count without explicit widths)` of the leftover.
	const flexCount = columns.filter((c) => c.width === undefined).length || 1;

	const colStyle = (col: VirtualColumn<T>): CSSProperties => {
		if (typeof col.width === 'number') return { width: col.width, flex: 'none' };
		if (typeof col.width === 'string') return { width: col.width, flex: 'none' };
		return { flex: `1 1 ${100 / flexCount}%`, minWidth: 0 };
	};

	const containerStyle: CSSProperties = { height: typeof height === 'number' ? `${height}px` : height };

	return (
		<div
			ref={parentRef}
			className={cn('relative overflow-auto rounded-md border border-border bg-background', className)}
			style={containerStyle}
			role='table'
			aria-rowcount={data.length}
			aria-colcount={columns.length}>
			{/* Header */}
			<div role='row' className='sticky top-0 z-10 flex w-full bg-muted text-[14px] font-medium text-zinc-700 border-b border-border'>
				{columns.map((col, idx) => (
					<div
						role='columnheader'
						key={idx}
						style={colStyle(col)}
						className={cn('px-4 py-2 truncate', cellAlignClass(col.align), col.className)}>
						{col.title}
					</div>
				))}
			</div>

			{/* Virtual scroll surface — total height drives the scrollbar */}
			<div style={{ height: totalSize, position: 'relative' }}>
				{items.map((virtualRow) => {
					const row = data[virtualRow.index];
					return (
						<div
							key={virtualRow.key}
							role='row'
							data-index={virtualRow.index}
							ref={typeof rowHeight === 'function' ? virtualizer.measureElement : undefined}
							onClick={onRowClick ? () => onRowClick(row, virtualRow.index) : undefined}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								transform: `translateY(${virtualRow.start}px)`,
							}}
							className={cn('flex w-full border-b border-border/60 hover:bg-muted/40 transition-colors', onRowClick && 'cursor-pointer')}>
							{columns.map((col, idx) => (
								<div
									role='cell'
									key={idx}
									style={colStyle(col)}
									className={cn('px-4 py-2 text-[14px] truncate self-center', cellAlignClass(col.align), col.className)}>
									{'render' in col && col.render ? col.render(row, virtualRow.index) : String(row[col.fieldName as keyof T] ?? '')}
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default VirtualizedDataTable;
