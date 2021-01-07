import React from "react"
import io from "socket.io-client";
import moment from "moment";
import UserList  from './user_list.js';
import './chatbox.css'
import Picker from 'emoji-picker-react';
import Giphy from "../giphy/giphy";
import Message from '../message/message_container';
import {switches} from './data_share'

class ChatBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      open: true, 
      openOrClose: 'close',
      emojiPicker: false,
    }


    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.openEmoji = this.openEmoji.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
    this.useGiphy = this.useGiphy.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }


  componentDidMount(){
    let roomId = this.props.room._id;

    this.props.socket.on(`MTC_${roomId}`, msg =>{
       //this message has been saved to the database, now need to update redux and components
      console.log(msg);
       
      let newMessage = {
        id: msg._id,
        message: msg.message,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        room: msg.room,
        sender: msg.sender,
        username: msg.username,
        replies: msg.replies
      }
      this.props.afterMessageSent(newMessage);      
    });

    
    this.subscription = switches.receiveOpen().subscribe(roomTitle=>{
      if(roomTitle === this.props.room.title){ //send an array or object with information about the room and open to true
        this.setState({open: true});//change the open directly but has a logic to determine it is the right room
      } 
    });
    
    if(this.props.room.closedFor.includes(this.props.user.email)){
      this.setState({open: false})
    } else {
      this.setState({open: true})
    };

    
    const openOrNot = localStorage.getItem(`roomOpen${this.props.room.title}`) === 'true';
    this.setState({open: openOrNot})
    
  };


  componentWillUnmount() {
    this.subscription.unsubscribe();

    let props = this.props;
    let email = props.user.email;
    let id = props.user.id;
     
    if(this.state.open === false){
      props.editClosedFor(props.room._id, email, id);
    } else {
      props.editOpenFor(props.room._id, email, id);
    };

    // localStorage.clear();

  };   

  handleChange(e){
    this.setState({
      chatMessage: e.currentTarget.value,
    })
  }

  selectEmoji(e, emojiObject){
    let newMessage = this.state.chatMessage + emojiObject.emoji;
    this.setState({
      chatMessage: newMessage
    })
  }

  openEmoji(){
    this.state.emojiPicker === true ? 
      this.setState({emojiPicker: false}) :
      this.setState({emojiPicker: true})
  }

  submitMessage(e) {
    if (e) { e.preventDefault()}

    let username = this.props.user.username;
    let userId = this.props.user.id;
    let room = this.props.room;

    let timestamp = moment().format('LT');
    let message = this.state.chatMessage;
     
    this.props.socket.emit("Create Message", {
      message,
      timestamp,
      username,
      userId,
      room
    })

    this.setState({
      chatMessage: "",
    })

    const ele = document.getElementById(`chatbox-item-${room.title}`);
    ele.scrollTop = ele.scrollHeight;


  }

  toggle(){

    if(this.state.open){

      this.setState({open: false, openOrClose: 'open'});
      const {open} = this.state;
      localStorage.setItem(`roomOpen${this.props.room.title}`, !open);

    } else {

      this.setState({open: true, openOrClose: 'close'});
      const {open} = this.state;
      localStorage.setItem(`roomOpen${this.props.room.title}`, !open);

    }
  }

  useGiphy(e){
    this.props.socket.emit("Create Message", {
      message: `${e.target.src}`,
      timestamp: moment().format('LT'), 
      username: this.props.user.username, 
      userId: this.props.user.id,
      room: this.props.room,
    })
  }

  deleteRoom(){
    let response = window.confirm(`Are you sure you want to delete the room: "${this.props.room.title}"`)
    if(response){
      this.props.deleteRoom(this.props.room);
    }
  }

  render() {
    
    let messages = this.props.room.messages.map((msg, index) => (<Message socket={this.props.socket} id={`msg-${this.props.room.title}-${index}`} msg={msg}/>)) || [];
    let users = this.props.room.users || [];

    return (
      <div className={(this.state.open) ? 'open' : 'close'}> <button onClick={this.toggle}>{this.state.open === true ? 'close' : `${this.props.room.title}`}</button>
        {(this.state.open ) ? (
          <div className="chatbox-container" id={`chatbox-item-${this.props.room.title}`}>

            <h1>{this.props.room.title}</h1>
            <div className='input-container' >
              <button onClick={this.props.leaveRoom} id={this.props.roomId}>Leave Room</button>
              {
                this.props.user.id === this.props.room.admin ? (
                  <button onClick={this.deleteRoom}>Delete Room</button>
                )
                :              
                (null)
              }
              <form onSubmit={this.submitMessage}>

                <input type="text" value={this.state.chatMessage} onChange={this.handleChange} />
              </form>
                {this.state.emojiPicker === false ? 
                <button onClick={this.openEmoji} > ☺ </button> : 
              <div onMouseLeave= {this.openEmoji}> <Picker className="emoji-picker" onEmojiClick={this.selectEmoji} /> </div>}

              <Giphy useGiphy={this.useGiphy} roomTitle={this.props.room.title}/>
            </div>
            <ul>
                {messages}
            </ul>
            <UserList users={users}/>
          </div>
        ) : null}
      </div>
    )
  }

}


export default ChatBox;