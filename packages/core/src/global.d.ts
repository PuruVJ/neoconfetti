declare module '*.module.css?map' {
	const container: string;
	const particle: string;
	export { container, particle };
}

declare module '*?inline' {
	const url: string;
	export default url;
}
