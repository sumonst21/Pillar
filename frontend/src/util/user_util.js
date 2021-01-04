import axios from 'axios';

export const getUser = (userData) => {
   debugger;
   return axios.get(`/api/users/current/`)
}