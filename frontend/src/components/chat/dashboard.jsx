import React from 'react';
//import room from '../../../../validation/room';
import io from "socket.io-client";
import ChatBox from './chat_box_container';
import Sidebar from './side_bar_container'
import { getAvailableRooms } from '../../util/room_api_util';

class DashBoard extends React.Component{
   constructor(props){
      super(props);
      this.socket = io();
      this.state = {
         newTitle: "",
         roomsAvailable: [],
      }

      this.createNewRoom = this.createNewRoom.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.joinRoom = this.joinRoom.bind(this);
   }

   //component did mount
   componentDidMount(){
      
      this.props.getRooms(this.props.user.id); //this pings the database


      getAvailableRooms(this.props.user.id) //this pings the database
         .then(rooms => {
            this.setState({
               roomsAvailable: rooms,
            })
            //console.log(roomsAvailable);

         });
    debugger
      //when the dashboard mounts, this.props.rooms will have a list of all rooms a user belongs to 
      // need to render the chatboxes with unique socket ids
   }

   componentDidUpdate(prevProps){
      let user = this.props.user.username;
      let rooms = this.props.rooms;
      if (Object.keys(rooms).length != Object.keys(prevProps.rooms).length) {
         // this.socket = io();
         this.socket.emit("User connected", { user, rooms });
      };
      getAvailableRooms(this.props.user.id)
         .then(rooms => {
            this.setState({
               roomsAvailable: rooms,
            })
            //console.log(roomsAvailable);

         });
   }

   createNewRoom(e){
      e.preventDefault();
      e.stopPropagation();
      let room = {
         title: this.state.newTitle,
         admin: this.props.user.id,
         users: this.props.user.id,
      }
      this.props.createRoom(room)
      this.setState({
         newTitle: "",
      })
   }

   joinRoom(e){
      
      let room = this.state.roomsAvailable.data.filter(room => e.currentTarget.id === room._id ? room : null);
      room[0].users.push(this.props.user.id);
      this.props.editRoom(room[0]);
      //  
   }

   handleChange(e){
      this.setState({
         newTitle: e.currentTarget.value,
      })
   }


   render(){

      let rooms = this.props.rooms || {};
      let roomIds = [];

      Object.keys(rooms).forEach(key => {
         roomIds.push(rooms[key]._id);  
      })
      return(
         <div>
               <Sidebar 
                  createNewRoom = {this.createNewRoom}
                  newTitle={this.state.newTitle}
                  handleChange={this.handleChange}
                  joinRoom={this.joinRoom}
                  roomsAvailable={this.state.roomsAvailable}
               />
            <div>
               {
                  roomIds.map(id=>
                     {
                        return (
                           <ChatBox roomId={id} key={id} socket={this.socket}/>
                        )
                     }
                  )
               }  
            </div>

         </div>
      )
   }
}


export default DashBoard;