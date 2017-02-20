var path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [/node_modules/],
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
