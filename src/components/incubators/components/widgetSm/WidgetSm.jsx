


                                                                        





import React, { useState, useEffect } from "react";                  
import axios from "axios";     
import "./widgetSm.css";
import {
  LinkedIn,
  Twitter,
  Instagram,
  YouTube,
  Language,  // For Website
} from '@material-ui/icons';

export default function WidgetSm() {
  const [incubatorInfo, setIncubatorInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/incubator/list/" , 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }      
      );
      console.log("Response data:", response.data);
      setIncubatorInfo(response.data[0]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="widgetSm">
      <div className="widgetSmTitle">Incubator Information</div>
      <div className="widgetSmDropdowns">
        {incubatorInfo && (
          <>
            {/* <div className="widgetSmDropdown">
              <label htmlFor="phone">Phone:</label>
              <p>{incubatorInfo.phone}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="email">Email:</label>
              <p>{incubatorInfo.email}</p>
            </div> */}
            <div className="widgetSmDropdown">
              <label htmlFor="address">Address:</label>
              <p>{incubatorInfo.address}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="incubator_people">Incubator People:</label>
              <p>{incubatorInfo.incubator_people}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="website">Website:</label>
              <p>{incubatorInfo.website}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="linkedin">LinkedIn:</label><br></br>
            
               <a href={incubatorInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedIn />
              </a>

            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="twitter">Twitter:</label><br></br>
              {/* <p>{incubatorInfo.twitter}</p> */}
              <a href={incubatorInfo.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter />
              </a>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="instagram">Instagram:</label><br></br>
              {/* <p>{incubatorInfo.instagram}</p> */}
               <a href={incubatorInfo.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram />
              </a>

            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="youtube">Youtube:</label>
              <p>{incubatorInfo.youtube}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="associated_institute">Associated Institute:</label>
              <p>{incubatorInfo.associated_institute}</p>
            </div>
          </>
        )}
      </div>     
    </div>
  );
}
