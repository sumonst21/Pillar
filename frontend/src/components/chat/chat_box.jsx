import React from "react"
import io from "socket.io-client";
import moment from "moment";
import './chatbox.css'



class ChatBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      open: true,
      openOrClose: 'close'
    }
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }


  componentDidMount(){
    let roomId = this.props.room._id;
    //this.props.getMessages(roomId);
 
    this.socket = io();
    this.socket.on(`MTC_${roomId}`, theMessage =>{
       
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

  toggle(){
    this.state.open ? 
    this.setState({open: false, openOrClose: 'open'}) : 
    this.setState({open: true, openOrClose: 'close'});
  }

  render() {
    let messages = this.props.room.messages || [];
    return (
      <div className={this.state.open ? 'open' : 'close'}> <button onClick={this.toggle}>{this.state.openOrClose}</button>
        {this.state.open ? (
          <div className="chatbox-container">

            <h1>{this.props.room.title}</h1>
            <form onSubmit={this.submitMessage}>

              <input type="text" value={this.state.chatMessage} onChange={this.handleChange} />
            </form>
            <ul>
              {messages.map(msg => (
                <li key={msg._id}>{(msg.sender) === null? null:msg.sender.username} says: {msg.message}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }

}


export default ChatBox;