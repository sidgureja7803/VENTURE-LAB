

import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./IncubatedStartups.css";
import PopupMessage from "./PopupMessage";
import FeesPopup from "./FeesPopup";
import EditChargePopup from "./EditChargePopup";

const IncubatedStartups = () => {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [charges, setCharges] = useState([]);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [editCharge, setEditCharge] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://incubator-crm.onrender.com/incubator/startupincubator/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      setStartups(response.data);
      setIsLoading(false);
      if (response.data.length === 0) {
        setShowPopup(true);
      }
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchSchedule = async (startup) => {
    try {
      const response = await axios.get(`https://incubator-crm.onrender.com/incubator/charges/${startup.startup_id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      setCharges(response.data);
      return response.data.length > 0;
    } catch (error) {
      console.error("Error fetching charges:", error.response ? error.response.data : error.message);
      return false;
    }
  };

  const handleManageFees = (startup) => {
    setSelectedStartup(startup);
    setShowSchedulePopup(true);
  };

  const handleViewSchedule = async (startup) => {
    setSelectedStartup(startup);
    const hasSchedule = await fetchSchedule(startup);
    if (!hasSchedule) {
      setShowPopup(true);
    }
  };

  const handleCreateSchedule = async (startupId, totalAmount, frequency) => {
    const payload = {
      startup: startupId,
      amount: totalAmount,
      frequency: frequency
    };

    try {
      const response = await axios.post(
        'https://incubator-crm.onrender.com/incubator/create-charges/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setShowSchedulePopup(false);
      await fetchSchedule(selectedStartup);
    } catch (error) {
      console.error("Error creating schedule:", error.response ? error.response.data : error.message);
    }
  };

  const handleEditCharge = async (updatedCharge) => {
    try {
      await axios.patch(
        `https://incubator-crm.onrender.com/incubator/updatecharge/${updatedCharge.id}/`,
        updatedCharge,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setEditCharge(null);
      setCharges((prevCharges) => prevCharges.map((charge) => (charge.id === updatedCharge.id ? updatedCharge : charge)));
    } catch (error) {
      console.error("Error updating charge:", error.response ? error.response.data : error.message);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowSchedulePopup(false);
    setEditCharge(null);
  };

  return (
    <div className="incubated-startups">
      <h2 style={{ color: "black", fontWeight: "bold" }}>Incubated Startups</h2>
      {isLoading && <p>Loading...</p>}
      {!isLoading && startups.length === 0 && showPopup && (
        <PopupMessage message="No startup incubated yet" onClose={handleClosePopup} />
      )}
      {!isLoading && startups.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Startup Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {startups.map((startup) => (
              <tr key={startup.id}>
                <td>{startup.startup}</td>
                <td>
                  <button
                    className="manage-fees-btn"
                    onClick={() => handleManageFees(startup)}
                  >
                    Manage Fees
                  </button>
                  <button
                    className="view-schedule-btn"
                    onClick={() => handleViewSchedule(startup)}
                  >
                    View Schedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showSchedulePopup && selectedStartup && (
        <FeesPopup
          startup={selectedStartup}
          onCreateSchedule={handleCreateSchedule}
          onClose={handleClosePopup}
        />
      )}
      {selectedStartup && charges.length > 0 && (
        <div>
          <h4>Schedule for {selectedStartup.startup}</h4>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Frequency</th>
                <th>Fee Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((charge, index) => (
                <tr key={index}>
                  <td>{charge.amount}</td>
                  <td>{charge.duedate}</td>
                  <td>{charge.paymentstatus}</td>
                  <td>{charge.frequency}</td>
                  <td>{charge.feetype}</td>
                  <td>
                    <button onClick={() => setEditCharge(charge)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editCharge && (
        <EditChargePopup
          charge={editCharge}
          onUpdateCharge={handleEditCharge}
          onClose={handleClosePopup}
        />
      )}
      {error && <p>Error fetching data: {error.message}</p>}
    </div>
  );
};

export default IncubatedStartups;
