import { connect } from 'react-redux';
import Sidebar from './side_bar';
import { fetchRoom } from '../../actions/room_actions';
import { logout } from '../../actions/session_actions';

const mapStateToProps = (state) => {

  return {
    user: state.session.user,
    loggedIn: state.session.isAuthenticated
    // errors: state.errors.session
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
        getRoom: (roomId) => dispatch(fetchRoom(roomId)),
        logout: () => dispatch(logout())
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);