var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件;

var rootPath = path.resolve(__dirname, '.'), // 项目根目录
    src = path.join(rootPath, 'src'), // 开发源码目录
    env = process.env.NODE_ENV.trim(); // 当前环境


var commonPath = {
  rootPath: rootPath,
  dist: path.join(rootPath, 'dist'), // build 后输出目录
  viewHTML: path.join(src, '/view/index.html'),
  STYLE:path.join(src, 'style'),
  staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
};


var webpackConfig = {
  mode:env,
  entry:{
    vendor:['react','react-dom'],
    main:path.join(src, '/entry/index.tsx')
  },
  output: {
    path: path.join(commonPath.dist, 'static'),
    publicPath: './',
  },
  resolve: {
    //定义资源的默认后缀名
    extensions: ['.ts', '.tsx', '.less', '.json', '.css','js','jsx'],
    alias: {
      COMMON: path.join(src, 'common'),
      COMPONENTS: path.join(src, 'components'),
      VIEW: path.join(src, 'view'),
      STATIC: commonPath.staticDir,
      STYLE:path.join(src, 'style'),
    },
    //设置默认搜索的目录名
    modules: [
      rootPath,
      "node_modules"
    ]
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader', 'source-map-loader'],
      exclude: /node_modules/,
    },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader'],
      }, {
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    },{
      test: /\.(le|c)ss$/,
      use: [
        env==='development'?'style-loader':MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'less-loader',
      ],
    },{
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 10240, // 10KB 以下使用 base64
        name: 'img/[name]-[hash:6].[ext]'
      }
    },
    ],
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  optimization:{
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: -20,
          chunks: 'all'
        },
      }
    },
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({//主要用来定义全局的环境变量，以便我们在自己的程序中引用它
      'process.env': { // 这是给 React 打包用的
        NODE_ENV: JSON.stringify(env==='development'?'development':'production')
      },
      __COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
    })
  ]
};
if(env==='development'){//开发环境
  webpackConfig.entry=[
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:5000',// bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    webpackConfig.entry.main // the entry point of our app
  ];
  webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        template:commonPath.viewHTML,
        chunksSortMode: 'auto',
      }),
  );
  const webpackDevServer = require('webpack-dev-server');
  const options = {
    contentBase: src,
    hot: true,
    host: 'localhost'
  };
  webpackDevServer.addDevServerEntrypoints(webpackConfig, options);
  const compiler = webpack(webpackConfig);
  const server = new webpackDevServer(compiler, options);

  server.listen(5000, 'localhost', () => {
    console.log('dev server listening on port 5000');
  });
}
else{//生产环境
  webpackConfig.plugins.push(
      new CleanWebpackPlugin('dist', {
        root: commonPath.rootPath,
        verbose: false
      }),
      new CopyWebpackPlugin([ // 复制高度静态资源
        {
          context:commonPath.staticDir,
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
        template: commonPath.viewHTML,
        favicon: path.resolve(commonPath.rootPath, '/static/images/logo.svg'),
        chunksSortMode: 'auto'
      }),
  );
  var fs = require('fs');
  webpack(webpackConfig, function (err, stats) {
    // show build info to console
    console.log(stats.toString({chunks: false, color: true}));
    // save build info to file
    fs.writeFile(
        path.join(commonPath.dist, '__build_info__'),
        stats.toString({color: false})
    );
  });
}

