import api from "./services";

/**
 * رفع مرفقات الوارد (PDF / Images)
 */
export const uploadIncomingArchive = (incomingId, files) => {
  const fd = new FormData();

  fd.append("incomingId", incomingId);

  files.forEach((file) => {
    fd.append("files", file);
  });

  return api.post("/Incomings/upload-archive", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/** جلب مرفقات الوارد */
export const getIncomingArchive = (incomingId) => {
    return api.get(`/Incomings/${incomingId}/archives`);
  };