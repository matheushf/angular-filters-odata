var path = require('path'),
  webpack = require('webpack'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ENV = process.env.ENV = process.env.NODE_ENV = 'development',
  autoprefixer = require('autoprefixer'),
  ProvidePlugin = require('webpack/lib/ProvidePlugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var metadata = {
  title: 'localhost',
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
  ENV: ENV
};

module.exports = {
  // static data for index.html
  // static data for index.html
  // for faster builds use 'eval'
  devtool: 'eval',
  watch: true,
  // cache: false,

  // our angular app
  entry: {
    // vendor: [root('src/vendor')],
    app: [root('src/main')],
    vendor: [
    ],
    polyfills: [root('src/polyfills')]
  },

  // Config for our build files
  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[name]-chunk.js'
  },

  resolve: {
    // certificar que as extensões correspondem
    extensions: ['*', '.ts', '.js', '.json', '.css', '.html', '.async'] // ensure .async.ts etc also works
  },

  module: {
    rules: [
      // {test: /\.ts$/, loader: 'tslint-loader', exclude: [root('node_modules')]},

      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [
          /(\\|\/)node_modules(\\|\/)/
        ]
      },

      // Support Angular 2 async routes via .async.ts
      {
        test: /\.async\.ts$/,
        use: ['es6-promise-loader', 'ts-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      // Support for .ts files.
      // {test: /\.ts$/, loader: 'ts-loader', exclude: [/\.(spec|e2e|async)\.ts$/], options: {transpileOnly: true}},

      {
        test: /\.ts$/,
        use: [{
            loader: '@angularclass/hmr-loader'
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: true
            }
          }, {
            loader: 'angular-router-loader'
          },
        ]
      },

      // Support for CSS as raw text
      {
        test: /\.css$/,
        loaders: ['raw-loader', 'css-loader']
      },
      // {test: /\.css$/, loaders: ['css-loader']},

      // support for .html as raw text
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [root('src/index.html')]
      },

      {
        test: /\.scss$/,
        use: ['raw-loader', 'sass-loader']
      },

      /*{
       test: /\.scss$/,
       use: [
       {
       loader: "css-to-string-loader"
       },
       {
       loader: "style-loader" // creates style nodes from JS strings
       }, {
       loader: "raw-loader"
       }, {
       loader: "resolve-url-loader"
       }, {
       loader: "sass-loader", // compiles Sass to CSS
       options: {
       includePaths: [
       path.resolve("./node_modules/!**")
       ]
       }
       }
       ]
       },*/

      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url?limit=10000&name=[name].[ext]'
      },

      // Bootstrap 4
      {
        test: /bootstrap\/dist\/js\/umd\//,
        loader: 'imports-loader?jQuery=jquery'
      }

    ]
  },

  plugins: [
    /* new BundleAnalyzerPlugin({
      analyzerHost: 'localhost',
      analyzerPort: 3001,
    }), */
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills',
      filename: 'polyfills.bundle.js',
      minChunks: Infinity
    }),
    // static assets
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),
    // generating html
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // replace
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),

    new ProvidePlugin({
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      $: 'jquery',
      'window.$': 'jquery', // dependencia do bootstrap
      'window.Tether': 'tether', // dependencia do bootstrap
      Tether: 'tether', // dependencia do bootstrap
      //Util: 'bootstrap/dist/js/umd/util.js',
      //Rickshaw: 'rickshaw',
      //Skycons: 'skycons/skycons',
      //"window['Morris']": 'morris.js/morris.js',
      //"window['GMaps']": 'gmaps',
      //Dropzone: 'dropzone/dist/dropzone.js',
      //Switchery: 'switchery/dist/switchery.js',
      //Backbone: 'backbone',
      //PageableCollection: 'backbone.paginator/lib/backbone.paginator.js',
      //Backgrid: 'backgrid/lib/backgrid.js',
      //'_': "underscore",
      moment: 'moment',
      //Holder: 'jasny-bootstrap/docs/assets/js/vendor/holder.js',
      //markdown: 'markdown/lib/markdown.js',
      //Shuffle: 'shufflejs/dist/shuffle.js',
      easyPieChart: 'easy-pie-chart/dist/jquery.easypiechart.js',
      //ProgressBar: 'progressbar.js/dist/progressbar.min.js'
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: false,
          failOnHint: false,
          resourcePath: 'src'
        },
        resolve: {
          extensions: ['.ts', '.tsx', '.js']
        },
        metadata: metadata
      }
    }),

    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(pt-br)$/
    ),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src')
    ),

    new webpack.HotModuleReplacementPlugin()

  ],

  // our Webpack Development Server config
  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    inline: true,
    hot: true,
    contentBase: './src'
  },
  // we need this due to problems with es6-shim
  node: {
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

// Helper functions

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function prepend(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) {
    args = [args]
  }
  return extensions.reduce(function (memo, val) {
    return memo.concat(val, args.map(function (prefix) {
      return prefix + val
    }));
  }, ['']);
}

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
