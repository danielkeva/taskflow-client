const initState = {
    error: null,
    isOpen: false,
    statusCode: null,

};

// Check for the existence of a non null error field in the action's payload.
//  If it exists, it simply picks the action and captures the error message.
//  This removes the need for explicitly defining the action types that need to be captured by the central error reducer.
export function errorReducer(state = initState, action) {
    const { error } = action;
    if (error) {
        console.log('err', error)
        return {
            error: [error.data],
            statusCode: error.status,
            isOpen: true
        }
    } else if (action.type === 'HIDE_ERROR') {
        return {
            error: null,
            isOpen: false
        }
    }

    return state;
}







