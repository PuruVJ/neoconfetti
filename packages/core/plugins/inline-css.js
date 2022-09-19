// @ts-check
import { dataToEsm } from '@rollup/pluginutils';
import fs from 'fs';
import lightningcss from 'lightningcss';
import { resolve } from 'path';

/** @type {() => import('rollup').Plugin} */
export const processCSS = () => {
	/** @type {Map<string, import('lightningcss').TransformResult>} */
	const idMap = new Map();

	return {
		name: 'process-css',
		async resolveId(id, importer, options) {
			if (!importer) return null;
			if (id.includes('.module.css') && importer) return resolve(importer, '..', id);
			return null;
		},
		load(id) {
			if (!id.includes('.module.css')) return null;

			const filePath = id.replace('?inline', '');
			const isInline = id.includes('?inline');

			if (!idMap.has(filePath)) {
				// Run CSS parser
				const cssContents = fs.readFileSync(filePath);

				const result = lightningcss.transform({
					// options
					filename: id.split('/').pop() || 'style.module.css',
					code: cssContents,
					minify: true,
					cssModules: true,
				});

				idMap.set(filePath, result);
			}

			const { code: parsedCSS = '', exports } = idMap.get(filePath) ?? {};

			if (isInline) return `export default ${JSON.stringify(parsedCSS.toString())}`;

			if (!exports) return;

			const cssModulesExports = Object.entries(exports).reduce((acc, [ogSelector, { name }]) => {
				acc[ogSelector] = name;
				return acc;
			}, {});

			return dataToEsm(cssModulesExports, { namedExports: true, preferConst: true });
		},
	};
};
