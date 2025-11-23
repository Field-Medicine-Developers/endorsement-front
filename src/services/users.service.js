import api from "./services.js";

// جلب المستخدمين مع فلاتر
export const getUsers = (params) =>
  api.get("/Users", { params });

// إضافة مستخدم جديد
export const addUser = (data) =>
  api.post("/Users", data);

// حذف مستخدم (إذا موجود)
export const deleteUser = (id) =>
  api.delete(`/Users/${id}`);

// تحديث مستخدم (إن توفر endpoint)
export const updateUser = (id, data) =>
  api.put(`/Users/${id}`, data);
