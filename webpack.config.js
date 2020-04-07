const path         = require('path')
const glob         = require('glob')
const autoprefixer = require('autoprefixer')

const sass_src = path.join(__dirname, 'src', 'app.scss')
const js_src   = path.join(__dirname, 'src', 'app.js')

module.exports = {
  entry: [sass_src, js_src],
  output: {
    path:     path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './dist'
  },

  devtool: 'inline-source-map',
  devServer: {
    contentbase: './dist'
  },

  module: {
    rules: [
      {
        test: /\.js/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: [
            ['@babel/preset-env', {
              "useBuiltIns": "usage",
            }]
          ]
        }
      },

      {
        test: /\.scss/,
        use: [
          { loader: 'file-loader',
            options: {
              name: 'build.css'
            },
          },

          { loader: 'extract-loader' },

          { loader: 'css-loader' },

          { loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },

          { loader: 'sass-loader',
            options: {
              webpackImporter: false,
              implementation: require('sass'),
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')]
              },
            }
          },
        ]
      }
    ]
  }
}