import axios from 'axios';

export const getUser = (userData) => {
   ;
   return axios.get(`/api/users/current/`)
}