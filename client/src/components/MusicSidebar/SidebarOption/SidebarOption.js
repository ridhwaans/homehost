import React from "react";
import style from "./SideBarOption.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SidebarOption({ Icon, option }) {
  return (
    <div className={style.sideBarOption}>
      {Icon && <div><span className={style.SideBarOptionIcon}><FontAwesomeIcon icon={Icon} /></span></div>}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div>
  );
}

export default SidebarOption;

//<FontAwesomeIcon icon={Icon} className={style.SideBarOptionIcon} />