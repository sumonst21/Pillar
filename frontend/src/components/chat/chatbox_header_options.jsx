import React, { Component } from 'react'
import ClickOutHandler from 'react-onclickout';
import { openModal, closeModal } from '../../actions/modal_actions';

export default class ChatBoxHeaderOptions extends Component {
  constructor(props){
    super(props);
    this.state={
      menuOpen: false,
    }
    this.handleClick= this.handleClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.showMembers = this.showMembers.bind(this);
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

  showMembers(){
    this.props.openModal({modal: "members", 
                          extras: {users: this.props.users,
                                  room: this.props.room}
                          });
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
          <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
                  <button onClick={this.showMembers} className="delete-input-button show-members">Members</button>

                </div>
              </div>
            </ClickOutHandler>
          ) : (null)
        }

      </div>
    )
  }
}


