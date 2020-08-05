import React, { createContext, useReducer } from 'react';

import { boardReducer } from '../reducers/boardReducer.js';
import { boardService } from '../../services/board.service.js';

const initialState = {
  board: null,
  currTask: null
};


export const BoardContext = createContext(initialState);

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  async function loadBoard() {
    const board = await boardService.query()
    _saveBoard(board)
  }
  function updateTaskList(taskList) {
    const boardCopy = JSON.parse(JSON.stringify(state.board));
    const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskList.id)
    boardCopy.taskLists.splice(idx, 1, taskList)
    _saveBoard(boardCopy)
  }
  function _saveBoard(board) {
    const boardCopy = JSON.parse(JSON.stringify(board));
    const savedBoard = boardService.save(boardCopy)
    dispatch({ type: 'SET_BOARD', board: savedBoard })
  }
  return (
    <BoardContext.Provider
      value={{
        board: state.board,
        loadBoard,
        updateTaskList
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
