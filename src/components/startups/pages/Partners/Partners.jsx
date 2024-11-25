import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../startup.css";
import "./Partners.css";

const Partners = () => {
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [incubators, setIncubators] = useState([]);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [startupId, setStartupId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitPopupVisible, setIsSubmitPopupVisible] = useState(false);
  const [showPrograms, setShowPrograms] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let storedStartupId = localStorage.getItem("startup_id");
    if (!storedStartupId) {
      storedStartupId = generateStartupId();
      localStorage.setItem("startup_id", storedStartupId);
    }
    setStartupId(storedStartupId);

    fetchIncubators();
  }, []);

  const generateStartupId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const fetchIncubators = () => {
    axios
      .get("https://incubator-crm.onrender.com/startup/incubators/list", {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
        },
      })
      .then((response) => {
        setIncubators(response.data);
      })
      .catch((error) => {
        console.error("Error fetching incubators:", error);
      });
  };

  const fetchPrograms = (incubatorId) => {
    axios
      .get(`https://incubator-crm.onrender.com/startup/incubators/${incubatorId}/programs`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
        },
      })
      .then((response) => {
        const updatedIncubator = incubators.find(inc => inc.id === incubatorId);
        if (updatedIncubator) {
          updatedIncubator.programs = response.data;
          setSelectedIncubator(updatedIncubator);
        }
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
      });
  };

  const handleIncubatorSelect = (e) => {
    const selectedIncubatorName = e.target.value;
    const selected = incubators.find(
      (incubator) => incubator.incubator_name === selectedIncubatorName
    );
    setSelectedIncubator(selected);

    if (selected) {
      fetchPrograms(selected.id);
    }
  };

  const togglePrograms = (incubatorId) => {
    setShowPrograms((prev) => ({
      ...prev,
      [incubatorId]: !prev[incubatorId],
    }));
  };

  const openModal = (program) => {
    setCurrentProgram(program);
    setModalIsOpen(true);
    setIsEditMode(!program.submitted);
    fetchQuestionsAndAnswers(program.id);
  };

  const fetchQuestionsAndAnswers = (programId) => {
    axios
      .get(
        `https://incubator-crm.onrender.com/startup/incubators/program/${programId}/questions-answers/`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
      )
      .then((response) => {
        if (response.data.length > 0) {
          const answersData = {};
          const questionsData = response.data.map((item) => {
            answersData[item.question_id] = item.answer;
            return {
              id: item.question_id,
              question_name: item.question,
            };
          });
          setFormData(answersData);
          setQuestions(questionsData);
        } else {
          fetchQuestions(programId);
        }
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  };

  const fetchQuestions = (programId) => {
    axios
      .get(
        `https://incubator-crm.onrender.com/startup/incubators/program/${programId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
      )
      .then((response) => {
        setQuestions(response.data);
        const initialFormData = {};
        response.data.forEach((question) => {
          initialFormData[question.id] = "";
        });
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({});
    setQuestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    submitAnswers("save").finally(() => {
      setIsLoading(false);
    });
  };

  const handleSubmit = () => {
    setIsSubmitPopupVisible(true);
  };

  const confirmSubmit = () => {
    submitAnswers("submit");
    setIsSubmitPopupVisible(false);
  };

  const submitAnswers = (action) => {
    const transformedPayload = {
      action: action,
      answers: Object.entries(formData)
        .filter(([questionId, answer]) => questionId && answer !== "")
        .map(([questionId, answer]) => ({
          program_question_id: parseInt(questionId, 10),
          answer: answer || "",
        })),
    };

    return axios.post(
      "https://incubator-crm.onrender.com/startup/incubators/program-questions/submit-answers/",
      transformedPayload,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
        },
      }
    )
    .then((response) => {
      if (action === "save") {
        setIsSuccessPopupVisible(true);
        setTimeout(() => setIsSuccessPopupVisible(false), 3000);
        const updatedPrograms = selectedIncubator.programs.map((program) =>
          program.id === currentProgram.id
            ? { ...program, submitted: false }
            : program
        );
        setSelectedIncubator({
          ...selectedIncubator,
          programs: updatedPrograms,
        });
      } else {
        const updatedPrograms = selectedIncubator.programs.map((program) =>
          program.id === currentProgram.id
            ? { ...program, submitted: true }
            : program
        );
        setSelectedIncubator({
          ...selectedIncubator,
          programs: updatedPrograms,
        });
      }
      closeModal();
    })
    .catch((error) => {
      console.error("Error saving form:", error.response?.data || error);
      alert(`Error: ${error.response?.data?.error || "An error occurred"}`);
    });
  };

  return (
    <div className="broad-container">
      <div className="header">
        <h2 className="page-title">Incubator Programs</h2>
        <select
          className="incubator-select"
          defaultValue=""
          onChange={handleIncubatorSelect}
        >
          <option value="">Select Incubator</option>
          {incubators.map((incubator) => (
            <option key={incubator.id} value={incubator.incubator_name}>
              {incubator.incubator_name}
            </option>
          ))}
        </select>
      </div>

      <div className="programs-container">
        {selectedIncubator ? (
          <div className="incubator-section">
            <div className="incubator-header" onClick={() => togglePrograms(selectedIncubator.id)}>
              <div className="incubator-name">{selectedIncubator.incubator_name}</div>
              <span className="toggle-icon">{showPrograms[selectedIncubator.id] ? '-' : '+'}</span>
            </div>
            
            {showPrograms[selectedIncubator.id] && (
              <div className="programs-list">
                {selectedIncubator.programs?.map((program) => (
                  <div key={program.id} className="program-row">
                    <div className="program-info">
                      <div className="program-name">{program.program_name}</div>
                      <div className="program-date">Last Date: {program.last_date}</div>
                    </div>
                    <div className="program-actions">
                      <button className="details-btn">Details</button>
                      <button 
                        className={`apply-btn ${program.submitted ? 'submitted' : ''}`}
                        onClick={() => openModal(program)}
                        disabled={program.submitted}
                      >
                        {program.submitted ? 'Submitted' : 'Apply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-selection">Please select an incubator to view its programs</div>
        )}
      </div>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Application Modal"
        className="application-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <span className="close-icon" onClick={closeModal}>&times;</span>
          <h2>{currentProgram?.program_name}</h2>
          
          <form className="application-form">
            {questions.map((question) => (
              <div key={question.id} className="form-group">
                <label>{question.question_name}</label>
                <input
                  type="text"
                  name={question.id.toString()}
                  value={formData[question.id] || ""}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  placeholder="Type here"
                />
              </div>
            ))}
            <div className="form-actions">
              <button 
                className="save-btn" 
                onClick={handleSave} 
                disabled={!isEditMode || isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              {!currentProgram?.submitted && (
                <button 
                  type="button" 
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>

      {isSuccessPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content success">
            <div className="popup-icon">✓</div>
            <p>Form saved successfully!</p>
          </div>
        </div>
      )}

      {isSubmitPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content warning">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit? You won't be able to edit the details after submission.</p>
            <div className="popup-actions">
              <button onClick={confirmSubmit} className="confirm-btn">Yes, Submit</button>
              <button onClick={() => setIsSubmitPopupVisible(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Partners;
