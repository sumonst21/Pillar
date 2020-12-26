import React from 'react';
import {getRoomUsers} from '../../util/room_api_util'
import SearchBarDropdown from './search_dropdown'

class Sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show_rooms: false,
            searchInput: '',
            dropDown: false
        };
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.displayRooms = this.displayRooms.bind(this);
        this.hideRooms = this.hideRooms.bind(this);
    }

    handleSearchInput(e){
        this.setState({searchInput: e.currentTarget.value, dropDown: true});
    };

    handleDropDown(){
        this.setState({dropDown: false});
    };

    displayRooms(){
        this.state.show_rooms === true ? 
        this.setState({show_rooms: false}) : this.setState({show_rooms: true});
    };

    hideRooms(){
        this.setState({show_rooms:false});
    };




    render(){
        let roomsAvailable = this.props.roomsAvailable.data || [];
        // let filtered_messages = this.props.rooms.messages.map(message_obj => {
        //     message_obj.message
        // });
        return(
            <div className='sidebar-contaier'>
                <div className='search-bar-container'>
                    <input 
                        className='search-bar' 
                        type='text'
                        onChange={this.handleSearchInput}
                        onBlur={this.handleDropDown}
                        value={this.state.searchInput}
                        placeholder='type here to search'
                    />
                    {this.state.dropDown ? 
                        <SearchBarDropdown 
                        dropdown={this.state.dropdown} 
                        searchInput={this.state.searchInput} 
                        roomsJoined={this.props.rooms} 
                        messages={this.props.messages} //add logic here to make message and sorted array 
                        allRooms={this.props.allRooms}
                        roomsAvailable={this.props.roomsAvailable}/>
                        : null
                    }
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