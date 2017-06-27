import _ from 'lodash';
import { 
	FETCH_EVENTS,
	FETCH_EVENT
} from '../actions/types';

export default function(state = {}, action) {
	switch(action.type) {
		case FETCH_EVENTS:
			return _.mapKeys(action.payload, 'id');
		case FETCH_EVENT:
			return { ...state, [action.payload.id]: action.payload };			
	}

	return state;
}