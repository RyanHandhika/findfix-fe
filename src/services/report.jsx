import api from "./axios";

const getReportStats = () => {
  return api.get("/founds/get-count-report");
};

const getNewestReport = () => {
  return api.get("/founds/get-newest-report");
};

const getAllReport = () => {
  return api.get("/founds/get-founds");
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

export { getReportStats, getNewestReport, getAllReport, addNewReport };
