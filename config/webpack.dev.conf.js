const merge = require("webpack-merge");
const constant = require('./constant.js');
const webpackConfigBase = require('./webpack.base.conf.js');
const webpack = require("webpack");


const webpackConfigDev = {
	output: {
		filename: constant.jsDirName + '/[name].[hash:8].js',
	},
	devtool: "#cheap-module-eval-source-map",
	devServer: constant.devServer,
	plugins: [
		//开启热更新
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
	],
}

module.exports = merge(webpackConfigBase, webpackConfigDev);