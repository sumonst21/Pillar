import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ChatBox from './chat/chat_box_container';
import DashBoard from './chat/dashboard';
const App = () => (
  <div>
    <NavBarContainer />
    <Switch>
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />
        <Route exact path="/chat" component={DashBoard} /> 
        <Route exact path="/" component={MainPage} />
    </Switch>
  </div>
);

export default App;