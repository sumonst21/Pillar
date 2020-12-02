import { combineReducers } from 'redux';
import session from './session_reducer';
import errors from './errors_reducer';
import messages from './messages_reducer';

const RootReducer = combineReducers({
  session,
  errors,
  messages
});

export default RootReducer;