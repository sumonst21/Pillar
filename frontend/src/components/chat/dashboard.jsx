import React from 'react';
//import room from '../../../../validation/room';
import io from "socket.io-client";
import ChatBox from './chat_box_container';
import Sidebar from './side_bar_container'
import { getAvailableRooms, getRooms } from '../../util/room_api_util';
import * as cloneDeep from 'lodash/cloneDeep';
import "./chatbox.css"
class DashBoard extends React.Component{
   constructor(props){
      super(props);
      this.socket = io();
      this.state = {
         newTitle: "",
         roomsAvailable: [],
         roomsJoined: [],
         all: [],
         deletedRoom: null,
      }

      this.createNewRoom = this.createNewRoom.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.joinRoom = this.joinRoom.bind(this);
      this.leaveRoom = this.leaveRoom.bind(this);
      this.userLeft = this.userLeft.bind(this);
      this.userJoined = this.userJoined.bind(this);
      this.deleteRoom = this.deleteRoom.bind(this);
      this.roomDeleted = this.roomDeleted.bind(this);
      this.ackDelete = this.ackDelete.bind(this);
      
   }

   
   //component did mount
   componentDidMount(){
      
      this.props.getRooms(this.props.user.id); //this pings the database
      
      getRooms(this.props.user.id)
         .then(rooms => {
            this.setState({
               roomsJoined: rooms,
            })
         })
         .then(()=>{
            getAvailableRooms(this.props.user.id) //this pings the database                                
            .then(rooms => {
               this.setState({
                  roomsAvailable: rooms,
               })
            })
            .then(()=>{
               this.setState({all: this.state.roomsAvailable.data.concat(this.state.roomsJoined.data)})
            })
         })
      
      this.socket.on("user left", this.userLeft);
      this.socket.on("user joined", this.userJoined);
      this.socket.on("room deleted", this.roomDeleted);
   }
   
   componentDidUpdate(prevProps){
      let user = this.props.user.username;
      let rooms = this.props.rooms;
      if (Object.keys(rooms).length != Object.keys(prevProps.rooms).length) {
         
         this.socket.emit("User connected", { user, rooms });
         this.props.getRooms(this.props.user.id); 
         
         
      getRooms(this.props.user.id)
         .then(rooms => {
            this.setState({
               roomsJoined: rooms,
            })
         })
         .then(()=>{
            getAvailableRooms(this.props.user.id) //this pings the database                                
            .then(rooms => {
               this.setState({
                  roomsAvailable: rooms,
               })
            })
            .then(()=>{
               this.setState({all: this.state.roomsAvailable.data.concat(this.state.roomsJoined.data)})
            })
         })
      };
   }

   userLeft({ user, room }) {     
      this.props.updateUserList(room);
   }

   userJoined({ user, room }) {
      //update list of current users....change format of newly added user to match state format
      //remove old format
      room.users.splice(room.users.length - 1, 1);
      //add new format
      room.users.push({username: user.username, _id: user.id})
      this.props.updateUserList(room);
   }
   
   createNewRoom(e){
      e.preventDefault();
      e.stopPropagation();
      let room = {
         title: this.state.newTitle,
         admin: this.props.user.id,
         users: this.props.user.id,
      }
      this.props.createRoom(room);
      this.setState({
         newTitle: "",
      })
   }

   joinRoom(e){
      
      let room = this.state.roomsAvailable.data.filter(room => e.currentTarget.id === room._id ? room : null);
      
      room[0].users.push(this.props.user.id);
      this.props.editRoom(room[0]);
      
      this.socket.emit('join room', {
         room: room[0],
         user: this.props.user,
      })
   }

   leaveRoom(e){
       
      let room = cloneDeep(this.props.rooms[e.currentTarget.id]);
      //find and remove current user from the room users array
      for (let i = 0; i < room.users.length; i++){
         if(room.users[i]._id === this.props.user.id){
            room.users.splice(i, 1);
         }
      }
       
      this.props.leaveRoom(room);
      this.socket.emit('leave room',{
         room: room,
         user: this.props.user,
      })
   }

   deleteRoom(room){
      this.socket.emit('delete room',{room, user: this.props.user});
   }

   roomDeleted({room, user}){
      debugger;
      this.props.deleteRoom(room);
      if (this.props.user.id !== room.admin){
         this.setState({deletedRoom: room});
      }
   }

   ackDelete(){
      this.setState({deletedRoom: null});
   }

   handleChange(e){
      this.setState({
         newTitle: e.currentTarget.value,
      })
   }


   render(){
      let rooms = this.props.rooms || {};
      let roomIds = [];
      console.log("Dashboard rendered");
      Object.keys(rooms).forEach(key => {
         roomIds.push(rooms[key]._id);  
      });

      return(
         <div>
               <Sidebar 
                  createNewRoom = {this.createNewRoom}
                  newTitle={this.state.newTitle}
                  handleChange={this.handleChange}
                  joinRoom={this.joinRoom}
                  roomsAvailable={this.state.roomsAvailable}
                  allRooms = {this.state.all}
               />
               {this.state.deletedRoom ? (
                  <div className="deleted-room-alert">
                     <h3>{`"${this.state.deletedRoom.title}" was deleted by the admin.`}</h3>
                     <button onClick={this.ackDelete}>OK</button>
                  </div>
                  ) : (null)            
               }
            <div className="chatbox-list" >
               {
                  roomIds.map(id=>
                     {
                        return (
                           <ChatBox leaveRoom={this.leaveRoom} deleteRoom={this.deleteRoom} roomId={id} key={id} socket={this.socket}/>
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