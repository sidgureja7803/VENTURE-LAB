

import React from "react";
import "./Header.css";

export default function Header({ leftContent, rightContent }) {
  return (
    <div className="headerWrapper">
    {leftContent}
    <button className="add-button" >{rightContent}</button>
      {/* <div className="header-left">{leftContent}</div> */}
      {/* <div className="header-right">{rightContent}</div> */}
    </div>
  );
}




