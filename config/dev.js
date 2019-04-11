// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
var path = require('path');

var webpackConfig = merge(commonConfig, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    'webpack/hot/only-dev-server',
    './entry/index.tsx' // the entry point of our app
  ],
  module:{
    rules:[
      {
        test: /\.(c|sc|le)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
          'less-loader',
        ]
      }
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({//主要用来定义全局的环境变量，以便我们在自己的程序中引用它
      'process.env': { // 这是给 React 打包用的
        NODE_ENV: JSON.stringify('development')
      },
      __COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
    }),
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({template: 'view/index.html',}),
  ],
});
const KoaStatic = require('koa-static');
const koaBody = require('koa-body');//拿来上传文件
const BodyParser = require('koa-bodyparser');
var Koa=require('koa'),
    http = require('http');
var app = new Koa();
var _rotr = require('../src/common/serverApis.js');
var staticRoute = require('../src/common/staticRender.js');
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
  }
}));
app.use(BodyParser());
app.use(KoaStatic(path.join( __dirname, '../../static')));//koa的静态资源目录
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  reload: true,
  publicPath: '/',
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compiler));
app.use(async (ctx,next)=>{
  if(ctx.path.match(/^.css|.jpg|static|.svg/)){
    return await staticRoute.routes()(ctx,next)
  }
  else{
    console.log('path',ctx.path);
    return await _rotr.routes()(ctx, next)
  }
});
http.createServer(app.callback()).listen(8800);