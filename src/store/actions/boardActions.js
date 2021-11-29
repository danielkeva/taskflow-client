import { boardService } from "../../services/board.service.js";

export function loadBoards() {
  return async (dispatch) => {
    try {
      const response = await boardService.query();
      dispatch({ type: "SET_BOARDS", boards: response });
    } catch (err) {
      console.log("should be dispatching error to its storeee", err);
      dispatch({ type: "SET_ERROR", error: err.response });
    }
  };
}
export function addBoard(newBoard) {
  return async (dispatch) => {
    try {
      const response = await boardService.save(newBoard);
      dispatch({ type: "ADD_BOARD", board: response });
    } catch (err) {
      dispatch({ type: "SET_ERROR", error: err.response });
    }
  };
}

export function getBoardById(id) {
  return async (dispatch) => {
    try {
      dispatch({ type: "SET_LOADING", isLoading: true });
      const response = await boardService.getById(id);
      dispatch({ type: "SET_BOARD", currBoard: response });
      dispatch({ type: "SET_LOADING", isLoading: false });
    } catch (err) {
      console.log(err.response);
      dispatch({ type: "SET_LOADING", isLoading: false });
      dispatch({ type: "SET_ERROR", error: err.response });
    }
  };
}

export function saveBoard(updatedBoard) {
  return async (dispatch, getState) => {
    // updatedBoard.isPrivate = true
    const prevBoard = getState().board.currBoard;
    dispatch({ type: "SET_BOARD", currBoard: updatedBoard });
    try {
      const savedBoard = await boardService.update(updatedBoard);
      console.log("after board saved", savedBoard);
    } catch (error) {
      dispatch({ type: "SET_BOARD", currBoard: prevBoard });
      console.log("Err: Board saving failed");
    }
  };
}
export function setCurrBoard(updatedBoard) {
  return (dispatch) => {
    dispatch({ type: "SET_BOARD", currBoard: updatedBoard });
  };
}

export function loadCard(id) {
  return async (dispatch, getState) => {
    await dispatch({ type: "SET_CARD", id });
    return getState().board.currCard;
  };
}

export function updateCard(card) {
  return (dispatch) => {
    dispatch({ type: "UPDATE_CARD", currCard: card });
  };
}

export function toggleLabels() {
  return (dispatch) => {
    dispatch({ type: "TOGGLE_LABELS" });
  };
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

// export function loadCard(cardId) {
//     state.board.cardLists.forEach(cardList => {
//         const card = cardList.cards.find(card => card.id === cardId)
//         if (card) {
//             dispatch({ type: 'SET_CARD', currCard: card })
//         }
//     })

// }

//   function updateCardList(cardList) {
//     const boardCopy = JSON.parse(JSON.stringify(state.board));
//     const idx = boardCopy.cardLists.findIndex(currList => currList.id === cardList.id)
//     boardCopy.cardLists.splice(idx, 1, cardList)
//     saveBoard(boardCopy)
//   }

//   function removeCardList(cardListId) {

//     const boardCopy = JSON.parse(JSON.stringify(state.board));
//     const idx = boardCopy.cardLists.findIndex(currList => currList.id === cardListId)
//     boardCopy.cardLists.splice(idx, 1)
//     saveBoard(boardCopy)
//   }

//   function updateCard(card) {
//     dispatch({ type: 'SET_CARD', currCard: card })
//     const boardCopy = JSON.parse(JSON.stringify(state.board))
//     boardCopy.cardLists.forEach(cardList => {
//       let idx = cardList.cards.findIndex(currCard => currCard.id === card.id)
//       if (idx !== -1) {
//         cardList.cards.splice(idx, 1, card)
//       }
//     })
//     saveBoard(boardCopy)
//   }

// console.log('state board after', state.board);
