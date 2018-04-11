import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appReducer from '../reducers/AppReducer'

export default function configureStore() {
  const store = createStore(
  	appReducer, 
  	applyMiddleware(thunk)
  );

  return store;
}