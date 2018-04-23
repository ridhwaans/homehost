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

    default:
      return state
  }
}