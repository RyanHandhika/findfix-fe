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

const addNewReport = () => {
  return api.post();
};

export { getReportStats, getNewestReport, getAllReport, addNewReport };
