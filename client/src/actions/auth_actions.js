import axios from 'axios';
import { ROOT_URL } from '../constants';
import { 
	AUTH_USER,
	UNAUTH_USER,
	AUTH_ERROR,
	FETCH_USER_INFO
} from './types';


export function signinUser({ email, password }, cb) {

	return function(dispatch) {
		axios.post(`${ROOT_URL}/signin`, { email, password })
			.then(response => {
				localStorage.setItem('deotoken', response.data.token);
				axios.get(
					`${ROOT_URL}/profile`, 
					{
						headers: 
						{ 
							authorization: response.data.token
						}
					}
				)
				.then(response => {
					dispatch({ type: AUTH_USER });
					dispatch({
						type: FETCH_USER_INFO,
						payload: response.data
					});

					cb();
				})
				.catch((err) => {
					console.log(err);
					dispatch(authError('An error occured'));

				});				
			})
			.catch((err) => {
				console.log(err);
				dispatch(authError('Bad Sign In Info'));
			});
	}

}

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	};
}

export function signupUser(user_input, cb) {
	return function(dispatch) {

		axios.post(`${ROOT_URL}/signup`, user_input)
			.then(response => {
				localStorage.setItem('deotoken', response.data.token);
				axios.get(
					`${ROOT_URL}/profile`, 
					{
						headers: 
						{ 
							authorization: response.data.token
						}
					}
				)
				.then(response => {
					dispatch({ type: AUTH_USER });
					dispatch({
						type: FETCH_USER_INFO,
						payload: response.data
					});

					cb();
				})
				.catch((err) => {
					console.log(err);
					dispatch(authError('An error occured'));
				});
			})
			.catch(({response}) => {
				dispatch(authError(response.data.error));
			});
	}

}

export function signoutUser() {
	localStorage.removeItem('deotoken');
	return { type: UNAUTH_USER };
}



