import React, { Component } from 'react'

export default class EditMessageForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      chatMessage: props.msg.message,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete  = this.handleDelete.bind(this);

  }


  handleChange(e){
    this.setState({
      chatMessage: e.currentTarget.value,
    })
  }

  handleSubmit(e){
    this.props.socket.emit("Edit Message",{
      message: this.state.chatMessage,
      createdAt: this.props.message.createdAt,
      updatedAt: this.props.message.updatedAt,
      username: this.props.message.username,
      id: this.props.message.id,
      room: this.props.message.room,
      sender: this.props.message.sender,

    })

    this.props.close();
  }

  handleDelete(e){
    let response = window.confirm(`Are you sure you want to delete "${this.props.msg.message}"?`);
    if (response) {
      this.props.socket.emit("Delete Message", this.props.msg);
    }
  };


  render() {
    return (
      <div className="edit-form-container">
          <form className="edit-message-form" onSubmit={this.handleSubmit}>
            <input className="edit-form-input" type="text" value={this.state.chatMessage} onChange={this.handleChange}></input>
            <div className="edit-message-form-buttons">
              <input className="text-input-button2" type="submit" value="Save"></input>
              <button className="text-input-button2 delete" onClick={this.handleDelete}>Delete</button>
              <button className="text-input-button2" onClick={this.props.close}>Cancel</button>
            </div>
          </form>
      </div>
    )
  }
}
