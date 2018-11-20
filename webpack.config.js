require('vue-loader');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = [{
	entry: './app/index.js',
	output: {
		path: __dirname + '/public/js',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
},
{
	entry: './app/usuarios.js',
	output: {
		path: __dirname + '/public/js',
		filename: 'bundle_u.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
}];
