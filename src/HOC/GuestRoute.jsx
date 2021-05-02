import React from 'react';
import { Route, Redirect } from "react-router-dom";
import {  useSelector } from 'react-redux';


function GuestRoute({ component: Component, ...rest }) {
  console.log('hey')
    const loggedInUser = useSelector(state => state.user.loggedInUser)
    return (
        <Route {...rest} render={(props) => (loggedInUser ? <Redirect to={'/'+loggedInUser.username+'/boards'} /> : <Component {...props} /> )} />
    );
}

export default GuestRoute

