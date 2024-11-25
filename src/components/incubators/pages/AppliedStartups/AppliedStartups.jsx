import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../incubator.css";
import "./AppliedStartups.css";
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

const AppliedStartups = () => {
  const [programs, setPrograms] = useState([]);
  const [expandedProgram, setExpandedProgram] = useState({});
  const [programApplications, setProgramApplications] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [questionsModalIsOpen, setQuestionsModalIsOpen] = useState(false);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const [editStatusModalIsOpen, setEditStatusModalIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    // Fetch applications for each program
    programs.forEach(program => {
      fetchApplications(program.id);
    });
  }, [programs]);

  const toggleProgram = (programId) => {
    setExpandedProgram(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  const fetchPrograms = async () => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get('https://incubator-crm.onrender.com/incubator/programs/list/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Programs fetched:", response.data);
      setPrograms(response.data);
      
      const initialExpandedState = {};
      response.data.forEach(program => {
        initialExpandedState[program.id] = false;
      });
      setExpandedProgram(initialExpandedState);
      
      response.data.forEach(program => {
        fetchApplications(program.id);
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchProgramDetails = async (programId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get(`https://incubator-crm.onrender.com/incubator/programs/${programId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProgramDetails(response.data);
    } catch (error) {
      console.error('Error fetching program details:', error);
    }
  };

  const fetchApplications = async (programId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get(`https://incubator-crm.onrender.com/incubator/applications/program/${programId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`Applications for program ${programId}:`, response.data);
      setProgramApplications(prev => ({
        ...prev,
        [programId]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching applications for program ${programId}:`, error);
    }
  };

  const fetchQuestionsAndAnswers = async (programId, startupId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get(`https://incubator-crm.onrender.com/incubator/program/${programId}/questions/?startup_id=${startupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuestionsAndAnswers(response.data);
    } catch (error) {
      console.error('Error fetching questions and answers:', error);
      setError('Error fetching questions and answers');
    }
  };

  const handleProgramChange = (event) => {
    const programId = event.target.value;
    const program = programs.find(p => p.id === parseInt(programId));
    setSelectedProgram(program);
    if (program) {
      fetchProgramDetails(program.id);
      fetchApplications(program.id); // Fetch applications when a program is selected
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleViewDetails = () => {
    setModalIsOpen(true);
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    fetchQuestionsAndAnswers(selectedProgram.id, application.startup_id);
    setQuestionsModalIsOpen(true);
  };

  const handleQuestionsModalClose = () => {
    setQuestionsModalIsOpen(false);
  };

  const handleEditStatusModalOpen = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setRemarks(application.remarks || '');
    setEditStatusModalIsOpen(true);
  };

  const handleEditStatusModalClose = () => {
    setEditStatusModalIsOpen(false);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleSaveStatus = async () => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      await axios.patch(`https://incubator-crm.onrender.com/incubator/editapplicationstatus/${selectedApplication.id}/`, {
        status: newStatus,
        remarks: remarks
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Update the applications list with the new status and remarks
      setApplications(applications.map(app =>
        app.id === selectedApplication.id ? { ...app, status: newStatus, remarks: remarks } : app
      ));
      // Clear the new status and remarks after saving
      setNewStatus('');
      setRemarks('');
      handleEditStatusModalClose();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <div className="broad-container">
      <div className="header-container">
        <h2 className="top-left-heading">Startup Applications</h2>
        <div className="filter">
          <span>Filter</span>
        </div>
      </div>

      {programs.length === 0 ? (
        <div>No programs found</div>
      ) : (
        programs.map(program => (
          <div key={program.id} className="program-section">
            <div 
              className="program-header"
              onClick={() => toggleProgram(program.id)}
            >
              {expandedProgram[program.id] ? 
                <KeyboardArrowUp className="arrow-icon" /> : 
                <KeyboardArrowDown className="arrow-icon" />
              }
              <span>{program.name}</span>
            </div>

            {expandedProgram[program.id] && (
              <div className="applications-container">
                {programApplications[program.id]?.length === 0 ? (
                  <div className="no-applications">No applications for this program</div>
                ) : (
                  programApplications[program.id]?.map(application => (
                    <div key={application.id} className="startup-card">
                      <div className="startup-info">
                        <div className="info-row">
                          <span className="label">Startup Name:</span>
                          <span className="value">{application.startup_name}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Founders Name:</span>
                          <span className="value">{application.founder_name}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Address:</span>
                          <span className="value">{application.address}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">No. of Employees:</span>
                          <span className="value">{application.employee_count}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">No. of Patents:</span>
                          <span className="value">{application.patent_count}</span>
                        </div>
                        {application.incubator_names?.map((name, index) => (
                          <div key={index} className="info-row">
                            <span className="label">Incubator Name:</span>
                            <span className="value">{name}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="view-application-btn"
                        onClick={() => handleApplicationClick(application)}
                      >
                        View Application
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Applications for {selectedProgram ? selectedProgram.program_name : ''}</h3>
            <button onClick={handleModalClose}>&times;</button>
          </div>
          <div className="modal-body">
            {applications.map(application => (
              <div key={application.id} className="application" onClick={() => handleApplicationClick(application)}>
                <strong>Startup Name:</strong> {application.startup_name}
                <strong>Status:</strong> {application.status}
                <strong>Applied Date:</strong> {new Date(application.applied_datetime).toLocaleString()}
                <button className="edit-status-button" onClick={() => handleEditStatusModalOpen(application)}>Edit Status</button>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button onClick={handleModalClose}>Close</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={questionsModalIsOpen} onRequestClose={handleQuestionsModalClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Questions and Answers</h3>
            <button onClick={handleQuestionsModalClose}>&times;</button>
          </div>
          <div className="modal-body">
            {error && <p className="error-message">{error}</p>}
            {questionsAndAnswers.map(qa => (
              <div key={qa.id} className="question-answer">
                <p><strong>Question:</strong> {qa.question}</p>
                <p><strong>Answer:</strong> {qa.answer ? qa.answer : "No answer provided"}</p>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button onClick={handleQuestionsModalClose}>Close</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={editStatusModalIsOpen} onRequestClose={handleEditStatusModalClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Application Status</h3>
            <button onClick={handleEditStatusModalClose}>&times;</button>
          </div>
          <div className="modal-body">
            <label>
              Status:
              <select value={newStatus} onChange={handleStatusChange}>
                <option value="applied">Applied</option>
                <option value="in progress">In Progress</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </label>
            <label>
              Remarks:
              <textarea value={remarks} onChange={handleRemarksChange} />
            </label>
          </div>
          <div className="modal-footer">
            <button onClick={handleSaveStatus}>Save</button>
            <button onClick={handleEditStatusModalClose}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppliedStartups;
