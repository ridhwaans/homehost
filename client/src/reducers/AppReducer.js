import { combineReducers } from 'redux'
import moviesReducer from './MoviesReducer'
import musicReducer from './MusicReducer'

const appReducer = combineReducers({
  moviesReducer: moviesReducer,
  musicReducer: musicReducer
})

export default appReducer;