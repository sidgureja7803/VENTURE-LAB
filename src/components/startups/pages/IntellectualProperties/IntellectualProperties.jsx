import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../startup.css";
import "./IntellectualProperties.css";

const IntellectualProperties = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    IP_type: "",
    IP_no: "",
    description: "",
    IP_status: "",
    IP_statusdate: "",
  });
  const [ipList, setIpList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/startup/intellectualproperties/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }
      );
      setIpList(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} is required`;
      }
    });

    if (formData.IP_no && !/^\d+$/.test(formData.IP_no)) {
      newErrors.IP_no = 'IP Number must contain only digits';
    }

    if (formData.IP_statusdate) {
      const selectedDate = new Date(formData.IP_statusdate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.IP_statusdate = 'Status date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://incubator-crm.onrender.com/startup/intellectualproperties/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }
      );
      setIpList([...ipList, response.data]);
      closeModal();
    } catch (error) {
      console.error("Error adding intellectual property:", error);
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(ipList[index]);
    setIsEditing(true);
    openModal();
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.patch(
        `https://incubator-crm.onrender.com/startup/intellectualproperties/${ipList[editIndex].id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }
      );
      const updatedIpList = [...ipList];
      updatedIpList[editIndex] = { ...updatedIpList[editIndex], ...formData };
      setIpList(updatedIpList);
      closeModal();
    } catch (error) {
      console.error("Error updating intellectual property:", error);
      setErrors({ submit: "Failed to update. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (index) => {
    const confirmation = window.confirm("Do you really want to delete this entry?");
    if (confirmation) {
      try {
        await axios.delete(
          `https://incubator-crm.onrender.com/startup/intellectualproperties/${ipList[index].id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            },
          }
        );
        const updatedIpList = ipList.filter((_, i) => i !== index);
        setIpList(updatedIpList);
      } catch (error) {
        console.error("Error deleting intellectual property:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      IP_type: "",
      IP_no: "",
      description: "",
      IP_status: "",
      IP_statusdate: "",
    });
    setEditIndex(null);
    setIsEditing(false);
  };

  const placeholders = {
    IP_type: "Enter IP Type",
    IP_no: "Enter IP Number",
    description: "Enter Description",
    IP_status: "Enter IP Status",
    IP_statusdate: "Enter IP Status Date",
  };

  return (
    <div className="page-container">
      <div className="header-section">
        <h1>Intellectual Properties Information</h1>
        <button className="add-info-btn" onClick={openModal}>
          Add Info
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={isEditing ? "Edit Intellectual Properties Information" : "Add Intellectual Properties Information"}
      >
        <h2>{isEditing ? "Edit Intellectual Properties Information" : "Add Intellectual Properties Information"}</h2>
        <form>
          {Object.entries(formData).map(([key, value]) => (
            <div className="input-row" key={key}>
              <label>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</label>
              {key === "IP_statusdate" ? (
                <input
                  type="date"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={placeholders[key]}
                  className={errors[key] ? 'error-input' : ''}
                  max={new Date().toISOString().split('T')[0]}
                />
              ) : key === "IP_no" ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={placeholders[key]}
                  className={errors[key] ? 'error-input' : ''}
                  pattern="\d*"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={placeholders[key]}
                  className={errors[key] ? 'error-input' : ''}
                />
              )}
              {errors[key] && <span className="error-message">{errors[key]}</span>}
            </div>
          ))}
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
        </form>
        <div className="modal-buttons">
          <button className="save-btn" onClick={isEditing ? handleUpdate : handleSave}>
            {isEditing ? "Save" : "Add"}
          </button>
          <button className="cancel-btn" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
      <div className="ip-cards-container">
        {ipList.map((ip, index) => (
          <div key={index} className="ip-card">
            <div className="ip-info">
              {/* <div className="ip-row">
                <span className="label">ID:</span>
                <span className="value">{ip.id}</span>
              </div> */}
              <div className="ip-row">
                <span className="label">IP type:</span>
                <span className="value">{ip.IP_type}</span>
              </div>
              <div className="ip-row">
                <span className="label">IP no:</span>
                <span className="value">{ip.IP_no}</span>
              </div>
              <div className="ip-row">
                <span className="label">Description:</span>
                <span className="value">{ip.description}</span>
              </div>
              <div className="ip-row">
                <span className="label">IP status:</span>
                <span className="value">{ip.IP_status}</span>
              </div>
              <div className="ip-row">
                <span className="label">IP status date:</span>
                <span className="value">{ip.IP_statusdate?.split('T')[0]}</span>
              </div>
              <div className="ip-row">
                <span className="label">Created:</span>
                <span className="value">{ip.created_datetime}</span>
              </div>
              <div className="ip-row">
                <span className="label">Updated:</span>
                <span className="value">{ip.updated_datetime}</span>
              </div>
              
            </div>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEdit(index)}>
                <svg className="edit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#6B7280"/>
                </svg>
              </button>
              <button className="delete-btn" onClick={() => handleDelete(index)}>
                <svg className="delete-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#6B7280"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntellectualProperties;
