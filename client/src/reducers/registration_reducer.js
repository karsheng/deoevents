import _ from 'lodash';
import {
	SELECT_CATEGORY,
	SELECT_MEAL,
	DESELECT_MEAL,
	RESET_MEAL_SELECTION,
	SET_TOTAL_PRICE,
	FETCH_REGISTRATION_INFO
} from '../actions/types';

export default function(state = { selectedMeals: {}, totalPrice: 0, info: {} }, action) {
	switch(action.type) {
		
		case SELECT_CATEGORY:
			return { ...state, selectedCategory: action.payload };
		
		case SELECT_MEAL:
			const { meal } = action.payload;
			const selectedMeals = { ...state.selectedMeals, [meal._id]: action.payload };
			return { ...state, selectedMeals: selectedMeals };

		case DESELECT_MEAL:
			return { ...state, selectedMeals: _.omit(state.selectedMeals, action.payload)};

		case RESET_MEAL_SELECTION:
			return { ...state, selectedMeals: {} };

		case SET_TOTAL_PRICE:
			return { ...state, totalPrice: action.payload}

		case FETCH_REGISTRATION_INFO:
			return { ...state, info: action.payload }
			
	}

	return state;
}
