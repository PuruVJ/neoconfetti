// @ts-check
import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { processCSS } from './plugins/inline-css';

export default defineConfig([
	{
		input: './src/index.ts',
		plugins: [processCSS(), esbuild(), resolve(), terser()],
		output: {
			file: './dist/index.js',
			format: 'esm',
			sourcemap: true,
		},
	},
	{
		input: './src/index.ts',
		plugins: [dts({ respectExternal: true })],
		output: {
			file: './dist/index.d.ts',
			format: 'esm',
		},
	},
]);
