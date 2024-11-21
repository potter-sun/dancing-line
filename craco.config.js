/* eslint-disable */

const CracoLessPlugin = require("craco-less");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const WebpackBar = require("webpackbar");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV;

const smp = new SpeedMeasurePlugin();

console.log("NODE_ENV: ", NODE_ENV);

const cracoWebpackConfig = {
  alias: {
    "@sashimiswap/compound-js":
      "@sashimiswap/compound-js/dist/browser/compound.min.js",
    "@": path.resolve(__dirname, "src"),
  },
  configure: (webpackConfig, arg) => {
    console.log("webpackConfig: ", webpackConfig.module.rules.oneOf);
    webpackConfig.devtool =
      webpackConfig.mode === "production" ? false : "source-map";
    webpackConfig.module.rules = [
      ...webpackConfig.module.rules,
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/,
      //   use: [
      //       {
      //           loader: 'url-loader',
      //           options: {
      //               limit: 10000,
      //               name: 'images/[name].[ext]'
      //           }
      //       },
      //       {
      //           loader:'image-webpack-loader',
      //           options: {
      //               bypassOnDebug: true,
      //           }
      //        }
      //   ]
      // }
    ];

    webpackConfig.resolve.fallback = {
      ...webpackConfig.resolve.fallback,
      events: require.resolve("events/"),
      buffer: require.resolve("buffer/"),
      url: require.resolve("url/"),
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
    };

    webpackConfig.optimization = {
      innerGraph: true,
      splitChunks: {
        chunks: "all",
        minSize: 30000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,

        cacheGroups: {
          assets: {
            name: "chunk-assets",
            priority: 10,
            test: /\.(png|svg|jpg|jpeg|gif)$/,
            reuseExistingChunk: true,
          },

          antd: {
            name: "chunk-antd",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?@?ant*/,
            reuseExistingChunk: true,
          },

          commons: {
            name: "chunk-commons",
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },

          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.nameForCondition() || "")
              );
            },
            name(module) {
              const packageNameArr = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              const packageName = packageNameArr ? packageNameArr[1] : "";
              return `chunk-lib.${packageName.replace("@", "")}`;
            },
            priority: 10,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      },
    };

    if (NODE_ENV === "development") {
      webpackConfig.optimization = {};
    }

    return webpackConfig;
  },
};

const plugins = [
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
  }),
  new WebpackBar(),
];

if (NODE_ENV === "production") {
  plugins.push(
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
        },
      },
    })
  );
}

if (process.env.WEBPACK_ANA) {
  plugins.push(new BundleAnalyzerPlugin());
}
plugins.push(
  new nodePolyfillPlugin({
    excludeAliases: ["console"],
    additionalAliases: ["process", "punycode"],
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
    },
  })
);

const Webpack = {
  development: smp.wrap({
    ...cracoWebpackConfig,
    plugins: plugins,
  }),
  production: {
    ...cracoWebpackConfig,
    plugins: plugins,
  },
};
module.exports = {
  style: {
    postcss: {
      loaderOptions: () => {
        const obj = {
          postcssOptions: {
            ident: "postcss",
          },
        };

        return obj;
      },
    },
  },
  devServer: {
    client: {
      overlay: false,
    },
    host: "0.0.0.0",
    port: 7777,
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: Webpack[NODE_ENV],
};
