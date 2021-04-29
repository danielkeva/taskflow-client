import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideError } from '../store/actions/errorActions';
import { Alert } from '@material-ui/lab';

const ErrorNotification = () => {
    const isOpen = useSelector(state => state.error.isOpen);
    const errors = useSelector(state => state.error.error);
    // const errorCode = useSelector(state => state.error.statusCode);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(hideError());
        };
    }, [dispatch]);

    // if (errorCode === 401) {
    //     return (
    //         <div style={{ paddingTop: '50px', fontSize: '100px' }}>unauthorized!!!</div>
    //     )
    // } else
    return (
        <>
            {isOpen && errors && (
                <div>
                    {console.log('i am here: ', errors)}
                    <Alert severity='error'>
                        {errors.map((error, idx) => (
                            <div key={idx}>{error}</div>
                            // <AlertTitle key={idx}>{error}</AlertTitle>
                        ))}
                    </Alert>
                </div>
            )}
        </>
    );
};

export default ErrorNotification;
