import { connect } from 'react-redux';
import { fetchMessages, afterMessageSent } from '../../actions/message_actions';
import ChatBox from './chat_box';
import { closeModal, openModal } from '../../actions/modal_actions';
import { editClosedFor} from '../../actions/room_actions';


const mapStateToProps = (state, ownProps) => {
   
   return {
      user: state.session.user,
      room: state.rooms[ownProps.roomId],
      socket: ownProps.socket,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      getMessages: (roomId) => dispatch(fetchMessages(roomId)),
      closeModal: () => dispatch(closeModal()),
      openModal: (modal) => dispatch(openModal(modal)),
      afterMessageSent: (msg) => {
         dispatch(afterMessageSent(msg));
      },
      editClosedFor: (roomId, email, id) => dispatch(editClosedFor(roomId, email, id))
   }
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(ChatBox);