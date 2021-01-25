import { getRoom, getRooms, deleteRoomUtil, updateRoomUtil, createRoomUtil, getRoomUsers, leaveRoomUtil, editRoomClosedForUtil} from '../util/room_api_util';

export const RECEIVE_ROOMS = "RECEIVE_ROOMS";
export const RECEIVE_ROOM = "RECEIVE_ROOM";
export const DELETE_ROOM = "DELETE_ROOM";
export const UPDATE_ROOM = "UPDATE_ROOM";
export const LEAVE_ROOM = "LEAVE_ROOM";
//export const RECEIVE_NEW_MESSAGE = "RECEIVE_NEW_MESSAGE";
export const RECEIVE_ROOM_USERS = "RECEIVE_ROOM_USERS";
export const CHAT_ROOM_STATUS = 'CHAT_ROOM_STATUS';


export const receiveRooms = rooms => ({
  type: RECEIVE_ROOMS,
  rooms
});

export const deleteRoom = room => ({
  type: DELETE_ROOM,
  room
});

export const updateRoom = room => ({
  type: UPDATE_ROOM,
  room
})

export const exitRoom = room => ({
  type: LEAVE_ROOM,
  room
})

export const receiveRoom = room => ({
  type: RECEIVE_ROOM,
  room
})

export const chatRoomStatus = data => ({
  type: CHAT_ROOM_STATUS,
  data
})

export const chatRoomSwitch = data => dispatch => {
  dispatch(chatRoomStatus(data));
};


export const fetchRoom = (roomId) => dispatch => (
  getRoom(roomId)
    .then(room => dispatch(receiveRoom(room)))
    .catch(err => console.log(err))
);

export const createRoom = room => dispatch => {
  dispatch(receiveRoom(room))
}

export const removeRoom = room => dispatch => (
  dispatch(deleteRoom(room))
  )

export const editRoom = room => dispatch => (
  updateRoomUtil(room)
    .then(room => {
         
      dispatch(updateRoom(room.data))
    })
)
export const updateUserList = room => dispatch => {
    
  dispatch(updateRoom(room));
    
}

export const leaveRoom = room => dispatch => (
  updateRoomUtil(room)
    .then(room => {
       
      dispatch(exitRoom(room.data))
    })
)

export const fetchRooms = (userId) => dispatch => (
  getRooms(userId)
    .then(rooms => {
      dispatch(receiveRooms(rooms));
    })
    .catch(err => console.log(err))
);

export const editClosedFor = (roomId, email, id) => dispatch => {
   ;
  return editRoomClosedForUtil(roomId, email, id)
  .then(rooms => {
     ;
    // fetchRooms(id)
    dispatch(receiveRooms(rooms));
  })
  // .catch(err => console.log(err))
}
