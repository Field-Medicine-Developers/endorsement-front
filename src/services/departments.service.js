import api from "./services.js";

export const getDepartments = (params) =>
  api.get("/Departments", { params });

export const addDepartment = (data) =>
  api.post("/Departments", data);

export const updateDepartment = (id, data) =>
  api.put(`/Departments/${id}`, data);

export const deleteDepartment = (id) =>
  api.delete(`/Departments/${id}`);
