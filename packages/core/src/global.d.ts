declare module '*.module.css?map' {
	const container: string;
	const particle: string;
	export { container as c, particle as p };
}

declare module '*?inline' {
	const url: string;
	export default url;
}
