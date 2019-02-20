import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import myHead from "./container/header";
import Login from "./container/login";
import MainMenu from "./container/mainmenu";
import Home from "./component/home";
import Changepassword from "./component/changepassword.jsx";
import IpEarlyWarning from "./component/ipearlywarning.jsx";
import RiskWarning from "./component/riskwarning";
import PortLog from "./component/portlog.jsx";
import Systemsetup from "./component/systemsetup.jsx";
import Systemupgrade from "./component/systemupgrade.jsx";
import Networksetup from "./component/networksetup.jsx";
import './index.css';
import './assets/sass/style.css';
ReactDOM.render( <BrowserRouter basename='/'>
  <Switch>
    <Route exact path="/login" component={Login} ></Route>
    <Route path="/admin" component={({match}) => (<div className='layout'>
      <Route component={MainMenu}></Route>
      <div className="container">
        <Route component={myHead}></Route>
        <Switch>
          <Route exact path={`${match.url}/`} component={Home}></Route>
          <Route path={`${match.url}/riskWarning`} component={RiskWarning}></Route>
          <Route path={`${match.url}/ipRisk`} component={IpEarlyWarning}></Route>
          <Route path={`${match.url}/portLog`} component={PortLog}></Route>
          <Route path={`${match.url}/password`} component={Changepassword}></Route>
          <Route path={`${match.url}/setnetwork`} component={Networksetup}></Route>
          <Route path={`${match.url}/setsystem`} component={Systemsetup}></Route>
          <Route path={`${match.url}/upgrade`} component={Systemupgrade}></Route>
          <Route path={`${match.url}/*`} component={Home}></Route>
        </Switch>
      </div>
    </div>)}></Route>
    <Route path='/*' component={Login}></Route>
  </Switch>
</BrowserRouter >, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
