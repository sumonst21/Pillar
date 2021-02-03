import React, { Component } from 'react';
import EditReplyForm from './edit_reply_form';


export default class Reply extends Component {
  constructor(props){
    super(props);
    this.state = {
      showOptions: false,
      showEditForm: false,

    }
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
    this.toggleEditForm = this.toggleEditForm.bind(this);

  }


  showOptions() {
    this.setState({
      showOptions: true,
    })
  }

  hideOptions(){
    // this.setState({
    //   showOptions: false,
    // })
  }

  toggleEditForm(){
    if(this.state.showEditForm){
      this.setState({
        showEditForm: false,
      })
    } else {
      this.setState({
        showEditForm: true,
      }
      )
    }
  }




  render() {
    let reply = this.props.reply;

    let replyOptionButtons = null;
    if (this.state.showOptions) {
      replyOptionButtons = (
        <div className="reply-options-buttons">
          <button className="text-input-button-reply" onClick={this.toggleEditForm}>Edit</button>
        </div>
      )
    }
    //if edit form is open, change to "Close"
    if (this.state.showEditForm) {
      replyOptionButtons = (
        <div className="reply-options-buttons">
          <button className="text-input-button-reply" onClick={this.toggleEditForm}>Close</button>
        </div>
      )
    }

    let editForm = <EditReplyForm toggleEditForm={this.toggleEditForm} 
                    socket={this.props.socket} msg={this.props.msg} 
                    replyId={reply._id} 
                  />

    return (
      <li key={reply._id} className="reply" id={`msg-reply-${reply.reply}`}
          onMouseEnter={this.showOptions} onMouseLeave={this.hideOptions}>

        <div className="reply-options-header">
          <h6>{reply.username}:</h6>
          {reply.userId === this.props.user.id && replyOptionButtons}
        </div>

        <p>{reply.reply}</p>
        {this.state.showEditForm && editForm}
      </li>
    )
  }
}
