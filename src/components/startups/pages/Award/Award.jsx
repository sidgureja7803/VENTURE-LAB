import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@material-ui/core"; 
import DeleteIcon from '@material-ui/icons/Delete'; 
import EditIcon from '@material-ui/icons/Edit';
import "../startup.css";
import "./Award.css"; // Import your CSS file for styling


const Award = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {         
    fetchData();    
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://incubator-crm.onrender.com/startup/awards/' ,  {
        headers: {
           Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          }, // Replace YOUR_TOKEN with your actual token
      }); 
      setData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('https://incubator-crm.onrender.com/startup/awards/', editedData , {
          headers: { Authorization:  `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          }, // Replace YOUR_TOKEN with your actual token
        } );
      setData([...data, response.data]);
      setIsModalOpen(false);
      setEditedData({});
    } catch (error) {
      setError(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditedData({});
  };

  const handleAddAward = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleEdit = (id) => {
    const selectedRow = data.find((row) => row.id === id);
    setEditedData(selectedRow);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(`https://incubator-crm.onrender.com/startup/awards/${editedData.id}`, editedData ,  {
          headers: { Authorization:  `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          }, // Replace YOUR_TOKEN with your actual token
        });
      const updatedData = data.map(item => (item.id === editedData.id ? response.data : item));
      setData(updatedData);
      setIsModalOpen(false);
      setEditedData({});        
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this award?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://incubator-crm.onrender.com/startup/awards/${id}` , {
          headers: { Authorization:  `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          }, // Replace YOUR_TOKEN with your actual token
        });
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    
    <div className="award">
      <div className="header">
        <h1 className="title">Awards</h1>
        <Button onClick={handleAddAward} className="addButton">Add Award</Button>
      </div>
      
      {isModalOpen && (
        <div className="modalContainer">
          <div className="modalContent">
            <div className="inputField">
              <input type="text" name="award_name" value={editedData.award_name || ""} onChange={handleInputChange} placeholder="Name" />
            </div>
            <input type="text" name="awarding_organisation" value={editedData.awarding_organisation || ""} onChange={handleInputChange} placeholder="Awarding Organisation" />
            <input type="text" name="award_date" value={editedData.award_date || ""} onChange={handleInputChange} placeholder="Award Date" />
            <input type="text" name="category" value={editedData.category || ""} onChange={handleInputChange} placeholder="Category" />
            <input type="text" name="description" value={editedData.description || ""} onChange={handleInputChange} placeholder="Description" />
            <div className="modalButtons">   
              {editedData.id ? (
                <Button onClick={handleUpdate} className="updateButton">Update</Button>
              ) : (
                <Button onClick={handleSave} className="saveButton">Save</Button>
              )}
              <Button onClick={handleCancel} className="cancelButton">Cancel</Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="table-container">
        {data.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Awarding Organisation</th>
                <th>Award Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.award_name}</td>
                  <td>{row.awarding_organisation}</td>
                  <td>{row.award_date}</td>
                  <td>{row.category}</td>
                  <td>{row.description}</td>
                  <td>
                    <Button onClick={() => handleEdit(row.id)} className="editButton"><EditIcon /></Button>
                    <Button onClick={() => handleDelete(row.id)} className="deleteButton"><DeleteIcon /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {error && <p>Error fetching data: {error.message}</p>}         
    </div>
  );
};   

export default Award;
