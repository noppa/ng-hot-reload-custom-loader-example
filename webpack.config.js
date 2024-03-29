/* eslint-env node */
const webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path');

const mode = process.env.NODE_ENV === 'production' ?
  'production' :
  'development';

let entry = ['./src/index.js'];
let jsLoaders = ['babel-loader'];

const customHotLoader = './development/hot-loader.js'

if (mode === 'development') {
  // Enables hot-reloading using the ng-hot-reload library
  // Only used in development, not in production.
  jsLoaders = [customHotLoader].concat(jsLoaders);
  entry = [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
  ].concat(entry);
}

const distPath = path.join(__dirname, 'dist')

module.exports = {
  mode: mode,
  entry: entry,
  devtool: 'source-map',
  output: {
    path: distPath,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: jsLoaders,
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    contentBase: distPath,
    port: 8080,
    // hotOnly: true, // Disable hard reloading for testing purposes.
  },
};