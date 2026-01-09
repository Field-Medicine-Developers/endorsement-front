import api from "./services.js";

/* Dashboard */
export const getDashboardStats = () => {
  return api.get("/Dashboard");
};

/*  Incoming Tracking */
export const trackIncoming = (params) => {
  return api.get("/Incomings/track", {
    params: {
      injuredName: params.injuredName || null,
      incomingBookNumber: params.incomingBookNumber || null,
    },
  });
};

/* Achievements */
export const getAchievements = (params = {}) => {
  return api.get("/Achievements", {
    params: {
      year: params.year ?? null,
      month: params.month ?? null,
      day: params.day ?? null,
    },
  });
};