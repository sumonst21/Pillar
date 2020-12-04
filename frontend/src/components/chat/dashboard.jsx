import React from 'react';
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{
   constructor(props){
      super(props);

      this.createNewRoom = this.createNewRoom.bind(this);

   }

   createNewRoom(e){
      e.preventDefault();
      e.stopPropagation();
      let room = {
         title: "Hardcode for now",
         admin: this.props.user.id,
         users: this.props.user.id,
      }
      
      debugger;
      this.props.createRoom(room)

   }


   render(){

      //login here to create chat boxes for each chatbox in state?

      //the ids entered below are the instance ids of two rooms in the db
      return(
         <div>
            <button onClick={this.createNewRoom}>Create a New Chat Room</button>
            <div>
               <ChatBox socketId="/5fc90aaf6da6f760b4b3b84a"/>    
               <ChatBox socketId="/5fc9193d0cb8b668f49456cd"/>    
            </div>

         </div>
      )
   }
}


export default DashBoard;