import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import AppRedux from './app';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    app: AppRedux
  });
}
