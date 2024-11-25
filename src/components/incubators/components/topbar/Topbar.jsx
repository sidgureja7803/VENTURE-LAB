import React, { useState, useEffect ,useRef } from "react";
import "./topbar.css";
import axios from 'axios';
import { Search, Settings, NotificationsNone, Add } from "@material-ui/icons";

export default function StartupTopbar() {
  const [logoUrl, setLogoUrl] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
   const [incubatorName, setIncubatorName] = useState(""); // State to store the incubator name
  const logoInputRef = useRef(null);
  const userImageInputRef = useRef(null);

  useEffect(() => {
    fetchIncubatorInfo();
  }, []);

  const fetchIncubatorInfo = async () => {
    try {
      const response = await axios.get("https://incubator-crm.onrender.com/incubator/list/" ,   {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        });
      if (response.data.length > 0) {
        setIncubatorName(response.data[0].incubator_name);
      }
    } catch (error) {
      console.error("Error fetching incubator info:", error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setLogoUrl(event.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current.click();
  };

  const handleUserImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setUserImageUrl(event.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUserImageClick = () => {
    userImageInputRef.current.click();
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logoContainer" onClick={handleLogoClick}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="logoImg" />
            ) : (
              <div className="placeholderLogo">
                <Add className="plusIcon" />
              </div>
            )}
            <span className="logoText">{incubatorName}</span>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              ref={logoInputRef}
              onChange={handleLogoChange}
              className="logoInput"
            />
          </div>
        </div>

        <div className="breadcrumb-section">
          <div className="breadcrumb">
            Pages / Dashboard
          </div>
          <div className="page-name">
            Dashboard
          </div>
        </div>

        <div className="topMiddle">
          <div className="searchBar">
            <Search className="searchIcon" />
            <input type="text" placeholder="Type here " className="searchInput" />
          </div>
        </div>
        
        <div className="topRight">
          <div className="userProfile" onClick={handleUserImageClick}>
            {userImageUrl ? (
              <img src={userImageUrl} alt="User" className="userImage" />
            ) : (
              <div className="placeholderUserAvatar">
                <Add className="plusIcon" />
              </div>
            )}
            <span className="userName">Aryan Kathpal</span>
          </div>
          <Settings className="settingsIcon" />
          <NotificationsNone className="notificationsIcon" />
        </div>
      </div>
    </div>
  );
}
