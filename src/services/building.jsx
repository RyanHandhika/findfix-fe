import api from "./axios";

// building
const getBuildings = () => {
  return api.get("/buildings/rooms");
};

const createBuilding = (payload) => {
  return api.post("/buildings/create-building", payload);
};

const updateBuilding = (id, payload) => {
  return api.post(`/buildings/update-building/${id}`, payload);
};

const deleteBuilding = (id) => {
  return api.delete(`/buildings/delete-building/${id}`);
};

// room
const createRoom = (payload) => {
  return api.post("/buildings/create-room", payload);
};

const updateRoom = (id, payload) => {
  return api.post(`/buildings/update-room/${id}`, payload);
};

const deleteRoom = (id) => {
  return api.delete(`/buildings/delete-room/${id}`);
};

export {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  createRoom,
  updateRoom,
  deleteRoom,
};
