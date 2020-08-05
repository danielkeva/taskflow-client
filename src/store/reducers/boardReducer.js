

export const boardReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return { ...state, board: { ...action.board } }

        default:
            return state
    }
}
