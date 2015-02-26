'use strict';

// EXTERNAL LIBRARIES
import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

// SERVICES
import {CurrentIdentity} from 'services/IdentityService';

// UI COMPONENTS
import UserProfile from 'ui/UserProfile';
import SideNav from 'ui/SideNav';
import Dashboard from 'ui/Dashboard';
import Login from 'ui/Login';

var App = React.createClass({
	mixins: [Router.State, Router.Navigation],
	componentWillMount: function() {
		CurrentIdentity
			.onValue(
				id => {
					if (!id) this.transitionTo('login');
					if (id && this.isActive('login')) this.transitionTo('dashboard');
				});
	},

	render: function() {
		return (
			<div>
				<header>
					<UserProfile />
				</header>
				<aside>
					<SideNav />
				</aside>
				<main>
					<RouteHandler/>
				</main>
			</div>
		);
	}
});

const routes = (
	<Route name='app' path='/' handler={App}>
		<DefaultRoute handler={Dashboard} />
		<Route name='dashboard' handler={Dashboard} />
		<Route name='login' handler={Login} />
	</Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
