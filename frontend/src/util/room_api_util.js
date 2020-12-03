import axios from 'axios';

export const getRooms = () => {
  return axios.get('/api/rooms')
};
export const getRoom = (roomId) => {
  return axios.get(`/api/rooms/${roomId}`)
};