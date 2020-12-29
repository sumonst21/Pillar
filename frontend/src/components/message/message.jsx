import React, { Component } from 'react';
import EditMessageForm from './edit_message_form_container.js';

export default class Message extends Component {

  constructor(props) {
    super(props);

    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.deleteGif = this.deleteGif.bind(this);
  }

  componentDidMount(){
    this.props.socket.on("Message Edited", this.editMessage);
    this.props.socket.on("Message Deleted", this.deleteMessage);
  }

  editMessage(msg){
    if (msg._id === this.props.msg.id){
      this.props.editMessage(msg);
    }
  }

  deleteMessage(msg){
    if (msg._id === this.props.msg.id) {
      this.props.deleteMessage(msg);
    }
  }

  deleteGif(){
    let response = window.confirm(`Are you sure you want to delete your Gif?`);
    if (response) {
      this.props.socket.emit("Delete Message", this.props.msg);
    }
  }

  render() {
    //show edit button only if current user was the author of this message
    //open edit message textfield form if button is clicked
    //use socket to edit database and all connected users' message
    //update redux state (room and messages)
    let msg = this.props.msg;
    let author = false;
  
    if (msg.sender === this.props.user.id){
       author = true;
     }
    
    let message;
    if (msg.message.includes('giphy')){
      message = <li key={msg.id}>{msg.username} says: <img className="chat-img" src={msg.message} alt="image" />
        {author && 
          <button onClick={this.deleteGif}>Delete Gif</button>
        }
      </li>
    } else {
      message = <li key={msg.id} id={this.props.id}>{msg.username} says: {msg.message}
        {author &&
          <EditMessageForm socket={this.props.socket} msg={msg}/>
        }
      </li>
    }


    return (
      message
    )
  }
}
