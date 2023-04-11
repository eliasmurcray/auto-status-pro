import React, { Component } from 'react';
import '../scss/header.scss';
import LoadingSpinner from './loading-spinner';

class Header extends Component {
	render () {
	 return <header className='main-header'>
		  <div className="logo">
				<img src="templogo.webp" height="100%" />
				<h1>AutoStatusPro</h1>
			</div>
			<ul>
				<LoadingSpinner />
				<li><a href="login">Log In</a></li>
				<li><a href="signup">Sign Up</a></li>
			</ul>
		</header>;
	}
}

export default Header;
