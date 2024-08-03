import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import '../../globals.scss';
import './index.scss';
import LoginForm from '../../components/login-form/login-form';

class App extends Component {
	render() {
		return <div className='app-root'>
			<img src='logo-black.png' width='128px' height='128px' />
			<h1>Sign In To Your Work Account</h1>
			<LoginForm />
			<footer>
				<ul>
					<li><a href='mailto:eliasmurcray@gmail.com'>Contact</a></li>
					<li><a href='https://github.com/eliasmurcray/auto-status-pro'>GitHub</a></li>
				</ul>
			</footer>
		</div>;
	}
}

const root = createRoot(document.body);
root.render(<App />);