import React, { Component } from 'react';
import './header.scss';
import LoadingSpinner from '../loading-spinner/loading-spinner';

class Header extends Component {
	render () {
	 return <header className='main-header'>
		  <div className="logo">
				<img src="logo-black.png" height="100%" />
			</div>
			<ul>
				<li><a href="/contact">Contact</a></li>
			</ul>
		</header>;
	}
}

export default Header;
