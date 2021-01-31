import React from 'react';
import Modal from '../../modal/modal';

class NewRoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTitle: '',
      errors: [],
    }
    this.socket = props.extras.socket;
    this.handleChange = this.handleChange.bind(this);
    this.addRoomCreationError = this.addRoomCreationError.bind(this);
  }

  componentDidMount(){
    this.socket.on("room creation error", this.addRoomCreationError);
  }

  handleChange(e) {
    this.setState({
      newTitle: e.currentTarget.value,
    })
  };

  addRoomCreationError({ errors, room }) {

    if (room.admin === this.props.user.id) {
      this.setState({
        errors: [errors.text],
      })
    }
  }
 
  render(){
    let {createNewRoom} = this.props.extras;
    let room = {
      title: this.state.newTitle,
      admin: this.props.user.id,
      users: this.props.user.id,
    }
    
    return (
      <div className="new-room-bar">
        <form className="new-room-form" onSubmit={() => createNewRoom(room)}>
          <label className="new-room-label" >Create A New Room</label>
          <input className="new-room-input" type="text" value={this.state.newTitle}
            onChange={this.handleChange}
            placeholder="Enter new room title" />
          <div className="create-room-button" onClick={() => createNewRoom(room)}>Create New Room</div>
        </form>


        <div className="room-create-errors">{this.state.errors}</div>
      </div>
    )


  }

}

export default (NewRoomForm);