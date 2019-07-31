import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './src/reducers/index';

const store = createStore(
     rootReducer,
    applyMiddleware(ReduxThunk)
);


export default store;
