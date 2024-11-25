import React from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>x</button>
    </div>
  );
};

export default Notification;
