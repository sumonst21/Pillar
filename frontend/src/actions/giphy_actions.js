import {getGiphy} from "../util/giphy_api_util"

export const RECEIVE_GIPHY = "RECEIVE_GIPHY"

export const receiveGiphy = giphy => {
   return {
      type: RECEIVE_GIPHY,
      giphy
   }
}
export const fetchGiphy = (keyword) => dispatch => {
   return getGiphy(keyword)
      .then(giphy => dispatch(receiveGiphy(giphy)))
}

// window.getGiphy('hi').then(result => {console.log(result)})