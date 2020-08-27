

export const boardReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BOARDS':
            return {
                 ...state,
                 boards: [ ...action.boards ]
                };
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
