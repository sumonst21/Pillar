import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ChatBox from './chat/chat_box_container';

const App = () => (
  <div>
    <NavBarContainer />
    <Switch>
        <Route exact path="/login" component={LoginFormContainer} />
        <Route exact path="/signup" component={SignupFormContainer} />
        <Route exact path="/chat" component={ChatBox} /> 
        <Route exact path="/" component={MainPage} />
    </Switch>
  </div>
);

export default App;