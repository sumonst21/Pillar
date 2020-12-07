import React from 'react';
//import room from '../../../../validation/room';
import io from "socket.io-client";
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         newTitle: "",
      }

      this.createNewRoom = this.createNewRoom.bind(this);
      this.handleChange = this.handleChange.bind(this);
   }

   //component did mount
   componentDidMount(){
      debugger;
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
         title: this.state.newTitle,
         admin: this.props.user.id,
         users: this.props.user.id,
      }
      
       ;
      this.props.createRoom(room)

   }

   handleChange(e){
      this.setState({
         newTitle: e.currentTarget.value,
      })
   }


   render(){

      let rooms = this.props.rooms || {};
      let roomIds = [];
      debugger;



      Object.keys(rooms).forEach(key => {
         roomIds.push(rooms[key]._id);  
      })

      return(
         <div>
            <form onSubmit={this.createNewRoom}>
               <input type="text" value={this.state.newTitle} 
                        onChange={this.handleChange}
                        placeholder="Enter new room title"/>

            </form>
            <button onClick={this.createNewRoom}>Create a New Chat Room</button>
            <div>
               {
                  roomIds.map(id=>(
                     <ChatBox roomId={id} key={id} />
                  ))
               }  
            </div>

         </div>
      )
   }
}


export default DashBoard;