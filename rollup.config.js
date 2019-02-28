const terser = require('rollup-plugin-terser').terser
const babel = require('rollup-plugin-babel')
import postcss from 'rollup-plugin-postcss'


export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'es'
  },
  plugins: [
    // terser(),
    postcss({
      extract: true,
      plugins: [require('autoprefixer')]
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        'react',
        [
          'env',
          {
            modules: false,
          },
        ],
        'stage-2'
      ],
      plugins: ['external-helpers'],
      babelrc: false,
    }),
  ],
};
