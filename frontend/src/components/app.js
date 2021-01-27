import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Route } from 'react-router-dom';
import Modal from "./modal/modal";
import MainPage from './main/main_page';
import ChatBox from './chat/chat_box_container';
import DashBoard from './chat/dashboard_container';
import SplashPageContainer from './splash/splash_page_container';
import "../stylesheets/index.scss";

const App = () => (
  <div>
    <Modal />
    {/* <Route path="/" component={SideBar} /> */}
    {/* <NavBar /> */}
    <Switch>
      <ProtectedRoute exact path="/chat" component={DashBoard} />
      <AuthRoute exact path="/" component={SplashPageContainer} />
    </Switch>
  </div>
)

export default App;