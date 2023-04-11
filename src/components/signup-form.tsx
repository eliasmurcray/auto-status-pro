import React, { Component, FormEvent, RefObject, createRef } from 'react';
import firebaseConfig from '../json/firebase-config.json';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, sendEmailVerification, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence } from 'firebase/auth';
import '../scss/Signup-form.scss';
import '../scss/form-assets.scss';

interface SignupFormState {
	errors: {
		email: string;
		password: string;
		'confirm-password': string;
		general: string;
	};
	showConfirmPassword: boolean;
}

interface SignupFormProps {
	onSuccess: () => void;
}

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
	persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});

class SignupForm extends Component<SignupFormProps> {

	constructor (props: SignupFormProps | Readonly<SignupFormProps>) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this) as (event: FormEvent<HTMLFormElement>) => void;
		this.handleInput = this.handleInput.bind(this) as (event: FormEvent<HTMLInputElement>) => void;
	}

	emailRef: RefObject<HTMLInputElement> = createRef();
	passwordRef: RefObject<HTMLInputElement> = createRef();
	confirmPasswordRef: RefObject<HTMLInputElement> = createRef();

	state: SignupFormState = {
		errors: {
			email: '',
			password: '',
			'confirm-password': '',
			general: ''
		},
		showConfirmPassword: false
	};

	handleInput (event: FormEvent<HTMLInputElement>): void {
		const { name, value } = event.target as HTMLInputElement;
		this.setState({ errors: {} });
		if(value.length === 0) {
			return;
		}
		switch(name) {
			case 'email':
				if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
					this.setState({ errors: { 'email': 'Invalid format' }});
				}
				break;
			case 'password':
				if(value.length < 8) {
					this.setState({ errors: { 'password': 'Password must be at least 8 characters' }});
				}
				break;
			case 'confirm-password':
				const element = event.target as HTMLInputElement;
				if(value !== this.passwordRef?.current?.value) {
					this.setState({ errors: { 'confirm-password': 'Password does not match' }});
					element.setCustomValidity('Invalid field.');
				} else {
					element.setCustomValidity('');
				}
				break;
		}
	}

	handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		this.setState({
			errors: {}
		});
		if(this.state.showConfirmPassword === false) {
			this.setState({
				showConfirmPassword: true
			});
			return;
		}
		const email = this.emailRef.current.value;
		const password = this.passwordRef.current.value;
		const confirmPassword = this.confirmPasswordRef.current.value;

		if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
			this.setState({ errors: { 'email': 'Invalid format' }});
			return;
		}

		if(password.length < 8) {
			this.setState({ errors: { 'password': 'Password must be at least 8 characters' }});
			return;
		}

		if(confirmPassword !== password) {
			this.setState({ errors: { 'confirm-password': 'Password does not match' }});
			return;
		}

		this.signupWithEmail(email, password)
			.then(() => {
				this.props.onSuccess();
			})
			.catch((error) => {
				switch(error.code) {
					case 'auth/email-already-in-use':
						this.setState({ errors: { email: 'Email already in use.' } });
						break;
					default:
						this.setState({ errors: { email: '', 'new-password': error } });
				}
			});
	};

	async signupWithEmail (email: string, password: string): Promise<any> {
		localStorage.setItem('email', email);
		const { user } = await createUserWithEmailAndPassword(auth, email, password);
		Object.assign(window, {
			user
		});
		return await sendEmailVerification(user, {
			url: window.location.origin + '/onboarding'
		});
	}

	render () {
		return <form action='#' autoComplete='off' onSubmit={this.handleSubmit} className='signup-form'>
			<div className='input-label-container'>
				<input ref={this.emailRef} name='email' type='email' onInput={this.handleInput} placeholder=' ' pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' required />
				<label htmlFor='email'>Email</label>
			</div>
			{this.state.errors.email && <div className='error'>{this.state.errors.email}</div>}
			<div className='input-label-container'>
				<input ref={this.passwordRef} name='password' type='password' onInput={this.handleInput} onBlur={() => {
					if(this.passwordRef.current.value.length < 8) {
						this.setState({
							showConfirmPassword: false
						});
					} else {
						this.setState({
							showConfirmPassword: true
						});
					}
				}} placeholder=' ' pattern='^.{8,}$' required />
				<label htmlFor='password'>Password</label>
			</div>
			{this.state.errors.password && <div className='error'>{this.state.errors.password}</div>}
			{this.state.showConfirmPassword === true && <div className='input-label-container'>
				<input ref={this.confirmPasswordRef} name='confirm-password' type='password' onInput={this.handleInput} placeholder=' ' pattern='^.{8,}$' required />
				<label htmlFor='confirm-password'>Confirm Password</label>
			</div>}
			{this.state.errors['confirm-password'] && <div className='error'>{this.state.errors['confirm-password']}</div>}
			{this.state.errors.general && <div className='error'>{this.state.errors.general}</div>}
			<input type='submit' value='Send Verification Email' />
		</form>;
	}
}

export default SignupForm;
