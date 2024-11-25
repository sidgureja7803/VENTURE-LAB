

import React from 'react';
import "./PopupMessage.css";

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className="popup-message">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupMessage;


