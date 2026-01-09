import api from "./services";

export const getFormations = (params) =>
  api.get("/Formations", { params });

export const addFormation = (body) =>
  api.post("/Formations", body);

export const updateFormation = (id, body) =>
  api.put(`/Formations/${id}`, body);

export const deleteFormation = (id) =>
  api.delete(`/Formations/${id}`);

export const getCommands = () => {
  return api.get("/Commands");
};