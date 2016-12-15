const path = require('path');
const ENV = process.env.NODE_ENV;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.resolve(__dirname, 'src');

const BUILD_DIR = path.resolve(__dirname, 'build');
const PLUGINS = [];
const PAGE_ENTRIES = {
  index: path.resolve(SRC_DIR, 'index.js'),
  vendor: [
    'babel-polyfill',
    'react',
    'react-dom',
    'react-router',
  ],
};

if (ENV === 'development') {
  PAGE_ENTRIES['webpack-dev-server'] = 'webpack/hot/dev-server';
}

PLUGINS.push(new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'));
PLUGINS.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(ENV)
}));

PLUGINS.push(new HtmlWebpackPlugin({
  inject: 'body',
  template: '!!ejs!src/index.ejs',
  filename: 'index.html',
  chunks: ['vendor', 'index'],
  chunksSortMode: 'dependency',
  environment: process.env.NODE_ENV,
}));

if (ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
    output: {
      comments: false,
    },
  }));
}

module.exports = {
  entry: PAGE_ENTRIES,
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
  },
  resolve: {
    root: ROOT_DIR,
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        include: SRC_DIR,
      },
    ],
    loaders: [
      {
        test: /\.css$/, // Only .css files
        loader: 'style!css?localIdentName=[path][name]---[local]---[hash:base64:5]', // Run both loaders
      },
      {
        test: /\.scss$/,
        loader: 'style!css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!sass',
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=1024&name=[name]-[hash:8].[ext]!image-webpack',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {presets: ['react', 'es2015']}
        // 'babel-loader' is also a legal name to reference
      },
    ],
  },
  plugins: PLUGINS,
  imageWebpackLoader: {
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
  },
};
