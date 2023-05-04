import React, { Component, FormEvent, RefObject, createRef } from 'react';
import './login-form.scss';
import firebaseConfig from '../../json/firebase-config.json';
import { initializeApp } from 'firebase/app';
import { Auth, User, browserLocalPersistence, createUserWithEmailAndPassword, indexedDBLocalPersistence, initializeAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';

interface LoginFormState {
	user: User | null;
	auth: Auth | null;
	errors: {
		email: string | null;
		password: string | null;
	};
	emailSent: boolean;
};

const data = {
	auth: null,
	email: null
};

class LoginForm extends Component {

	constructor(props: {} | Readonly<{}>) {
		super(props);
		this.emailRef = createRef();
		this.passwordRef = createRef();
		this.handleSubmit = this.handleSubmit.bind(this);
		this.signUpUser = this.signUpUser.bind(this);
	}

	emailRef: RefObject<HTMLInputElement>;
	passwordRef: RefObject<HTMLInputElement>;

	state: LoginFormState = {
		user: null,
		auth: null,
		errors: {
			email: null,
			password: null
		},
		emailSent: false
	};

	componentDidMount(): void {
		const app = initializeApp(firebaseConfig);
		const auth = initializeAuth(app, {
			persistence: [indexedDBLocalPersistence, browserLocalPersistence]
		});
		
		this.setState({
			auth
		});

		onAuthStateChanged(auth, (user) => {
			this.state.user = user;
		});
	}

	signUpUser(event: FormEvent<HTMLButtonElement>) {
		event.preventDefault();
		if(this.state.auth === null) {
			return;
		}

		const email = this.emailRef.current.value;
		const password = this.passwordRef.current.value;

		if(email.length === 0) {
			this.setState({
				errors: {
					email: 'Email field is required'
				}
			});
			return;
		}

		if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
			this.setState({
				errors: {
					email: 'Invalid format'
				}
			});
			return;
		}

		if(password.length === 0) {
			this.setState({
				errors: {
					password: 'Password field is required'
				}
			});
			return;
		}

		if(password.length < 8) {
			this.setState({
				errors: {
					password: 'Password must be at least 8 characters long'
				}
			});
			return;
		}

		data.email = email;
		createUserWithEmailAndPassword(this.state.auth, email, password)
			.then((userCredential) => 
				sendEmailVerification(userCredential.user, {
					url: window.location.origin + '/onboarding'
			}))
			.then(() => {
				this.setState({
					emailSent: true
				});
			})
			.catch((error) => {
				switch(error.code) {
					case 'auth/email-already-in-use':
						this.setState({ errors: { email: 'Email already in use.' } });
						break;
					default:
						this.setState({ errors: { email: '', password: error } });
				}
			});
	}

	handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if(this.state.auth === null) {
			return;
		}

		const email = this.emailRef.current.value;
		const password = this.passwordRef.current.value;

		signInWithEmailAndPassword(this.state.auth, email, password)
			.then(() => {
				window.open('/dashboard', '_self');
			})
			.catch(alert);
	}

	render() {
		return <div>
			{this.state.emailSent ? 
			<div className='email-sent'>
				<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m421 667-98-98q-9-9-22-9t-23 10q-9 9-9 22t9 22l122 123q9 9 21 9t21-9l239-239q10-10 10-23t-10-23q-10-9-23.5-8.5T635 453L421 667Zm59 309q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z"/></svg>
				<div className='success-message'>Success! An email has been sent to {data.email ?? 'your address'}. Please click the link in that email to complete your account. The email may be in your spam or junk folder.</div>
			</div> : 
			<form className='login-form' action='#' onSubmit={this.handleSubmit}>
				<label htmlFor='email'>Email</label>
				<div className='input-container'>
					<input ref={this.emailRef} id='email' type='email' onInput={() => this.setState({ errors: { email: null }})} required/>
					{this.state.errors.email !== null && 
					<div className='error'>{this.state.errors.email}</div>}
				</div>
				<label htmlFor='password'>Password</label>
				<div className='input-container'>
					<input ref={this.passwordRef} type='password' onInput={() => this.setState({ errors: { password: null }})} required/>
					{this.state.errors.password !== null && 
						<div className='error'>{this.state.errors.password}</div>}
				</div>
				<input type='submit' value={this.state.auth ? 'Log In' : 'Loading...'} />
				<button onClick={this.state.auth ? this.signUpUser : null}>{this.state.auth ? 'Sign Up' : 'Loading...'}</button>
			</form>}
		</div>;
	}
}

export default LoginForm;