const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	...defaultConfig,
	// bs-delivery-date nie jest blokiem Gutenberga (brak block.json), więc
	// wp-scripts go nie wykrywa automatycznie — kopiujemy cały folder do
	// build/ bez żadnej kompilacji (to zwykłe pliki PHP/JS/CSS), żeby
	// wdrożenie trzymało się tego samego wzorca co reszta repo (tylko
	// build/ + bs-plugins.php trafiają na serwer).
	plugins: [
		...defaultConfig.plugins,
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: 'src/bs-delivery-date',
					to: 'bs-delivery-date',
				},
			],
		} ),
	],
	entry: {
		...defaultConfig.entry(),
		global: './src/global.scss',
		'global-view': './src/global-view.ts',
	},
};
