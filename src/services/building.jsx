import api from "./axios";

// building
const getBuildings = () => {
  return api.get("/buildings/rooms");
};

const createBuilding = ({ building_name, description, rooms = [] }) =>
  api.post("/buildings/create-building", {
    building_name,
    description,
    rooms,
  });

const updateBuilding = (id, payload) => {
  return api.post(`/buildings/update-building/${id}`, payload);
};

const deleteBuilding = (id) => {
  return api.delete(`/buildings/delete-building/${id}`);
};

// room
const createRoom = ({ building_id, name_room, room_description }) => {
  return api.post("/buildings/create-room", {
    building_id,
    name_room: String(name_room),
    room_description: String(room_description),
  });
};

const updateRoom = (id, { building_id, name_room, description }) => {
  return api.post(`/buildings/update-room/${id}`, {
    building_id,
    name_room: String(name_room),
    description: String(description),
  });
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
