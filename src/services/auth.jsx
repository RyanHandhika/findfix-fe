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

const getUserRole = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user)?.user_role_id ?? null;
};

const isAdmin = () => getUserRole() === 1;
const isUser = () => getUserRole() === 2;

export { login, getMe, logout, getUserRole, isAdmin, isUser };
