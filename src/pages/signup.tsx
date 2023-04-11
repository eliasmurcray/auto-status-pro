import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import '../scss/globals.scss';
import '../scss/signup.scss';
import SignupForm from '../components/signup-form';

class App extends Component {
	render() {
		return <div className='app-root'>
			<div className='car-panel'></div>
			<div className='form-panel'>
				<h1>Sign Up</h1>
				<SignupForm onSuccess={() => alert(0)} />
			</div>
		</div>;
	}
}

const root = createRoot(document.body);
root.render(<App />);