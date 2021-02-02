import React, { Component } from 'react';
import { debug } from 'request';
import EditMessageForm from './edit_message_form_container.js';
import Replies from './replies.jsx';
import RepliesForm from './replies_container.js'
export default class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repliesOpen: false,
      showOptions: false,
    }
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.deleteGif = this.deleteGif.bind(this);
    this.toggleReplies = this.toggleReplies.bind(this);
    this.showOptions = this.showOptions.bind(this);
  };

  componentDidMount(){
    this.props.socket.on("Message Edited", this.editMessage);
    this.props.socket.on("Message Deleted", this.deleteMessage);
  };

  showOptions(e){
    e.stopPropagation();
    if (this.state.showOptions){
      this.setState({
        showOptions: false,
      })
    } else {
      this.setState({
        showOptions: true,
      })
    }
  }
 

  editMessage(msg){
     
    if (msg._id === this.props.msg.id){
      this.props.editMessage(msg);
    }
  };

  deleteMessage(msg){
    if (msg._id === this.props.msg.id) {
      this.props.deleteMessage(msg);
    }
  };

  deleteGif(){
    let response = window.confirm(`Are you sure you want to delete your Gif?`);
    if (response) {
      this.props.socket.emit("Delete Message", this.props.msg);
    }
  };

  toggleReplies(){
    this.state.repliesOpen === true ? 
    this.setState({repliesOpen: false}) : this.setState({repliesOpen: true})
  };
  
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
      message = <li className="message-li" key={msg.id} id={`msg_${msg.id}`}
                    onMouseEnter={this.showOptions} onMouseLeave={this.showOptions}>
                  <div className="message-li-text">
                    <h6>{msg.username}: </h6>
                    <img className="chat-img" src={msg.message} alt="image" />
                  </div>
                  {this.state.showOptions ? (
                    <div className="message-li-buttons">
                      {author && 
                        <button className="text-input-button2" onClick={this.deleteGif}>Delete Gif</button>
                      }
                      <RepliesForm socket={this.props.socket} msg={msg} message={msg.message} />
                    </div>
                  ) : (null)}
                </li>         
    } else {
      message = 
        <li className="message-li" key={msg.id} id={`msg_${msg.id}`} 
            onMouseEnter={this.showOptions} onMouseLeave={this.showOptions}>
        <div className="message-li-text">
          <h6>{msg.username}:</h6>
          <p>{msg.message}</p>
        </div>
        {this.state.showOptions ? (
          <div className="message-li-buttons">
            {
              author && <EditMessageForm socket={this.props.socket} msg={msg}/> 
            }       
            <RepliesForm socket={this.props.socket} msg={msg} message={msg.message}/>
          </div>
        ):(null)}
      </li>
    }

   
    return (
      <div className="message-container">
        {message}
      </div>
   
    )
  }
}
