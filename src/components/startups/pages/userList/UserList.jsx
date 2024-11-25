


import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const Award = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const API_URL = 'https://incubator-crm.onrender.com/startup/awards/';
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    try {
      const response = await fetch(PROXY_URL + API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      setError(error);
    }
  };

  const handleSave = async () => {
    try {
      let newData;
      if (editedData.id) {
        newData = data.map((item) => (item.id === editedData.id ? editedData : item));
        setData(newData); // Update frontend immediately

        const response = await fetch(`https://incubator-crm.onrender.com/startup/awards/${editedData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedData),
        });
        if (!response.ok) {
          throw new Error('Failed to update data');
        }
      } else {
        // Add a local version of edited data first
        newData = [...data, { ...editedData, id: data.length + 1 }];
        setData(newData); // Update frontend immediately
      }
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

  const handleAddRow = () => {
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

  const handleDelete = async (id) => {
    try {
      const newData = data.filter((item) => item.id !== id);
      setData(newData); // Update frontend immediately

      const response = await fetch(`https://incubator-crm.onrender.com/startup/awards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete data');
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="award-container">
      <Button onClick={handleAddRow} style={{ marginBottom: '10px' }}>Add Row</Button>
      {isModalOpen && (
        <div className="modalContainer">
          <div className="modalContent">
            <input type="text" name="name" value={editedData.name || ""} onChange={handleInputChange} placeholder="Name" />
            <input type="text" name="awarding_organisation" value={editedData.awarding_organisation || ""} onChange={handleInputChange} placeholder="Awarding Organisation" />
            <input type="text" name="award_date" value={editedData.award_date || ""} onChange={handleInputChange} placeholder="Award Date" />
            <input type="text" name="category" value={editedData.category || ""} onChange={handleInputChange} placeholder="Category" />
            <input type="text" name="desc" value={editedData.desc || ""} onChange={handleInputChange} placeholder="Description" />
            <input type="text" name="image" value={editedData.image || ""} onChange={handleInputChange} placeholder="Image" />
            <input type="text" name="startup_award" value={editedData.startup_award || ""} onChange={handleInputChange} placeholder="Startup Award" />
            <div className="buttonContainer">
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Awarding Organisation</th>
              <th>Award Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Image</th>
              <th>Startup Award</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.awarding_organisation}</td>
                <td>{row.award_date}</td>
                <td>{row.category}</td>
                <td>{row.desc}</td>
                <td>{row.image}</td>
                <td>{row.startup_award}</td>
                <td>
                  <Button onClick={() => handleEdit(row.id)}><EditIcon /></Button>
                  <Button onClick={() => handleDelete(row.id)}><DeleteIcon /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p>Error fetching data: {error.message}</p>}
    </div>
  );
};

export default Award;
