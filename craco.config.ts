/* eslint-disable import/no-anonymous-default-export */
const { whenProd } = require('@craco/craco')
const pluginCracoLess = require('craco-less');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin')
const nodePolyfillPlugin = require('node-polyfill-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin');

const path = require("path")
export default {
  typescript: {
    enableTypeChecking: true /* (default value) */,
  },
  devServer: {
    host: '0.0.0.0',
    port: 7777,
  },
  plugins: [{
    plugin: pluginCracoLess,
    options: {
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
        }
      },
      cssLoaderOptions: {
        modules: {
          localIdentName: '[path][static_pc]__[local]--[hash:base64:5]'
        }
      }
    }
  }],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig: any, { paths }: any) => {
      paths.appBuild = 'build'
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
      }
      
      console.log(webpackConfig.resolve.extensions);

      // remove ModuleScopePlugin for fixing crypto-browser in vercel.
      // const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
      //   ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      // );
      // webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      return {
        ...webpackConfig,
        module: {
          ...webpackConfig.module,
          rules: [
            ...(webpackConfig.module.rules || []),
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ]
        }
      }
    },
    plugins: [
      ...whenProd(
        () => [
          new uglifyJsPlugin({
            uglifyOptions: {
              compress: {
                drop_debugger: true,
                drop_console: false,
              }
            },
            sourceMap: false,
            parallel: true
          })
        ], []
      ),
      new nodePolyfillPlugin({
        excludeAliases: ["console"],
        additionalAliases: ["process", "punycode"],
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
        },
      }),

      // new CompressionPlugin({
      //   algorithm: 'brotliCompress',
      //   test: /\.(js|css|html|svg|br)$/,
      //   threshold: 10240,
      //   minRatio: 0.8,
      // })
    ],
  },
}