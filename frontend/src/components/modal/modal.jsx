import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import NewRoomForm from '../chat/new_room_form/new_room_form_container';

function Modal({ modal, closeModal }) {
  if (!modal) {
    return null;
  }
  let component;

  switch (modal.modal) {
    case 'login':
      component = <LoginFormContainer />;
      break;
    case 'signup':
      component = <SignupFormContainer />;
      break;
    case 'create room':
      

      component = <NewRoomForm extras={modal.extras}/>;
      return (
        <div className="modal-background create-room" onClick={closeModal}>
          <div className="modal-child-create-room" onClick={e => e.stopPropagation()}>
            {component}
          </div>
        </div>
      )
    default:
      return null;
  }



  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-child" onClick={e => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    modal: state.modal,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(closeModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
