import { FC, ReactNode } from 'react';
import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
} from '@/components/ui/sidebar';

export interface NavItem {
	label: string;
	icon?: LucideIcon;
	to: string;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

interface SidebarNavProps {
	/** Optional element rendered above the menu — typically a logo or workspace switcher. */
	header?: ReactNode;
	/** Flat list of items. Use `groups` instead for sectioned navigation. */
	items?: NavItem[];
	/** Sectioned navigation. Mutually exclusive with `items`. */
	groups?: NavGroup[];
	/** Pathname to highlight as active. */
	activePath?: string;
	/** Optional element rendered below the menu — typically a settings button or user chip. */
	footer?: ReactNode;
}

/**
 * `SidebarNav` is a collapsible app navigation rail composed from the
 * shadcn `Sidebar` primitives. It exposes a clean two-prop API
 * (`items` *or* `groups`, plus `activePath`) on top of the underlying
 * `Sidebar` / `SidebarMenu` set, and lets the caller drop a logo or
 * footer chip in via the `header` / `footer` slots.
 *
 * - When `items` is provided the menu renders flat.
 * - When `groups` is provided each group becomes a labelled section.
 * - Active items are highlighted by matching `activePath === item.to`.
 * - In the collapsed (icon-only) state each item shows its label as a
 *   tooltip on hover.
 *
 * **The caller must provide a `SidebarProvider`** wrapping this component
 * and the main content area — that's how the shadcn primitives expect to
 * be composed. See `SidebarNav.stories.tsx` for the canonical layout.
 */
const SidebarNav: FC<SidebarNavProps> = ({ header, items, groups, activePath, footer }) => {
	const renderItem = (item: NavItem) => {
		const isActive = activePath === item.to;
		const Icon = item.icon;
		return (
			<SidebarMenuItem key={item.to}>
				<SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
					<Link to={item.to}>
						{Icon && <Icon />}
						<span>{item.label}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	};

	return (
		<Sidebar collapsible='icon'>
			{header && <SidebarHeader>{header}</SidebarHeader>}
			<SidebarContent>
				{items && items.length > 0 && (
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>{items.map(renderItem)}</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
				{groups?.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>{group.items.map(renderItem)}</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			{footer && <SidebarFooter>{footer}</SidebarFooter>}
		</Sidebar>
	);
};

export default SidebarNav;
