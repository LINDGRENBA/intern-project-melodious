const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'sketch', to: 'sketch' },
      ],
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),  // ??? OK ???  // DON'T NEED { cleanStale } ???
    new HtmlWebpackPlugin({
      title: 'Melodius',
      template: './index.html',  // structure we want available as soon as it runs - makes template, inserts into body of dist/index.html
      inject: 'body',
    }),
  ],
  output: {
    filename: 'bundle.js', // ??? where to emit the bundles it webpack creates - outputs bundle in dist with name of main.js ???
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(css|css?2020.0.2)$/,
        use: [
          'style-loader',
          'css-loader',
          'app-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,  // NEED TO MAKE CASE-INSENSITIVE ???
        use: [
          'file-loader',
          // options: {  ???
          // name: '[name].[ext]',  ???
          // outputPath: 'assets/images' ???
          // }
        ],
      },
      {
        test: /\.(js|js?2020.0.2)$/,
        exclude: [
          /node_modules/,
          /spec/
        ]
      },   // DO WE NEED CSV, TSV OR XML
      // need rules for mp3 files? sketch files? 
      {
        test: /\.html$/,
        use: [
          'html-loader'
        ]
      },
    ],
  },
};