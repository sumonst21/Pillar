import { RECEIVE_ROOM, 
        RECEIVE_ROOMS,
        DELETE_ROOM,
        UPDATE_ROOM,
        RECEIVE_NEW_MESSAGE,
         } from '../actions/room_actions';
import * as cloneDeep from 'lodash/cloneDeep';

const RoomsReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = cloneDeep(state);
  switch (action.type) {
    case RECEIVE_ROOM:
      const roomId = action.room.data._id;
      Object.assign(newState,{ [roomId]: action.room.data });
      return newState;

      /////
    case RECEIVE_NEW_MESSAGE:
      
      //make a deep dupe of the messages array and reassign to the new state
      // let NewArray = [];
      // newArray = lodash.newState[action.message.room].messages

      newState[action.message.room].messages.push(action.message);
      return newState;
      /////
    case RECEIVE_ROOMS:
      action.rooms.data.forEach(room => {
        const roomId = room._id;
        Object.assign(newState, { [roomId]: room })
      });
      
      return newState;
    case DELETE_ROOM:
       ;
      delete newState.rooms[action.roomId];
      return newState;
    case UPDATE_ROOM:
      // debugger;
      const id = action.room._id;
      //newState.rooms[action.room._id] = action.room;
      Object.assign(newState,{[id]: action.room })
      return newState;
    default:
      return state;
  }
};

export default RoomsReducer;