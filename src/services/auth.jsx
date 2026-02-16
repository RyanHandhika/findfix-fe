import api from "./axios";

const login = async (data) => {
  const response = await api.post("/auth/login", data);
  localStorage.setItem("token", response.data.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.data.user));

  return response;
};

const register = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("user_role_id", data.user_role_id);
  formData.append("password", data.password);

  const response = await api.post("/users/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

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

const getAllUsers = () => {
  return api.get("/users/get");
};

const isAdmin = () => getUserRole() === 1;
const isUser = () => getUserRole() === 2;

export {
  login,
  register,
  getMe,
  logout,
  getUserRole,
  isAdmin,
  isUser,
  getAllUsers,
};
