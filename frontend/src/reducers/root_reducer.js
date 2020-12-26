import { combineReducers } from 'redux';
import session from './session_reducer';
import errors from './errors_reducer';
import messages from './messages_reducer';
import rooms from './rooms_reducer';
import giphy from './giphy_reducer'
const RootReducer = combineReducers({
  session,
  errors,
  messages,
  rooms,
  giphy
});

export default RootReducer;

