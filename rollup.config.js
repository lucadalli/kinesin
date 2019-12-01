import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default [
  // ESM build to be used with webpack/rollup.
  {
    input: 'src/components/Kinesin.vue',
    output: {
      format: 'esm',
      file: 'dist/kinesin.esm.min.js'
    },
    external: ['vue'],
    plugins: [
      vue(),
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      terser()
    ]
  }
]
