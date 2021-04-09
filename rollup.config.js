import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json';

const config = [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'es',
                exports: 'named',
                sourcemap: true,
            },
        ],
        plugins: [
            commonjs(),
            resolve(),
            typescript({
                rollupCommonJSResolveHack: true,
                clean: true,
            }),
            uglify(),
        ],
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'es',
                exports: 'named',
                sourcemap: true,
            },
        ],
        plugins: [
            commonjs(),
            resolve(),
            typescript({
                rollupCommonJSResolveHack: true,
                clean: true,
            }),
            uglify(),
        ],
    },
    {
        input: './dist/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];

export default config;
