import React from 'react'
import style from '../style/App.css'

class FooterBar extends React.Component {
  render() {
  	return (
  		<div className={style.footer}>
       <p>
       Powered by <a href="https://developer.spotify.com/documentation/web-api/">Spotify</a> and <a href="https://www.themoviedb.org/documentation/api">TMDB</a>&emsp;
       Made with ❤️ by <a href="https://github.com/ridhwaans">@ridhwaans</a>&emsp;
       Code licensed <a href="https://github.com/ridhwaans/homehost/blob/master/LICENSE">MIT</a>&emsp;
       <a href="http://localhost:3000/disclaimer">Disclaimer & General Copyright Statement</a>
       </p> 
      </div>
		)
  }
}

export default FooterBar