import { connect } from 'react-redux';
import Sidebar from './side_bar';
import { fetchRoom } from '../../actions/room_actions';
import { logout } from '../../actions/session_actions';

const mapStateToProps = (state) => {
  //  
  return {
    user: state.session.user,
    loggedIn: state.session.isAuthenticated
    // errors: state.errors.session
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRooms: (userId) => dispatch(fetchRooms(userId)),
    getRoom: (roomId) => dispatch(fetchRoom(roomId)),
    createRoom: (room) => dispatch(createRoom(room)),
    deleteRoom: (roomId) => dispatch(removeRoom(roomId)),
    editRoom: (room) => dispatch(editRoom(room)),
    leaveRoom: (room) => dispatch(leaveRoom(room)),
    updateUserList: (room) => dispatch(updateUserList(room)),
    editClosedFor: (roomId, email, id) => dispatch(editClosedFor(roomId, email, id)),
    logout: () => dispatch(logout())
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);