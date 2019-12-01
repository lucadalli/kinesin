const path = require('path')

module.exports = {
  css: { extract: false },
  configureWebpack: {
    resolve: {
      alias: {
        'kinesin$': path.resolve(__dirname, './dist/kinesin.esm.js')
      }
    }
  }
}
