// production config
var commonConfig=require('./common');
var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件;
const merge = require('webpack-merge');
const path=require('path');

const webpackConfig=merge(commonConfig,{
  mode:'production',
  entry:'./entry/index.tsx',
  devtool:false,
  output: {
    path: path.join(__dirname,'../dist'),
    publicPath: './',
  },
  module:{
    rules:[
      {
        test: /\.(c|sc)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }
    ],
  },
  plugins:[
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({//主要用来定义全局的环境变量，以便我们在自己的程序中引用它
      'process.env': { // 这是给 React 打包用的
        NODE_ENV: JSON.stringify('production')
      },
      __COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
    }),
    new CleanWebpackPlugin('dist', {
      root: '../',
      verbose: false
    }),
    new CopyWebpackPlugin([ // 复制高度静态资源
      {
        context:'../static',
        from: '**/*',
        // to:path.resolve(__dirname, '../dist/static')
        ignore: ['*.md']
      }
    ]),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 30000
    }),
    new MiniCssExtractPlugin({
      filename:  '[name].[contenthash:6].css',
      chunkFilename: '[name].[contenthash:6].css',
    }),
    new OptimizeCssAssetsPlugin(),
    new HtmlWebpackPlugin({
      title: 'react app',
      template: './view/index.html',
      favicon: '../static/images/logo.svg',
      chunksSortMode: 'auto'
    }),
  ]
});
var fs = require('fs');
webpack(webpackConfig, function (err, stats) {
  // show build info to console
  console.log(stats.toString({chunks: false, color: true}));
  // save build info to file
  fs.writeFile(
      path.join(__dirname,'../dist/__build_info__'),
      stats.toString({color: false})
  );
});


