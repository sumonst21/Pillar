import { connect } from 'react-redux';
import NewRoomForm from '../new_room_form/new_room_form';
import { openModal, closeModal } from '../../../actions/modal_actions';

const mapStateToProps = (state) => {

  return {
    user: state.session.user,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: () => dispatch(openModal({modal: 'create room'})),
    closeModal: () => dispatch(closeModal()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewRoomForm);