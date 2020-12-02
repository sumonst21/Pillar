import axios from 'axios';

export const getMessages = () => {
  return axios.get('/api/messages')
};

// export const getUserTweets = id => {
//   return axios.get(`/api/tweets/user/${id}`)
// };

// export const writeTweet = data => {
//   return axios.post('/api/tweets/', data)
// }