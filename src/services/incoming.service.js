import api from "./services.js";

// جلب الوارد Pagination + فلاتر
export const getIncomings = (params) =>
  api.get("/Incomings", { params });

// إضافة وارد
export const addIncoming = (data) =>
  api.post("/Incomings", data);

// تعديل وارد
export const updateIncoming = (id, data) =>
  api.put(`/Incomings/${id}`, data);

// حذف وارد
export const deleteIncoming = (id) =>
  api.delete(`/Incomings/${id}`);
