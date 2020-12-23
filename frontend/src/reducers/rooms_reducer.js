import { RECEIVE_ROOM, 
        RECEIVE_ROOMS,
        DELETE_ROOM,
        UPDATE_ROOM,
        LEAVE_ROOM,
         } from '../actions/room_actions';
import { RECEIVE_NEW_MESSAGE } from '../actions/message_actions';
import * as cloneDeep from 'lodash/cloneDeep';

const RoomsReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = cloneDeep(state);
  switch (action.type) {
    case RECEIVE_ROOM:
      const roomId = action.room.data._id;
      Object.assign(newState,{ [roomId]: action.room.data });
      return newState;

    case RECEIVE_NEW_MESSAGE:
      newState[action.message.room].messages.push(action.message);
      return newState;

    case RECEIVE_ROOMS:
      debugger;
      action.rooms.data.forEach(room => {
        const roomId = room._id;
        //shape the messages for each room
        let messages = [];
        room.messages.forEach(msg => {
          messages.push({
            id: msg._id,
            message: msg.message,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            room: msg.room,
            sender: msg.sender._id,
            username: msg.sender.username,
          })
        });
         
        room.messages = messages;

        Object.assign(newState, { [roomId]: room })
      });
      
      return newState;
    case DELETE_ROOM:
       ;
      delete newState.rooms[action.roomId];
      return newState;
    case UPDATE_ROOM:
        
      let id = action.room._id;
      //newState.rooms[action.room._id] = action.room;
      Object.assign(newState,{[id]: action.room })
      return newState;
    case LEAVE_ROOM:
       
      delete newState[action.room._id];
      return newState;
    default:
      return state;
  }
};

export default RoomsReducer;