import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import eventReducer from './event_reducer';
import registrationReducer from './registration_reducer';

const rootReducer = combineReducers({
  form,
  auth : authReducer,
  events: eventReducer,
  registration: registrationReducer
});

export default rootReducer;
