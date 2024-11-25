import React, { useState, useEffect } from 'react';
import "../components/Common.css";
import './Signup.css'; // Import the CSS file
import axios from 'axios';
import A_Startup from './A_Startup.png';
import An_Incubator from './An_Incubator.png';
import VentureSignup from './venture_signup.png'; // Import the image

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    role: 'incubator', // Initialize role state to 'incubator'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let countdown;
    if (isOtpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isOtpSent, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://incubator-crm.onrender.com/api/v1/auth/register/', formData);
      setLoading(false);
      if (response.status === 201) {
        setIsOtpSent(true);
        setTimer(300); // Reset timer to 5 minutes
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setLoading(false);
      // Handle error accordingly
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://incubator-crm.onrender.com/api/v1/auth/verify-email/', {
        email: formData.email,
        otp_code: otpCode
      });
      if (response.status === 200) {
        window.location.href = '/login';
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      // Handle error accordingly
    }
  };

  const handleRoleSelection = (role) => {
    setFormData({ ...formData, role });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="main-heading">Venture Lab, TIET</div>
        <div className="sub-heading">Register here as:</div>
        <div className="role-selection">
          <div
            className={`role-option ${formData.role === 'startup' ? 'selected' : ''}`}
            onClick={() => handleRoleSelection('startup')}
          >
            <img src={A_Startup} alt="A Startup" />
            <p>A Startup</p>
          </div>
          <div
            className={`role-option ${formData.role === 'incubator' ? 'selected' : ''}`}
            onClick={() => handleRoleSelection('incubator')}
          >
            <img src={An_Incubator} alt="An Incubator" />
            <p>An Incubator</p>
          </div>
        </div>
        <div className="form-and-image-container">
          {isOtpSent ? (
            <form onSubmit={handleOtpSubmit} className="otp-form">
              <div className="form-input">
                <label>Enter OTP:</label>
                <input
                  type="text"
                  name="otp_code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ width: '100%' }} // Equal length for all text fields
                />
                {errors.otp && <span className="error">{errors.otp}</span>}
              </div>
              <div className="timer">
                {`Time remaining: ${formatTime(timer)}`}
              </div>
              <button type="submit" className="submit-button" disabled={loading || timer === 0}>
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-input">
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Type here"
                  style={{ width: '100%' }} // Equal length for all text fields
                />
                {errors.first_name && <span className="error">{errors.first_name}</span>}
              </div>
              <div className="form-input">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Type here"
                  style={{ width: '100%' }} // Equal length for all text fields
                />
                {errors.last_name && <span className="error">{errors.last_name}</span>}
              </div>
              <div className="form-input">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Type here"
                  style={{ width: '100%' }} // Equal length for all text fields
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="form-input">
                <label>Create Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  style={{ width: '100%' }} // Equal length for all text fields
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              <div className="form-input">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  style={{ width: '100%' }} // Equal length for all text fields
                />
                {errors.password2 && <span className="error">{errors.password2}</span>}
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          )}
          <img src={VentureSignup} alt="Venture Signup" className="venture-image" />
        </div>
        <p className="login-link">
          Already Registered? <span onClick={() => window.location.href = '/login'}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

