import { connect } from 'react-redux';
import { fetchMessages, afterMessageSent } from '../../actions/message_actions';
import ChatBox from './chat_box';



const mapStateToProps = (state, ownProps) => {
   debugger;
   return {
      user: state.session.user,
      room: state.rooms[ownProps.roomId],
       
      // errors: state.errors.session
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      getMessages: (roomId) => dispatch(fetchMessages(roomId)),
      afterMessageSent: (msg) => {
         dispatch(afterMessageSent(msg));
      }
   }
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(ChatBox);