import { RECEIVE_ROOM, 
        RECEIVE_ROOMS,
        DELETE_ROOM,
        UPDATE_ROOM } from '../actions/room_actions';

const RoomsReducer = (state = {}, action) => {
  Object.freeze(state);
  // debugger;
  let newState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_ROOM:
      const roomId = action.room.data._id;
      Object.assign(newState,{ [roomId]: action.room.data });
      debugger;
      return newState;
    // case RECEIVE_USER_TWEETS:
    //   newState.user = action.tweets.data;
    //   return newState;
    case RECEIVE_ROOMS:
      // debugger;
      Object.assign(newState.rooms, action.rooms);
      return newState;
    case DELETE_ROOM:
      // debugger;
      delete newState.rooms[action.roomId];
      return newState;
    case UPDATE_ROOM:
      newState.rooms[action.room.id] = action.room;
      return newState;
    default:
      return state;
  }
};

export default RoomsReducer;