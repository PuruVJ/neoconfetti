import { ConfettiOptions, createConfetti } from '@neoconfetti/solid';
import { Component, createEffect, createSignal } from 'solid-js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const App: Component = () => {
	const { confetti } = createConfetti();
	const [options, setOptions] = createSignal<ConfettiOptions>({});
	const [render, setRender] = createSignal(false);

	createEffect(() => {
		async function run() {
			if (!render) return;

			await sleep(2000);

			setOptions((o) => ({
				...o,
				colors: ['red', 'blue'],
				particleShape: 'circles',
			}));

			await sleep(600);

			// Override entire options, re-triggers the confetti
			setOptions({
				particleCount: 200,
				duration: 3500,
				colors: ['#eee', 'black', 'hotpink' /* Sorry 😅 */],
			});
		}

		run();
	});

	return (
		<>
			<>
				<button onClick={() => setRender(true)}>🎉</button>

				{render() && <div use:confetti={options()} />}
			</>
		</>
	);
};

export default App;
