import _ from 'lodash';
import { 
	FETCH_EVENTS,
	FETCH_EVENT
} from '../actions/types';

export default function(state = {}, action) {
	switch(action.type) {
		case FETCH_EVENTS:
			return _.mapKeys(action.payload, '_id');
		case FETCH_EVENT:
			return { ...state, [action.payload._id]: action.payload };			
	}

	return state;
}