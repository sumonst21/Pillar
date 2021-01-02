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
      displayForm: false,

    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete  = this.handleDelete.bind(this);

  }


  handleClick(){
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

    this.handleClick(e);
  }

  handleDelete(e){
    let response = 
      window.confirm(`Are you sure you want to delete "${this.state.reply.reply}"?`);
    debugger;
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
        {this.state.displayForm ? ( 
          <form onSubmit={this.handleSubmit}>
            <textarea value={this.state.reply.reply} onChange={this.handleChange}></textarea>
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
