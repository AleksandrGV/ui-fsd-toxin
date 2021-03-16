const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');

const devWebpackConfig = merge(webpackConfig, {
  mode: 'development',
  devServer: {
    contentBase: webpackConfig.externals.paths.public,
    port: 9000,
    overlay: {
      warnings: true,
      errors: true,
    },
    open: true,
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),

  ],
});

module.exports = new Promise((resolve) => {
  resolve(devWebpackConfig);
});
