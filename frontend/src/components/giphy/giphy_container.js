import { connect } from 'react-redux';
import Giphy from './giphy';
import { fetchGiphy } from '../../actions/giphy_actions';



const mapStateToProps = (state) => {

  return {
    user: state.session.user,
    rooms: state.rooms,
    // errors: state.errors.session
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
        fetchGiphy: (keyword) => dispatch(fetchGiphy(keyword)),
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Giphy);