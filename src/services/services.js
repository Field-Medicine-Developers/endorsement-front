import axios from "axios";

const api = axios.create({
  // baseURL: "http://ems-api.somee.com/api",
  // baseURL: "http://192.168.9.54:5001/api",
  baseURL: "http://alwakeeliq-001-site1.stempurl.com/api",
  // baseURL: "https://tayid-api.cmfsa-iq.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
