import './App.css';
import React, { useState, useEffect, useContext } from "react";
import Login from "./components/Login/Login";
import { myContext } from './Context'
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import Staff from "./components/Staff/Staff";
import StaffMember from "./components/Staff/StaffMember";
import GeneralSetup from "./components/GeneralSetup";
import Schedule from "./components/Schedule/Schedule";

function App() {
  const [loginUser, setLoginUser] = useState(null);
  const userObject = useContext(myContext);

  return (
    <BrowserRouter>
      <div className="App">
        Login User: {userObject && userObject._id}
        {userObject && <h1> Logged in!</h1>}
        {!userObject && <Login setLoginUser={setLoginUser}/>}
      </div>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path={`/staff/:staffId`}>
          <StaffMember />
        </Route>
        <Route path="/staff">
          <Staff />
        </Route>
        <Route path="/generalSetup">
          <GeneralSetup />
        </Route>
        <Route path="/schedule">
          <Schedule />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
