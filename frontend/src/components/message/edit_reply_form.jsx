import React, { Component } from 'react';
import * as cloneDeep from 'lodash/cloneDeep';


export default class EditReplyForm extends Component {
  constructor(props){
    super(props);
    //find the reply from the replies array
    let reply;
    props.msg.replies.forEach(rep => {
      if (rep._id === props.replyId){
        reply = rep;
      }
    });

    this.state = {
      reply: reply,
    }


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete  = this.handleDelete.bind(this);

  }


  handleChange(e){
    let rep = this.state.reply;
    rep.reply = e.currentTarget.value;

    this.setState({
      reply: rep,
    })
  }

  handleSubmit(e){
   
    let replies = cloneDeep(this.props.msg.replies);
    let reply = replies.find(reply => reply._id === this.state.reply._id);

    reply.reply = this.state.reply.reply;
    this.props.socket.emit("Edit Message Reply",{
      message: this.props.msg,
      replies: replies,
    })

    this.props.toggleEditForm();
  }

  handleDelete(e){
    let response = 
      window.confirm(`Are you sure you want to delete "${this.state.reply.reply}"?`);
     
    if (response) {
      let replies = cloneDeep(this.props.msg.replies);
      let replyIndex = replies.findIndex(reply => reply._id === this.state.reply._id);
      replies.splice(replyIndex,1);

      this.props.socket.emit("Edit Message Reply", {
        message: this.props.msg,
        replies: replies,
      });
    }
  }


  render() {
    return (
      <div> 
          <form onSubmit={this.handleSubmit}>
            <input class="edit-form-input-reply" type="text" value={this.state.reply.reply} onChange={this.handleChange}></input>
          <div className="edit-message-form-buttons">
            <input className="text-input-button2" type="submit" value="Save"></input>
            <button className="text-input-button2 delete" onClick={this.handleDelete}>Delete </button>
            <button className="text-input-button2" onClick={this.handleClick}>Cancel</button>
          </div>
          </form>

      </div>
    )
  }
}
