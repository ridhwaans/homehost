import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  FILTER_MOVIES,
  SORT_MOVIES
} from '../constants/Page'

const initialState = {
  movies: [],
  displayedMovies: []
}

export default function movie(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MOVIES:
      return {
        ...state
      }

    case RECEIVE_MOVIES:
      let movies = action.movies
      return {
        ...state,
        movies,
        displayedMovies: movies
      }

    case FILTER_MOVIES:
      let displayedMovies = state.movies.filter(movie => {
        if (movie.title.toLowerCase().includes(action.searchTerm.toLowerCase())) {
          return true
        }
        return false
      })
      return {
        ...state,
        displayedMovies,
        displayedMovies: displayedMovies
      }

    case SORT_MOVIES:
      let sortDisplayedMovies
      switch(action.sortOption) {
        case 'Alphabetical':
          sortDisplayedMovies = state.displayedMovies.sort((a,b)=> {
            var a1 = a.title.toLowerCase();
            var b1 = b.title.toLowerCase();
            return a1<b1 ?-1:a1> b1? 1 :0;
          })
          break;
        case 'Oldest':
          sortDisplayedMovies = state.displayedMovies.sort((a,b)=> {
            return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
          })
          break;
        case 'Newest':
          sortDisplayedMovies = state.displayedMovies.sort((a,b)=> {
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
          })
          break;
        default:
          break;
      }
      return {
        ...state,
        sortDisplayedMovies,
        displayedMovies: sortDisplayedMovies
      }

    default:
      return state
  }

}