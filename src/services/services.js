import axios from "axios";

const api = axios.create({
  // baseURL: "http://ems-api.somee.com/api",
  // baseURL: "http://10.10.9.29:5001/api",
  baseURL: "https://tayid-api.cmfsa-iq.com/api",
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
