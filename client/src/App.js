import React from "react";
import Login from "./components/Login/Login";
import {BrowserRouter, Switch, Route } from "react-router-dom";
import Staff from "./components/Staff/Staff";
import StaffMember from "./components/Staff/StaffMember";
import GeneralSetup from "./components/GeneralSetup/GeneralSetup";
import ScheduleIntro from "./components/Schedule/ScheduleIntro";
import UserScheduledShifts from "./components/Schedule/UserScheduledShifts";
import NavBar from "./components/MainPage/NavBar";
import Register from "./components/Login/Register";
import Landing from "./components/MainPage/Landing";
import PrivateRoute from "./components/General/PrivateRoute"
import AdminRoute from "./components/General/AdminRoute"

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <div className="App">
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <PrivateRoute path={`/staff/:staffId/schedule`}>
          <UserScheduledShifts />
        </PrivateRoute>
        <PrivateRoute path={`/staff/:staffId`}>
          <StaffMember />
        </PrivateRoute>
        <AdminRoute path="/staff">
          <Staff />
        </AdminRoute>
        <AdminRoute path="/generalSetup">
          <GeneralSetup />
        </AdminRoute>
        <AdminRoute path="/schedule">
          <ScheduleIntro />
        </AdminRoute>
        <Route path="/">
          <Landing/>
        </Route>
      </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
