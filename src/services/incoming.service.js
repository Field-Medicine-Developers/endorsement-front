import api from "./services.js";

export const getIncomings = (params) =>
  api.get("/Incomings", { params });

export const getIncomingSecret = (params) =>
  api.get("/Incomings/secret", { params });


export const addIncoming = (data) =>
  api.post("/Incomings", data);

export const updateIncoming = (id, data) =>
  api.put(`/Incomings/${id}`, data);

export const deleteIncoming = (id) =>
  api.delete(`/Incomings/${id}`);

export const transferIncoming = (data) =>
  api.post("/Incomings/transfer", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });


  export const getIncomingTransfers = (params) => {
    return api.get("/Incomings/transfers", { params });
  };
