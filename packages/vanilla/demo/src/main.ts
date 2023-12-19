import './style.css';
import { Confetti } from '@neodrag/vanilla';

const button = document.querySelector<HTMLDivElement>('.button')!;
const targetEl = document.querySelector<HTMLDivElement>('.target')!;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const confetti = new Confetti(targetEl);

button.onclick = () => {
	setTimeout(async () => {
		console.log('Trigger confetti');

		confetti.explode();

		console.log('Changing colors now');
		await sleep(1000);

		confetti.options.colors = ['red', 'blue'];
		confetti.options.particleShape = 'circles';
		confetti.options.force = 1;

		await sleep(600);
		console.log('Changing again');

		confetti.options = { particleCount: 100, duration: 7000, colors: ['red', 'blue'] };

		await sleep(1000);
		confetti.options.particleShape = 'circles';

		await sleep(1000);
		confetti.options.particleShape = 'rectangles';

		await sleep(1000);
		confetti.options.particleShape = 'mix';
	}, 10);
};
