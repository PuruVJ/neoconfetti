declare module '*.module.css' {
	const mapping: { [key: string]: string };
	export default mapping;
}

declare module '*?inline' {
	const url: string;
	export default url;
}
