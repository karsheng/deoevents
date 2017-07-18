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
		axios.post(`${ROOT_URL}/api/signin`, { email, password })
			.then(response => {
				localStorage.setItem('deotoken', response.data.token);
				axios.get(
					`${ROOT_URL}/api/profile`, 
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

export function signupUser(formProps, cb) {
	return function(dispatch) {

		axios.post(`${ROOT_URL}/api/signup`, formProps)
			.then(response => {
				localStorage.setItem('deotoken', response.data.token);
				axios.get(
					`${ROOT_URL}/api/profile`, 
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

export function fetchUserInfo() {
	const token = localStorage.getItem('deotoken');
	if (token) {
		return function(dispatch) {
			axios.get(
				`${ROOT_URL}/api/profile`,
				{
					headers:
					{
						authorization: token
					}
				}
			)
			.then(response => {
				dispatch({
					type: FETCH_USER_INFO,
					payload:response.data
				});

			})
			.catch(err => {
				console.log(err);
			});
		}
	}
}



