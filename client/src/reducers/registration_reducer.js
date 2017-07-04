import _ from 'lodash';
import {
	SELECT_CATEGORY,
	SELECT_MEAL,
	DESELECT_MEAL
} from '../actions/types';

export default function(state = { selectedMeals: {} }, action) {
	switch(action.type) {
		
		case SELECT_CATEGORY:
			return { ...state, selectedCategory: action.payload };
		
		case SELECT_MEAL:
			const { meal } = action.payload;
			const selectedMeals = { ...state.selectedMeals, [meal._id]: action.payload };
			return { ...state, selectedMeals: selectedMeals };

		case DESELECT_MEAL:
			return { ...state, selectedMeals: _.omit(state.selectedMeals, action.payload)};

	}

	return state;
}
