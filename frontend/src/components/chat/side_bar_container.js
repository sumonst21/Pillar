import { connect } from 'react-redux';
import Sidebar from './side_bar';
import { fetchRoom } from '../../actions/room_actions';



const mapStateToProps = (state) => {

  return {
    user: state.session.user,
    rooms: state.rooms
    // errors: state.errors.session
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
        getRoom: (roomId) => dispatch(fetchRoom(roomId)),
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);