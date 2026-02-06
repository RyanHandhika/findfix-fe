import api from "./axios";

const login = (data) => api.post("/auth/login", data);
const getMe = () => api.get("/auth/get");
const logout = () => {
  localStorage.removeItem("token");
};

export { login, getMe, logout };
