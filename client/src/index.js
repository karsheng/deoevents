import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import App from './app';
import { AUTH_USER, FETCH_USER_INFO, FETCH_USER_EVENTS } from './actions/types';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');
// TO DELETE: mimic fetching user events from database
export const userInfo = {
		id: '1',
		firstName: 'Kar Sheng',
		lastName: 'Lee',
		gender: 'male',	
		address1: '16 The Breezeway',
		address2: 'Persiaran Residen 3, Desa Parkcity',
		address3: 'Kuala Lumpur',
		postcode: '52200',
		interests: ['5km', '10km', 'Half-marathon', 'Full-marathon']
	};

// TODO: provide logic to link reg to events
const regEvents = [
  { reg_id: '1-user1', event_id: 1, pay_date: 1493623412065, event_name: 'Event 1', open: false },
  { reg_id: '2-user1', event_id: 2, pay_date: 1493623412065, event_name: 'Event 2', open: false }
];
export const userEvents = _.mapKeys(regEvents, 'event_id');

// if we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER });

  // TODO: call function to fetch user info
	// TO DELETE - mimic fetch user info from database
  store.dispatch({
  	type: FETCH_USER_INFO,
  	payload: userInfo
  });

  store.dispatch({
    type: FETCH_USER_EVENTS,
    payload: userEvents
  });  
}

ReactDOM.render(
  <Provider store={store}>
  	<BrowserRouter>
      <MuiThemeProvider>
  		  <App />
      </MuiThemeProvider>
  	</BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
