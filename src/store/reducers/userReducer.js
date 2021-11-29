let localLoggedinUser = null
if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user)

const initialState = {
  loggedInUser: localLoggedinUser
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        loggedInUser: { ...action.user }
      }
    // case 'SET_LOADING':
    //     return {
    //         ...state,
    //         userLoading: action.isLoading
    //     };
    case 'SET_LOGOUT':
      return {
        ...state,
        loggedInUser: null
      }
    default:
      return state
  }
}
