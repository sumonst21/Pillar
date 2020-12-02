import { connect } from 'react-redux';
import { fetchMessages } from '../../actions/message_actions';
import ChatBox from './chat_box';



const mapStateToProps = (state) => {
   return {
      user: state.session.user,
      // errors: state.errors.session
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      getMessages: () => dispatch(fetchMessages()),
   }
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(ChatBox);