import axios from 'axios';
import { ROOT_URL } from '../constants';
import {
	SELECT_CATEGORY,
	SELECT_MEAL,
	DESELECT_MEAL,
	RESET_MEAL_SELECTION
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