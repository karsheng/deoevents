import axios from 'axios';
import { ROOT_URL } from '../constants';
import {
	SELECT_CATEGORY,
	SELECT_MEAL,
	DESELECT_MEAL
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

export function selectMeal({ meal, quantity }) {
	return (dispatch) => {
		dispatch({
			type: SELECT_MEAL,
			payload: { meal, quantity }
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