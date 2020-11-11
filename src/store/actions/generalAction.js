

// Dispatching this action to determine wether or not to start editing in CardChecklist cmp on initial render
export function toggleInitialAddition(isInitial) {
    return dispatch => {
        dispatch({ type: 'TOGGLE_INITIAL_ADDITION', isInitial });
    }
}