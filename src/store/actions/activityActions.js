import { boardService } from "../../services/board.service"


// Dispatching this action to determine wether or not to start editing in TaskChecklist cmp on initial render

export function loadActivities(boardId) {
    return async dispatch => {
        try {
            const activities = await boardService.getActivities(boardId)
            dispatch({ type: 'SET_ACTIVITIES', activities })
            dispatch({ type: 'SET_BOARD_ID', boardId })
        } catch (err) {
            console.warn('cannot load activities', err)
            throw err
        }
    }
}


export function addActivity(activity) {
    return async (dispatch, getState) => {
        const boardId = getState().activity.boardId
        try {
            await boardService.addActivity(boardId, activity)
            dispatch({ type: 'ADD_ACTIVITY', activity });
        } catch (err) {
            throw err
        }
    }
}
