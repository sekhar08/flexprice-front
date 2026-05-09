import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { TooltipProvider } from '../src/components/ui/tooltip';
import type { Decorator } from '@storybook/react';

const storybookQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			staleTime: Infinity,
			gcTime: Infinity,
		},
		mutations: { retry: false },
	},
});

export const withProviders: Decorator = (Story) => (
	<QueryClientProvider client={storybookQueryClient}>
		<MemoryRouter>
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		</MemoryRouter>
	</QueryClientProvider>
);
