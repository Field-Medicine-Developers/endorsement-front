import axios from "./services"; // نفس ملف axios العام

// ===============================
//  GET: Fetch list
// ===============================
export const getMarginAdditionalInfos = (params) => {
  return axios.get("/MarginAdditionalInfos", { params });
};

// ===============================
//  POST: Add new info
// ===============================
export const addMarginAdditionalInfo = (data) => {
  return axios.post("/MarginAdditionalInfos", data);
};

// ===============================
//  PUT: Update info
// ===============================
export const updateMarginAdditionalInfo = (id, data) => {
  return axios.put(`/MarginAdditionalInfos/${id}`, data);
};

// ===============================
//  DELETE: Remove info
// ===============================
export const deleteMarginAdditionalInfo = (id) => {
  return axios.delete(`/MarginAdditionalInfos/${id}`);
};

// ===============================
//  GET BY MARGIN NOTE ID
//  /api/MarginAdditionalInfos/margin-note/{marginNoteId}
// ===============================
export const getByMarginNote = (marginNoteId) => {
  return axios.get(`/MarginAdditionalInfos/margin-note/${marginNoteId}`);
};

// ===============================
//  SEND TO TRANSACTION FLOW AFTER MARGIN
//  POST: /api/MarginAdditionalInfos/{id}/send-to-transaction-flow-after-margin
// ===============================
export const sendToFlowAfterMargin = (id) => {
  return axios.post(`/MarginAdditionalInfos/${id}/send-to-transaction-flow-after-margin`);
};
