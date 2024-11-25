import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import "../incubator.css";
import "./IncubatorInfo.css";

const IncubatorInfo = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    incubator_name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });
  const [originalFormData, setOriginalFormData] = useState({});
  const [incubatorExists, setIncubatorExists] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/incubator/list/",
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
        setIncubatorExists(true);
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
    setFormData(originalFormData);
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      if (incubatorExists) {
        await axios.patch(
          `https://incubator-crm.onrender.com/incubator/list/${formData.id}`,
          formData,
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
          "https://incubator-crm.onrender.com/incubator/list/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("access_token")
              }`,
            },
          }
        );
        setIncubatorExists(true);
        setFormData(response.data);
        localStorage.setItem("incubator_info_filled", "true");
      }
      setOriginalFormData(formData);
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const fieldLabels = {
    incubator_name: "Incubator Name",
    address: "Address",
    country: "Country",
    state: "State",
    city: "City",
    pincode: "Pincode",
    website: "Website",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    instagram: "Instagram",
    youtube: "YouTube",
  };

  return (
    <div className="broad-container">
      <div className="header-container">
        <h2>Incubation Information</h2>
        {incubatorExists ? (
          <button className="edit-info-button" onClick={openModal}>
            Edit info
          </button>
        ) : (
          <button className="edit-info-button" onClick={openModal}>
            Add Incubator Info
          </button>
        )}
      </div>

      {incubatorExists && (
        <div className="info-card">
          <h3 className="incubator-title">{formData.incubator_name}</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Phone:</label>
              <span>{formData.phone}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{formData.email}</span>
            </div>
            <div className="info-item">
              <label>Address:</label>
              <span>{formData.address}</span>
            </div>
            <div className="info-item">
              <label>Website:</label>
              <a href={formData.website} target="_blank" rel="noopener noreferrer">
                {formData.website}
              </a>
            </div>
            <div className="info-item">
              <label>LinkedIn:</label>
              <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">
                {formData.linkedin}
              </a>
            </div>
            <div className="info-item">
              <label>Twitter:</label>
              <a href={formData.twitter} target="_blank" rel="noopener noreferrer">
                {formData.twitter}
              </a>
            </div>
            <div className="info-item">
              <label>Instagram:</label>
              <a href={formData.instagram} target="_blank" rel="noopener noreferrer">
                {formData.instagram}
              </a>
            </div>
            <div className="info-item">
              <label>YouTube:</label>
              <a href={formData.youtube} target="_blank" rel="noopener noreferrer">
                {formData.youtube}
              </a>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Incubator Information"
      >
        <h2>
          {incubatorExists
            ? "Edit Incubator Information"
            : "Add Incubator Information"}
        </h2>
        <form>
          {Object.entries(formData).map(([key, value]) => (
            ["incubator_name", "address", "country", "state", "city", "pincode", "website", "linkedin", "twitter", "instagram", "youtube"].includes(
              key
            ) && (
              <div className="input-row" key={key}>
                <label>{fieldLabels[key]}</label>
                <input
                  type={key === "phone" ? "tel" : "text"}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={`Enter ${fieldLabels[key]}`}
                />
              </div>
            )
          ))}
        </form>
        <div className="modal-buttons">
          <button onClick={handleSave} className="add-startup-button">
            {incubatorExists ? "Update" : "Save"}
          </button>
          <button onClick={closeModal} className="edit-startup-button">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default IncubatorInfo;
