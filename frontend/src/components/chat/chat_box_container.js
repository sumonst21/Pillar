import { connect } from 'react-redux';
import { fetchMessages, afterMessageSent } from '../../actions/message_actions';
import ChatBox from './chat_box';



const mapStateToProps = (state, ownProps) => {
   let roomId = ownProps.socketId.substring(1); 
   debugger;

   return {
      user: state.session.user,
      messages: state.messages,
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