import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./topbar.css";
import { Search, Settings, NotificationsNone, Add } from "@material-ui/icons";

export default function StartupTopbar() {
  const [logoUrl, setLogoUrl] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
  const [startupName, setStartupName] = useState("");
  const logoInputRef = useRef(null);
  const userImageInputRef = useRef(null);

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        const response = await axios.get(
          "https://incubator-crm.onrender.com/startup/list/",
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("access_token")
              }`,
            },
          }
        );
        if (response.data && response.data.length > 0) {
          const { startup_name } = response.data[0];
          setStartupName(startup_name);
        }
      } catch (error) {
        console.error("Error fetching startup data:", error);
      }
    };

    fetchStartupData();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logoContainer" onClick={() => logoInputRef.current.click()}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="logoImg" />
            ) : (
              <div className="placeholderLogo">
                <Add />
              </div>
            )}
            
            <span className="logoText">{startupName || "Startup Name"}</span>
            <input
              type="file"
              accept="image/*"
              ref={logoInputRef}
              onChange={handleLogoChange}
              className="logoInput"
            />
          </div>
        </div>
        <div className="topMiddle">
          <h1 className="dashboardTitle">Dashboard</h1>
        </div>
        <div className="topRight">
          <div className="searchBar">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Search..."
              className="searchInput"
            />
          </div>
          <div className="userProfile" onClick={() => userImageInputRef.current.click()}>
            {userImageUrl ? (
              <img src={userImageUrl} alt="User" className="userImage" />
            ) : (
              <div className="placeholderUserAvatar">
                <Add />
              </div>
            )}
            <span className="userName">Aryan Kathpal</span>
            <input
              type="file"
              accept="image/*"
              ref={userImageInputRef}
              onChange={handleUserImageChange}
              className="userImageInput"
            />
          </div>
          <div className="iconWrapper">
            <Settings className="icon" />
            <NotificationsNone className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}