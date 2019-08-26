import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
    {
        input: 'lib/index.js',
        external: ['create-hash', 'crypto-js', 'hdkey', 'lemo-tx', 'lemo-utils', 'pbkdf2', 'safe-buffer'],
        output: [
            {file: pkg.main, format: 'cjs'}, // CommonJS (for Node) build
            {file: pkg.module, format: 'esm'}, // ES module (for Rollup and webpack) build
        ],
        plugins: [
            replace({
                'process.env.SDK_VERSION': JSON.stringify(pkg.version),
            }),
            babel({
                exclude: 'node_modules/**',
            }),
        ],
    },
]
