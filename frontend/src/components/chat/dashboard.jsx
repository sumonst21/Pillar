import React from 'react';
//import room from '../../../../validation/room';
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{
   constructor(props){
      super(props);

      this.createNewRoom = this.createNewRoom.bind(this);
      
   }

   //component did mount
   componentDidMount(){
      //debugger;
      this.props.getRooms(this.props.user.id);
      //when the dashboard mounts, this.props.rooms will have a list of all rooms a user belongs to 
      // need to render the chatboxes with unique socket ids
   }

   createNewRoom(e){
      e.preventDefault();
      e.stopPropagation();
      let room = {
         title: "Hardcode for now",
         admin: this.props.user.id,
         users: this.props.user.id,
      }
      
      //debugger;
      this.props.createRoom(room)

   }


   render(){

      let rooms = this.props.rooms || {};
      let socketIds = []
      Object.keys(rooms).forEach(key => {
         socketIds.push("/" + rooms[key]._id);  //add the '/' for socketio syntax
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