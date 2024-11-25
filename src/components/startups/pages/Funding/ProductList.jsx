import React, { useState, useEffect } from "react";
import "../startup.css";
import "./productList.css";        
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from "axios";                                             

export default function ProductList() {
  const defaultIncubatorRow = { funding_program: "", funding_agency: "", amount: "" };
  const defaultExternalRow = { investor_name: "", amount: "", funding_program: "" };
                         
  const [incubatorData, setIncubatorData] = useState([]);               
  const [externalData, setExternalData] = useState([]);               
  const [editedRow, setEditedRow] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingTable, setEditingTable] = useState(""); // Track which table is being edited

  useEffect(() => {
    fetchData();                                      
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const incubatorResponse = await axios.get("https://incubator-crm.onrender.com/startup/incubatorfunding/", {
        headers: {
          Authorization: `Bearer ${token}`                        
        }
      });

      const externalResponse = await axios.get("https://incubator-crm.onrender.com/startup/externalfunding/", {
        headers: {
          Authorization: `Bearer ${token}`                        
        }
      });

      setIncubatorData(incubatorResponse.data);
      setExternalData(externalResponse.data);
    } catch (error) { 
      console.error("Error fetching data", error);
    }
  };                                             

  const handleAddRow = (table) => {
    setEditingTable(table);
    setEditedRow(table === "Incubator Funding" ? defaultIncubatorRow : defaultExternalRow);
    setShowEditModal(true);
  };

  const handleEdit = (row, table) => {
    setEditingTable(table);
    setEditedRow(row);
    setShowEditModal(true);
  };

  const handleDelete = (id, table) => {
    setEditingTable(table);
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const url = editingTable === "Incubator Funding"
        ? `https://incubator-crm.onrender.com/startup/incubatorfunding/${deleteId}`
        : `https://incubator-crm.onrender.com/startup/externalfunding/${deleteId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (editingTable === "Incubator Funding") {
        setIncubatorData(incubatorData.filter((item) => item.id !== deleteId));
      } else {
        setExternalData(externalData.filter((item) => item.id !== deleteId));
      }
      
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setShowDeleteConfirmation(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const method = editedRow.id ? "PATCH" : "POST";
      const url = editingTable === "Incubator Funding"
        ? `https://incubator-crm.onrender.com/startup/incubatorfunding/${editedRow.id || ""}`
        : `https://incubator-crm.onrender.com/startup/externalfunding/${editedRow.id || ""}`;

      await axios({
        url,
        method,
        data: editedRow,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <div className="broad-container">
      <h1 className="funding-title">Funding</h1>
      
      <div className="tableContainer">
        <h2 className="section-title">Incubator Funding</h2>
        <button className="addRowButton" onClick={() => handleAddRow("Incubator Funding")}>Add</button>
        <table className="productListTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Funding Program</th>
              <th>Funding Agency</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incubatorData.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.amount}</td>
                <td>{row.funding_program}</td>
                <td>{row.funding_agency}</td>
                <td>{row.created}</td>
                <td>
                  <EditIcon className="productListEdit" onClick={() => handleEdit(row, "Incubator Funding")} />
                  <DeleteIcon className="productListDelete" onClick={() => handleDelete(row.id, "Incubator Funding")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tableContainer">
        <h2 className="section-title">External Funding</h2>
        <button className="addRowButton" onClick={() => handleAddRow("External Funding")}>Add</button>
        <table className="productListTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Funding Program</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {externalData.map((row) => (
              <tr key={row.id}>
                <td>{row.investor_name}</td>
                <td>{row.amount}</td>
                <td>{row.funding_program}</td>
                <td>
                  <EditIcon className="productListEdit" onClick={() => handleEdit(row, "External Funding")} />
                  <DeleteIcon className="productListDelete" onClick={() => handleDelete(row.id, "External Funding")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing and adding funding */}
      {showEditModal && (
        <div className="modalContainer">
          <div className="modalContent">
            {/* Modal content based on the table being edited */}
            {editingTable === "Incubator Funding" ? (
              <>
                <input type="text" value={editedRow.funding_program || ""} onChange={(e) => setEditedRow({ ...editedRow, funding_program: e.target.value })} placeholder="Funding Program" className="inputField" />
                <input type="text" value={editedRow.funding_agency || ""} onChange={(e) => setEditedRow({ ...editedRow, funding_agency: e.target.value })} placeholder="Funding Agency" className="inputField" />
                <input type="number" value={editedRow.amount || ""} onChange={(e) => setEditedRow({ ...editedRow, amount: e.target.value })} placeholder="Amount" className="inputField" />
              </>
            ) : (
              <>
                <input type="text" value={editedRow.investor_name || ""} onChange={(e) => setEditedRow({ ...editedRow, investor_name: e.target.value })} placeholder="Investor Name" className="inputField" />
                <input type="number" value={editedRow.amount || ""} onChange={(e) => setEditedRow({ ...editedRow, amount: e.target.value })} placeholder="Amount" className="inputField" />
                <input type="text" value={editedRow.funding_program || ""} onChange={(e) => setEditedRow({ ...editedRow, funding_program: e.target.value })} placeholder="Funding Program" className="inputField" />
              </>
            )}
            <div className="modalButtons">
              <button className="saveButton" onClick={handleSave}>{editedRow.id ? "Update" : "Save"}</button>
              <button className="cancelButton" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirmation && (
        <div className="modalContainer">
          <div className="modalContent deleteConfirmation">
            <h2>Are you sure you want to delete this row?</h2>
            <div className="modalButtons">
              <button onClick={handleConfirmDelete}>Confirm</button>
              <button onClick={handleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  
