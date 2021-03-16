const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const ImageminWebp = require('imagemin-webp');

const publicWebpackConfig = merge(webpackConfig, {
  mode: 'production',

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', 'public'],
    }),
    new ImageminWebpackPlugin({
      plugins: [
        ImageminWebp({
          quality: 75,
        }),
        ['gifsicle', {}],
        ['jpegtran', { progressive: true, quality: 85 }],
        ['optipng', { optimizationLevel: 3 }],
        [
          'svgo',
          {
            plugins: [
              {
                removeViewBox: false,
              },
            ],
          },
        ],
      ],
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  resolve(publicWebpackConfig);
});
