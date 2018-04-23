import { combineReducers } from 'redux'
import moviesReducer from './MoviesReducer'
import musicReducer from './MusicReducer'
import tvReducer from './TVReducer'

const appReducer = combineReducers({
  moviesReducer: moviesReducer,
  musicReducer: musicReducer,
  tvReducer: tvReducer
})

export default appReducer;