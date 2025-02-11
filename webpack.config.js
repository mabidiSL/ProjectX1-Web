const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,  // Remove console.* statements
            drop_debugger: true, // Remove debugger statements
            pure_funcs: ['console.log'] // Remove specific functions
          },
          mangle: {
            // Mangle property names
            properties: {
              regex: /^_/ // Mangle properties that start with underscore
            }
          },
          format: {
            comments: false // Remove comments
          }
        },
        extractComments: false
      })
    ]
  }
};
