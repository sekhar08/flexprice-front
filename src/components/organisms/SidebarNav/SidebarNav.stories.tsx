import type { Meta, StoryObj } from '@storybook/react';
import {
	LayoutDashboard,
	Receipt,
	Users,
	CreditCard,
	BarChart3,
	Settings,
	HelpCircle,
	Plug,
	Sparkles,
	LogOut,
	ChevronsUpDown,
} from 'lucide-react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import SidebarNav, { type NavItem, type NavGroup } from './SidebarNav';

/**
 * `SidebarNav` is the primary application navigation rail. It composes
 * the shadcn `Sidebar` primitives into a collapsible, keyboard-shortcutable
 * menu with active-route highlighting.
 *
 * The component is a *child* of `SidebarProvider` — the caller wraps both
 * the SidebarNav and the main content area in `SidebarProvider`, which
 * matches how shadcn intends the primitives to be used and lets the
 * trigger button toggle the sidebar's collapsed state from anywhere in
 * the layout.
 *
 * Stories below cover:
 * - Default — flat menu, one item active
 * - Grouped — sectioned menu with headers
 * - Collapsed — initial icon-only state (hover an item to see its tooltip)
 */
const meta: Meta<typeof SidebarNav> = {
	title: 'Organisms/SidebarNav',
	component: SidebarNav,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarNav>;

const flatItems: NavItem[] = [
	{ label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
	{ label: 'Customers', icon: Users, to: '/customers' },
	{ label: 'Subscriptions', icon: CreditCard, to: '/subscriptions' },
	{ label: 'Invoices', icon: Receipt, to: '/invoices' },
	{ label: 'Analytics', icon: BarChart3, to: '/analytics' },
];

const groupedItems: NavGroup[] = [
	{
		title: 'Workspace',
		items: [
			{ label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
			{ label: 'Customers', icon: Users, to: '/customers' },
			{ label: 'Subscriptions', icon: CreditCard, to: '/subscriptions' },
			{ label: 'Invoices', icon: Receipt, to: '/invoices' },
		],
	},
	{
		title: 'Configure',
		items: [
			{ label: 'Integrations', icon: Plug, to: '/integrations' },
			{ label: 'Settings', icon: Settings, to: '/settings' },
		],
	},
	{
		title: 'Help',
		items: [{ label: 'Documentation', icon: HelpCircle, to: '/help' }],
	},
];

const Header = () => (
	<div className='flex items-center gap-2 px-2 py-1.5'>
		<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground'>
			<Sparkles size={16} />
		</div>
		{/* Hide the wordmark when the sidebar collapses to icon-only width. */}
		<span className='text-sm font-semibold group-data-[collapsible=icon]:hidden'>FlexPrice</span>
	</div>
);

const USER_EMAIL = 'testuser@gmail.com';

/**
 * Bottom-of-sidebar user chip — clicking opens a popover with Settings
 * and Logout. The email collapses to just the avatar when the sidebar
 * is in icon-only mode.
 */
const UserChip = () => (
	<DropdownMenu>
		<DropdownMenuTrigger className='flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
			<div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white'>
				{USER_EMAIL.charAt(0).toUpperCase()}
			</div>
			<span className='flex-1 truncate text-xs text-zinc-700 group-data-[collapsible=icon]:hidden'>{USER_EMAIL}</span>
			<ChevronsUpDown className='size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden' />
		</DropdownMenuTrigger>
		<DropdownMenuContent side='top' align='start' className='w-[--radix-dropdown-menu-trigger-width] min-w-[180px]'>
			<DropdownMenuItem className='gap-2'>
				<Settings className='size-4' />
				<span>Settings</span>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem className='gap-2'>
				<LogOut className='size-4' />
				<span>Logout</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

interface ShellProps {
	defaultOpen?: boolean;
	children: React.ReactNode;
}

/**
 * Wraps the story in a `SidebarProvider` and a main content area, the
 * same way the live app does it.
 */
const Shell = ({ defaultOpen = true, children }: ShellProps) => (
	<SidebarProvider defaultOpen={defaultOpen}>
		{children}
		<SidebarInset>
			<header className='flex h-12 items-center gap-2 border-b border-border/60 px-4'>
				<SidebarTrigger />
				<span className='text-sm font-medium text-zinc-700'>Workspace</span>
			</header>
			<main className='p-6 text-sm text-muted-foreground'>
				<p>Body content goes here. Click the trigger button (top-left) to toggle the sidebar.</p>
			</main>
		</SidebarInset>
	</SidebarProvider>
);

/** Flat menu with `Subscriptions` highlighted as the active route. */
export const Default: Story = {
	render: () => (
		<Shell>
			<SidebarNav header={<Header />} items={flatItems} activePath='/subscriptions' footer={<UserChip />} />
		</Shell>
	),
};

/** Sectioned navigation — Workspace, Configure, Help. */
export const Grouped: Story = {
	render: () => (
		<Shell>
			<SidebarNav header={<Header />} groups={groupedItems} activePath='/customers' footer={<UserChip />} />
		</Shell>
	),
};

/** Initial collapsed (icon-only) state. Hover any item to see its tooltip. */
export const Collapsed: Story = {
	render: () => (
		<Shell defaultOpen={false}>
			<SidebarNav header={<Header />} items={flatItems} activePath='/dashboard' footer={<UserChip />} />
		</Shell>
	),
};
