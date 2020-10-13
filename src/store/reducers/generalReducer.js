const initialState = {
   isInitialAddition:false
};

export const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_INITIAL_ADDITION':
            return {
                ...state,
                isInitialAddition: action.isInitial
            };
        default:
            return state
    }
}
