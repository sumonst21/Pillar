import { connect } from 'react-redux';
import { signup, receiveErrors } from '../../actions/session_actions';
import SessionForm from './session_form';
import { openModal, closeModal } from '../../actions/modal_actions';

const mapStateToProps = (state) => {
  return {
    errors: state.errors.session,
    signedIn: state.session.isSignedIn,
    formType: 'Sign up'
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processForm: user => dispatch(signup(user)),
    switchForm: () => {
      dispatch(openModal({modal:'login'}));
      dispatch(receiveErrors({}));
    },
    closeModal: () => dispatch(closeModal()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionForm);