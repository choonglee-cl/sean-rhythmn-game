const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./lib/endless.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/lib/'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '.'),
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    inline: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
};
