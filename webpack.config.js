const path              = require('path')
const autoprefixer      = require('autoprefixer')
const webpack           = require('webpack')
const { NODE_ENV }      = require('./config')
const path_node_modules = path.resolve(__dirname, 'node_modules')
const path_src          = path.resolve(__dirname, 'src')
const is_development    = NODE_ENV === 'development'

const plugins = {
  dev: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  prod: [
    new (require('compression-webpack-plugin'))({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html)$/,
      threshold: 1024,
      minRatio: 0.8
    }),

    new (require('brotli-webpack-plugin'))({
      asset: '[path].br[query]',
      test: /\.(js|css|html)$/,
      threshold: 1024,
      minRatio: 0.8
    })
  ]
}

const webpack_modules = {
  rules: [
    { test: /\.js/,
      exclude: path_node_modules,
      include: path_src,
      loader: 'babel-loader',
      query: {
        presets: [
          ['@babel/preset-env', {
            "useBuiltIns": "usage",
          }]
        ]
      }
    },

    { test: /\.scss/,
      use: [
        { loader: 'file-loader', options: { name: 'build.css' } },
        { loader: 'extract-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader', options: { plugins: () => [autoprefixer()] } },
        { loader: 'sass-loader',
          options: {
            webpackImporter: false,
            implementation: require('sass'),
            sassOptions: { includePaths: [path_node_modules] },
          }
        },
      ]
    }
  ]
}

// WEBPACK CONFIG
webpack_config = {
  mode:    NODE_ENV,
  entry:   ['./src/app.js', './src/main.scss'],
  plugins: is_development ? plugins.dev : plugins.prod,
  module:  webpack_modules,
  output: {
    path:     path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  }
}

if (is_development) {
  webpack_config.devtool = 'inline-source-map'
}

module.exports = webpack_config
