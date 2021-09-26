import React, { useState, useContext } from "react";
import Login from "./components/Login/Login";
import { LoginUserStateContext } from './Context/userAuth/Context'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Staff from "./components/Staff/Staff";
import StaffMember from "./components/Staff/StaffMember";
import GeneralSetup from "./components/GeneralSetup/GeneralSetup";
// import Schedule from "./components/Schedule/Schedule";
import ScheduleIntro from "./components/Schedule/ScheduleIntro";
import UserScheduledShifts from "./components/Schedule/UserScheduledShifts";
import NavBar from "./components/MainPage/NavBar";
import Register from "./components/Login/Register";
import Landing from "./components/MainPage/Landing";

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <div className="App">
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/register">
          <Register />
        </PrivateRoute>
        <PrivateRoute path={`/staff/:staffId/schedule`}>
          <UserScheduledShifts />
        </PrivateRoute>
        <PrivateRoute path={`/staff/:staffId`}>
          <StaffMember />
        </PrivateRoute>
        <PrivateRoute path="/staff">
          <Staff />
        </PrivateRoute>
        <PrivateRoute path="/generalSetup">
          <GeneralSetup />
        </PrivateRoute>
        <PrivateRoute path="/schedule">
          <ScheduleIntro />
        </PrivateRoute>
        <Route path="/">
          <Landing/>
        </Route>
      </Switch>
      </div>
    </BrowserRouter>
  );
}


function PrivateRoute({ children, ...rest }) {
  const {loginUserInfo} = useContext(LoginUserStateContext);
  
  if (loginUserInfo.loading || (loginUserInfo.errorMessage !== "Please Login" && !loginUserInfo.userDetails)) return "Loading...";

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loginUserInfo.userDetails ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
