import React, { createContext, useEffect, useState, useReducer, useMemo } from 'react';
import {userReducer, initialState} from './reducer'
import axios from 'axios';

export const LoginUserStateContext = createContext();


export const UserStateProvider = (props) => {
    const [loginUserInfo, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        console.log("Hello?")
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

// export const LoginUserContext = createContext({});


// export default function Context(props) {
//     const [userObject, setUserObject] = useState({currentUser: "123"});

    // useEffect(() => {
    //     axios.get("http://localhost:5000/auth/getUser", {withCredentials: true}).then((res) => {
    //         console.log("Here", res);
    //         if (res.data) {
    //             setUserObject({currentUser: res.data});
    //         }
    //         else setUserObject({currentUser: null})
    //     })
    // }, [])

//     return (
//         <LoginUserContext.Provider value={userObject}>{props.children}</LoginUserContext.Provider>
//     )
// }