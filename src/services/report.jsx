import api from "./axios";

const getFoundCategories = () => {
  return api.get("/founds/get-found-category");
};

const getFoundStatuses = () => {
  return api.get("/founds/get-found-status");
};

// const getRooms = () => {
//   return api.get("/founds/get-rooms");
// };

const getReportStats = () => {
  return api.get("/founds/get-count-report");
};

const getNewestReport = () => {
  return api.get("/founds/get-newest-report");
};

const getAllReport = (filters = {}) => {
  return api.get("/founds/get-founds", {
    params: filters,
  });
};

const addNewReport = async (formData) => {
  try {
    const response = await api.post("/founds/create-report", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export {
  getReportStats,
  getNewestReport,
  getAllReport,
  addNewReport,
  getFoundCategories,
  getFoundStatuses,
  // getRooms,
};
