import { RECEIVE_MESSAGES } from '../actions/message_actions';

const MessagesReducer = (state = { }, action) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_MESSAGES:
      newState = action.messages;
      return newState;
    // case RECEIVE_USER_TWEETS:
    //   newState.user = action.tweets.data;
    //   return newState;
    // case RECEIVE_NEW_TWEET:
    //   newState.new = action.tweet.data
    //   return newState;
    default:
      return state;
  }
};

export default MessagesReducer;