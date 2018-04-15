import {
  REQUEST_MUSIC,
  RECEIVE_MUSIC,
  FILTER_MUSIC,
  SORT_MUSIC
} from '../constants/Page'

const initialState = {
  music: [],
  displayedMusic: []
}

export default function music(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MUSIC:
      return {
        ...state
      }

    case RECEIVE_MUSIC:
      let music = action.music
      return {
        ...state,
        music,
        displayedMusic: music
      }

    case FILTER_MUSIC:
      let displayedMusic = state.music.filter(music => {
        if (music.album_name.toLowerCase().includes(action.searchTerm.toLowerCase())) {
          return true
        }
        return false
      })
      return {
        ...state,
        displayedMusic,
        displayedMusic: displayedMusic
      }

    case SORT_MUSIC:
      let sortDisplayedMusic
      switch(action.sortOption) {
        case 'Album name':
          sortDisplayedMusic = state.displayedMusic.sort((a,b)=> {
            var a1 = a.album_name.toLowerCase();
            var b1 = b.album_name.toLowerCase();
            return a1<b1 ?-1:a1> b1? 1 :0;
          })
          break;
        case 'Artist name':
          sortDisplayedMusic = state.displayedMusic.sort((a,b)=> {
            var a1 = a.artist_name.toLowerCase();
            var b1 = b.artist_name.toLowerCase();
            return a1<b1 ?-1:a1> b1? 1 :0;
          })
          break;
        case 'Oldest':
          sortDisplayedMusic = state.displayedMusic.sort((a,b)=> {
            return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
          })
          break;
        case 'Newest':
          sortDisplayedMusic = state.displayedMusic.sort((a,b)=> {
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
          })
          break;
        default:
          break;
      }
      return {
        ...state,
        sortDisplayedMusic,
        displayedMusic: sortDisplayedMusic
      }

    default:
      return state
  }

}