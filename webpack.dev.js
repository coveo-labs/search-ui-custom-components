const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: `./js/[name].js`
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css'
    })
  ],
  devServer: {
    stats: {
      colors: true
    },
    publicPath: '/assets/',
    compress: true,
    before(app) {
      app.set('view engine', 'ejs');
      app.get('/', (req, res) => {
        res.render(`index`, {filename: 'index'}, (err, html) => {
          if (err) {
            console.error(err);
            res.status(404).send('Page not found');
          } else {
            res.send(html);
          }
        });
      });
      app.get('/views/*', (req, res) => {
        res.render(req.params[0] + '.ejs', {filename: req.params[0]}, (err, html) => {
          if (err) {
            console.error(err);
            res.status(404).send('Page not found');
          } else {
            res.send(html);
          }
        });
      });
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
});
