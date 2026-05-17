import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust in production
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsedInfo = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${parsedInfo.token}`;
  }
  return req;
});

export default API;
