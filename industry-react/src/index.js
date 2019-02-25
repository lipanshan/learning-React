import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import myHead from "./container/header";
import Login from "./container/login";
import MainMenu from "./container/mainmenu";
import Home from "./component/home";
import {NeedChangepassword, NeedIpEarlyWarning, NeedRiskWarning, NeedPortLog, NeedSystemsetup, NeedSystemupgrade, NeedNetworksetup} from './assets/js/needComponent'
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
          <Route path={`${match.url}/riskWarning`} component={NeedRiskWarning}></Route>
          <Route path={`${match.url}/ipRisk`} component={NeedIpEarlyWarning}></Route>
          <Route path={`${match.url}/portLog`} component={NeedPortLog}></Route>
          <Route path={`${match.url}/password`} component={NeedChangepassword}></Route>
          <Route path={`${match.url}/setnetwork`} component={NeedNetworksetup}></Route>
          <Route path={`${match.url}/setsystem`} component={NeedSystemsetup}></Route>
          <Route path={`${match.url}/upgrade`} component={NeedSystemupgrade}></Route>
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
