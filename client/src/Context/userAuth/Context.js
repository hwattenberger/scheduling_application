import React, { createContext, useEffect, useReducer } from 'react';
import {userReducer, initialState} from './reducer'
import axios from 'axios';

export const LoginUserStateContext = createContext();


export const UserStateProvider = (props) => {
    const [loginUserInfo, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        dispatch({type: 'REQUEST_LOGIN'});
        axios.get("http://localhost:5000/auth/getUser", {withCredentials: true}).then((res) => {
            if (res.data) {
                dispatch({type: 'LOGIN_SUCCESS', payload: {
                    isAdmin: res.data.isAdmin,
                    id: res.data._id
                }});
            }
            else dispatch({type: 'LOGIN_UNSUCCESSFUL'});
        })
    }, [])

    const value = React.useMemo(() => ({
        loginUserInfo, dispatch
      }), [loginUserInfo, dispatch]);

    return (
        <LoginUserStateContext.Provider value={value}>
            {props.children}
        </LoginUserStateContext.Provider>
    )
}