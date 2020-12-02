import { RECEIVE_MESSAGES, RECEIVE_NEW_MESSAGE } from '../actions/message_actions';

const MessagesReducer = (state = { }, action) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);
  // debugger;
  switch (action.type) {
    case RECEIVE_MESSAGES:
      newState = action.messages;
      return newState;
    // case RECEIVE_USER_TWEETS:
    //   newState.user = action.tweets.data;
    //   return newState;
    case RECEIVE_NEW_MESSAGE:
      // debugger;
      newState.data.push(action.message);
      // debugger;
      return newState;
    default:
      return state;
  }
};

export default MessagesReducer;