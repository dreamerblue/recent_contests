const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

const config = {
  entry: {
    background: "./src/background/index.ts",
    popup: "./src/popup/popup.ts",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "async",
    },
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['*', '.tsx', '.ts', '.js', '.vue', '.json'],
  },
  output: {
    filename: "[name]/[name].js",
    path: path.resolve(__dirname, "dist/"),
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./src/manifest.json",
        to: "./manifest.json",
      },
      {
        from: "./src/images/",
        to: "images/",
      },
    ]),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'popup/popup.html',
      template: 'src/popup/popup.html',
      chunks: ['popup'],
      hash: true,
    }),
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.plugins.push(
      new ChromeExtensionReloader({
        port: 9090, // Which port use to create the server
        reloadPage: true, // Force the reload of the page also
        entries: { // The entries used for the content/background scripts
          background: 'background',
        },
      })
    );
  }

  return config;
};
