import React from "react";
import style from "./SideBarOption.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SidebarOption({ Icon, option }) {
  return (
    <div className={style.sideBarOption}>
      {Icon && <span className={style.SideBarOptionIcon}><FontAwesomeIcon icon={Icon} /></span>}
      {Icon && <p>{option}</p>}
    </div>
  );
}

export default SidebarOption;

//<FontAwesomeIcon icon={Icon} className={style.SideBarOptionIcon} />