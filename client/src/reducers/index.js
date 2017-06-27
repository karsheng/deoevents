import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import auth from './auth_reducer';
import events from './event_reducer';
import user from './user_reducer';
import user_events from './user_events_reducer';


const rootReducer = combineReducers({
  form,
  auth,
  events,
  user,
  user_events
});

export default rootReducer;
