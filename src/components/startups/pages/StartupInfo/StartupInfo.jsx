import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./StartupInfo.css";

const StartupInfo = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    startup_name: "",
    sector: "",
    stage: "",
    industry: "",
    cin_no: "",
    cin_date: "",
    dpiit_no: "",
    dpiit_date: "",
    PAN_no: "",
    TAN_no: "",
    product_demo_url: "",
  });
  const [originalFormData, setOriginalFormData] = useState({});
  const [startupExists, setStartupExists] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      if (response.data.length > 0) {
        setStartupExists(true);
        setFormData(response.data[0]);
        setOriginalFormData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (!startupExists) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        startup_name: "",
        sector: "",
        stage: "",
        industry: "",
        cin_no: "",
        cin_date: "",
        dpiit_no: "",
        dpiit_date: "",
        PAN_no: "",
        TAN_no: "",
        product_demo_url: "",
      });
      setErrorMessages({});
    } else {
      setFormData(originalFormData);
      setErrorMessages({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessages((prev) => ({
      ...prev,
      [name]: "", // Clear error message for the field being edited
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate required fields
    const newErrorMessages = {};
    for (const key in formData) {
      if (!formData[key] && (key !== "product_demo_url")) {
        newErrorMessages[key] = "This field is required";
      }
    }

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return; // Stop the save process if there are errors
    }

    try {
      const apiData = {
        user: {
          phone: formData.phone,
          email: formData.email,
        },
        
        address: formData.address,
        startup_name: formData.startup_name,
        sector: formData.sector,
        stage: formData.stage,
        industry: formData.industry,
        cin_no: formData.cin_no,
        cin_date: formData.cin_date,
        dpiit_no: formData.dpiit_no,
        dpiit_date: formData.dpiit_date,
        PAN_no: formData.PAN_no,
        TAN_no: formData.TAN_no,
        product_demo_url: formData.product_demo_url,
      };

      if (startupExists) {
        await axios.patch(
          `https://incubator-crm.onrender.com/startup/list/${formData.id}/`,
          apiData,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("access_token")
              }`,
            },
          }
        );
      } else {
        const response = await axios.post(
          "https://incubator-crm.onrender.com/startup/list/",
          apiData,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("access_token")
              }`,
            },
          }
        );
        setStartupExists(true);
        setFormData({ ...formData, id: response.data.id });
      }
      setOriginalFormData(formData);
      closeModal();
      fetchData(); // Refresh the data after saving
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="broad-container">
      <div className="header-section">
        <h1 className="page-title">Startup Information</h1>
        <button className="edit-button" onClick={openModal}>
          Edit info
        </button>
      </div>

      {startupExists ? (
        <div className="info-section">
          <h2 className="section-title">Startup Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Industry</div>
              <div className="info-value">{formData.industry}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Sector</div>
              <div className="info-value">{formData.sector}</div>
            </div>
            <div className="info-item">
              <div className="info-label">CIN Date</div>
              <div className="info-value">{formData.cin_date}</div>
            </div>
            <div className="info-item">
              <div className="info-label">CIN No.</div>
              <div className="info-value">{formData.cin_no}</div>
            </div>
            <div className="info-item">
              <div className="info-label">DPIIT No.</div>
              <div className="info-value">{formData.dpiit_no}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Communication Address</div>
              <div className="info-value">{formData.address}</div>
            </div>
            <div className="info-item address-value">
              <div className="info-label">Registered Address</div>
              <div className="info-value">{formData.address}</div>
            </div>
          </div>
        </div>
      ) : (
        <button className="add-startup-button" onClick={openModal}>
          Add Startup Info
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <span className="close-icon" onClick={closeModal}>&times;</span>
          <h2>{startupExists ? "Edit Startup Information" : "Add Startup Information"}</h2>
          
          <form onSubmit={handleSave} className="startup-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="input-group">
                <div className="input-row">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                  {errorMessages.name && <span className="error-message">{errorMessages.name}</span>}
                </div>

                <div className="input-row">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                  {errorMessages.phone && <span className="error-message">{errorMessages.phone}</span>}
                </div>
              </div>

              <div className="input-group">
                <div className="input-row">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                  {errorMessages.email && <span className="error-message">{errorMessages.email}</span>}
                </div>

                <div className="input-row">
                  <label>Startup Name *</label>
                  <input
                    type="text"
                    name="startup_name"
                    value={formData.startup_name}
                    onChange={handleInputChange}
                    placeholder="Enter startup name"
                  />
                  {errorMessages.startup_name && <span className="error-message">{errorMessages.startup_name}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Company Details</h3>
              <div className="input-group">
                <div className="input-row">
                  <label>Sector *</label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    placeholder="Enter sector"
                  />
                  {errorMessages.sector && <span className="error-message">{errorMessages.sector}</span>}
                </div>

                <div className="input-row">
                  <label>Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="Enter industry"
                  />
                  {errorMessages.industry && <span className="error-message">{errorMessages.industry}</span>}
                </div>
              </div>

              <div className="input-row full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
                {errorMessages.address && <span className="error-message">{errorMessages.address}</span>}
              </div>
            </div>

            {/* Add the rest of your form fields in similar grouped sections */}
            
            <div className="modal-buttons">
              <button type="submit" className="save-button">
                {startupExists ? "Update" : "Save"}
              </button>
              <button type="button" onClick={closeModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default StartupInfo;