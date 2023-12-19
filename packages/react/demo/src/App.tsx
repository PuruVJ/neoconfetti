import { Confetti, ConfettiProps } from '@neoconfetti/react';
import { useEffect, useState } from 'react';

function App() {
	const [options, setOptions] = useState<ConfettiProps>({ destroyAfterDone: false });
	const [render, setRender] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setOptions((o) => ({ ...o, colors: ['#eee', 'black'] }));
			// explode();
		}, 1000);
	}, []);

	return (
		<>
			<button onClick={() => setRender(false)}>Unrender</button>
			{render && <Confetti class="hello" particleClass="particle-something" {...options} />}
		</>
	);
}

export default App;
