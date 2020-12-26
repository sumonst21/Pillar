import axios from 'axios';

export const getGiphy = (keyword) => {
  return axios.get(`/api/giphy/${keyword}`)
};