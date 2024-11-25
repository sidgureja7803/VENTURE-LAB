

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";


const PaymentScheduleModal = ({ isOpen, onClose, paymentSchedule }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Payment Schedule</DialogTitle>
      <DialogContent dividers>
        {paymentSchedule.length > 0 ? (
          paymentSchedule.map((payment, index) => (
            <div key={index} className="payment-schedule-item">
              <div className="payment-detail">
                <span className="detail-label">Startup:</span>
                <span>{payment.startup}</span>
              </div>
              <div className="payment-detail">
                <span className="detail-label">Incubator:</span>
                <span>{payment.incubator}</span>
              </div>
              <div className="payment-detail">
                <span className="detail-label">Amount:</span>
                <span>{payment.amount}</span>
              </div>
              <div className="payment-detail">
                <span className="detail-label">Due Date:</span>
                <span>{payment.duedate}</span>
              </div>
              <div className="payment-detail">
                <span className="detail-label">Fee Type:</span>
                <span>{payment.feetype || "N/A"}</span>
              </div>
              <div className="payment-detail">
                <span className="detail-label">Payment Status:</span>
                <span>{payment.paymentstatus || "N/A"}</span>
              </div>
              <div className="payment-detail">
                <span className="detail-label">Frequency:</span>
                <span>{payment.frequency}</span>
              </div>
              {index < paymentSchedule.length - 1 && <hr className="divider" />}
            </div>
          ))
        ) : (
          <p>No payment schedule available.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentScheduleModal;
