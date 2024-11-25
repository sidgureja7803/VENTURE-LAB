import axios from 'axios';

const api = axios.create({
  baseURL: 'https://incubator-crm.onrender.com',
});
                   
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,     
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('https://incubator-crm.onrender.com/api/v1/auth/refresh/', {
            refresh: refreshToken,
          });
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          sessionStorage.setItem('access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Optionally handle refresh failure, e.g., redirect to login
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
