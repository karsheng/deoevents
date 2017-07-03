import {
	SELECT_CATEGORY,
	SELECT_MEAL
} from '../actions/types';

export default function(state = {}, action) {
	switch(action.type) {
		case SELECT_CATEGORY:
			return { ...state, selectedCategory: action.payload }
		case SELECT_MEAL:
			return { ...state, selectedMeal: action.payload }
	}

	return state;
}