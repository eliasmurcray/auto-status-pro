import React, { Component, FormEvent, RefObject, createRef } from 'react';

interface DisplayNameFormProps {
	onSuccess: (name: string) => void;
}

class DisplayNameForm extends Component<DisplayNameFormProps> {

	state = {
		error: ''
	}

	displayNameRef: RefObject<HTMLInputElement>;

	constructor(props: DisplayNameFormProps | Readonly<DisplayNameFormProps>) {
		super(props);
		this.displayNameRef = createRef();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const displayName = this.displayNameRef.current.value;
		this.setState({
			error: ''
		});
		if(!displayName) {
			this.setState({
				error: 'Must provide display name'
			});
			return;
		}

		if(!displayName.match(/^[a-zA-Z ]+$/u)) {
			this.setState({
				error: 'Username must only include letters and spaces'
			});
			return;
		}

		this.props.onSuccess(displayName);
	}

	render() {
		return <form action='#' onSubmit={this.handleSubmit}>
		<input ref={this.displayNameRef} placeholder='Display Name' />
		{this.state.error && <div className='error'>{this.state.error}</div>}
		<input type='submit' value='Continue' />
	</form>
	}
}

export default DisplayNameForm;