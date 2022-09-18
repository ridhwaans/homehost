import React, { useEffect, useRef, useState } from 'react';

import logo from '../../assets/logos/Homehost_White.svg';

function AdminHeader() {
  const [setHeader] = useState(false);
  const ref = useRef(null);

  const handleScroll = () => {
    if (window.scrollY === 0) {
      setHeader(false);
    } else if (ref && ref.current && ref.current.getBoundingClientRect()) {
      setHeader(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  useEffect(() => {
    var li = document.getElementsByClassName('header-list-item');
    for (var el of li) {
      el.firstElementChild.addEventListener('click', (e) =>
        e.target.classList.toggle('active')
      );
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  return (
    <div className="header-height-pinned">
      <div className="header pin-header" ref={ref}>
        <div className="logo">
          <img src={logo} alt={'logo'} />
        </div>

        <div className="header-options">
          <div className="account-menu">
            <div className="account-dropdown-menu">
              <span className="presentation">
                <img
                  src={
                    'https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABWyw3UeUMaPP3aLxzskg3Bn5htGHqQymxiEGTbfM91FZ0zJAPoEfYQdvHW7FV06FcdXhPC_4F7zNR7TFKLLv6yo.png?r=88c'
                  }
                  alt={'avatar'}
                />
              </span>
              <span className="caret"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
