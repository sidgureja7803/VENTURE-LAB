

// V IMP AND WORKING CODE

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chart.css";

// Import icons for labels
import { Phone, Mail } from "@material-ui/icons";

export default function Chart() {
  const [partnerData, setPartnerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await axios.get(
          "https://incubator-crm.onrender.com/incubator/partners/" ,  {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        } 
        );
        setPartnerData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching partner data");
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, []);

  return (
    <div className="chart">
      <div className="chartTitle">Partners Associated</div>
      <div className="partnerCards">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          partnerData.map((partner, index) => (
            <div key={index} className="card">
              <div className="logo-container">
                {/* You can use a default partner logo image here */}
                {/* <img src={circularLogo} alt="Circular Logo" className="card-logo" /> */}
              </div>
              <div className="partnerInfo">
                <span className="partnerName">Name: {partner.incubatorpartners_name}</span>
                {/* <div className="partnerContact">
                  <Phone className="icon" />   
                  <span className="label">Phone no: </span>
                  <span className="value">{partner.phone}</span>
                </div> */}

                <span className="partnerContact"> <Phone className="icon" />Phone no: {partner.phone}</span>
                {/* <div className="partnerContact">
                  <Mail className="icon" />
                  <span className="label">Email: </span>
                  <span className="value">{partner.email}</span>
                </div> */}
                <span className="partnerContact"> <Mail className="icon" />Email: {partner.email} </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
