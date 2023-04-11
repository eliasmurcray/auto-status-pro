import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import '../scss/globals.scss';
import Header from '../components/header';

class App extends Component {
	render() {
		return <div className='app-root'>
			<Header />
		</div>;
	}
}

const root = createRoot(document.body);
root.render(<App />);