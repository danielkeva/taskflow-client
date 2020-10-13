const initialState = {
    activities: [],
    boardId: null
};

export const activityReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ACTIVITIES':
            return {
                ...state,
                activities: [...action.activities]
            };
        case 'SET_BOARD_ID':
            return {
                ...state,
                boardId: action.boardId
            };
        case 'ADD_ACTIVITY':
            return {
                ...state,
                activities: [action.activity, ...state.activities]
            };
        default:
            return state
    }
}
