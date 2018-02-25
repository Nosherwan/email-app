/* global __dirname, process */
const path = require('path'); //node module to resolve paths
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// the path(s) that should be cleaned
const pathsToClean = [
	'www'
];

// the clean options to use
const cleanOptions = {
	// root: '/full/webpack/root/path',
	// exclude: ['shared.js'],
	verbose: true,
	dry: false
};

const babelSettings = {
	extends: path.join(__dirname, '/.babelrc')
};
const PATHS = {
	src: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'www'),
};

const devEntries = [
	'react-hot-loader/patch',
	// 'webpack-dev-server/client?http://0.0.0.0:8080',	//DEV only
	// 'webpack/hot/only-dev-server',											//DEV only
];

let prodEntries = [
	'babel-polyfill',
	'es6-promise',
	'whatwg-fetch',
	PATHS.src
];


module.exports = env => {
	env = { options: process.env.NODE_ENV };

	console.log('webpack-dev-server env =', env);

	if (env && env.options && env.options === 'development') {
		prodEntries = devEntries.concat(prodEntries);
	}

	return {
		// devServer is for dev only
		devServer: {
			compress: true,
			inline: true,
			port: 8080,
			hot: true,
			// outputPath: PATHS.build,
			contentBase: PATHS.build
		},
		// devtool: 'inline-source-map',
		devtool: 'eval-source-map',
		// devtool: 'cheap-module-source-map',
		// devtool: 'inline-source-map',
		entry: {
			'./www': prodEntries,
			vendor: [
				'react',
				'react-dom',
				'react-redux',
				'react-router',
				'react-router-dom',
				'react-router-redux',
				'react-transition-group',
				'prop-types',
				'lodash',
				'immutable',
				'numeral',
				'moment',
				'redux-saga',
				'whatwg-fetch',
				'es6-promise',
				'classnames',
				'history',
				'keymirror',
			],
		},
		output: {
			filename: 'bundle.[hash].js', //destination file name
			path: PATHS.build, //destination folder
			publicPath: '/',                    //append this to your url when trying to access app
			// // export itself to a global var
			// libraryTarget: 'var',
			// // name of the global var: "Foo"
			// library: 'SWSReactApp'
		},
		resolve: {
			modules: [ //will pick up references from other folders
				__dirname,
				path.join(__dirname, 'node_modules')
			],
			plugins: [
			],
			extensions: ['.js', '.jsx'],
			alias: {}
		},
		module: { //add multiple loaders to process files
			noParse: /node_modules\/localforage\/dist/, //localforage comes pre-built webpack does'nt need to do anything
			rules: [
				{
					// Only run .js & .jsx files through Babel
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: babelSettings
						}
					]
				},
				{
					// Transform our own .css files with PostCSS and CSS-modules
					test: /\.css$/,
					// exclude: /node_modules/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								query: {
									modules: true,
									importLoaders: 1,
									localIdentName: '[local]-[hash:base64:5]'
								}
							}
						]
					})
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff',
						name: '[name].[ext]'
					}
				},
				{
					test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					exclude: [/images/],
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					}
				},
				{
					test: /.*\.(gif|png|jpe?g)$/i,
					loader: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]'
							}
						},
						{
							loader: 'image-webpack-loader',
							options: {
								progressive: true,
								optimizationLevel: 7,
								interlaced: false,
								pngquant: {
									quality: '65-90',
									speed: 4
								}
							}
						},
					]
				},
				{
					test: /\.svg$/,
					exclude: /node_modules/,
					loader: 'svg-react-loader'
				}
			]
		},
		plugins: [
			new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),
			new CleanWebpackPlugin(pathsToClean, cleanOptions),
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			new ExtractTextPlugin('styles.css'),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: Infinity,
				filename: '[name].[hash].js',
			}),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'src/index.html'),
				filename: 'index.html',
				inject: 'body',
			}),
			new UglifyJsPlugin({
				sourceMap: true
			})
		]
	};
};
