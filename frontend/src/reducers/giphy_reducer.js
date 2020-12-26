import {RECEIVE_GIPHY}  from '../actions/giphy_actions';

const GiphyReducer = (oldState = {}, action) => {
   Object.freeze(oldState);

   switch(action.type){
      case RECEIVE_GIPHY:
      ;
         return Object.assign({}, oldState, action.giphy.data)
      default:
         return oldState;
   }
}

export default GiphyReducer;