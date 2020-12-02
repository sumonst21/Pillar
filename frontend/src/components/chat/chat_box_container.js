import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';
import ChatBox from './chat_box';
import io from "socket.io-client";


const mapStateToProps = (state) => {
   return {
      user: state.session.user,
      // errors: state.errors.session
   };
};

// const mapDispatchToProps = (dispatch) => {
//    return {
//       login: user => dispatch(login(user))
//    }
// }

export default connect(
   mapStateToProps,
   null
)(ChatBox);