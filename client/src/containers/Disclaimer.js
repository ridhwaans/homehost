import React, { Component } from 'react'
import NavBar from '../components/NavBar'
import FooterBar from '../components/FooterBar'
import style from '../style/App.css'

class Disclaimer extends Component {

  render() {
    
    return (
      <div>
      <NavBar type={-1}/>
      <br/>
      <p className={style.disclaimer}>
      Disclaimer <br/>
      <br/>
      All pictures copyright to their respective owner(s). This project does not claim <br/>
      ownership of any of the pictures displayed on this site unless stated otherwise. <br/>
      This project does not knowingly intend or attempt to offend or violate any <br/>
      copyright or intellectual property rights of any entity. Some images used on this <br/>
      project are taken from the web and believed to be in the public domain. In addition, <br/>
      to the best of this project's knowledge, all content, images, photos, etc., if any, <br/>
      are being used in compliance with the Fair Use Doctrine (Copyright Act of 1976, <br/>
      17 U.S.C. § 107.) The pictures are provided for comment/criticism/news reporting/ <br/>
      educational purposes only. <br/>
      Where every care has been taken to ensure the accuracy of the contents of this <br/>
      project, we do not warrant its completeness, quality and accuracy, nor can we <br/>
      guarantee that it is up-to-date. We will not be liable for any consequences <br/>
      arising from the use of, or reliance on, the contents of this project. The <br/>
      respective owners are exclusively responsible for external websites. This <br/>
      project accepts no liability of the content of external links. <br/>
      Our project follows the safe harbor provisions of 17 U.S.C. §512, otherwise <br/>
      known as Digital Millennium Copyright Act (“DMCA”). <br/>
      If any images posted here are in violation of copyright law, please contact <br/>
      us and we will gladly remove the offending images immediately upon receipt <br/>
      of valid proof of copyright infringement. <br/>
      <br/>
      General Copyright Statement <br/>
      <br/>
      Most of the sourced material is posted according to the “fair use” doctrine of <br/>
      copyright law for non-commercial news reporting, education and discussion purposes. <br/>
      We comply with all takedown requests. <br/>
      You may not use the Service for any illegal or unauthorized purpose. You must not, <br/>
      in the use of the Service, violate any laws in your jurisdiction (including but not <br/>
      limited to copyright or trademark laws).
      </p>
      </div>
    );
  }

}

export default Disclaimer;
