import React from 'react';
import {getRoomUsers} from '../../util/room_api_util'

class Sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show_rooms: false
        };

        this.displayRooms = this.displayRooms.bind(this);
        this.hideRooms = this.hideRooms.bind(this);
    }

    displayRooms(){
        this.state.show_rooms === true ? 
        this.setState({show_rooms: false}) : this.setState({show_rooms: true});
    };

    hideRooms(){
        this.setState({show_rooms:false});
    }


    render(){
        let roomsAvailable = this.props.roomsAvailable.data || [];

        return(
            <div className='sidebar-contaier'>
                <div>
                    <input 
                    className='search-bar' 
                    type='text'
                    value=''
                    placeholder='type here to search for messages and chatrooms'
                    />
                </div>
                <div>
                    <form onSubmit={this.props.createNewRoom}>
                        <input type="text" value={this.props.newTitle} 
                        onChange={this.props.handleChange}
                        placeholder="Enter new room title"/>
                    </form>
                    <button onClick={this.props.createNewRoom}>Create a New Chat Room</button>
                </div>
                <div>
                    <button onClick={()=>this.displayRooms()}>Display All Joinable Chatrooms</button>
                </div>
                <div onMouseLeave={this.hideRooms}>
                    {this.state && this.state.show_rooms === true ? 
                    roomsAvailable.map(room => {
                     return (
                        <li id={room._id} key={room._id}>
                        <p>
                            Title: {room.title}
                        </p>
                        <p>
                            Number of current users: {room.users.length}
                        </p>
                        <button id={room._id} onClick={this.props.joinRoom}>Join Room</button>
                        </li>
                     )
                  }) : null}
                </div>
            </div>
        )
    }
};

export default Sidebar;