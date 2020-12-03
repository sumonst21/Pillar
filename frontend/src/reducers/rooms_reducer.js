import { RECEIVE_ROOM, RECEIVE_ROOMS } from '../actions/room_actions';

const MessagesReducer = (state = {}, action) => {
  Object.freeze(state);
  // debugger;
  let newState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_ROOM:
      newState = action.messages;
      return newState;
    // case RECEIVE_USER_TWEETS:
    //   newState.user = action.tweets.data;
    //   return newState;
    case RECEIVE_ROOMS:
      // debugger;
      newState.data.push(action.message);
      return newState;
    default:
      return state;
  }
};

export default MessagesReducer;