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
  const [startupInfo, setStartupInfo] = useState([]);

 

  useEffect(() => {  
    fetchData();
  }, []);  // Fetch data whenever startupId changes



  const fetchData = async () => {
    try {
     
      const response = await axios.get(
        "https://incubator-crm.onrender.com/startup/list/" ,  {
        headers: {
           Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,           
          },    
      }                 
      );                                                                                       
      setStartupInfo(response.data[0]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="widgetSm">
      <div className="widgetSmTitle">Startup Information</div>
      <div className="widgetSmDropdowns">
        {startupInfo && (
          <>   
            <div className="widgetSmDropdown">           
              <label htmlFor="startup_name">Name:</label>
              <p>{startupInfo.startup_name}</p>
            </div>
            <div className="widgetSmDropdown">  
             <label htmlFor="phone">Phone:</label>
              <p>{startupInfo.phone}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="email">Email:</label>
              <p>{startupInfo.email}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="address">Address:</label>
              <p>{startupInfo.address}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="country">Country:</label>
              <p>{startupInfo.country}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="state">State:</label>             
              <p>{startupInfo.state}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="city">City:</label>
              <p>{startupInfo.city}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="pincode">Pincode:</label>
              <p>{startupInfo.pincode}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="sector">Sector:</label>
              <p>{startupInfo.sector}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="stage">Stage:</label>
              <p>{startupInfo.stage}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="industry">Industry:</label>
              <p>{startupInfo.industry}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="website">Website:</label>
              <p>{startupInfo.website}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="linkedin">LinkedIn:</label>
              <a href={startupInfo.linkedin} target="_blank" rel="noopener noreferrer"><br></br>
                <LinkedIn />
              </a>
            </div>
          
            <div className="widgetSmDropdown">
              <label htmlFor="twitter">Twitter:</label>
              {/* <p>{startupInfo.twitter}</p> */}
                <a href={startupInfo.twitter} target="_blank" rel="noopener noreferrer"><br></br>
                <Twitter />
              </a>
            </div>
          
            <div className="widgetSmDropdown">
              <label htmlFor="instagram">Instagram:</label>
              {/* <p>{startupInfo.instagram}</p> */}
              <a href={startupInfo.instagram} target="_blank" rel="noopener noreferrer"><br></br>
                <Instagram />
              </a>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="youtube">Youtube:</label>
              {/* <p>{startupInfo.youtube}</p> */}
               <a href={startupInfo.youtube} target="_blank" rel="noopener noreferrer"><br></br>
                <YouTube />
              </a>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="cin_no">CIN No:</label> 
              <p>{startupInfo.cinNo}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="cin_date">CIN Date:</label>
              <p>{startupInfo.email}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="dpiit_no">DPIIT No:</label>
              <p>{startupInfo.dpiit_no}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="dpiit_date">DPIIT Date:</label>
              <p>{startupInfo.dpiit_date}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="PAN_no">PAN NO:</label>
              <p>{startupInfo.PAN_no}</p>
            </div>

            <div className="widgetSmDropdown">
              <label htmlFor="TAN_no">TAN NO:</label>
              <p>{startupInfo.TAN_no}</p>
            </div>
            <div className="widgetSmDropdown">
              <label htmlFor="product_demo_url">Product Demo url:</label>
              <p>{startupInfo.product_demo_url}</p>
            </div>
          
            {/* <div className="widgetSmDropdown">
              <label htmlFor="communicationAddress">Communication Address:</label>
              <p>{startupInfo.communicationAddress}</p>
            </div> */}
        //   </>
        )}
      </div>
    </div>
  );   
}



