const initialState = {
  boards: null,
  currBoard: null,
  currCard: null,
  isExpanded: false
}

export const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BOARDS':
      return {
        ...state,
        boards: JSON.parse(JSON.stringify(action.boards))
      }
    case 'SET_BOARD':
      return {
        ...state,
        // currBoard: action.currBoard
        currBoard: { ...action.currBoard }
      }
    case 'ADD_BOARD':
      return {
        ...state,
        boards: [action.board, ...state.boards]
      }
    case 'SET_CARD': {
      let cardToUpdate
      state.currBoard.cardLists.forEach(cardList => {
        cardList.cards.find(card => {
          if (card.id === action.id) cardToUpdate = card
        })
      })
      return {
        ...state,
        currCard: cardToUpdate ? { ...cardToUpdate } : null
      }
    }
    case 'UPDATE_CARD':
      return {
        ...state,
        currCard: { ...action.currCard }
      }
    case 'TOGGLE_LABELS':
      return {
        ...state,
        isExpanded: !state.isExpanded
      }
    case 'SET_LOGOUT':
      return {
        state: undefined
      }
    default:
      return state
  }
}
