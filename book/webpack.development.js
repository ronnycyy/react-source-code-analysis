const { join } = require('path');

module.exports = {
  devServer: {
    contentBase: join(__dirname, '../dist'),
    hot: true,
    port: 3000
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  }
}