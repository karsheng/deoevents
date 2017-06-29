import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import eventReducer from './event_reducer';

const rootReducer = combineReducers({
  form,
  auth : authReducer,
  events: eventReducer,
});

export default rootReducer;
