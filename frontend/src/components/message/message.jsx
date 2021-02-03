import React, { Component } from 'react';
import EditMessageForm from './edit_message_form_container.js';
import RepliesForm from './replies_container.js'
export default class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repliesOpen: false,
      showOptions: false,
      showEditForm: false,
    }
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.deleteGif = this.deleteGif.bind(this);
    this.toggleReplies = this.toggleReplies.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
    this.editMessageToggle = this.editMessageToggle.bind(this);
  };

  componentDidMount(){
    this.props.socket.on("Message Edited", this.editMessage);
    this.props.socket.on("Message Deleted", this.deleteMessage);
  };

  showOptions(){
      this.setState({
        showOptions: true,
      })
  }

  hideOptions(){
      this.setState({
        showOptions: false,
      })
  }

  editMessageToggle(){
    
    if (this.state.showEditForm) {
      this.setState({
        showEditForm: false,
      })
    } else {
      this.setState({
        showEditForm: true,
      })
    }
  };
 

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
    let replies;
    
    if (this.state.repliesOpen){
      replies = <RepliesForm socket={this.props.socket} msg={msg} message={msg.message} />
    } else {
      replies = null;
    }
    
    
    //set the correct reply button
    let replyButton = <button className="replies-div text-input-button2" 
    onClick={this.toggleReplies}>Reply</button>
    
    if (msg.replies.length > 1){
      replyButton = <button className="replies-div text-input-button2" 
      onClick={this.toggleReplies}>{msg.replies.length} replies
                    </button>
    } else if (msg.replies.length === 1){
      replyButton = <button className="replies-div text-input-button2" 
      onClick={this.toggleReplies}> {msg.replies.length} reply
                    </button>
    }
    
    //overide the above reply button styling if the replies thread is open
    if (this.state.repliesOpen){
      replyButton = <button className="replies-div text-input-button2"
      onClick={this.toggleReplies}>Close Thread</button>
    }
  
    if (msg.sender === this.props.user.id){
       author = true;
     }

    let editMessageForm = null;
    if (this.state.showEditForm){
      editMessageForm = <EditMessageForm close={this.editMessageToggle} socket={this.props.socket} msg={msg} />
    }
    
    let message;
    if (msg.message.includes('giphy')){
      message = <li className="message-li" key={msg.id} id={`msg_${msg.id}`}
                    onMouseEnter={this.showOptions} onMouseLeave={this.hideOptions}>
                  <div className="message-li-text">
                    <div className="message-header-row">
                      <h6>{msg.username}: </h6>
                      {this.state.showOptions ? (
                        <div className="message-li-buttons">
                          {author && 
                            <button className="text-input-button2" onClick={this.deleteGif}>Delete Gif</button>
                          }
        
                          {replyButton}
                        </div>
                      ) : (null)}
                    </div>
                    <img className="chat-img" src={msg.message} alt="image" />
                  </div>
                  <div className="show-replies">
                      {replies}
                  </div>
                </li>         
    } else {
      message = 
        <li className="message-li" key={msg.id} id={`msg_${msg.id}`} 
            onMouseEnter={this.showOptions} onMouseLeave={this.hideOptions}>
        <div className="message-li-text">
          <div className="message-header-row">
            <h6>{msg.username}:</h6>
            {this.state.showOptions ? (
              <div className="message-li-buttons">
                {
                  author && <button className="text-input-button2" onClick={this.editMessageToggle}>Edit</button>
                }
                {replyButton}
              </div>
            ):(null)}
          </div>
          <p>{msg.message}</p>
          {editMessageForm}
        </div>
        <div className="show-replies">
          {replies}
        </div>
      </li>
    }

   
    return (
      <div className="message-container">
        {message}
      </div>
   
    )
  }
}
