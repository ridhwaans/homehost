import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReact, faGithub } from '@fortawesome/free-brands-svg-icons'


function Footer() {
    return (
        <div className="footer">

            <div className="footer-content">
                <span className="copyright">&copy; 2021 </span> made using <span className="react-icon"><FontAwesomeIcon icon={faReact} /></span> by
            </div>

            <div className="social-links">
                <a href={"https://github.com/ridhwaans"} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
            </div>
        </div>
    );
}

export default Footer;
