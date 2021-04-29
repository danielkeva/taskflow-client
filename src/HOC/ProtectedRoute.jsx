import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ErrorNotification from '../components/ErrorNotification';
import NotFoundFallback from '../components/NotFoundFallback';

import { hideError } from '../store/actions/errorActions';

function ProtectedRoute({ component: Component, ...rest }) {
    const errorCode = useSelector(state => state.error.statusCode);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            console.log('cleaning up');
            dispatch(hideError());
        };
    }, [dispatch]);

    return (
        <Route
            {...rest}
            render={props => (errorCode === 401 && <ErrorNotification />) || (errorCode === 404 && <NotFoundFallback status={errorCode} />) || <Component {...props} />}
        />
    );
}

export default ProtectedRoute;
