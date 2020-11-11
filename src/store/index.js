import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { boardReducer } from './reducers/boardReducer';
import { generalReducer } from './reducers/generalReducer';
import { activityReducer } from './reducers/activityReducer';
import userReducer from './reducers/userReducer';
import { errorReducer } from './reducers/errorReducer';

const store = createStore(combineReducers({
    board: boardReducer,
    user: userReducer,
    activity: activityReducer,
    general: generalReducer,
    error: errorReducer
}), applyMiddleware(thunk));

export default store;