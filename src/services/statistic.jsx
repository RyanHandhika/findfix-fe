import api from "./axios";

const getFoundStatistic = () => {
  return api.get("/founds/get-founds-statistic");
};

const getReportCount = () => {
  return api.get("/founds/get-count-report");
};

export { getFoundStatistic, getReportCount };
