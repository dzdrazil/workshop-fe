'use strict';

import React from 'react';
import Router from 'react-router';

let Link = Router.Link;

function renderLogin() {
	return <Link to='login'/>;
}

export default React.createClass({
	render: function() {
		return renderLogin();
	}
});
