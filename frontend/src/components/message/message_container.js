import { connect } from 'react-redux';
import Message from './message';
import { afterMessageSent } from '../../actions/message_actions';

const mapStateToProps = (state, ownProps) => {

  debugger;
  return {
    user: state.session.user,
    room: state.rooms[ownProps.roomId],
    socket: ownProps.socket,
    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    afterMessageSent: (msg) => {
      dispatch(afterMessageSent(msg));
    },

  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);