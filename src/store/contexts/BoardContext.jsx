import React, { createContext, useReducer } from 'react';

import { boardReducer } from '../reducers/boardReducer.js';
import { boardService } from '../../services/board.service.js';

const initialState = {
  board: null,
  currTask: null,
};


export const BoardContext = createContext(initialState);

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  async function loadBoard() {
    const board = await boardService.query()
    saveBoard(board)
  }

  function loadTask(taskId) {
    const currTask = boardService.getTaskById(taskId)
    console.log('BoardContext', currTask);
    dispatch({ type: 'SET_TASK', currTask })
  }

  function updateTaskList(taskList) {
    const boardCopy = JSON.parse(JSON.stringify(state.board));
    const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskList.id)
    boardCopy.taskLists.splice(idx, 1, taskList)
    saveBoard(boardCopy)
  }

  function removeTaskList(taskListId) {

    const boardCopy = JSON.parse(JSON.stringify(state.board));
    const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskListId)
    boardCopy.taskLists.splice(idx, 1)
    saveBoard(boardCopy)
  }

  function updateTask(task) {
    dispatch({ type: 'SET_TASK', currTask: task })
    const boardCopy = JSON.parse(JSON.stringify(state.board))
    boardCopy.taskLists.forEach(taskList => {
      let idx = taskList.tasks.findIndex(currTask => currTask.id === task.id)
      if (idx !== -1) {
        taskList.tasks.splice(idx, 1, task)
      }
    })
    saveBoard(boardCopy)
  }

  function saveBoard(updatedBoard) {
    console.log('saveeborad',updatedBoard);
    const boardCopy = JSON.parse(JSON.stringify(updatedBoard));
    const savedBoard = boardService.save(boardCopy)
    dispatch({ type: 'SET_BOARD', board: savedBoard })

    // console.log('state board after', state.board);
  }

  return (
    <BoardContext.Provider
      value={{
        board: state.board,
        currTask: state.currTask,
        loadBoard,
        loadTask,
        updateTaskList,
        removeTaskList,
        updateTask,
        saveBoard
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
