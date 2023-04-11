import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import '../scss/globals.scss';
import '../scss/signup.scss';
import SignupForm from '../components/signup-form';

class App extends Component {

	state = {
		step: 1
	}

	render() {
		return <div className='app-root'>
			<div className='car-panel'></div>
			{this.state.step === 1 && <div className='form-panel'>
				<h1>Sign Up</h1>
				<SignupForm onSuccess={() => this.setState({ step: 2 })} />
			</div>}
			{this.state.step === 2 && <div className='form-panel'>
				<h2>Verify Your Email</h2>
				<div className='email-info'>An email has been sent to your email {localStorage.getItem('email') || ''}. Please click the link in that email to complete your account.</div>
			</div>}
		</div>;
	}
}

const root = createRoot(document.body);
root.render(<App />);