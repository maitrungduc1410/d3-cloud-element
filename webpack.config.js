const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    historyApiFallback: true
  },
  mode: process.env.NODE_ENV || 'development',
  entry: `./src/${process.env.NODE_ENV === 'production' ? 'd3-cloud-element' : 'demo-element'}.ts`,
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        include: [path.resolve(__dirname, "src")],
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".ts"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: true,
      title: "D3 Cloud Element",
      inject: 'body'
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        'package.json',
        'README.md'
      ],
    }),
  ],
};