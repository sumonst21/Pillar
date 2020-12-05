import React from 'react';
//import room from '../../../../validation/room';
import io from "socket.io-client";
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{
   constructor(props){
      super(props);

      this.createNewRoom = this.createNewRoom.bind(this);
      
   }

   //component did mount
   componentDidMount(){
      this.props.getRooms(this.props.user.id);
      //when the dashboard mounts, this.props.rooms will have a list of all rooms a user belongs to 
      // need to render the chatboxes with unique socket ids
   }

   componentDidUpdate(prevProps){
      let user = this.props.user.username;
      let rooms = this.props.rooms;
      if (Object.keys(rooms).length != Object.keys(prevProps.rooms).length) {
         this.socket = io();
          ;
         this.socket.emit("User connected", { user, rooms });
      }
   }

   createNewRoom(e){
      e.preventDefault();
      e.stopPropagation();
      let room = {
         title: "Hardcode for now",
         admin: this.props.user.id,
         users: this.props.user.id,
      }
      
       ;
      this.props.createRoom(room)

   }


   render(){

      let rooms = this.props.rooms || {};
      let socketIds = []




      Object.keys(rooms).forEach(key => {
         socketIds.push(rooms[key]._id);  
      })

      return(
         <div>
            <button onClick={this.createNewRoom}>Create a New Chat Room</button>
            <div>
               {
                  socketIds.map(id=>(
                     <ChatBox socketId={id} key={id} />
                  ))
               }  
            </div>

         </div>
      )
   }
}


export default DashBoard;