import React, { Component } from 'react';
import '../scss/loading-spinner.scss';

interface LoadingSpinnerProps {
	size?: string;
	borderWidth?: string;
}

class LoadingSpinner extends Component<LoadingSpinnerProps> {
	render () {
		return <div className='loading-spinner' style={{
			width: `${this.props.size}px`,
			height: `${this.props.size}px`
		}}>
			<div style={{
				borderWidth: `${this.props.borderWidth}px`
			}}></div>
			<div style={{
				borderWidth: `${this.props.borderWidth}px`
			}}></div>
			<div style={{
				borderWidth: `${this.props.borderWidth}px`
			}}></div>
		</div>;
	}
}

export default LoadingSpinner;
