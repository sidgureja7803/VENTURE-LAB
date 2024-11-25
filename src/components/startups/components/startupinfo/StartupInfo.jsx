import React, { useState, useEffect } from "react";
import axios from "axios";
import "./startupinfo.css";

export default function StartupInfo() {
  const [startupData, setStartupData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    startup_name: "",
    cin_date: "",
    registration_address: "",
    sector: "",
    cin_no: "",
    dpiit_no: "",
    communication_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchStartupData = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/startup/list/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.data && response.data.length > 0) {
        setStartupData(response.data[0]);
        setFormData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching startup data:", error);
      setError("Failed to fetch startup data");
    }
  };

  useEffect(() => {
    fetchStartupData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      let response;
      if (startupData) {
        response = await axios.put(
          `https://incubator-crm.onrender.com/startup/update/${startupData.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          "https://incubator-crm.onrender.com/startup/create/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Startup information saved successfully!");
        await fetchStartupData();
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save startup information");
    } finally {
      setLoading(false);
    }
  };

  const renderReadOnlyView = () => {
    if (!startupData) return null;
    
    return (
      <div className="startup-info-display">
        <div className="info-row">
          <h3>Startup Name:</h3>
          <p>{startupData.startup_name}</p>
        </div>
        <div className="info-row">
          <h3>CIN Date:</h3>
          <p>{startupData.cin_date}</p>
        </div>
        <div className="info-row">
          <h3>Sector:</h3>
          <p>{startupData.sector}</p>
        </div>
        <div className="info-row">
          <h3>CIN No:</h3>
          <p>{startupData.cin_no}</p>
        </div>
        <div className="info-row">
          <h3>DPIIT No:</h3>
          <p>{startupData.dpiit_no}</p>
        </div>
        <div className="info-row">
          <h3>Address:</h3>
          <p>{startupData.registration_address}</p>
        </div>
        
        <button 
          className="edit-button" 
          onClick={() => setIsEditing(true)}
        >
          Edit Information
        </button>
      </div>
    );
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <h2>Startup Information</h2>
        {isEditing && (
          <button className="close-button" onClick={() => setIsEditing(false)}>×</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Startup Name</label>
              <input
                type="text"
                name="startup_name"
                value={formData.startup_name}
                onChange={handleInputChange}
                placeholder="Enter startup name"
                required
              />
            </div>

            <div className="form-group">
              <label>CIN Date</label>
              <input
                type="date"
                name="cin_date"
                value={formData.cin_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Sector</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                placeholder="Enter sector"
                required
              />
            </div>

            <div className="form-group">
              <label>CIN No.</label>
              <input
                type="text"
                name="cin_no"
                value={formData.cin_no}
                onChange={handleInputChange}
                placeholder="Enter CIN number"
                required
              />
            </div>

            <div className="form-group">
              <label>DPIIT No.</label>
              <input
                type="text"
                name="dpiit_no"
                value={formData.dpiit_no}
                onChange={handleInputChange}
                placeholder="Enter DPIIT number"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Registration Address</label>
              <textarea
                name="registration_address"
                value={formData.registration_address}
                onChange={handleInputChange}
                placeholder="Enter registration address"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Communication Address</label>
              <textarea
                name="communication_address"
                value={formData.communication_address}
                onChange={handleInputChange}
                placeholder="Enter communication address"
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        renderReadOnlyView()
      )}
    </div>
  );
} 