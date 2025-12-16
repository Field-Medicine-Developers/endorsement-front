import api from "./services.js";

export const getInjurySupports = (params) => {
  return api.get("/InjurySupports", { params });
};

export const addInjurySupport = (body) => {
  return api.post("/InjurySupports", body);
};

export const updateInjurySupport = (id, body) => {
  return api.put(`/InjurySupports/${id}`, body);
};

export const deleteInjurySupport = (id) => {
  return api.delete(`/InjurySupports/${id}`);
};


export const getIncomings = () =>
  api.get("/Incomings");


export const getFormations = () =>
  api.get("/Formations");

export const getInjurySupportByPerson = (injuredPersonId) => {
  return api.get(`/InjurySupports/by-injured-person/${injuredPersonId}`);
};
