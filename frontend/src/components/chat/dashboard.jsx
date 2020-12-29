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
         all: []
      }

      this.createNewRoom = this.createNewRoom.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.joinRoom = this.joinRoom.bind(this);
      this.leaveRoom = this.leaveRoom.bind(this);
      this.userLeft = this.userLeft.bind(this);
      this.userJoined = this.userJoined.bind(this);
      // this.userLeft = this.userLeft.bind(this);

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
      // getAvailableRooms(this.props.user.id) //this pings the database
      // .then(rooms => {
         
      //    this.setState({
      //       roomsAvailable: rooms,
      //    })
      // });
      
      this.socket.on("user left", this.userLeft);
      this.socket.on("user joined", this.userJoined);
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
            //console.log(roomsAvailable);
            
         
      };
   }

   userLeft({ user, room }) {
      //update list of current users....
       
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
      
      debugger
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
                  //rooms={this.props.rooms}
                  // messages={this.props.messages}
                  //allRooms = {this.state.all}
               />
            <div className="chatbox-list" >
               {
                  roomIds.map(id=>
                     {
                        return (
                           <ChatBox leaveRoom={this.leaveRoom} roomId={id} key={id} socket={this.socket}/>
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