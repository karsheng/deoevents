import axios from 'axios';
import { ROOT_URL } from '../constants';
import {
	SELECT_CATEGORY,
	SELECT_MEAL,
	DESELECT_MEAL,
	RESET_MEAL_SELECTION,
	SET_TOTAL_PRICE,
	FETCH_REGISTRATION_INFO
} from './types';

export function selectCategory(category, cb) {
	return (dispatch) => {
		dispatch({
			type: SELECT_CATEGORY,
			payload: category
		});
		cb();
	};
}

export function selectMeal({ meal, quantity, event }) {
	// event is included to verify if 
	// selectedMeal is for which event
	return (dispatch) => {
		dispatch({
			type: SELECT_MEAL,
			payload: { meal, quantity, event }
		});
	};
}

export function deselectMeal(meal_id) {
	return (dispatch) => {
		dispatch({
			type: DESELECT_MEAL,
			payload: meal_id
		});
	};
}

export function resetMealSelection() {
	return (dispatch) => {
		dispatch({
			type: RESET_MEAL_SELECTION
		});
	};
}

export function setTotalPrice(totalPrice) {
	return (dispatch) => {
		dispatch({
			type: SET_TOTAL_PRICE,
			payload: totalPrice
		})
	};
}

export function createRegistration({ event, category, orders }, cb) {
	const token = localStorage.getItem('deotoken');
	
	let config = {
    headers: { authorization: token }
  };
	return function(dispatch) {
		axios.post(
			`${ROOT_URL}/event/register/${event._id}`,
			{ category, orders },
			config
		)
		.then(response => {
			cb(response.data);
		})
		.catch(err => {
			console.log(err);
		});
	};
}

export function fetchRegistrationInfo(event_id) {
	const token = localStorage.getItem('deotoken');

	let config = {
    headers: { authorization: token }
  };
	return function(dispatch) {
		axios.get(
			`${ROOT_URL}/registration/${event_id}`,
			config
		)
		.then(response => {
			dispatch({
				type: FETCH_REGISTRATION_INFO,
				payload: response.data
			})
		})
		.catch(err => {
			console.log(err);
		});
	};	
}