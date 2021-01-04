import { authenticate } from 'passport';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {Redirect} from 'react-router'
import { login } from '../../util/session_api_util';

class SignupForm extends React.Component {
  constructor(props) {
     
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      password2: '',
      errors: {},
      is_authenticated: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearedErrors = false;
  }

  componentDidUpdate(prevProps){
    //  
    if(this.props.authenticated !== prevProps.authenticated){
      //  
      this.setState({is_authenticated: true})
    }

    if(this.props.errors !== prevProps.errors){
      this.setState({
        errors: this.props.errors,
      })
    }
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
     
    let user = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.signup(user, this.props.history)
      .then(user => {
        
        if (Object.keys(user.errors).length === 0){
          this.props.login({
            email: this.state.email,
            password: this.state.password
          });
        }
          
      })

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
    return (
      <div className="signup-form-container">
        <form onSubmit={this.handleSubmit}>
          <div className="signup-form">
            <br/>
              <input type="text"
                value={this.state.email}
                onChange={this.update('email')}
                placeholder="Email"
              />
            <br/>
              <input type="text"
                value={this.state.username}
                onChange={this.update('username')}
                placeholder="Username"
              />
            <br/>
              <input type="password"
                value={this.state.password}
                onChange={this.update('password')}
                placeholder="Password"
              />
            <br/>
              <input type="password"
                value={this.state.password2}
                onChange={this.update('password2')}
                placeholder="Confirm Password"
              />
            <br/>
            <input type="submit" value="Submit" />
            {this.renderErrors()}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(SignupForm);