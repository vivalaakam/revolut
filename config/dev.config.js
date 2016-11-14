const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const config = require('./webpack.config.js');
const assetsConfig = require('./assets.config');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(assetsConfig);

config.devtool = 'cheap-module-eval-source-map';
config.entry.unshift(
  'eventsource-polyfill',
  'react-hot-loader/patch',
  'webpack-hot-middleware/client'
);

config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  webpackIsomorphicToolsPlugin.development()
);

module.exports = config;
