import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'
// import strip from 'rollup-plugin-strip'

const output = (file, format, plugins) => ({
    input: './src/main.js',
    output: {
        name: 'vectorToGrid',
        file,
        format,
        exports: 'default'
    },
    plugins
})

export default [
    output('./dist/vectorToGrid.js', 'umd', [commonjs(),
        // strip({
        //     functions: ['debugEventAndSegment', 'debugEventAndSegments']
        // }),
        resolve()
    ]),
    output('./dist/vectorToGrid.min.js', 'umd', [commonjs(),
        // strip({
        //     functions: ['debugEventAndSegment', 'debugEventAndSegments']
        // }),
        resolve(),
        terser()
    ]),
    output('./dist/vectorToGrid.esm.js', 'esm', [commonjs(),
        // strip({
        //     functions: ['debugEventAndSegment', 'debugEventAndSegments']
        // }),
        resolve()
    ])
]
