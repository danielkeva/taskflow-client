

export const boardReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return {
                 ...state,
                 board: { ...action.board } 
                };
        case 'SET_TASK':
            return { 
                ...state,
                 currTask: { ...action.currTask } 
                };
        default:
            return state
    }
}
