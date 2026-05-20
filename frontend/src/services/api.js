import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo && userInfo !== 'undefined') {
    try {
      const parsedInfo = JSON.parse(userInfo);
      if (parsedInfo?.token) {
        req.headers.Authorization = `Bearer ${parsedInfo.token}`;
      }
    } catch (e) {
      console.error('Failed to parse userInfo for auth token', e);
      // Clean up corrupted storage
      localStorage.removeItem('userInfo');
    }
  }
  return req;
});

export default API;
