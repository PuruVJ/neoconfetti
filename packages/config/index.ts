import { dataToEsm } from '@rollup/pluginutils';
import { Plugin } from 'esbuild';
import { transform } from 'lightningcss';
import fs from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

export const coreConfig = ({ dtsBanner }: { dtsBanner?: string } = { dtsBanner: '' }) =>
	defineConfig([
		{
			entry: ['./src/index.ts'],
			format: 'esm',
			external: ['vue', 'react', 'solid-js', 'svelte', 'lit'],
			target: 'es2022',
			dts: { resolve: true, banner: dtsBanner },
			clean: true,
			treeshake: 'smallest',
			esbuildPlugins: [processCSS()],
		},
		{
			entry: ['./src/index.ts'],
			minify: 'terser',
			external: ['vue', 'react', 'solid-js', 'svelte', 'lit'],
			format: 'esm',
			target: 'es2022',
			clean: true,
			outDir: 'dist/min',
			treeshake: 'smallest',
			esbuildPlugins: [processCSS()],
		},
	]);

const processCSS: () => Plugin = () => {
	const idMap: Map<string, import('lightningcss').TransformResult> = new Map();

	return {
		name: 'process-css',
		setup(build) {
			build.onResolve({ filter: /\.module.css/ }, (args) => {
				return {
					path: resolve(args.resolveDir, args.path),
					namespace: 'process-css',
					pluginData: {
						isInline: args.path.includes('?inline'),
						isMap: args.path.includes('?map'),
					},
				};
			});

			build.onLoad({ filter: /.*/, namespace: 'process-css' }, async (args) => {
				const filePath = args.path.replace(/\?.*$/, '');
				const isInline = !!args.pluginData.isInline;

				if (!idMap.has(filePath)) {
					// Run CSS parser
					const cssContents = fs.readFileSync(filePath);

					const result = transform({
						filename: args.path.split('/').pop() || 'style.module.css',
						code: cssContents,
						minify: true,
						cssModules: true,
					});

					idMap.set(filePath, result);
				}

				const { code = '', exports } = idMap.get(filePath) ?? {};

				if (isInline) return { contents: `export default ${JSON.stringify(code.toString())}` };

				if (!exports) return;

				const cssModulesExports = Object.entries(exports).reduce((acc, [ogSelector, { name }]) => {
					acc[ogSelector] = name;
					return acc;
				}, {});

				return {
					contents: dataToEsm(cssModulesExports, { namedExports: true, preferConst: true }),
				};
			});
		},
	};
};
