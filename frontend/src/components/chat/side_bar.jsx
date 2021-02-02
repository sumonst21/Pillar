import React from 'react';
import {getRoomUsers} from '../../util/room_api_util'
import SearchBarDropdown from './search_dropdown'
import { getAvailableRooms, getRooms } from '../../util/room_api_util';
import {getUser } from "../../util/session_api_util"
import { updateRoom } from '../../actions/room_actions';
import ClickOutHandler from 'react-onclickout';
import NewRoomForm from './new_room_form/new_room_form_container';

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
        this.logoutUser = this.logoutUser.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.displayRooms = this.displayRooms.bind(this);
        this.hideRooms = this.hideRooms.bind(this);
        this.toggleRooms = this.toggleRooms.bind(this);
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
            roomIds.push(rooms[key]._id)})
            
        let extras = {
            createNewRoom: this.props.createNewRoom,
            socket: this.props.socket,
        }
        
        return(
            <div className="sidebar-parent">
            <div className='sidebar-container'>
                <div className="sidebar-left">
                    <h1>PILLAR</h1>
                    <div className="welcome-div">Welcome, {this.props.user.username}</div>
                    
                </div>

                    
                <div className="sidebar-right">
                        <div className='search-bar-container'>
                            <input 
                                className='search-bar' 
                                type='text'
                                onChange={this.handleSearchInput}
                                onKeyDown={this.handleDropDown}
                                value={this.state.searchInput}
                                placeholder='Search'
                            />
                            {this.state.dropDown && this.state.searchInput.length !== 0 ? 
                            <ClickOutHandler onClickOut={this.handleDropDown}> 
                                <SearchBarDropdown className='search-bar-dropdown-container'
                                    handleDropDown={this.handleDropDown}
                                    searchInput={this.state.searchInput} 
                                    allRooms={this.props.allRooms}
                                    roomsAvailable={this.props.roomsAvailable}
                                    user={this.props.user}
                                    editClosedFor= {this.props.editClosedFor}
                                    />
                            </ClickOutHandler>
                                : null
                            }
                        </div>
                        <div className="logout-button create-room" 
                            onClick={() => this.props.openModal({
                                modal: 'create room',
                                extras: extras
                            })}>
                        <div>Create New Room</div>
                    </div>
                    <div className="allrooms">
                        <div className="logout-button available-chatrooms" onClick={()=>this.displayRooms()}>Available Rooms</div>
                    
                        <div className="allroomsul" onMouseLeave={this.hideRooms}>
                            {this.state && this.state.show_rooms === true ? 
                            roomsAvailable.map(room => {
                            return (
                                <li className="room-list" id={room._id} key={room._id}>
                                    <p>
                                        Room: {room.title}
                                    </p>
                                    <p>
                                        Members: {room.users.length}
                                    </p>
                                    <div className="join-room-button-div">
                                        <button className="join-room-button" id={room._id} onClick={this.props.joinRoom}>Join Room</button>
                                    </div>
                                </li>
                            )
                        }) : null}
                        </div>
                    </div>
                        <div className="logout-button create-room"
                            onClick={() => this.props.openModal({
                                modal: 'team',
                                extras: extras
                            })}>Our Team
                        </div>
                    
                        <div className="logout-button" onClick={this.logoutUser}>
                        <div >Logout</div>
                        
                    </div>
                    <br/>
                    
                </div>
            </div>
            <div className="myroomsdiv">
                    {/* <h2>My Rooms</h2> */}
                    <ul className="myrooms">
                        {Object.keys(this.props.rooms).length > 0 ?

                            roomIds.map(id => {
                                //   ;
                                if (id !== undefined) {
                                    return rooms[id].closedFor.includes(this.props.user.email)
                                        //   [this.props.user.username] 
                                        ?
                                        (<li id={rooms[id]._id} onClick={this.toggleRooms}>Show {rooms[id].title}</li>
                                            // ,<button onClick= { this.toggleRooms }> Open</button>]
                                        ) :
                                        (<li id={rooms[id]._id} onClick={this.toggleRooms}> Hide {rooms[id].title}</li>
                                            // <button onClick={this.toggleRooms}> Close</button>]
                                        )
                                }
                            })
                            : ""}
                    </ul>
                </div>
        </div >
        )
    }
};

export default Sidebar;