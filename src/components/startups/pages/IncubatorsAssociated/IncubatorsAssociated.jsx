import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Snackbar,
} from "@material-ui/core";
import axios from "axios";
import "./IncubatorsAssociated.css";

const IncubatorsAssociated = () => {
  const [incubators, setIncubators] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    startdate: "",
    enddate: "",
    incubator: "",
  });
  const [selectedIncubatorIndex, setSelectedIncubatorIndex] = useState(null);
  const [allIncubators, setAllIncubators] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchIncubators();
    fetchAllIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/startup/startupincubator/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }
      );
      setIncubators(response.data);
    } catch (error) {
      console.error("Error fetching incubators:", error);
    }
  };

  const fetchAllIncubators = async () => {
    try {
      const response = await axios.get(
        "https://incubator-crm.onrender.com/startup/incubators/list",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }
      );
      setAllIncubators(response.data);
    } catch (error) {
      console.error("Error fetching all incubators:", error);
    }
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const selectedIncubator = incubators[index];
      setFormData({
        ...selectedIncubator,
        startdate: selectedIncubator.startdate ? selectedIncubator.startdate.slice(0, 10) : "",
        enddate: selectedIncubator.enddate ? selectedIncubator.enddate.slice(0, 10) : "",
        incubator: selectedIncubator.incubator,
      });
      setSelectedIncubatorIndex(index);
    } else {
      setFormData({
        startdate: "",
        enddate: "",
        incubator: "",
      });
      setSelectedIncubatorIndex(null);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!formData.startdate || !formData.enddate) {
      alert("Please fill in the start date and end date.");
      return;
    }

    try {
      if (selectedIncubatorIndex !== null) {
        await axios.patch(
          `https://incubator-crm.onrender.com/startup/startupincubator/${formData.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://incubator-crm.onrender.com/startup/startupincubator/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            },
          }
        );
      }
      closeModal();
      fetchIncubators();
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage("Failed to save data. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (index) => {
    const incubatorId = incubators[index].id; // Get the ID of the incubator to delete
    const confirmDelete = window.confirm("Are you sure you want to delete this incubator?");
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://incubator-crm.onrender.com/startup/startupincubator/${incubatorId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            },
          }
        );
        // Update the state to remove the deleted incubator
        setIncubators((prevIncubators) => prevIncubators.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting incubator:", error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="new-container">
      {/* <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="top-new-heading" style={{ margin: 0 }}>
          Incubators Associated Information
        </h1>
        <Button
          variant="contained"
          onClick={() => openModal()}
          className="add-edit-top-right-button"
          style={{
            backgroundColor: '#A500B5', // Adjust color to match the image
            color: '#FFFFFF', // Text color
            borderRadius: '20px', // Rounded corners
            padding: '10px 20px', // Padding for button
            marginLeft: '20px', // Space between heading and button
          }}
        >
          Add Incubator 
        </Button>
      </div> */}

<div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <h1 className="top-new-heading" style={{ margin: 0 }}>
    Incubators Associated Information
  </h1>
  <Button
    variant="contained"
    onClick={() => openModal()}
    className="add-edit-top-right-button"
    style={{
      backgroundColor: '#A500B5', // Adjust color to match the image
      color: '#FFFFFF', // Text color
      borderRadius: '20px', // Rounded corners
      padding: '10px 20px', // Padding for button
      marginLeft: '10px', // Reduced space between heading and button
    }}
  >
    Add Incubator 
  </Button>
</div>

      <div className="incubators-list">
        {incubators.map((incubator, index) => (
          <div key={index} className="centre-new-card">
            <div className="incubator-image">
              <img src={incubator.logo || "default-logo.png"} alt={incubator.incubator_name} />
            </div>
            <div className="details-container">
              <p className="incubator-name">{incubator.incubator_name}</p>
              <p>Start Date: {incubator.startdate}</p>
              <p>End Date: {incubator.enddate}</p>
            </div>
            <div className="options-container">
              <button className="card-new-button edit-new-button" onClick={() => openModal(index)}>
                Edit
              </button>
              <button className="card-new-button delete-new-button" onClick={() => handleDelete(index)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={modalIsOpen} onClose={closeModal}>
        <DialogTitle>{selectedIncubatorIndex !== null ? "Edit Incubation" : "Add Incubation"}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              margin="normal"
              label="Start Date"
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              label="End Date"
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Incubator</InputLabel>
              <Select
                name="incubator"
                value={formData.incubator}
                onChange={handleInputChange}
                required
              >
                {allIncubators.map((incubator) => (
                  <MenuItem key={incubator.id} value={incubator.id}>
                    {incubator.incubator_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </div>
  );
};

export default IncubatorsAssociated;
