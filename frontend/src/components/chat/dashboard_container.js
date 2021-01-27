import { connect } from 'react-redux';
import { fetchRoom, fetchRooms, createRoom, removeRoom, editRoom, leaveRoom, updateUserList } from '../../actions/room_actions';
import { closeModal } from '../../actions/modal_actions';
import DashBoard from './dashboard';



const mapStateToProps = (state) => {
  // ;
  return {
    user: state.session.user,
    rooms: state.rooms,
    messages: state.messages,

    // errors: state.errors.session
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: ()=> dispatch(closeModal()),
    getRooms: (userId) => dispatch(fetchRooms(userId)),
    getRoom: (roomId) => dispatch(fetchRoom(roomId)),
    createRoom: (room) => dispatch(createRoom(room)),
    deleteRoom: (roomId) => dispatch(removeRoom(roomId)),
    editRoom: (room) => dispatch(editRoom(room)),
    leaveRoom: (room) => dispatch(leaveRoom(room)),
    updateUserList: (room) => dispatch(updateUserList(room)),
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);