type Rotate3dTransform = [number, number, number];

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// From here: https://stackoverflow.com/a/11832950
export function round(num: number, precision: number = 2) {
	return Math.round((num + Number.EPSILON) * 10 ** precision) / 10 ** precision;
}

export function arraysEqual<ItemType>(a: ItemType[], b: ItemType[]) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;

	return true;
}

export const mapRange = (value: number, x1: number, y1: number, x2: number, y2: number) =>
	((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export const rotate = (degree: number, amount: number) => {
	const result = degree + amount;
	return result > 360 ? result - 360 : result;
};

export const coinFlip = () => Math.random() > 0.5;

// avoid this for circles, as it will have no visual effect
const zAxisRotation: Rotate3dTransform = [0, 0, 1];

export const rotationTransforms: Rotate3dTransform[] = [
	// dual axis rotations (a bit more realistic)
	[1, 1, 0],
	[1, 0, 1],
	[0, 1, 1],
	// single axis rotations (a bit dumber)
	[1, 0, 0],
	[0, 1, 0],
	zAxisRotation,
];

export const shouldBeCircle = (rotationIndex: number) =>
	!arraysEqual(rotationTransforms[rotationIndex], zAxisRotation) && coinFlip();
