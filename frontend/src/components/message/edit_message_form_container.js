import { connect } from 'react-redux';
import EditMessageForm from './edit_message_form';
import { afterMessageSent } from '../../actions/message_actions';

const mapStateToProps = (state, ownProps) => {

   ;
  return {
    user: state.session.user,
    room: state.rooms[ownProps.msg.room],
    message: state.messages[ownProps.msg.id],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    
    afterMessageSent: (msg) => {
      dispatch(afterMessageSent(msg));
    },

  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMessageForm);