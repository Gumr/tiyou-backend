const path = require('path');
const glob = require("glob");
const constant = require('./constant.js');
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PurifyCssWebpack = require("purifycss-webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader');


//扫描入口
const commonLibName = 'common-lib';		// 公共组件JS名字
const allEntry = constant.getEntry('src/pages/**/*Entry.js', 'src/pages/', [commonLibName]);
allEntry.entrys[commonLibName]=[
	'vue',
	path.resolve(__dirname, '../src/common/js/app.js'),
	path.resolve(__dirname, '../src/common/css/app.scss')
];

//postcss-loader配置
const postcssConfig = {plugins:[require("autoprefixer")("last 3 versions","> 5%","ie >= 8","Firefox >= 10","last 3 Safari versions")]};


//基本配置
module.exports = {
	entry: allEntry.entrys,
	output: {
        path: constant.distRoot,
		publicPath: constant.assetsPublicPath
	},
	resolve: {
		extensions: [".js",".css",".scss",".json"],
        alias: {
			"vue" : "vue/dist/vue.js",
            "common": path.resolve(__dirname, '../src/common'),
            "components": path.resolve(__dirname, '../src/components')
        }
    },
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: ["vue-loader"],
				include: constant.srcRoot,
                exclude: /node_modules\//
			},
			{
                test: /\.html$/,
				loader: "html-loader",
				include: constant.srcRoot,
                exclude: /node_modules\//				
			},
			{
				test: /\.js$/,
				use: ["babel-loader"],
				include: constant.srcRoot,
                exclude: /node_modules\//
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						"css-loader",
						{loader: 'postcss-loader',options: postcssConfig}
					]
				}),

				include: constant.srcRoot,
                exclude: /node_modules\//	
			},
			{
				test: /\.(scss|sass)$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						"css-loader",
						{loader: 'postcss-loader',options: postcssConfig},
						"sass-loader"
					]
				}),
				include: constant.srcRoot,
                exclude: /node_modules\//	
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						"css-loader",
						{loader: 'postcss-loader',options: postcssConfig},						
						"less-loader"
						]
				}),
				include: constant.srcRoot,
                exclude: /node_modules\//	
			},
			{
				//当图片较小的时候会把图片BASE64编码，大于limit参数的时候会使用file-loader拷贝
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				use: [{
					loader: "url-loader",
					options: {
						limit: 10240, 	//10KB
						outputPath: constant.imageDirName,
						name: '[name].[hash:8].[ext]'
					}
				}],
				include: constant.srcRoot,
                exclude: /node_modules\//	
			},
			{
				test: /\.(woff|woff2|ttf|eot)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10240,   //10KB
						outputPath: constant.fontDirName,
						name: '[name].[hash:8].[ext]'
					}
				}],
				include: constant.srcRoot,
                exclude: /node_modules\//	
			}
		]
	},
	plugins: [
		//高于15版本的vue-loader版本需要这样处理
		new VueLoaderPlugin(),
		//全局暴露
		new webpack.ProvidePlugin({
			//需要全局引入的东西写在这里
		}),
		//删除dist目录
		new CleanWebpackPlugin(['dist'], {
			root: constant.projectRoot,
			verbose: true 	 //开启在控制台输出信息
		}),
		//静态资源复制
		new CopyWebpackPlugin([{
			from: constant.assetsCopyPath,
			to: constant.distRoot,
			ignore: ['.*']
		}]),
		// 消除未使用的冗余的css代码
		new PurifyCssWebpack({
			paths: glob.sync(path.join(__dirname, "../src/pages/**/*.ejs"))
		}),
		// 提取css
		new ExtractTextPlugin(constant.cssDirName + '/[name].[contenthash:8].css', { allChunks: true }),
		// 提取公共代码
		new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
			name: commonLibName,
            minChunks: Infinity
        }),
	].concat(allEntry.templates)
}
