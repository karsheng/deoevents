import axios from 'axios';
import { ROOT_URL } from '../constants';
import {
	SELECT_CATEGORY,
	SELECT_MEAL
} from './types';

export function selectCategory(category, cb) {
	return (dispatch) => {
		dispatch({
			type: SELECT_CATEGORY,
			payload: category
		});
		cb();
	}
}

export function selectMeal(meal, cb) {
	return (dispatch) => {
		dispatch({
			type: SELECT_CATEGORY,
			payload: meal
		});		
		cb();
	}
}