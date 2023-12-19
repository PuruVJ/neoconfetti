import { Confetti, ConfettiOptions } from '@neoconfetti/react';
import { useEffect, useState } from 'react';

function App() {
	const [options, setOptions] = useState<ConfettiOptions>({ destroyAfterDone: false });
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
			{render && <Confetti className="hello" particleClassName="particle-something" {...options} />}
		</>
	);
}

export default App;
