import axios from 'axios';
import { 
	REGISTER_EVENT, 
	FETCH_USER_EVENTS
} from './types';
import _ from 'lodash';

// To DELETE - to mimic fetching user events from database
import { events } from './events';
const mappedEvents = _.mapKeys(events, 'id');

const ROOT_URL = 'http://localhost:3090';


export function registerEvent(formProps, cb) {
	// post request to server and return regId
	const regEvent = {
		reg_id: formProps.eventId + '-user1',
		event_id: formProps.eventId,
		pay_date: new Date().getTime(),
		event_name: getEvent(formProps.eventId).name,
		open: getEvent(formProps.eventId).open
	};

	return (dispatch) => {
		dispatch({
			type: REGISTER_EVENT,
			payload: regEvent 
		});

		cb();
	}
}

// TODO: update to get eventname (to do it in server?)
function getEvent(id) {
	return mappedEvents[id];
}