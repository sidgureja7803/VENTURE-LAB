import React, { useState } from "react";
import { Button, Modal } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import "./productList.css";

const ProductList = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    incubatorName: "",
    infraId: "",
    infraType: "",
    infraCapacity: "",
    incubatorId: ""
  });
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [selectedInfraId, setSelectedInfraId] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
    setFormData({
      incubatorName: "",
      infraId: "",
      infraType: "",
      infraCapacity: "",
      incubatorId: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedData = data.map((item, index) =>
        index === editIndex ? formData : item
      );
      setData(updatedData);
    } else {
      setData([...data, formData]);
    }
    handleClose();
  };

  const handleEdit = (index) => {
    setFormData(data[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Do you really want to delete that entry?");
    if (confirmDelete) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const handleEditInfoOpen = () => {
    setEditInfoOpen(!editInfoOpen);
  };

  const handleEditInfoChange = (e) => {
    const infraId = e.target.value;
    setSelectedInfraId(infraId);
    const index = data.findIndex(item => item.infraId === infraId);
    if (index !== -1) {
      handleEdit(index);
    }
    setEditInfoOpen(false);
  };

  return (
    <div className="page-container">
      

      <div className="content-container">
        <div className="title-container">
          <h2>Infrastructure Incubated</h2>
          <button className="add-info-button" onClick={handleOpen}>
            Add info
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Incubator Name</th>
                <th>Infrastructure Type</th>
                <th>Infrastructure Capacity</th>
                <th>Incubator ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.incubatorName}</td>
                  <td>{row.infraType}</td>
                  <td>{row.infraCapacity}</td>
                  <td>{row.incubatorId}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button" onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </button>
                      <button className="icon-button delete" onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <div className="modalContainer">
          <div className="modalContent">
            <input
              type="text"
              name="incubatorName"
              value={formData.incubatorName}
              onChange={handleChange}
              placeholder="Incubator Name"
            />
            <input
              type="text"
              name="infraId"
              value={formData.infraId}
              onChange={handleChange}
              placeholder="Infrastructure ID"
            />
            <input
              type="text"
              name="infraType"
              value={formData.infraType}
              onChange={handleChange}
              placeholder="Infrastructure Type"
            />
            <input
              type="text"
              name="infraCapacity"
              value={formData.infraCapacity}
              onChange={handleChange}
              placeholder="Infrastructure Capacity"
            />
            <input
              type="text"
              name="incubatorId"
              value={formData.incubatorId}
              onChange={handleChange}
              placeholder="Incubator ID"
            />
            <div className="modalButtons">
              <Button onClick={handleSave} className="saveButton">Save</Button>
              <Button onClick={handleClose} className="cancelButton">Cancel</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
