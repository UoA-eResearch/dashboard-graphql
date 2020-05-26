// https://www.gorillastack.com/news/optimizing-your-lambda-cold-starts-with-serverless-webpack/
// https://medium.com/a-man-with-no-server/deploying-a-serverless-application-using-webpack-and-babel-to-support-es2015-to-aws-2f61cff8bafb

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
   entry: slsw.lib.entries,
   mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
   target: 'node',
   optimization: {
       minimize: false,
   },
   externals: [nodeExternals()],
   devtool: 'cheap-module-source-map',
   output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, '.webpack'),
      filename: '[name].js',
   },
   module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { node: "current" }, useBuiltIns: 'usage', corejs: 3 }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
};