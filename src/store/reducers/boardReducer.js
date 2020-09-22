const initialState = {
    boards: null,
    currBoard: null,
    currTask: null,
    isExpanded: false
};

export const boardReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_BOARDS':
            return {
                ...state,
                boards: JSON.parse(JSON.stringify(action.boards))
            };
        case 'SET_BOARD':
            return {
                ...state,
                currBoard: JSON.parse(JSON.stringify(action.currBoard))
            };
        case 'SET_TASK':
            let taskToUpdate;
            state.currBoard.taskLists.forEach(taskList => {
                taskList.tasks.find(task => {
                    if (task.id === action.id) taskToUpdate = task
                })
            })
            return {
                ...state,
                currTask: taskToUpdate ? { ...taskToUpdate } : null
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                currTask: { ...action.currTask }
            }
        case 'TOGGLE_LABELS':
            return {
                ...state,
                isExpanded: !state.isExpanded
            }
        default:
            return state
    }
}
