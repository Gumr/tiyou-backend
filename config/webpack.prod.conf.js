const merge = require("webpack-merge");
const constant = require('./constant.js');
const webpackConfigBase = require('./webpack.base.conf.js');
const webpack = require("webpack");


const webpackConfigProd = {
	output: {
		filename: constant.jsDirName + '/[name].[chunkhash:8].js',
	},
	plugins: [
		//压缩JS
		new webpack.optimize.UglifyJsPlugin(),
	]
}

module.exports = merge(webpackConfigBase, webpackConfigProd);