import React from 'react';
//import room from '../../../../validation/room';
import io from "socket.io-client";
import ChatBox from './chat_box_container';
import Sidebar from './side_bar_container'
import { getAvailableRooms, getRooms } from '../../util/room_api_util';
import * as cloneDeep from 'lodash/cloneDeep';
class DashBoard extends React.Component{
   constructor(props){
      super(props);
      this.socket = io();
      
      this.state = {
         roomsAvailable: [],
         roomsJoined: [],
         all: [],
         deletedRoom: null,
         myRooms: this.props.user.rooms,
      }
      
      this.createNewRoom = this.createNewRoom.bind(this);
      this.joinRoom = this.joinRoom.bind(this);
      this.leaveRoom = this.leaveRoom.bind(this);
      this.userLeft = this.userLeft.bind(this);
      this.userJoined = this.userJoined.bind(this);
      this.deleteRoom = this.deleteRoom.bind(this);
      this.roomDeleted = this.roomDeleted.bind(this);
      this.ackDelete = this.ackDelete.bind(this);
      this.roomCreated = this.roomCreated.bind(this);
      
      
   }

   
   //component did mount
   componentDidMount(){
      
      this.props.closeModal();
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
      this.socket.on("room created", this.roomCreated);
      // this.socket.on("room creation error", this.addRoomCreationError);
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
      // if (this.props.rooms != prevProps) {
      //    this.render()
      // }
   }

   userLeft({ user, room }) { 
      //check if this user belongs to the room
      let currentRooms = Object.keys(this.props.rooms);

      if (currentRooms.includes(room._id)) {    
         this.props.updateUserList(room);
      }
   }

   userJoined({ user, room }) {
      //check if this user belongs to the room
      let currentRooms = Object.keys(this.props.rooms);

      if (currentRooms.includes(room._id)){
         //reformat the user object added to the room to match existing users
         room.users.splice(room.users.length - 1, 1);
         room.users.push({username: user.username, _id: user.id})
         this.props.updateUserList(room);
      }
   }
   
   createNewRoom(newRoom){
      
      this.socket.emit("Create Room", newRoom);
      this.setState({
         newTitle: "",
         errors: []
      })
   }

   roomCreated(room){
      this.props.closeModal();
      let roomsJoined = cloneDeep(this.state.roomsJoined);
      let roomsAvail = cloneDeep(this.state.roomsAvailable);
      let allRooms = cloneDeep(this.state.all);
      
      if (room.admin === this.props.user.id){
         this.props.createRoom(room);
         roomsJoined.data.push(room);
         this.setState({
            roomsJoined: {data: roomsJoined.data},
         })
      } else {
         roomsAvail.data.push(room);
         this.setState({
            roomsAvailable: {data: roomsAvail.data},
         })
      }
       
      allRooms.push(room);
      this.setState({
         all: allRooms,
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
      this.props.deleteRoom(room);
      //check if this user was a member 
       
      let roomMembers = room.users;
      if (this.props.user.id !== room.admin && roomMembers.includes(this.props.user.id)){
         this.setState({deletedRoom: room});
         
      } else {
         //remove from available rooms list
         let rmsAvail = cloneDeep(this.state.roomsAvailable);
         let index = null;
         for (let i = 0; i < rmsAvail.data.length; i++){
            if(rmsAvail.data[i]._id === room._id){
               index = i;
            }
         }

         if (index) {
            rmsAvail.data.splice(index, 1);
         }

         this.setState({
            roomsAvailable: {data: rmsAvail.data}
         })
          
      }

      //remove from joined rooms list?

   }

   ackDelete(){
      this.setState({deletedRoom: null});
   }






   render(){
      let rooms = this.props.rooms || {};
      if (rooms.length > 0){
         // 
      }
      let roomIds = [];
      //   myRooms = this.state.myRooms;
      console.log("Dashboard rendered");
      Object.keys(rooms).forEach(key => {
         // ;
         roomIds.push(rooms[key]._id);  
      });
      // rooms.forEach(room => {
      //    ;
      //    roomIds.push(room.roomId);
      // });
      // ;
      return(
         <div className="dashboard">
            <Sidebar 
               createNewRoom = {this.createNewRoom}
               newTitle={this.state.newTitle}
               handleChange={this.handleChange}
               joinRoom={this.joinRoom}
               roomsAvailable={this.state.roomsAvailable}
               allRooms = {this.state.all}
               errors = {this.state.errors}
               socket = {this.socket}
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
                        if (id !== undefined){
                     return (this.props.rooms[id].closedFor.includes(this.props.user.email) ?
                         "" :  <ChatBox leaveRoom={this.leaveRoom} deleteRoom={this.deleteRoom} roomId={id} key={id} socket={this.socket}/>
                        )}
                     }
                  )
               }  
            </div>

         </div>
      )
   }
}


export default DashBoard;