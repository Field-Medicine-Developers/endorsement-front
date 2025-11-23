import api from "./services.js";

export const login = (data) =>
  api.post("/Auth/login", data);