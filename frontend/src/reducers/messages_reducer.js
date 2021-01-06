import { debug } from 'request';
import { RECEIVE_MESSAGES, RECEIVE_NEW_MESSAGE, UPDATE_MESSAGE, REMOVE_MESSAGE } from '../actions/message_actions';
import { RECEIVE_ROOMS, DELETE_ROOM, RECEIVE_ROOM } from '../actions/room_actions';

const MessagesReducer = (state = { }, action) => {
  Object.freeze(state);
   ;
  let newState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_MESSAGES:
      newState = action.messages;
      return newState;
    case RECEIVE_NEW_MESSAGE:
       
      Object.assign(newState, {[action.message.id]: action.message});
      return newState;
    case RECEIVE_ROOMS:
      let messages = {};
      //create messages object
      //  ;
      ;
      action.rooms.data.forEach(room => {
        room.messages.forEach(msg => {
          messages[msg._id] = {
            id: msg._id,
            message: msg.message,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            room: msg.room,
            sender: msg.sender === null ? null : msg.sender._id,
            username: msg.sender === null ? null : msg.sender.username,
          }
        })
      });
      Object.assign(newState, messages);
      return newState;
    case RECEIVE_ROOM:

       ;
      return state;
    case UPDATE_MESSAGE:
      action.message.id = action.message._id; //rename the id property key
      delete action.message._id;
      newState[action.message.id] = action.message;
      return newState;
    case REMOVE_MESSAGE:
       
      delete newState[action.message._id];
      return newState;
    case DELETE_ROOM:
       
      action.room.messages.forEach(msgId =>{
        delete newState[msgId];
      });
      return newState;
    default:
      return state;
  }
};

export default MessagesReducer;