
import { boardService } from '../../services/board.service.js';
import { socketService } from '../../services/socket.service.js';


export function loadBoards() {
    return async dispatch => {
        const boards = await boardService.query()
        if (boards) {
            dispatch({ type: 'SET_BOARDS', boards })
        }
    }
}

export function getBoardById(id) {
    return async dispatch => {
        try {
            const currBoard = await boardService.getById(id)
            dispatch({ type: 'SET_BOARD', currBoard })
        } catch (err) {
            console.warn('cannot save board', err)
            throw err
        }
    }
}

export function saveBoard(updatedBoard) {
    return async (dispatch, getState) => {
        const prevBoard = getState().board.currBoard
        dispatch({ type: 'SET_BOARD', currBoard: updatedBoard })
        try {
            const savedBoard = await boardService.update(updatedBoard)
            console.log('after board saved', savedBoard)
            socketService.emit('update board', savedBoard);
        } catch (error) {
            dispatch({ type: 'SET_BOARD', currBoard: prevBoard })
            console.log('Err: Board saving failed')

        }
    }
}
export function setCurrBoard(updatedBoard) {
    return dispatch => {
        dispatch({ type: 'SET_BOARD', currBoard: updatedBoard })
    }
}

export function loadTask(id) {
    return async (dispatch, getState) => {
        await dispatch({ type: 'SET_TASK', id });
        return getState().board.currTask
    }
}

export function updateTask(task) {
    return dispatch => {
        dispatch({ type: 'UPDATE_TASK', currTask: task });
    }
}

export function toggleLabels() {
    return dispatch => {
        dispatch({ type: 'TOGGLE_LABELS' });
    }
}





// export function saveBoard(updatedBoard) {
//     return async dispatch => {
//         dispatch({ type: 'SET_BOARD', currBoard: updatedBoard })

//         await boardService.update(updatedBoard)
//     }
// }
// export function saveBoard(updatedBoard) {
//     console.log('saveeborad', updatedBoard);
//     const boardCopy = JSON.parse(JSON.stringify(updatedBoard));
//     const savedBoard = boardService.save(boardCopy)
//     return async dispatch => {
//         dispatch({ type: 'SET_BOARD', currBoard: savedBoard })
//     }
// }


    // export function loadTask(taskId) {
    //     state.board.taskLists.forEach(taskList => {
    //         const task = taskList.tasks.find(task => task.id === taskId)
    //         if (task) {
    //             dispatch({ type: 'SET_TASK', currTask: task })
    //         }
    //     })

    // }


    //   function updateTaskList(taskList) {
    //     const boardCopy = JSON.parse(JSON.stringify(state.board));
    //     const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskList.id)
    //     boardCopy.taskLists.splice(idx, 1, taskList)
    //     saveBoard(boardCopy)
    //   }

    //   function removeTaskList(taskListId) {

    //     const boardCopy = JSON.parse(JSON.stringify(state.board));
    //     const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskListId)
    //     boardCopy.taskLists.splice(idx, 1)
    //     saveBoard(boardCopy)
    //   }

    //   function updateTask(task) {
    //     dispatch({ type: 'SET_TASK', currTask: task })
    //     const boardCopy = JSON.parse(JSON.stringify(state.board))
    //     boardCopy.taskLists.forEach(taskList => {
    //       let idx = taskList.tasks.findIndex(currTask => currTask.id === task.id)
    //       if (idx !== -1) {
    //         taskList.tasks.splice(idx, 1, task)
    //       }
    //     })
    //     saveBoard(boardCopy)
    //   }


    // console.log('state board after', state.board);



