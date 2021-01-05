import { connect } from 'react-redux';
import Sidebar from './side_bar';
import { fetchRoom, fetchRooms, createRoom, removeRoom, editRoom, leaveRoom, updateUserList, editClosedFor} from '../../actions/room_actions';



const mapStateToProps = (state) => {
  // debugger
  return {
    user: state.session.user,
    rooms: state.rooms,
    messages: state.messages
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
    editClosedFor: (roomId, email, id) => dispatch(editClosedFor(roomId, email, id))
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);