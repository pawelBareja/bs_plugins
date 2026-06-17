const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		global: './src/global.scss',
		'global-view': './src/global-view.ts',
	},
};
