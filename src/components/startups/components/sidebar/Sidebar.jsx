import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./sidebar.css";
import {
  ExitToApp,
  LineStyle,
  Timeline,
  EmojiPeople,
  EmojiEvents,
  AttachMoney,
  BarChart,
  Business,
  Event
} from "@material-ui/icons";

export default function StartupSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <div className="mainContainer">
      <div className="startup-sidebar">
        <div className="sidebarWrapper">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <NavLink to="/startup" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <LineStyle className="sidebarIcon" />
              Home
            </NavLink>
            <NavLink to="/startup/incubator-associated" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <Timeline className="sidebarIcon" />
              Incubator Associated
            </NavLink>
            <NavLink to="/startup/startup-people" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <EmojiPeople className="sidebarIcon" />
              Startup People
            </NavLink>
            <NavLink to="/startup/users" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <EmojiEvents className="sidebarIcon" />
              Awards
            </NavLink>
            <NavLink to="/startup/products" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <AttachMoney className="sidebarIcon" />
              Funding
            </NavLink>
            <NavLink to="/startup/startup-info" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <BarChart className="sidebarIcon" />
              Startup Info
            </NavLink>
            <NavLink to="/startup/intellectual-properties" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <Business className="sidebarIcon" />
              Intellectual Properties
            </NavLink>
            <NavLink to="/startup/partners" className={({ isActive }) => `sidebarListItem ${isActive ? "active" : ""}`}>
              <Event className="sidebarIcon" />
              Programs
            </NavLink>
            <li className="sidebarListItem logoutItem" onClick={handleLogout}>
              <ExitToApp className="sidebarIcon" />
              Logout
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </div>
  );
}