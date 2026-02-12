import api from "./axios";

const login = async (data) => {
  const response = await api.post("/auth/login", data);
  localStorage.setItem("token", response.data.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.data.user));

  return response;
};

const getMe = () => api.get("/auth/get");

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export { login, getMe, logout };
