import { fileSync } from 'brotli-size';
import { readdirSync } from 'fs';

const jsRootPath = '../.svelte-kit/output/client/_app/immutable/chunks';
const jsFile =
	jsRootPath +
	'/' +
	readdirSync(jsRootPath, {
		withFileTypes: true,
	}).find((dirent) => dirent.name.includes('ConfettiExplosion'))?.name;

const jsSize = (fileSync(jsFile) / 1024).toFixed(2);
console.log('JS Size:', jsSize);

const cssRootPath = '../.svelte-kit/output/client/_app/immutable/assets';
const cssFile =
	cssRootPath +
	'/' +
	readdirSync(cssRootPath, {
		withFileTypes: true,
	}).find((dirent) => dirent.name.includes('ConfettiExplosion'))?.name;

const cssSize = (fileSync(cssFile) / 1024).toFixed(2);
console.log('CSS Size:', cssSize);

console.log('\n\n');

console.log('Combined size: ', +jsSize + +cssSize);
