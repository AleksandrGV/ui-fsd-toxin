const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  source: path.join(__dirname, './source'),
  public: path.join(__dirname, './public'),
  // assets: 'assets/'
};

// Для плагина HtmlWebpackPlugin и PUG

const PAGES_DIR = `${PATHS.source}/pug/pages/`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith('.pug'));

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: [
    'webpack-dev-server/client',
    `${PATHS.source}/js/index.js`,
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        chunks: 'all',
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                config: path.resolve(__dirname, './postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                config: path.resolve(__dirname, './postcss.config.js'),
              },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/,
      //   // loader: 'file-loader',
      // },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [
    ...PAGES.map(
      (page) => new HtmlWebpackPlugin({
        hash: false,
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`,
        inject: true,
      }),
    ),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.source}/img`,
          to: `${PATHS.public}/img`,
        },
        {
          from: './source/img/*.(jpeg|jpg|png)',
          to: `${PATHS.public}/img/[name].webp`,
        },
        {
          from: `${PATHS.source}/static`,
          to: `${PATHS.public}`,
        },
      ],
    }),
  ],
  output: {
    filename: 'js/[name].js',
    path: `${PATHS.public}`,
    iife: true,
    publicPath: '/',
  },
};
