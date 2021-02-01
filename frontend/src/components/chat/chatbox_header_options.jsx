import React, { Component } from 'react'

export default class ChatBoxHeaderOptions extends Component {
  constructor(props){
    super(props);
    this.state={
      menuOpen: false,
    }
    this.handleClick= this.handleClick.bind(this);
  }

  handleClick(e){
    e.stopPropagation();
    this.state.menuOpen === true ? this.setState({menuOpen: false}) :
      this.setState({menuOpen: true});
  }


  render() {
    let deleteRoom = null;
    if(this.props.user.id === this.props.room.admin){
      deleteRoom = <button className="delete-input-button"
        onClick={this.props.deleteRoom}>Delete Room</button>
    } 

    return (
      <div className="chatbox-header-icons">
        <span className="chatbox-ellipsis" onClick={this.handleClick}>
          <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        </span>
        {
          this.state.menuOpen ? (
            <div className="chatbox-header-menu">
              {deleteRoom}
              <div className="leave-room-icon" >
                <button className="delete-input-button" 
                        onClick={this.props.leaveRoom} 
                        id={this.props.roomId}>Leave Room
                </button>
              </div>
            </div>
          ) : (null)
        }

      </div>
    )
  }
}
