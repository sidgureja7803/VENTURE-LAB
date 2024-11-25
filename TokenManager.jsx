import React, { useEffect } from 'react';
import axios from 'axios';

const TokenManager = () => {
  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await axios.post(
          'https://incubator-crm.onrender.com/api/v1/auth/refresh-token/',
          { refresh: refreshToken }
        );
        if (response.status === 200) {
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          sessionStorage.setItem('access_token', access);
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  useEffect(() => {
    const tokenRefreshInterval = setInterval(refreshTokens, 10 * 60 * 1000); // Refresh every 10 minutes
    return () => clearInterval(tokenRefreshInterval);
  }, []);

  return null; // This component doesn't render anything
};

export default TokenManager;
