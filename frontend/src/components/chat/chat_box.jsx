import React from "react"
import io from "socket.io-client";
import moment from "moment";
import UserList  from './user_list.js';
import './chatbox.css'
import Picker from 'emoji-picker-react';
import Giphy from "../giphy/giphy_container"

class ChatBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      open: true,
      openOrClose: 'close',
      emojiPicker: false,
      giphyMessage: ""
    }
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.openEmoji = this.openEmoji.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
    this.useGiphy = this.useGiphy.bind(this);
    this.submitGiphy = this.submitGiphy.bind(this);
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
      }
      this.props.afterMessageSent(newMessage);      
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    ;
    // prevProps.room.messages.length
    // this.props.room.messages.length

  }    

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
    //add room id to props
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

  }

  toggle(){
    this.state.open ? 
    this.setState({open: false, openOrClose: 'open'}) : 
    this.setState({open: true, openOrClose: 'close'});
  }

  submitGiphy(){

    let username = this.props.user.username;
    let userId = this.props.user.id;
    let room = this.props.room;

    let timestamp = moment().format('LT');
    let message = this.state.giphyMessage;
     
    this.props.socket.emit("Create Message", {
      message,timestamp, username, userId, room
    })
  
    this.setState({
      giphyMessage: ""
    })
  }

  useGiphy(e){

    let newMessage = `${e.target.src}`;
    this.setState({
      giphyMessage: newMessage
    }, this.submitGiphy)

  }
  render() {
    let messages = this.props.room.messages || [];
    let users = this.props.room.users || [];

     
    return (
      <div className={this.state.open ? 'open' : 'close'}> <button onClick={this.toggle}>{this.state.openOrClose}</button>
        {this.state.open ? (
          <div className="chatbox-container">

            <h1>{this.props.room.title}</h1>
            <button onClick={this.props.leaveRoom} id={this.props.roomId}>Leave Room</button>
            <form onSubmit={this.submitMessage}>

              <input type="text" value={this.state.chatMessage} onChange={this.handleChange} />
            </form>
              {this.state.emojiPicker === false ? 
              <button onClick={this.openEmoji} > ☺ </button> : 
             <div onMouseLeave= {this.openEmoji}> <Picker className="emoji-picker" onEmojiClick={this.selectEmoji} /> </div>}

            <Giphy useGiphy={this.useGiphy}/>
            <ul>
              {messages.map(msg => {
                if(msg.message.includes("giphy")){
                  return <li key={msg.id}>{(msg.sender) === null? null:msg.username} says: <img className="chat-img" src={msg.message} alt="image"/></li>
                }else{
                  return <li key={msg.id}>{(msg.sender) === null? null:msg.username} says: {msg.message}</li>
                }
              })}
            </ul>
            <UserList users={users}/>
          </div>
        ) : null}
      </div>
    )
  }

}


export default ChatBox;