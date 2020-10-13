import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { boardReducer } from './reducers/boardReducer';
import { generalReducer } from './reducers/generalReducer';
import { activityReducer } from './reducers/activityReducer';

const store = createStore(combineReducers({
    board: boardReducer,
    activity: activityReducer,
    general: generalReducer
}), applyMiddleware(thunk));

export default store;