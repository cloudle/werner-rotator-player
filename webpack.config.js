const path = require('path');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const env = process.env.ENV || 'dev';
const port = process.env.PORT || 3000;
const prod = env === 'prod';
const publicPath = '/';
const entry = prod ? './src/index.js' : './index.js';

const plugins = [
	new DefinePlugin({
		ENV: JSON.stringify(env)
	}),
	new webpack.optimize.OccurrenceOrderPlugin(),
	new HtmlWebpackPlugin({
		isProduction: prod,
		template: 'index.ejs',
		filename: 'index.html',
	}),
	new ProgressBarPlugin({
		width: 39, complete: '█', incomplete: '¦', summary: false,
	}),
];

if (env === 'dev') {
	plugins.push(new webpack.HotModuleReplacementPlugin());
	plugins.push(new webpack.NamedModulesPlugin());
	plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = {
	cache: true,
	devtool: prod ? false : 'eval-source-map',
	entry: {
		app: [entry],
	},
	output: {
		publicPath,
		path: path.join(__dirname, 'web'),
		filename: prod ? 'werner-player.js' : '[name].bundle.js',
		chunkFilename: '[name].js'
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js'],
		alias: {
			'react': 'preact-compat',
			'react-dom': 'preact-compat',
			// Not necessary unless you consume a module using `createClass`
			'create-react-class': 'preact-compat/lib/create-react-class'
		},
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.js?$/,
				loaders: ['babel-loader'],
				exclude: /node_modules|packages/,
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{
				test: /\.(png|jpg|svg|ttf)$/,
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				test: /\.json/,
				loader: 'json-loader'
			}
		],
	},
};