import React, { useState, useEffect } from "react";
import axios from "axios";
import { Delete, Edit, Email, Phone } from "@material-ui/icons";
// import WorkIcon from '@mui/icons-material/Work';
import "../startup.css";
import "./StartupPeople.css";
import dummyImage from "./dummyImage.png";
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'; 
import { AddCircle } from "@material-ui/icons";

const StartupPeople = () => {
  const [people, setPeople] = useState([]);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [personalPhn, setPersonalPhn] = useState("");
  const [companyPhn, setCompanyPhn] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [primaryRole, setPrimaryRole] = useState("");
  const [secondaryRole, setSecondaryRole] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [image, setImage] = useState(null);

  const [editIndex, setEditIndex] = useState(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isUserAdded, setIsUserAdded] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://incubator-crm.onrender.com/startup/people/", {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
        },
      });
      setPeople(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!first_name.trim()) {
      errors.first_name = "First name is required";
      isValid = false;
    }
    if (!last_name.trim()) {
      errors.last_name = "Last name is required";
      isValid = false;
    }
    if (!personalEmail.trim()) {
      errors.personalEmail = "Personal email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(personalEmail) || !personalEmail.endsWith('.com')) {
      errors.personalEmail = "Invalid email format";
      isValid = false;
    }

    if (!companyEmail.trim()) {
      errors.companyEmail = "Company email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(companyEmail) || !companyEmail.endsWith('.com')) {
      errors.companyEmail = "Invalid email format";
      isValid = false;
    }

    if (personalEmail === companyEmail) {
      errors.companyEmail = "Company email must be different from personal email";
      isValid = false;
    }

    if (personalPhn && !personalPhn.startsWith('+91')) {
      errors.personalPhn = "Phone number must start with +91";
      isValid = false;
    } else if (personalPhn && !/^\+91\d{10}$/.test(personalPhn)) {
      errors.personalPhn = "Invalid phone number format. Must be +91 followed by 10 digits";
      isValid = false;
    }

    if (companyPhn && !companyPhn.startsWith('+91')) {
      errors.companyPhn = "Phone number must start with +91";
      isValid = false;
    } else if (companyPhn && !/^\+91\d{10}$/.test(companyPhn)) {
      errors.companyPhn = "Invalid phone number format. Must be +91 followed by 10 digits";
      isValid = false;
    }

    setFormErrors(errors);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleAddPerson = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('personal_phone', personalPhn);
    formData.append('company_phone', companyPhn);
    formData.append('personal_email', personalEmail);
    formData.append('company_email', companyEmail);
    formData.append('primary_role', primaryRole);
    formData.append('secondary_role', secondaryRole);
    formData.append('linkedin', linkedin);
    formData.append('twitter', twitter);
    formData.append('instagram', instagram);
    if (image) {
      formData.append('image', image);
    }

    try {        
      const response = await axios.post("https://incubator-crm.onrender.com/startup/people/", formData, {
        headers: { 
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPeople([...people, response.data]);
      resetForm();
      setIsUserAdded(true);
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const handleEdit = (index) => {
    const person = people[index];
    setFirstName(person.first_name);
    setLastName(person.last_name);
    setPersonalPhn(person.personal_phone);
    setCompanyPhn(person.company_phone);
    setPersonalEmail(person.personal_email);
    setCompanyEmail(person.company_email);
    setPrimaryRole(person.primary_role);
    setSecondaryRole(person.secondary_role);
    setLinkedin(person.linkedin);
    setTwitter(person.twitter);
    setInstagram(person.instagram);
    setEditIndex(index);
    setIsAddPersonOpen(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('personal_phone', personalPhn);
    formData.append('company_phone', companyPhn);
    formData.append('personal_email', personalEmail);
    formData.append('company_email', companyEmail);
    formData.append('primary_role', primaryRole);
    formData.append('secondary_role', secondaryRole);
    formData.append('linkedin', linkedin);
    formData.append('twitter', twitter);
    formData.append('instagram', instagram);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.patch(`https://incubator-crm.onrender.com/startup/people/${people[editIndex].id}`, formData, {
        headers: { 
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  const handleDelete = async (index) => {
    const confirmation = window.confirm("Do you really want to delete this entry?");
    if (confirmation) {
      try {
        await axios.delete(`https://incubator-crm.onrender.com/startup/people/${people[index].id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
        const updatedPeople = people.filter((_, i) => i !== index);
        setPeople(updatedPeople);
      } catch (error) {
        console.error("Error deleting person:", error);
      }
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPersonalPhn("");
    setCompanyPhn("");
    setPersonalEmail("");
    setCompanyEmail("");
    setPrimaryRole("");
    setSecondaryRole("");  
    setLinkedin("");
    setTwitter("");
    setInstagram("");
    setIsAddPersonOpen(false);
    setEditIndex(null);
    setFormErrors({});
    setIsFormValid(true);
    setImage(null);
  };

  return (
    <div className="broad-container">
      <div className="header-container">
        <h2 className="top-left-heading">Startup People Information</h2>
        <button className="add-person-button" onClick={() => setIsAddPersonOpen(true)}>
          <AddCircle />
          {isUserAdded === true ? "Add More Users" : "Add Person"}
        </button>
      </div>
      {isAddPersonOpen && (
        <div className="modal-card">
          <div className="input-row">
            <input
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {formErrors.first_name && <span className="error-message">{formErrors.first_name}</span>}
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            {formErrors.last_name && <span className="error-message">{formErrors.last_name}</span>}
          </div>
          <div className="input-row">
            <input
              type="tel"
              placeholder="Personal Phone (+91)"
              value={personalPhn}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('+91') && value.length > 0) {
                  value = '+91' + value;
                }
                setPersonalPhn(value);
              }}
            />
            {formErrors.personalPhn && (
              <span className="error-message">{formErrors.personalPhn}</span>
            )}
          </div>
          <div className="input-row">
            <input
              type="tel"
              placeholder="Company Phone (+91)"
              value={companyPhn}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('+91') && value.length > 0) {
                  value = '+91' + value;
                }
                setCompanyPhn(value);
              }}
            />
            {formErrors.companyPhn && (
              <span className="error-message">{formErrors.companyPhn}</span>
            )}
          </div>
          <div className="input-row">
            <input
              type="email"
              placeholder="Personal Email"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
            />
            {formErrors.personalEmail && <span className="error-message">{formErrors.personalEmail}</span>}
          </div>
          <div className="input-row">
            <input
              type="email"
              placeholder="Company Email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
            {formErrors.companyEmail && <span className="error-message">{formErrors.companyEmail}</span>}
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Primary Role"
              value={primaryRole}
              onChange={(e) => setPrimaryRole(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Secondary Role"
              value={secondaryRole}
              onChange={(e) => setSecondaryRole(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="url"
              placeholder="LinkedIn"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="url"
              placeholder="Twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="url"
              placeholder="Instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="modal-buttons">
            {editIndex !== null ? (
              <button onClick={handleUpdate}>Save</button>
            ) : (
              <button onClick={handleAddPerson}>Add Person</button>
            )}
            <button onClick={resetForm}>Cancel</button>
          </div>
          {!isFormValid && <div className="error-message">Please fill all required fields correctly.</div>}
        </div>
      )}
      {people.map((person, index) => (
        <div key={index} className="person-card">
          <div className="person-details">
            <div className="person-field">
              <strong>Name: {person.first_name} {person.last_name}</strong> 
            </div>
            <div className="person-field">
              <Email /> <strong>Personal Email:</strong> {person.personal_email}
            </div>
            <div className="person-field">
              <Email /> <strong>Company Email:</strong> {person.company_email}
            </div>
            <div className="person-field">
              <Phone /> <strong>Personal Phone:</strong> {person.personal_phone}
            </div>
            <div className="person-field">
              <Phone /> <strong>Company Phone:</strong> {person.company_phone}
            </div>
            <div className="person-field">
             <strong>Primary Role:</strong> {person.primary_role}
            </div>    
            <div className="person-field">
           <strong>Secondary Role:</strong> {person.secondary_role}
            </div>
            <div className="person-field">
              <FaLinkedin/> <strong>LinkedIn:</strong> {person.linkedin}
            </div>
            <div className="person-field">
              <FaTwitter/> <strong>Twitter:</strong> {person.twitter}      
            </div>
            <div className="person-field">
              <FaInstagram/> <strong>Instagram:</strong> {person.instagram}
            </div>
          </div>
          <div className="person-actions">
            <img 
              src={person.image || dummyImage} 
              alt={`${person.first_name} ${person.last_name}`} 
              className="dummy-image" 
            />
            <button className="card-button edit-button-people" onClick={() => handleEdit(index)}>
              <Edit />
            </button>
            <button className="delete-button-people" onClick={() => handleDelete(index)}>
              <Delete />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartupPeople;