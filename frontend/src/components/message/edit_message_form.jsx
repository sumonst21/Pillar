import React, { Component } from 'react'

export default class EditMessageForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      chatMessage: props.msg.message,
      displayForm: false,

    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete  = this.handleDelete.bind(this);

  }


  handleClick(){
     ;
    if (this.state.displayForm){
      this.setState({
        displayForm: false,
      })
    } else {
      this.setState({
        displayForm: true,
      })
    }
  }

  handleChange(e){
    this.setState({
      chatMessage: e.currentTarget.value,
    })
  }

  handleSubmit(e){
    debugger;
    this.props.socket.emit("Edit Message",{
      message: this.state.chatMessage,
      createdAt: this.props.message.createdAt,
      updatedAt: this.props.message.updatedAt,
      username: this.props.message.username,
      id: this.props.message.id,
      room: this.props.message.room,
      sender: this.props.message.sender,

    })
    this.handleClick(e);
  }

  handleDelete(e){
    window.confirm("Are you sure?");
  }


  render() {
    return (
      <div>
        {this.state.displayForm ? ( 
          <form onSubmit={this.handleSubmit}>
            <textarea value={this.state.chatMessage} onChange={this.handleChange}></textarea>
          <input type="submit" value="Save"></input>
          <button onClick={this.handleClick}>Cancel</button>
          </form>
         ) 
        :
        (<div>
          <button onClick={this.handleClick}>Edit Message</button>
          <button onClick={this.handleDelete}>Delete Message</button>
          </div>
        )}
      </div>
    )
  }
}
