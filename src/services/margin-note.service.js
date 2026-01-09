import axios from "./services";

const buildMarginNoteFormData = (data) => {
  const formData = new FormData();

  formData.append("IncomingId", data.incomingId);

  data.managerNotes.forEach((note, index) => {
    formData.append(
      `ManagerNotes[${index}].ManagerNote`,
      note.managerNote
    );
    formData.append(
      `ManagerNotes[${index}].NoteDate`,
      note.noteDate
    );
  });

  return formData;
};


export const getMarginNotes = (params) => {
  return axios.get("/MarginNotes", { params });
};

export const addMarginNote = (data) => {
  const formData = buildMarginNoteFormData(data);

  return axios.post("/MarginNotes", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
};

export const updateMarginNote = (id, data) => {
  const formData = buildMarginNoteFormData(data);

  return axios.put(`/MarginNotes/${id}`, formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
};



export const deleteMarginNote = (id) => {
  return axios.delete(`/MarginNotes/${id}`);
};

export const getMarginNoteById = (id) => {
  return axios.get(`/MarginNotes/${id}`);
};

export const getMarginNotesTransfer = (params) => {
  return axios.get("/MarginNotes/transfers", { params });
};

export const transferMarginNote = (formData) => {
  return axios.post("/MarginNotes/transfer", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const changeMarginNoteStatus = (data) => {
  return axios.post("/MarginNotes/change-status", data);
};