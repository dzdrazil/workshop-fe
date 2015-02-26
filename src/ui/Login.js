'use strict';

import React from 'react';
import {authenticate} from '../services/IdentityService';

export default React.createClass({
	onSubmit: function(e) {
		e.preventDefault();
		authenticate(this.refs.email.value);
	},
	render: function() {
		return (
			<div>
				<h1>Login</h1>
				<form onSubmit={this.onSubmit}>
					<label htmlFor="login-email">Email Address</label>
					<input ref="email" type="email" id="login-email" />
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
});
