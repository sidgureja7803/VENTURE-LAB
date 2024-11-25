import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./sidebar.css";
import { ExitToApp, LineStyle, Timeline, EmojiPeople, EmojiEvents, AttachMoney, BarChart, Business, Group } from "@material-ui/icons";

export default function Sidebar() {
  const history = useHistory();

  const handleLogout = () => {
    alert("Logged out!"); // Placeholder for logout functionality
    history.push("/login"); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem active">
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>

            <Link to="/incubator-associated" className="link">
              <li className="sidebarListItem">
                <Timeline className="sidebarIcon" />
                Incubator Associated
              </li>
            </Link>
            <Link to="/startup-people" className="link">
              <li className="sidebarListItem">
                <EmojiPeople className="sidebarIcon" />
                Startup People
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <EmojiEvents className="sidebarIcon" />
                Awards
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                <AttachMoney className="sidebarIcon" />
                Funding
              </li>
            </Link>
            <Link to="/startup-info" className="link">
              <li className="sidebarListItem">
                <BarChart className="sidebarIcon" />
                Startup Info
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Partners and IPs</h3>
          <ul className="sidebarList">
            <Link to="/intellectual-properties" className="link">
              <li className="sidebarListItem">
                <Business className="sidebarIcon" />
                Intellectual Properties
              </li>
            </Link>
            <Link to="/partners" className="link">
              <li className="sidebarListItem">
                <Group className="sidebarIcon" />
                Programs
              </li>
            </Link>
            <li className="sidebarListItem" onClick={handleLogout}>
              <ExitToApp className="sidebarIcon" />
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}












