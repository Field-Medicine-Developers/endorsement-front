import axios from "axios";

const api = axios.create({
  baseURL: "http://ems-api.somee.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة Authorization تلقائياً إذا موجود
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
