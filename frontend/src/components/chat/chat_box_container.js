import { connect } from 'react-redux';
import { fetchMessages, afterMessageSent } from '../../actions/message_actions';
import ChatBox from './chat_box';
import {getRoomUsers} from '../../util/room_api_util'



const mapStateToProps = (state, ownProps) => {
   return {
      user: state.session.user,
      room: state.rooms[ownProps.roomId],
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