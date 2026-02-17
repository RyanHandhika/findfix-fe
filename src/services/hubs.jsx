import api from "./axios";

const getHubs = () => {
  return api.get("/hubs/get-hubs");
};

const getDetailHubs = (id) => {
  return api.get(`/hubs/get-hubs/${id}`);
};

const createHub = (payload) => {
  return api.post("/hubs/create-hub", payload);
};

const updateHub = (id, payload) => {
  return api.post(`/hubs/update-hub/${id}`, payload);
};

const deleteHub = (id) => {
  return api.delete(`/hubs/delete-hub/${id}`);
};

export { getHubs, getDetailHubs, createHub, updateHub, deleteHub };
