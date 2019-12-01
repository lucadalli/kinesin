import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
  // ESM build to be used with webpack/rollup.
  {
    input: 'src/components/Kinesin.vue',
    output: {
      banner: '/* eslint-disable */', // prevent eslint errors when aliasing from dist
      format: 'esm',
      file: 'dist/kinesin.esm.js'
    },
    external: ['vue'],
    plugins: [
      vue({
        template: {
          isProduction: true
        }
      }),
      buble({
        objectAssign: 'Object.assign'
      }),
      resolve(),
      commonjs()
    ]
  }
]
