import React, { Component } from 'react'

export default class Message extends Component {

  constructor(props) {
    super(props);
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
          <button>Edit Message</button>
        }
      </li>
    } else {
      message = <li key={msg.id}>{msg.username} says: {msg.message}
        {author &&
          <button>Edit Message</button>
        }
      </li>
    }


    return (
      message
    )
  }
}
