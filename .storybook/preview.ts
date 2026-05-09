import '../src/index.css';
import type { Preview } from '@storybook/react';
import { withProviders } from './withProviders';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			config: {
				rules: [],
			},
		},
	},
	decorators: [withProviders],
};

export default preview;
