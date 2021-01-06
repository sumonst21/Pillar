import { connect } from 'react-redux';
import Message from './message';
import { afterMessageSent, editMessage, deleteMessage } from '../../actions/message_actions';

const mapStateToProps = (state, ownProps) => {

  return {
    user: state.session.user,
    room: state.rooms[ownProps.msg.room],
    message: state.messages[ownProps.msg.id],

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editMessage: msg => dispatch(editMessage(msg)),
    deleteMessage: msg => dispatch(deleteMessage(msg)),
    afterMessageSent: (msg) => {
      dispatch(afterMessageSent(msg));
    },

  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);