import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	build: { reportCompressedSize: true, minify: 'terser' },
};

export default config;
