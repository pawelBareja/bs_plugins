import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: [ '../src/**/*.stories.@(ts|tsx)' ],
	addons: [ '@storybook/addon-essentials' ],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	viteFinal: ( config ) => {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = {
			...( config.resolve.alias as Record< string, string > ),
			'@wordpress/block-editor': path.resolve(
				__dirname,
				'../src/__mocks__/@wordpress/block-editor.tsx'
			),
			'@wordpress/blocks': path.resolve(
				__dirname,
				'../src/__mocks__/@wordpress/blocks.ts'
			),
			'@wordpress/components': path.resolve(
				__dirname,
				'../src/__mocks__/@wordpress/components.tsx'
			),
		};
		return config;
	},
};

export default config;
