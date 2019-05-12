const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'kinesin$': path.resolve(__dirname, './src/components/Kinesin.vue')
      }
    }
  }
}
