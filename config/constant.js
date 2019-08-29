const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    // 开发环境,默认开启
    isDev: process.env.NODE_ENV === 'development',
    // 项目根目录
    projectRoot: path.resolve(__dirname, '..'),
    // 源码根目录
    srcRoot: path.resolve(__dirname, '../src'),    
    // 打包编译的根目录
    distRoot: path.resolve(__dirname, '../dist'),
    // 需要拷贝的静态资源的路径
    assetsCopyPath: path.resolve(__dirname, '../src/static'),
    // 从浏览器访问时，资源的根路径
    assetsPublicPath: "/",
    // 所有css编译打包到这个目录
    cssDirName: 'wp/css',
    // 所有js编译打包到这个目录
    jsDirName: 'wp/js',
    // 所有图片编译打包到这个目录
    imageDirName: 'wp/images',
    // 所有字体编译打包到这个目录
    fontDirName: 'wp/fonts',

    // 开发环境服务器启动配置
    devServer: {
        contentBase: this.distRoot,
		host: "127.0.0.1",
		port: 3000,
		overlay: true, 		// 浏览器页面上显示错误
        hot: true, 			// 开启热更新
        proxy: {
            '/api/': {
                target: 'http://tsys.tiyoukids.com',
                secure: false,          //处理https
                changeOrigin: true      //允许跨域
            }
        }
    },

    //自动扫描入口文件和HTML模板
    getEntry: function (globPath, pathDir, commmonChunks, entries) {
        var files = glob.sync(globPath);
        var entries = {},
            templates = [],     //HTML数组
            entry,dirname,extname,basename,pathname,outFileName;
          
        for (var i = 0; i < files.length; i++) {
            entry = files[i];
            dirname = path.dirname(entry);
            extname = path.extname(entry);
            basename = path.basename(entry, extname);
            pathname = path.normalize(path.join(dirname,  basename));
            outFileName = path.normalize(dirname);
            pathDir = path.normalize(pathDir);
    
            if(pathname.startsWith(pathDir)){
                pathname = pathname.substring(pathDir.length)
            }
            
            if(outFileName.startsWith(pathDir)){
                outFileName = outFileName.substring(pathDir.length)
            }else{
                outFileName = pathname;
            }
            // path window和liunx斜线相反 ...
            pathname = pathname.replace(/\\/g,'/');
            outFileName = outFileName.replace(/\\/g,'/');
    
            entries[outFileName] = ['./' + entry];
            templates.push(
                new HtmlWebpackPlugin({
                    template: './src/pages/' + pathname + '.ejs',
                    filename: outFileName + '.html',
                    inject: true,
                    hash: true,
                    chunks: commmonChunks.concat(outFileName),
                    //若是开发环境,则不处理
                    minify: this.isDev ? false : {              
                        removeComments: true,                   //移除HTML中的注释
                        collapseWhitespace: true,               //折叠空白区域,压缩代码
                        removeAttributeQuotes: true             //去除属性的引号
                    },
                })
            );
        }
        return {
            entrys:entries,
            templates:templates
        }
    },    
}
