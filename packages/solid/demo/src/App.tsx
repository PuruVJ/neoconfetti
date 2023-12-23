import { createConfetti } from '@neoconfetti/solid';
import { Component } from 'solid-js';

const App: Component = () => {
	const { confetti } = createConfetti();

	return (
		<>
			<div use:confetti style={{ translate: '10vh 10vh' }}></div>
		</>
	);
};

export default App;
