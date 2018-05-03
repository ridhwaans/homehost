import {
  REQUEST_TV,
  RECEIVE_TV,
  FILTER_TV,
  SORT_TV
} from '../constants/Page'

const initialState = {
  TV: [],
  displayedTV: []
}

export default function tv(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TV:
      return {
        ...state
      }

    case RECEIVE_TV:
      let tv = action.tv
      return {
        ...state,
        tv,
        displayedTV: tv
      }

    case FILTER_TV:
      let displayedTV = state.TV.filter(tv => {
        if (tv.name.toLowerCase().includes(action.searchTerm.toLowerCase())
           || tv.season.name.toLowerCase().includes(action.searchTerm.toLowerCase())
           || tv.season.episodes.some(episode => episode.name.toLowerCase().includes(action.searchTerm.toLowerCase()))
           ) {
          return true
        }
        return false
      })

      return {
        ...state,
        displayedTV,
        displayedTV: displayedTV
      }

    case SORT_TV:
      let sortDisplayedTV
      switch(action.sortOption) {
        case 'Alphabetical':
          sortDisplayedTV = state.displayedTV.sort((a,b)=> {
            var a1 = a.name.toLowerCase() + a.season.name.toLowerCase();
            var b1 = b.name.toLowerCase() + b.season.name.toLowerCase();
            return a1<b1 ?-1:a1> b1? 1 :0;
          })
          break;
        case 'Oldest':
          sortDisplayedTV = state.displayedTV.sort((a,b)=> {
            return new Date(a.season.air_date).getTime() - new Date(b.season.air_date).getTime();
          })
          break;
        case 'Newest':
          sortDisplayedTV = state.displayedTV.sort((a,b)=> {
            return new Date(b.season.air_date).getTime() - new Date(a.season.air_date).getTime();
          })
          break;
        default:
          break;
      }
      return {
        ...state,
        sortDisplayedTV,
        displayedTV: sortDisplayedTV
      }

    default:
      return state
  }
}