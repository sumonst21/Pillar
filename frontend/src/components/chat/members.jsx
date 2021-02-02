import React, { Component } from 'react'

export default class Members extends Component {
  render() {
    let users = this.props.extras.users;
    let room = this.props.extras.room;
    
    return (
      <div className="members-modal-container">
        <div className="members-modal-title">Members of {room.title}</div>     
        
        <div className="chatboxUsers" >
            <ul className="chatboxUl">
              {users.map(user => {
                return (
                  <li classsName="members-list-li" key={user.id}>
                    {user.username}
                  </li>
                )
              })}
            </ul>
        </div>
      </div>
    )
  }
}
