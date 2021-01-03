import { getMessages } from '../util/message_api_util';

export const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
export const RECEIVE_NEW_MESSAGE = "RECEIVE_NEW_MESSAGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";

export const receiveMessages = messages => ({
  type: RECEIVE_MESSAGES,
  messages
});

export const receiveNewMessage = message => ({
  type: RECEIVE_NEW_MESSAGE,
  message
})

export const updateMessage = message => ({
  type: UPDATE_MESSAGE,
  message
})

export const removeMessage = message => ({
  type: REMOVE_MESSAGE,
  message
})


export const editMessage = message => dispatch => {
  dispatch(updateMessage(message));
};



export const deleteMessage = message => dispatch => {
  dispatch(removeMessage(message));
};

export const fetchMessages = (roomId) => dispatch => (
  getMessages(roomId)
    .then(messages => dispatch(receiveMessages(messages)))
    .catch(err => console.log(err))
);

export const afterMessageSent = (msg) => dispatch => {
     
  dispatch(receiveNewMessage(msg))
};

