import { getRoom, getRooms, deleteRoomUtil, updateRoomUtil, createRoomUtil, getRoomUsers } from '../util/room_api_util';

export const RECEIVE_ROOMS = "RECEIVE_ROOMS";
export const RECEIVE_ROOM = "RECEIVE_ROOM";
export const DELETE_ROOM = "DELETE_ROOM";
export const UPDATE_ROOM = "UPDATE_ROOM";
//export const RECEIVE_NEW_MESSAGE = "RECEIVE_NEW_MESSAGE";
export const RECEIVE_ROOM_USERS = "RECEIVE_ROOM_USERS";


export const receiveRooms = rooms => ({
  type: RECEIVE_ROOMS,
  rooms
});

export const deleteRoom = roomId => ({
  type: DELETE_ROOM,
  roomId
});

export const updateRoom = room => ({
  type: UPDATE_ROOM,
  room
})

export const receiveRoom = room => ({
  type: RECEIVE_ROOM,
  room
})


export const fetchRoom = (roomId) => dispatch => (
  getRoom(roomId)
    .then(room => dispatch(receiveRoom(room)))
    .catch(err => console.log(err))
);

export const createRoom = room => dispatch => (
  createRoomUtil(room)
    .then(room => dispatch(receiveRoom(room)))
)

export const removeRoom = roomId => dispatch => (
  deleteRoomUtil(roomId)
    .then(roomId => dispatch(deleteRoom(roomId)))
  )

export const editRoom = room => dispatch => (
  updateRoomUtil(room)
    .then(room => {
       
      dispatch(updateRoom(room.data))
    })
)

export const fetchRooms = (userId) => dispatch => (
  getRooms(userId)
    .then(rooms => {
      
      dispatch(receiveRooms(rooms));
    })
    .catch(err => console.log(err))
);

