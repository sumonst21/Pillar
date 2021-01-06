import React from 'react';
import {getRoomUsers} from '../../util/room_api_util'
import SearchBarDropdown from './search_dropdown'
import { getAvailableRooms, getRooms } from '../../util/room_api_util';
import {getUser } from "../../util/session_api_util"
import { updateRoom } from '../../actions/room_actions';
class Sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show_rooms: false,
            searchInput: '',
            dropDown: false,
            roomsAvailable: [],
            roomsJoined: [],
            all: [],
            rooms: this.props.rooms,
            errors: {}
        };
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.displayRooms = this.displayRooms.bind(this);
        this.hideRooms = this.hideRooms.bind(this);
        this.toggleRooms = this.toggleRooms.bind(this);
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


    toggleRooms(e){
        //   
        // let title = e.target.innerText;
        let user = this.props.user.username;
        let email = this.props.user.email;
        let id = this.props.user.id;
        // e.target.id 
        this.props.editClosedFor(e.target.id, email,  id)
        .then(rooms => {
              ;
            this.setState({rooms: this.props.rooms},this.render)
        })
       
    }

    componentDidMount(props){
        //   ;
        this.setState({ rooms: this.props.rooms })
    }
    componentDidUpdate(prevprops, prevState){
        //   ;
        if( this.props.rooms != prevprops.rooms){
            this.setState({rooms: this.props.rooms}, this.render)
            //   ;
            // this.render()
        }
    //    this.setState({ rooms: this.props.rooms })
        
        // Object.keys(this.props.rooms).forEach(roomId => {
        //       ;
        //      console.log(prevprops.rooms[roomId]) 

        //     })
    }

    render(){
        let roomsAvailable = this.props.roomsAvailable.data || [];
        //  
        let rooms = this.state.rooms || this.props.rooms
        //   ;
        let roomIds = [];
        //   myRooms = this.state.myRooms;
        console.log("Dashboard rendered");
        Object.keys(rooms).forEach(key => {
            // ;
            //   
            roomIds.push(rooms[key]._id)}) 
        
        return(
            <div className='sidebar-contaier'>
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
                            user={this.props.user}
                            editClosedFor= {this.props.editClosedFor}
                            />
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

                <div><h2>My Rooms</h2>
                    {Object.keys(this.props.rooms).length > 0 ? 
                  roomIds.map(id =>{
                    //     ;
                      if (id !== undefined) {
                        return rooms[id].closedFor.includes(this.props.user.email)
                        //   [this.props.user.username] 
                        ? 
                        (<li id={rooms[id]._id} onClick={this.toggleRooms}>Open {rooms[id].title}</li>
                            // ,<button onClick= { this.toggleRooms }> Open</button>]
                            ) :
                            (<li id={rooms[id]._id} onClick={this.toggleRooms}> Close {rooms[id].title}</li>
                            // <button onClick={this.toggleRooms}> Close</button>]
                            ) 
                          }
                  }) 
                  : ""}
                </div>
            </div>
        )
    }
};

export default Sidebar;