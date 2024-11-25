import React, { useState, useEffect } from "react";
import axios from "axios";
import { Delete, Edit, Email, Phone } from "@material-ui/icons";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import "../incubator.css";
import pic from "./pic.png";

const IncubatorPeople = () => {
  const [people, setPeople] = useState([]);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/incubator/people/",
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
      );
      setPeople(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleAddPerson = async () => {
    if (!first_name || !last_name || !email || !designation) {
      alert("Please fill all fields");
      return;
    }
    
    const newPerson = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      designation: designation,
    };

    try {
      const response = await axios.post(
        "https://incubator-crm.onrender.com/incubator/people/",
        newPerson,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
      );
      setPeople([...people, response.data]);
      resetForm();
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const handleEdit = (index) => {
    const person = people[index];
    setfirst_name(person.first_name);
    setlast_name(person.last_name);
    setEmail(person.email);
    setDesignation(person.designation);
    setEditIndex(index);
    setIsAddPersonOpen(true);
  };

  const handleUpdate = async () => {
    const updatedPerson = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      designation: designation,
    };

    try {
      await axios.patch(
        `https://incubator-crm.onrender.com/incubator/people/${
          people[editIndex].id
        }`,
        updatedPerson,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
      );
      const updatedPeople = [...people];
      updatedPeople[editIndex] = {
        ...updatedPerson,
        id: people[editIndex].id,
      };
      setPeople(updatedPeople);
      resetForm();
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  const handleDelete = async (index) => {
    const confirmation = window.confirm(
      "Do you really want to delete this entry?"
    );
    if (confirmation) {
      try {
        await axios.delete(
          `https://incubator-crm.onrender.com/incubator/people/${
            people[index].id
          }`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("access_token")
              }`,
            },
          }
        );
        const updatedPeople = people.filter((_, i) => i !== index);
        setPeople(updatedPeople);
      } catch (error) {
        console.error("Error deleting person:", error);
      }
    }
  };

  const resetForm = () => {
    setfirst_name("");
    setlast_name("");
    setEmail("");
    setDesignation("");
    setIsAddPersonOpen(false);
    setEditIndex(null);
  };

  return (
    <div className="broad-container">
      <div className="header-container">
        <h2 className="top-left-heading">Incubator People</h2>
        <button
          className="add-button"
          onClick={() => setIsAddPersonOpen(true)}
        >
          Add Person
        </button>
      </div>

      {/* Modal Form */}
      {isAddPersonOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editIndex !== null ? "Edit Person" : "Add New Person"}</h3>
              <button className="close-modal" onClick={resetForm}>&times;</button>
            </div>
            
            <form className="modal-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setfirst_name(e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => setlast_name(e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              
              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Enter designation"
                />
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="save-button"
                  onClick={editIndex !== null ? handleUpdate : handleAddPerson}
                >
                  {editIndex !== null ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-content">
            <i className="fas fa-check-circle"></i>
            <p>Person added successfully!</p>
          </div>
        </div>
      )}

      <div className="people-grid">
        {people.map((person, index) => (
          <div key={index} className="person-card">
            <div className="person-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{`${person.first_name} ${person.last_name}`}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Designation:</span>
                <span className="detail-value">{person.designation}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{person.email}</span>
              </div>
            </div>
            
            <div className="right-section">
              <div className="profile-image-container">
                <img src={pic} alt="Profile" className="profile-image" />
              </div>
              <div className="action-icons">
                <div className="icon-circle">
                  <Edit className="edit-icon" onClick={() => handleEdit(index)} />
                </div>
                <div className="icon-circle">
                  <Delete className="delete-icon" onClick={() => handleDelete(index)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncubatorPeople;
