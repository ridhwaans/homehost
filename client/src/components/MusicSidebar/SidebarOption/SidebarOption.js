import React from "react";
import style from "./SidebarOption.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SidebarOption({ Icon, option }) {
  return (
    <div className={style.SidebarOption}>
      {Icon && <span className={style.SidebarOptionIcon}><FontAwesomeIcon icon={Icon} /></span>}
      {Icon && <p>{option}</p>}
    </div>
  );
}

export default SidebarOption;
