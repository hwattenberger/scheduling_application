import React, { useContext } from "react";
import { LoginUserStateContext } from '../../Context/userAuth/Context'
import {Route, Redirect} from "react-router-dom";

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

  export default PrivateRoute