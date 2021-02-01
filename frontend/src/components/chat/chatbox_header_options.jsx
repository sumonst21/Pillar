import React, { Component } from 'react'
import ClickOutHandler from 'react-onclickout';

export default class ChatBoxHeaderOptions extends Component {
  constructor(props){
    super(props);
    this.state={
      menuOpen: false,
    }
    this.handleClick= this.handleClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  handleClick(e){
    e.stopPropagation();
    this.state.menuOpen === true ? this.setState({menuOpen: false}) :
      this.setState({menuOpen: true});
  }

  closeMenu(){
    this.setState({
      menuOpen: false,
    })
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
            <ClickOutHandler onClickOut={this.closeMenu}>
              <div className="chatbox-header-menu">
                {deleteRoom}
                <div className="leave-room-icon" >
                  <button className="delete-input-button" 
                          onClick={this.props.leaveRoom} 
                          id={this.props.roomId}>Leave Room
                  </button>
                </div>
              </div>
            </ClickOutHandler>
          ) : (null)
        }

      </div>
    )
  }
}
