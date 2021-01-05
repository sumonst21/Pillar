import {
  RECEIVE_ROOM,
  RECEIVE_ROOMS,
  DELETE_ROOM,
  UPDATE_ROOM,
  LEAVE_ROOM,
} from '../actions/room_actions';
import { RECEIVE_NEW_MESSAGE, UPDATE_MESSAGE, REMOVE_MESSAGE } from '../actions/message_actions';
import * as cloneDeep from 'lodash/cloneDeep';
const RoomsReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = cloneDeep(state);
  switch (action.type) {
    case RECEIVE_ROOM:
       
      const roomId = action.room._id;
      Object.assign(newState, { [roomId]: action.room });
      return newState;
    case RECEIVE_NEW_MESSAGE:
      let messagesArray = newState[action.message.room].messages;
      let length = messagesArray.length;
      let lastMessage = messagesArray[length-1];

      if (length !== 0){
        if( lastMessage.id !== action.message.id){
          newState[action.message.room].messages.push(action.message);
        }
      }else{
        newState[action.message.room].messages.push(action.message);
      };

      return newState;
    case RECEIVE_ROOMS:
      action.rooms.data.forEach(room => {
        // ;
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
            replies: msg.replies,
          })
        });
        room.messages = messages;
        Object.assign(newState, { [roomId]: room })
      });
      return newState;
    case DELETE_ROOM:
      delete newState[action.room._id];
      return newState;
    case UPDATE_ROOM:
      let id = action.room._id;
      Object.assign(newState, { [id]: action.room })
      return newState;
    case LEAVE_ROOM:
      delete newState[action.room._id];
      return newState;
    case UPDATE_MESSAGE:
      let messages = newState[action.message.room].messages;
      let index = messages.findIndex(msg => msg.id === action.message.id);
      newState[action.message.room].messages[index] = action.message;
      return newState;
    case REMOVE_MESSAGE:
      let msgs = newState[action.message.room].messages;
      let indx = msgs.findIndex(msg => msg.id === action.message._id);
      newState[action.message.room].messages.splice(indx, 1);
      return newState;
    default:
      return state;
  }
};
export default RoomsReducer;