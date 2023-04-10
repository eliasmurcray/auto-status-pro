import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import '../scss/globals.scss';

class App extends Component {
	render() {
		return <div className='app-root'>
			
		</div>;
	}
}

const root = createRoot(document.body);
root.render(<App />);