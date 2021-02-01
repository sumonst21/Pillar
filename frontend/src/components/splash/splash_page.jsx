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
    document.getElementsByClassName("main-title")[0].classList.add('animated');
    this.props.openModal({modal: "login"});
  }

  render() {

    let demoUser = { email: "demo_user@gmail.com", password: "password" };

    return (
      <div>
        <div className="splash-wrapper">
          <div className="splash-container-1">
              <div className="logo-button">
                  <h1 onClick={this.loginModal} className="main-title">PILLAR</h1>
              </div>
          </div>
        </div>
          <div className='demo-user-container'>
            <div className="switch-form-link" onClick={()=> this.props.login(demoUser)}>Demo User</div>
          </div>
      </div>
    );
  }
}

export default SplashPage;