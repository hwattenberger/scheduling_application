import './App.css';
import React, { useState, useContext } from "react";
import Login from "./components/Login/Login";
import { myContext } from './Context'
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
  // const [loginUser, setLoginUser] = useState(null);
  // const userObject = useContext(myContext);

  return (
    <BrowserRouter>
      <NavBar />
      <div className="App">
        {/* Login User: {userObject && userObject._id} */}
        {/* {userObject && <h1> Logged in!</h1>} */}
        {/* {!userObject && <Login setLoginUser={setLoginUser}/>} */}

      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
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
          <ScheduleIntro />
        </Route>
        <Route path={`/myShifts/:staffId`}>
          <UserScheduledShifts />
        </Route>
        <Route path="/">
          <Landing/>
        </Route>
      </Switch>
      </div>
    </BrowserRouter>
  );
}

function PrivateRoute({ children, ...rest }) {
  const userObject = useContext(myContext);
  console.log("User", userObject)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        userObject ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
