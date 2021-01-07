import React from 'react';
import {getRoomUsers} from '../../util/room_api_util'
import SearchBarDropdown from './search_dropdown'

class Sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show_rooms: false,
            searchInput: '',
            dropDown: false,
            errors: {}
        };
        this.logoutUser = this.logoutUser.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.displayRooms = this.displayRooms.bind(this);
        this.hideRooms = this.hideRooms.bind(this);
    }

    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
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
        //  
        return(
            <div className='sidebar-container'>
                <div className="sidebar-left">
                    <h1>Pillr</h1>
                    <div className='search-bar-container'>
                        <input 
                            className='search-bar' 
                            type='text'
                            onChange={this.handleSearchInput}
                            onKeyDown={this.handleDropDown}
                            value={this.state.searchInput}
                            placeholder='type here to search'
                        />
                        {this.state.dropDown && this.state.searchInput.length !== 0 ? 
                            <SearchBarDropdown className='search-bar-dropdown-container'
                                handleDropDown={this.handleDropDown}
                                searchInput={this.state.searchInput} 
                                allRooms={this.props.allRooms}
                                roomsAvailable={this.props.roomsAvailable}
                                />
                            : null
                        }
                    </div>
                </div>
                <div className="new-room-bar">
                    <form onSubmit={this.props.createNewRoom}>
                        <input type="text" value={this.props.newTitle} 
                        onChange={this.props.handleChange}
                        placeholder="Enter new room title"/>
                    </form>

                    <button onClick={this.props.createNewRoom}>Create a New Chat Room</button>
                    <h3>{this.props.errors}</h3>
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
                <div>
                    <button onClick={this.logoutUser}>Logout</button>
                </div>
            </div>
        )
    }
};

export default Sidebar;