

import React, { useState, useEffect } from "react";
import "./chart.css";
import { Business, AccountBalance, MonetizationOn, BusinessCenter, Person } from "@material-ui/icons"; // Import appropriate icons

export default function Chart() {
  const [incubatorFundingData, setIncubatorFundingData] = useState([]);
  const [externalFundingData, setExternalFundingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncubatorFundingData = async () => {
      try {
        const response = await fetch("https://incubator-crm.onrender.com/startup/incubatorfunding/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch incubator funding data");
        }
        const data = await response.json();
        setIncubatorFundingData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchExternalFundingData = async () => {
      try {
        const response = await fetch("https://incubator-crm.onrender.com/startup/externalfunding/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch external funding data");
        }
        const data = await response.json();
        setExternalFundingData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    Promise.all([fetchIncubatorFundingData(), fetchExternalFundingData()])
      .then(() => setLoading(false))
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="chart">
      <div className="chartTitle">Incubator Funding</div>
      <div className="selectedCenters">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          incubatorFundingData.map((funding, index) => (
            <div key={index} className="card">
              <div className="logo-container ">
                <Business className="card-logo" />
              </div>
              <span><MonetizationOn /> Amount: {funding.amount}</span>
              <span><BusinessCenter /> Program: {funding.funding_program}</span>
              <span><Business /> Agency: {funding.funding_agency}</span>
            </div>
          ))
        )}
      </div>
      <div className="fundingSection">
        <h2 className="fundingTitle">External Funding</h2>
        <div className="defaultCards">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            externalFundingData.map((funding, index) => (
              <div key={index} className="card defaultCard">
                <div className="logo-container">
                  <AccountBalance className="card-logo" />
                </div>
                
                <span><Person /> Investor Name: {funding.investor_name}</span>
                <span><MonetizationOn /> Amount: {funding.amount}</span>
                <span><BusinessCenter /> Program: {funding.funding_program}</span>
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
