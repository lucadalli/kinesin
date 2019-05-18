const path = require('path')

module.exports = {
  css: { extract: false },
  configureWebpack: {
    resolve: {
      alias: {
        'kinesin$': path.resolve(__dirname, './src/components/Kinesin.vue')
      }
    }
  }
}
