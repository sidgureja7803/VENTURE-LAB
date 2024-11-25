import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file
import VentureImage from './Venture1.png'; // Import the Venture image

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState('email@example.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoPopupMessage, setInfoPopupMessage] = useState('');
  const [infoFilled, setInfoFilled] = useState(true); // State to track if the info is filled
  const [showToast, setShowToast] = useState(false); // State to show/hide toast
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('remembered_email');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    // Start token refreshing interval
    const tokenRefreshInterval = setInterval(refreshTokens, 10 * 60 * 1000); // Refresh every 10 minutes
    return () => clearInterval(tokenRefreshInterval); // Clear interval on component unmount
  }, []);

  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await axios.post(
          'https://incubator-crm.onrender.com/api/v1/auth/refresh-token/',
          { refresh_token: refreshToken }
        );
        if (response.status === 200) {
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          sessionStorage.setItem('access_token', access_token);
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      if (!email.trim() || !password.trim()) {
        showToastMessage('Please enter both email and password', 'error');
        return;
      }

      const response = await axios.post(
        'https://incubator-crm.onrender.com/api/v1/auth/login/',
        { email, password }
      );

      if (response.status === 200) {
        const { role, access_token, refresh_token, startup_id } = response.data;
        
        // Store tokens
        if (rememberMe) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('startup_id', startup_id);
        } else {
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('refresh_token', refresh_token);     
          sessionStorage.setItem('startup_id', startup_id);
        }

        setUserRole(role);
        setShowSuccessPopup(true); // Show success popup

        // Delay navigation to show the popup
        setTimeout(() => {
          const hasFilledInfo = localStorage.getItem(`${role}_info_filled`) === 'true';
          if (role === 'incubator') {
            navigate(hasFilledInfo ? '/incubator' : '/incubator/incubator-info');
          } else if (role === 'startup') {
            navigate(hasFilledInfo ? '/startup' : '/startup/startup-info');
          }
        }, 2000); // Wait for 2 seconds before navigating
      }
    } catch (error) {
      showToastMessage('Invalid credentials. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage({ text: message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remembered_email');
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setShowErrorPopup(true);
      return;
    }
    try {
      const response = await axios.post(
        'https://incubator-crm.onrender.com/api/v1/auth/reset-password/',
        { email, newPassword }
      );
      if (response.status === 200) {
        setShowForgotPasswordPopup(false);
        setShowSuccessPopup(true);
        setErrorMessage('Password reset successfully!');
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setShowErrorPopup(true);
      setErrorMessage('Password reset failed. Please try again later.');
    }
  };

  const handleSignupNavigation = () => {
    navigate('/');
  };

  return (                                            
    <div className="login-container">                                                                        
      <div className="left-container">
        <div className="login-header">
          <h1 className="login-title">
            <span>Venture Lab</span>
          </h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
       
        <form className="login-form">
          <div className="form-input">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email'
            />
          </div>
          <div className="form-input">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
          </div>
          <div className="remember-me">
            <label className="switch">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span className="slider round"></span>
            </label>
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="button" onClick={handleLogin} className="login-button">
            SIGN IN
          </button>
          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>
          <p className="signup-link" onClick={handleSignupNavigation}>
            New user? Please register
          </p>
        </form>
      </div>
      <div className="right-container">
        <img src={VentureImage} alt="Venture Lab TIET" className="venture-logo" />
      </div>

      {showErrorPopup && (
        <div className="error-popup">
          <button className="close-button" onClick={() => setShowErrorPopup(false)}>×</button>
          <p>{errorMessage}</p>
          <button onClick={() => setShowErrorPopup(false)}>Close</button>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="success-popup">
            <div className="success-icon">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="25" fill="#4CAF50"/>
                <path d="M38 15L22 33L12 25" stroke="white" strokeWidth="3" fill="none"/>
              </svg>
            </div>
            <h2>Success!</h2>
            <p>Logged in successfully</p>
          </div>
        </div>
      )}

      {showForgotPasswordPopup && (
        <div className="forgot-password-popup">
          <button className="close-button" onClick={() => setShowForgotPasswordPopup(false)}>×</button>
          <h2>Create new password for your existing account</h2>
          <div className="form-input">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder='New Password'
            />
          </div>
          <div className="form-input">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirm Password'
            />
          </div>
          <button type="button" onClick={handleForgotPasswordSubmit} className="login-button">
            Submit
          </button>
        </div>
      )}

      {showInfoPopup && (
        <div className="info-popup">
          <p>{infoPopupMessage}</p>
          <button onClick={() => setShowInfoPopup(false)}>Close</button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-container ${toastMessage.type}`}>
          <span className="toast-icon">
            {toastMessage.type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="toast-message">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );           
};

export default Login;


