import React from "react"
import io from "socket.io-client";
import moment from "moment";
import UserList  from './user_list.js';
import Picker from 'emoji-picker-react';
import ChatBoxHeaderOptions from './chatbox_header_options';
import Giphy from "../giphy/giphy";
import Message from '../message/message_container';
import {switches} from './data_share'
import ClickOutHandler from 'react-onclickout';

class ChatBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      open: true, //null
      openOrClose: 'close',
      emojiPicker: false,
      userList: "close",
      send: false,
    }

    // 

    this.toggle = this.toggle.bind(this);
    this.openUserList = this.openUserList.bind(this);
    this.closeUserList = this.closeUserList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.openEmoji = this.openEmoji.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
    this.useGiphy = this.useGiphy.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.componentRefresh = this.componentRefresh.bind(this);
  }


  componentDidMount(){
    let roomId = this.props.room._id;

    this.props.socket.on(`MTC_${roomId}`, msg =>{
       //this message has been saved to the database, now need to update redux and components
      console.log(msg);
       
    // ;
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
    }

    window.addEventListener('beforeunload', this.componentRefresh(this.props))
     
  };

  componentRefresh(props){
    // let user = this.props.user.username;
    let email = props.user.email;
    let id = props.user.id;
     
    if(this.state.open === false){
       
      props.editClosedFor(props.room._id, email,  id)
    }
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
    const props = this.props;
    this.componentRefresh(props);
    window.removeEventListener('beforeunload', this.componentRefresh);


  };   

  handleChange(e){
    let send;
    
    if (e.currentTarget.value.trim().length > 0){
      send = true;
    } else {
      send = false;
    }
    this.setState({
      chatMessage: e.currentTarget.value,
      send: send,
    });
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
      send: false,
    })

    const ele = document.getElementById(`chatbox-item-${room.title}`);
    ele.scrollTop = ele.scrollHeight;


  }

  toggle(){
    this.state.open ? 
    this.setState({open: false, openOrClose: 'open'}) : 
    this.setState({open: true, openOrClose: 'close'});
  }

  openUserList() {
      this.setState({ userList: 'open' }) 
  }

  closeUserList() {
      this.setState({ userList: 'close' })
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
    let roomGiphy = `${this.props.room.title}-giphysearch`

    return (
      <div className={(this.state.open) ? 'open' : 'close'}> 
        {(this.state.open ) ? (
          <div className="chatbox-container" id={`chatbox-item-${this.props.room.title}`}>
            <div className="chatbox-header">
              <h1>{this.props.room.title}</h1>
              <ChatBoxHeaderOptions user={this.props.user}
                                    users= {users} 
                                    room={this.props.room}
                                    deleteRoom={this.deleteRoom}
                                    leaveRoom={this.props.leaveRoom}
                                    roomId={this.props.roomId}
                                    openModal={this.props.openModal}
                                    closeModal={this.props.closeModal}/>
              
            </div>
            <div className="message-ul">
              <ul>{messages}</ul>
            </div>
            <div className="chatbox-bottom">
              <div className='input-container' >
                
                {
                  this.state.emojiPicker === false ? 
                    <button className="text-input-button" onClick={this.openEmoji} > ☺ </button> : 
                  
                    <div onClick={this.openEmoji}>
                      <ClickOutHandler onClickOut={this.openEmoji} >
                        <div className="picker-wrapper">
                          <Picker className="emoji-picker" onEmojiClick={this.selectEmoji} /> 
                        </div>
                  
                        <button className="text-input-button" onClick={this.openEmoji} > ☺ </button>
                      </ClickOutHandler>
                    </div>
                }
                <Giphy case={"chatbox"} useGiphy={this.useGiphy} roomTitle={this.props.room.title}/>
              
                {this.state.send === true ? (
                  <form className="message-input" onSubmit={this.submitMessage}>
                    <input className="message-text-input" type="text" placeholder="Send message" value={this.state.chatMessage} onChange={this.handleChange} />
                    <button className="text-input-button" type="submit">Send</button>
                  </form>
                ) : (
                  <form className="message-input">
                    <input className="message-text-input" type="text" placeholder="Send message" value={this.state.chatMessage} onChange={this.handleChange} />
                  <button className="text-input-button-invalid" type="submit">Send</button>
                </form>
                )}

                
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

}


export default ChatBox;