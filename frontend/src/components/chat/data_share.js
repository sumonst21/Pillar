// class SharedData {
//     constructor(){
//         this.openOrClose = [false];
//         this.infoFromSearchbar = (bool) => {
//             this.openOrClose.pop();
//             this.openOrClose.push(bool);
//             console.log(this.openOrClose)
//         }; 
//     };


//     infoToChatbox(){

//         return this.openOrClose
//     };

// }

// const instance = new SharedData();

// export default instance;
import ChatBox from './chat_box_container';
import SearchBarDropdown from './search_dropdown';
import React, {useState} from 'react';

function BridgeReducer(state, action) {
    //when clicked in searchbar, it dispatch the room the message belongs to the state
}