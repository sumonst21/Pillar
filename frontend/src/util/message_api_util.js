import axios from 'axios';

export const getMessages = (roomId) => {
  return axios.get(`/api/messages/${roomId}`)
};

// export const getUserTweets = id => {
//   return axios.get(`/api/tweets/user/${id}`)
// };

// export const writeTweet = data => {
//   return axios.post('/api/tweets/', data)
// }