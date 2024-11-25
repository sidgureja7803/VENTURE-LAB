


import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
import {
  ExitToApp,
  LineStyle,
  Timeline,
  EmojiPeople,
  EmojiObjects,
  AttachMoney,
  BarChart,
  Group,
  HowToReg
} from "@material-ui/icons";

export default function IncubatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();                     
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  const handleClick = (path) => {
    setActiveItem(path);
  };

  return (
    <div className="mainContainer">
      <div className="incubator-sidebar">
        <div className="sidebarWrapper">
          <div className="sidebarMenu">
            {/* <h3 className="sidebarTitle">Dashboard</h3> */}
            <ul className="sidebarList">
              <SidebarItem to="/incubator" icon={<LineStyle />} label="Home" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/institute-associated" icon={<Timeline />} label="Institute Associated" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/incubator-people" icon={<EmojiPeople />} label="Incubator People" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/incubated-startups" icon={<EmojiObjects />} label="Incubated Startups" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/infrastructure-incubator" icon={<AttachMoney />} label="Infrastructure" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/incubator-info" icon={<BarChart />} label="Incubator Info" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/startups-applied-at-venture-lab" icon={<HowToReg />} label="Startup Applications" location={location} handleClick={handleClick} activeItem={activeItem} />
              <SidebarItem to="/incubator/partners" icon={<Group />} label="Partners" location={location} handleClick={handleClick} activeItem={activeItem} />
              {/* <SidebarItem to="/incubator/rent-updates" icon={<Home />} label="Rent Updates" location={location} handleClick={handleClick} activeItem={activeItem} /> */}
              <li className="sidebarListItem" onClick={handleLogout}>
                <ExitToApp className="sidebarIcon" />
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </div>    
  ); 
}

function SidebarItem({ to, icon, label, location, handleClick, activeItem }) {
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`link ${isActive ? "active" : ""}`} onClick={() => handleClick(to)}>
      <li className={`sidebarListItem ${isActive ? "active" : ""}`}>
        {React.cloneElement(icon, { className: "sidebarIcon" })}
        {label}
      </li>
    </Link>   
  );
}
