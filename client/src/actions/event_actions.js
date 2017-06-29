import axios from 'axios';
import { ROOT_URL } from '../constants';
import { 
	FETCH_EVENTS, 
	FETCH_EVENT 
} from './types';

export function fetchEvents() {

	return (dispatch) => {
		axios.get(`${ROOT_URL}/event/open/all`)
		.then(response => {
			const events = response.data;

			dispatch({
				type: FETCH_EVENTS,
				payload: events
			});

		})
		.catch(err => {
			console.log(err);
		});
	}

}

export function fetchEvent(event_id) {

	return (dispatch) => {
		axios.get(`${ROOT_URL}/event/${event_id}`)
		.then(response => {
			const event = response.data;
			dispatch({
				type: FETCH_EVENT,
				payload: event
			});
		})
		.catch(err => {
			console.log(err);
		});
	}	
}