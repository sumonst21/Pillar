import React from "react";  

class SplashPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImg: 0
    };
    this.loginModal = this.loginModal.bind(this);
  }

  loginModal(e) {
    e.preventDefault();
    this.props.clearErrors();
    this.props.openModal("login");
  }

  render() {

    return (
      <div className="splash-wrapper">
        <div className="splash-container-1">
            <div className="logo-button">
                <h1 onClick={this.loginModal}>PILLR</h1>
            </div>
        </div>
      </div>
    );
  }
}

export default SplashPage;