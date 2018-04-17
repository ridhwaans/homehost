import React from 'react'
import style from '../style/App.css'

class FooterBar extends React.Component {
  render() {
  	return (
  		<div className={style.footer}>
       <p>
       Made with ❤️ by <a href="https://github.com/ridhwaans">@ridhwaans</a>&emsp;
       Code licensed <a href="https://github.com/ridhwaans/homehost/blob/master/LICENSE">MIT</a>&emsp;
       <a href="http://localhost:3000/disclaimer">Disclaimer & General Copyright Statement</a> 
       </p> 
      </div>
		)
  }
}

export default FooterBar