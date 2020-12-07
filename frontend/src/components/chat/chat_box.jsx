import React from "react"
import io from "socket.io-client";
import moment from "moment";


class ChatBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }


  componentDidMount(){
    let roomId = this.props.room._id;
    debugger;
    //this.props.getMessages(roomId);
 
    this.socket = io();
    this.socket.on(`MTC_${roomId}`, theMessage =>{
       debugger;
      console.log(theMessage[0].message);
      this.props.afterMessageSent(theMessage[0]);
    });
  }
     

  handleChange(e){
    this.setState({
      chatMessage: e.currentTarget.value,
    })
  }

  submitMessage(e) {
    e.preventDefault();
    //add room id to props
    let username = this.props.user.username;
    let userId = this.props.user.id;
    let room = this.props.room;
     
    console.log(username);
    let timestamp = moment().format('LT');
    let message = this.state.chatMessage;
     
    this.socket.emit("Create Message", {
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



  render() {
    let messages = this.props.room.messages || [];
     
    return (
      <div className="chatbox-container">
        <h1>{this.props.room.title}</h1>
        <form onSubmit={this.submitMessage}>

          <input type="text" value={this.state.chatMessage} onChange={this.handleChange} />
        </form>
        <ul>
          {messages.map(msg => (
            <li key={msg._id}>{msg.sender.username} says: {msg.message}</li>
          ))}

        </ul>
      </div>
    )
  }

}


export default ChatBox;