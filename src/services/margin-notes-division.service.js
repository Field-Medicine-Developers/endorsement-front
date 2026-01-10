import axios from "./services";

// ===============================
//  GET LIST: Margin Notes Division
// ===============================
export const getMarginNotesDivision = (params) => {
  return axios.get("/MarginNotesDivision", { params });
};

// ===============================
//  POST: Create Margin Note Division
// ===============================
export const addMarginNoteDivision = (data) => {
  return axios.post("/MarginNotesDivision", data);
};

// ===============================
//  DELETE
// ===============================
export const deleteMarginNoteDivision = (id) => {
  return axios.delete(`/MarginNotesDivision/${id}`);
};

// ===============================
//  GET BY ID
// ===============================
export const getMarginNoteDivisionById = (id) => {
  return axios.get(`/MarginNotesDivision/${id}`);
};

// ===============================
//  UPDATE
// ===============================
export const updateMarginNoteDivision = (id, data) => {
  return axios.put(`/MarginNotesDivision/${id}`, data);
};

// ===============================
//  TRANSFER MARGIN NOTE DIVISION
// ===============================
export const transferMarginNoteDivision = (formData) => {
  return axios.post("/MarginNotesDivision/transfer", formData);
};



// ===============================
//  GET TRANSFERS
// ===============================
export const getTransfers = () => {
  return axios.get("/MarginNotesDivision/transfers");
};

// ===============================
//  GET TRANSFERS (المراسلات)
// ===============================
export const getMarginNotesDivisionTransfers = (params) => {
  return axios.get("/MarginNotesDivision/transfers", { params });
};

// ===============================
//  CHANGE STATUS (قبول / رفض)
// ===============================
export const changeMarginNoteDivisionStatus = (data) => {
  return axios.post("/MarginNotesDivision/change-status", data);
};







