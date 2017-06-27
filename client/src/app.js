import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './containers/header';
import Signin from './containers/auth/signin';
import Signout from './containers/auth/signout';
import Signup from './containers/auth/signup';
import Feature from './containers/feature';
import RequireAuth from './containers/auth/require_auth';
import WelcomePage from './containers/welcome';
import EventShow from './containers/event_show';
import RegisterEvent from './containers/register_event';
import UserProfile from './containers/profile';


export default class App extends Component {
	render() {
		return(
			<div>
				<Header />
				<div className="inner-container">
					<Switch>
						<Route path="/reg-event/:id" component={RegisterEvent} />
						<Route path="/events/:id" component={EventShow} />
						<Route path="/signin" component={Signin} />
						<Route path="/signout" component={Signout} />
						<Route path="/signup" component={Signup} />
				    <Route path="/feature" component={RequireAuth(Feature)} />
				    <Route path="/profile" component={RequireAuth(UserProfile)} />
				    <Route path="/" component={WelcomePage} />					
					</Switch>				
				</div>
			</div>
		);
	}
}