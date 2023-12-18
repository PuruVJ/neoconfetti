// DOESN"T WORK YET
/// <reference types="bun-types" />
import { file as brotliSize } from 'brotli-size';

const packages = ['svelte'];

const files = packages.map(
	(p) => new URL(`../packages/${p}/dist/min/index.js`, import.meta.url).pathname
);

const versions = await Promise.all(
	packages.map(async (pkg) => {
		const path = files[packages.indexOf(pkg)].replace('/dist/min/index.js', '/package.json');

		return { framework: pkg, version: JSON.parse(await Bun.file(path).text()).version };
	})
);

const contents = (
	await Promise.all(
		files.map(async (file) => {
			const framework = /packages\/(?<framework>[^ $]*)\/dist/.exec(file)?.groups?.framework!;
			const size = ((await brotliSize(file)) / 1024).toFixed(2);

			return { framework, size };
		})
	)
).reduce(
	(acc, { framework, size }) => ({
		...acc,
		[framework]: {
			size,
			version: versions.find(({ framework: vFw }) => vFw === framework)?.version,
		},
	}),
	{}
);

console.table(Object.entries(contents).sort((a, b) => (a[0] > b[0] ? 1 : -1)));

// // Ensure folder if not exists
// try {
// 	await mkdir(new URL('../docs/src/data', import.meta.url).pathname);
// } catch (error) {}

// Bun.write(
// 	new URL('../docs/src/data/sizes.json', import.meta.url),
// 	JSON.stringify(contents, null, 2)
// );
