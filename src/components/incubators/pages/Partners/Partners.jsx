





import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./Partners.css";

const IncubatorPartners = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Type: "",     
    Email: "",
    Phone: "",
    Address: "",
    Country: "",
    State: "",
    City: "",
    Pincode: "",
    Website: "",
    Linkedin: ""
  });
  const [partnersList, setPartnersList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get("https://incubator-crm.onrender.com/incubator/partners/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
        },
      });
      setPartnersList(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const openModal = () => {
    setFormData({
      Name: "",
      Type: "",
      Email: "",
      Phone: "",
      Address: "",
      Country: "",
      State: "",
      City: "",
      Pincode: "",
      Website: "",
      Linkedin: ""
    });
    setIsEditing(false);
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
      if (isEditing) {
        await axios.patch(`https://incubator-crm.onrender.com/incubator/partners/${formData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
      } else {
        const response = await axios.post("https://incubator-crm.onrender.com/incubator/partners/", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
        setPartnersList([...partnersList, response.data]);
      }
      closeModal();
      fetchPartners(); // Fetch updated list of partners
    } catch (error) {
      console.error("Error saving partner:", error);
    }
  };

  const handleEdit = (partner) => {
    setFormData(partner);
    setIsEditing(true);
    setModalIsOpen(true);
  };

  const handleDelete = async (partnerId) => {
    try {
      await axios.delete(`https://incubator-crm.onrender.com/incubator/partners/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
        },
      });
      setPartnersList(partnersList.filter(partner => partner.id !== partnerId));
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  return (
    <div className="broad-container">
      <h2 className="top-left-heading">Partners</h2>
      <button className="add-edit-top-right-button" onClick={openModal}>Add Partners</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={isEditing ? "Edit Partners Information" : "Add Partners Information"}
      >
        <h2>{isEditing ? "Edit Partners Information" : "Add Partners Information"}</h2>
        <form>
          {/* Render input fields for partner information */}
          {Object.entries(formData).map(([key, value]) => (
            key !== "id" && key !== "created_datetime" && key !== "updated_datetime" && key !== "Incubator" && (
              <div className="input-row" key={key}>
                <label>{key === "incubatorpartners_name" ? "Name" : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={key === "phone" ? "(+91) " : `Enter ${key}`}
                />
              </div>
            )
          ))}
        </form>
        <div className="modal-buttons">
          <button onClick={handleSave} className="modal-button">{isEditing ? "Update" : "Save"}</button>
          <button onClick={closeModal} className="modal-button cancel-button">Cancel</button>
        </div>
      </Modal>
      <div className="partners-list">
        {partnersList.map((partner, index) => (
          <div key={index} className="centre-card">
            {/* Render partner information */}
            {Object.entries(partner).map(([key, value]) => (
              key !== "id" && key !== "created_datetime" && key !== "updated_datetime" && key !== "Incubator" && (
                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
              )
            ))}
            <div className="centre-card buttons">
              <button onClick={() => handleEdit(partner)} className="card-button edit-button">Edit</button>
              <button onClick={() => handleDelete(partner.id)} className="card-button delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncubatorPartners;
