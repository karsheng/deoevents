import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './components/header';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import RequireAuth from './components/auth/require_auth';
import WelcomePage from './components/welcome';
import EventPage from './components/event_page';
import CategorySelection from './components/registration/category_selection';
import UserProfile from './components/profile';


export default class App extends Component {
	render() {
		return(
			<div>
				<Header />
				<div className="inner-container">
					<Switch>
						<Route path="/registration/category/:event_id" component={CategorySelection} />
						<Route path="/event/:_id" component={EventPage} />
						<Route path="/signin" component={Signin} />
						<Route path="/signout" component={Signout} />
						<Route path="/signup" component={Signup} />
				    <Route path="/profile" component={RequireAuth(UserProfile)} />
				    <Route path="/" component={WelcomePage} />					
					</Switch>				
				</div>
			</div>
		);
	}
}