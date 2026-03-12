import axios from "./services";

// ===============================
//  GET LIST: Landa (الإدارة والبيانات)
// ===============================
export const getLanda = (params) => {
  return axios.get("/Landa", { params });
};

export const getLandaViwe = (params) => { return axios.get("/Landa", { params }); };

// ===============================
//  POST: Create Landa Record
// ===============================
export const addLanda = (data) => {
  return axios.post("/Landa", data);
};

// ===============================
//  PUT: Update Landa Record
// ===============================
export const updateLanda = (id, data) => {
  return axios.put(`/Landa/${id}`, data);
};

export const deleteLanda = (id) => {
  return axios.delete(`/Landa/${id}`);
};

export const getLandaById = (id) => {
  return axios.get(`/Landa/${id}`);
};


export const getLandaByMarginNote = (marginNoteId) => {
  return axios.get(`/Landa/margin-note/${marginNoteId}`);
};

export const transferLanda = (formData) => {
  return axios.post("/Landa/transfer", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getLandaTransfers = (params) => {
  return axios.get("/Landa/transfers", { params });
};


export const changeLandaStatus = (data) => {
  return axios.post("/Landa/change-status", data);
};

export const updateLandaAchieved = (id, isAchieved) => {
  return axios.put(`/Landa/${id}/achieved`, {
    isAchieved,
  });
};