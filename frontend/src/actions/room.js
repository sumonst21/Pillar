import { getRooms, getRoom } from '../util/room_api_util';

export const RECEIVE_ROOMS = "RECEIVE_ROOMS";

export const receiveRooms = rooms => ({
  type: RECEIVE_ROOMS,
  rooms
});

// export const receiveUserTweets = tweets => ({
//   type: RECEIVE_USER_TWEETS,
//   tweets
// });

// export const receiveNewMessage = message => ({
//   type: RECEIVE_NEW_MESSAGE,
//   message
// })

export const fetchRooms = () => dispatch => (
  getRooms()
    .then(rooms => dispatch(receiveRooms(rooms)))
    .catch(err => console.log(err))
);



