import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  logoutUser(e) {
      e.preventDefault();
      this.props.logout();
  }

  // Selectively render links dependent on whether the user is logged in
  getLinks() {
      if (this.props.loggedIn) {
        return (
            <div>
                <button onClick={this.logoutUser}>Logout</button>
                {/* put sidebar component here */}
            </div>
        );
      } else {
        let current_path = this.props.location.pathname.split('/');
        if(current_path.includes('login') && current_path.length>1){
          return (
            <div>
                <Link to={'/signup'}>Signup</Link>
            </div>
          )
        } else if (current_path.includes('signup') && current_path.length>1){
          return (
              <div>
                <Link to={'/login'}>Login</Link>
              </div>
          );
        } else {
            return (
              <div>
                  <Link to={'/signup'}>Signup</Link>
                  <Link to={'/login'}>Login</Link>
              </div>
          );
        }
      }
  }

  render() {
      return (
        <div>
          <h1>Pillar</h1>
            { this.getLinks() }
        </div>
      );
  }
}

export default NavBar;