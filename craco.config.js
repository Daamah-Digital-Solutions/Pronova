const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add polyfills for Node.js modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "assert": require.resolve("assert/"),
        "buffer": require.resolve("buffer/"),
        "crypto": require.resolve("crypto-browserify"),
        "http": false,
        "https": false,
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "zlib": false,
        "fs": false,
        "net": false,
        "tls": false
      };

      // Add plugins
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
      ];

      // Ignore source map warnings for node_modules
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
  devServer: {
    // Configure dev server to ignore certificate errors
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};