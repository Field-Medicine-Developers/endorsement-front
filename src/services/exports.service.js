import api from "./services";

export const getExports = (params) =>
  api.get("/Landa/exports", { params });


export const getExportsSecret = (params) =>
  api.get("/Landa/exports/secret", { params });


export const createExport = (data) =>
  api.post("/Landa/exports", data);

export const updateExport = (id, data) =>
  api.put(`/Landa/exports/${id}`, data);

export const deleteExport = (id) =>
  api.delete(`/Landa/exports/${id}`);

export const uploadExportArchive = (exportId, files) => {
  const fd = new FormData();

  fd.append("exportId", exportId);

  files.forEach((file) => {
    fd.append("files", file);
  });

  return api.post("/Landa/exports/upload-archive", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getExportArchive = (exportId) =>
  api.get("/Landa/exports/archives", { params: { exportId } });


