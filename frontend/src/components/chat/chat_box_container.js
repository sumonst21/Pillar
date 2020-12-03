import { connect } from 'react-redux';
import { fetchMessages, afterMessageSent } from '../../actions/message_actions';
import ChatBox from './chat_box';



const mapStateToProps = (state) => {
   return {
      user: state.session.user,
      messages: state.messages,
      // errors: state.errors.session
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      getMessages: () => dispatch(fetchMessages()),
      afterMessageSent: (msg) => {
         dispatch(afterMessageSent(msg));
      }
   }
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(ChatBox);