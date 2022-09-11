import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	package: {
		emitTypes: true,
		dir: 'package',
		exports: (file) => {
			return file === 'index.ts' || file.endsWith('.svelte');
		},
	},
};

export default config;
