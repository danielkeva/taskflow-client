
export function setError(error) {
    console.log('error',error)
    return dispatch => {
        dispatch({ type: 'SET_ERROR', error: error });
    }
}
export function hideError() {
    return dispatch => {
        dispatch({ type: 'HIDE_ERROR'});
    }
}

