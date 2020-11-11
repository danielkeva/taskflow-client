const initialState = {
    isInitialAddition: false,
    isLoading: true
};

export const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_INITIAL_ADDITION':
            return {
                ...state,
                isInitialAddition: action.isInitial
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.isLoading
            };
        default:
            return state
    }
}
