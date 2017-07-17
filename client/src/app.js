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
import ConfirmationPage from './components/registration/confirmation';
import MealSelection from './components/registration/meal_selection';
import Checkout from './components/registration/checkout';
import Payment from './components/registration/payment';
import UserProfile from './components/profile';


export default class App extends Component {
	render() {
		return(
			<div>
				<Header />
				<div>
					<Switch>
						<Route path="/registration/confirmation/:registration_id" component={ConfirmationPage} />
						<Route path="/registration/payment/:registration_id" component={Payment} />
						<Route path="/registration/checkout/:event_id" component={Checkout} />
						<Route path="/registration/category/:event_id" component={CategorySelection} />
						<Route path="/registration/meal/:event_id" component={MealSelection} />
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