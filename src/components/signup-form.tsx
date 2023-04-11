import React, { Component, FormEvent, RefObject, createRef } from 'react';
import '../scss/signup-form.scss';
import '../scss/form-assets.scss';

interface SignupFormState {
	errors: {
		email: string;
		password: string;
	}
}

interface SignupFormProps {
	onSuccess: () => void;
}

class SignupForm extends Component<SignupFormProps> {

	constructor (props: SignupFormProps | Readonly<SignupFormProps>) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this) as (event: FormEvent<HTMLFormElement>) => void;
		this.handleInput = this.handleInput.bind(this) as (event: FormEvent<HTMLInputElement>) => void;
	}

	emailRef: RefObject<HTMLInputElement> = createRef();
	passwordRef: RefObject<HTMLInputElement> = createRef();

	state: SignupFormState = {
		errors: {
			email: '',
			password: ''
		}
	};

	handleInput (event: FormEvent<HTMLInputElement>): void {
		const { name, value } = event.target as HTMLInputElement;
		this.setState({ errors: {} });
		if(value.length === 0) return;
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
		}
	}

	handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const email = this.emailRef.current.value;
		const password = this.passwordRef.current.value;

		console.log(email, password);
	};

	render () {
		return <form action='#' autoComplete='off' onSubmit={this.handleSubmit} className='signup-form'>
			<div className='input-label-container'>
				<input ref={this.emailRef} name='email' type='email' onInput={this.handleInput} placeholder=' ' pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' required />
				<label htmlFor='email'>Email</label>
			</div>
			{this.state.errors.email && <div className='error'>{this.state.errors.email}</div>}
			<div className='input-label-container'>
				<input ref={this.passwordRef} name='password' type='password' onInput={this.handleInput} placeholder=' ' pattern='^.{8,}$' required />
				<label htmlFor='password'>Password</label>
			</div>
			{this.state.errors.password && <div className='error'>{this.state.errors.password}</div>}
			<input type='submit' value='Submit' />
		</form>;
	}
}

export default SignupForm;
