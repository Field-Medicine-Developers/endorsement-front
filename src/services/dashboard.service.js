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