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

export { getReportStats, getNewestReport, getAllReport };
