import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../incubator.css";

const InstituteAssociated = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    institute_name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    website: "",
  });
  const [institute, setInstitute] = useState(null);

  useEffect(() => {
    fetchInstitute();
  }, []);

  const fetchInstitute = async () => {
    try {
      const response = await axios.get("https://incubator-crm.onrender.com/incubator/institute/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
        },
      });
      if (response.data.length > 0) {
        setInstitute(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching institute:", error);
    }
  };

  const openModal = () => {
    if (institute) {
      setFormData({
        institute_name: institute.institute_name,
        address: institute.address,
        country: institute.country,
        state: institute.state,
        city: institute.city,
        pincode: institute.pincode,
        website: institute.website,
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      let response;
      if (institute) {
        response = await axios.patch(`https://incubator-crm.onrender.com/incubator/institute/${institute.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
      } else {
        response = await axios.post("https://incubator-crm.onrender.com/incubator/institute/", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
      }
      setInstitute(response.data); // Update local state with new data
      closeModal();
    } catch (error) {
      console.error("Error saving institute:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      try {
        await axios.delete(`https://incubator-crm.onrender.com/incubator/institute/${institute.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
        setInstitute(null);
        closeModal();
      } catch (error) {
        console.error("Error deleting institute:", error);
      }
    }
  };

  return (
    <div className="broad-container">
      <h2 className="top-left-heading">Institute Information</h2>
      <button className="add-edit-top-right-button" onClick={openModal}>
        {institute ? "Edit Institute" : "Add Institute"}
      </button>
      {institute && (
        <div className="institute-card">
          <div className="institute-details">
            <h3 className="institute-title">{institute.institute_name}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Address:</span>
                <span className="info-value">{institute.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Country:</span>
                <span className="info-value">{institute.country}</span>
              </div>
              <div className="info-item">
                <span className="info-label">State:</span>
                <span className="info-value">{institute.state}</span>
              </div>
              <div className="info-item">
                <span className="info-label">City:</span>
                <span className="info-value">{institute.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pincode:</span>
                <span className="info-value">{institute.pincode}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Website:</span>
                <span className="info-value">{institute.website}</span>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={openModal} className="btn-edit">
                <i className="fas fa-edit"></i> Edit
              </button>
              <button onClick={handleDelete} className="btn-delete">
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={institute ? "Edit Institute Information" : "Add Institute Information"}
      >
        <h2>{institute ? "Edit Institute Information" : "Add Institute Information"}</h2>
        <form>
          <div className="input-row">
            <label>Institute Name</label>
            <input
              type="text"
              name="institute_name"
              value={formData.institute_name}
              onChange={handleInputChange}
              placeholder="Enter Institute Name"
            />
          </div>
          <div className="input-row">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter Address"
            />
          </div>
          <div className="input-row">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter Country"
            />
          </div>
          <div className="input-row">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter State"
            />
          </div>
          <div className="input-row">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter City"
            />
          </div>
          <div className="input-row">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="Enter Pincode"
            />
          </div>
          <div className="input-row">
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Enter Website"
            />
          </div>
        </form>
        <div className="modal-buttons">
          <button onClick={handleSave} className="add-institute-button">{institute ? "Update" : "Save"}</button>
          <button onClick={closeModal} className="edit-institute-button">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default InstituteAssociated;
