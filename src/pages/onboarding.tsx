import '../scss/globals.scss';
import '../scss/onboarding.scss';
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import firebaseConfig from '../json/firebase-config.json';
import { initializeApp } from 'firebase/app';
import { User, browserLocalPersistence, indexedDBLocalPersistence, initializeAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import LoadingSpinner from '../components/loading-spinner/loading-spinner';
import DisplayNameForm from '../components/display-name-form/display-name-form';
import RoleChooseForm from '../components/role-choose-form/role-choose-form';

interface AppState {
	user: User | null;
	error: string | null;
	step: number;
	elements: JSX.Element[];
};

const appInfo = {
	displayName: 'Guest',
	role: '',
	database: null,
	uid: ''
};

class App extends Component {

	state: AppState = {
		user: null,
		error: null,
		step: 0,
		elements: [<div className='large-loading-container'>
		<h2>Enter Display Name</h2>
		<DisplayNameForm onSuccess={(displayName) => {
			appInfo.displayName = displayName;
			this.setState({
				step: 1
			})
		}}/>
	</div>,
	<div className='large-loading-container'>
		<h2>Choose Role</h2>
		<RoleChooseForm onSuccess={(role) => {
			appInfo.role = role;
			if(role === 'admin') {
				this.setState({
					step: 2
				});
			} else {
				this.setState({
					step: 3
				});
			}
		}} />
	</div>,
	<div className='large-loading-container'>
		<h2>Enter Company Name</h2>
		<input placeholder='Enter Company Name' />
	</div>,
	<div className='large-loading-container'>
		<h2>Enter Employer ID</h2>
		<input type='search' placeholder='Employer ID' />
		<div>You should have an employer ID. You can ask your employer to send it to you.</div>
	</div>
	]
	}
	
	componentDidMount(): void {
		const app = initializeApp(firebaseConfig);
		const auth = initializeAuth(app, {
			persistence: [indexedDBLocalPersistence, browserLocalPersistence]
		});

		onAuthStateChanged(auth, (user) => {
			if(user?.emailVerified === true) {
				const database = getDatabase(app);
				appInfo.database = database;
				appInfo.uid = user.uid;
				onValue(ref(database, 'verified_users/' + user.uid), (snapshot) => {
					if(snapshot.exists()) {
						this.setState({
							error: 'User already has an account'
						});
					} else {
						this.setState({
							user
						});
					}
				});
			} else {
				if(user === null) {
					this.setState({
						error: 'User is not logged in'
					});
				} else {
					this.setState({
						error: 'User email is not verified'
					});
				}
			}
		});
	}

	render() {
		return <div className='app-root'>
			{this.state.user === null ?
				(this.state.error !== null ? <div className='large-loading-container'>
				<div className='error'>{this.state.error}</div>
			</div>:
			<div className='large-loading-container'>
				<LoadingSpinner size='120' />
				<div>Resolving identity</div>
			</div>) :
			this.state.elements[this.state.step]}
		</div>;
	}
}

const root = createRoot(document.body);
root.render(<App />);