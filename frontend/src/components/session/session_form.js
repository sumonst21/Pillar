import React from 'react';
import { withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password2: '',
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let newUser = Object.assign({}, this.state);
    delete newUser['errors'];

    let existingUser = {
      email: this.state.email,
      password: this.state.password
    };
    
    let user = (this.props.formType === 'Sign up') ? newUser : existingUser;
    
    this.props.processForm(user)
      .then(this.props.closeModal)
  }
    
  renderErrors() {
    return(
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li key={`error-${i}`}>
            {this.state.errors[error]}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { formType, switchForm, closeModal } = this.props;
    const sessionFormInputs = (
      <div className='session-form-text-inputs'>
          <input type='text'
            className='session-form-input'
            id='email'
            value={this.state.email}
            placeholder="Email"
            onChange={this.update('email')}
          />
        {formType === 'Sign up' ? (
            <input type='text'
              className="session-form-input"
              value={this.state.username}
              placeholder="Username"
              onChange={this.update('username')}
            />
        ) : null}
          <input type='password'
            className="session-form-input"
            id='password'
            value={this.state.password}
            placeholder="Password"
            onChange={this.update('password')}
          />
        {formType === 'Sign up' ? (
            <input type='password'
              className="session-form-input"
              value={this.state.password2}
              placeholder="Confirm password"
              onChange={this.update('password2')}
            />
        ) : null}
      </div>
    );

    const switchFormLink = (    
      <div className="switch-form-link" onClick={switchForm}>
        {formType === "Sign up" ?
        "Log in" :
        "Sign up"}
      </div>
    );

    return (
      <div className="session-form-container">
        <div className="session-form-subcontainer" >
          <div className="close-session-form-icon-container" onClick={closeModal}>
            <i className="fas fa-times" id="close-session-form-icon" ></i>
          </div>
          <form className="session-form" onSubmit={this.handleSubmit}>
              <div className="session-form-inputs">
                {sessionFormInputs}
                {this.renderErrors()}
              </div>
            <div className="session-form-button-container">
              
                <input type="submit"
                  className="session-form-button-input"
                  id="form-action"
                  value={formType}
                />
                <span className="session-form-spacer">{switchFormLink}</span>
                
            </div>
            
          </form>
          <h1 className="typing-h1">Communication Made Better by PILLR</h1>

        </div>
      </div>
    );
  }
}



export default withRouter(SessionForm);