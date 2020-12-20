import axios from 'axios';

export const getRooms = (userId) => {
  return axios.get(`/api/rooms/${userId}/rooms`)
};

export const getAvailableRooms = (userId) => {
  return axios.get(`/api/rooms/${userId}/roomsAvailable`)
};

export const createRoomUtil = (room) => {
  return axios.post('api/rooms/', room)
}

export const getRoom = (roomId) => {
  return axios.get(`/api/rooms/${roomId}`)
};

export const deleteRoomUtil = (roomId) => {
  return axios.post(`/api/rooms/${roomId}/delete`)
}

export const updateRoomUtil = (room) => {
  // debugger;
  return axios.post(`/api/rooms/${room._id}`, room)
}
// /:roomId

// export const writeTweet = data => {
//   return axios.post('/api/tweets/', data)
// }

// axios.delete('url', { data: payload }).then(
//   // Observe the data keyword this time. Very important
//   // payload is the request body
//   // Do something
// )