import React, { Component, FormEvent, RefObject, createRef } from 'react';

interface RoleChooseFormProps {
	onSuccess: (role: string) => void;
}

class RoleChooseForm extends Component<RoleChooseFormProps> {

	roleSelectRef: RefObject<HTMLSelectElement>;

	constructor(props: RoleChooseFormProps | Readonly<RoleChooseFormProps>) {
		super(props);
		this.roleSelectRef = createRef();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const role = this.roleSelectRef.current.value;
		if(!role) {
			this.setState({
				error: 'No role provided'
			});
			return;
		}

		this.props.onSuccess(role);
	}
	
	render() {
		return <form action='#' onSubmit={this.handleSubmit}>
			<div>
				<span className='role-text'>I want to use this system as an...</span>
				<select ref={this.roleSelectRef}>
					<option value='admin'>Admin</option>
					<option value='employee'>Employee</option>
				</select>
			</div>
			<input type='submit' value='Continue' />
		</form>;
	}
}

export default RoleChooseForm;