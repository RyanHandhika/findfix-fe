import { Navigate, Outlet } from "react-router";

// for user
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // validasi
  if (!token) return <Navigate to="/login" replace />;
  // admin
  if (user?.user_role_id === 1) return <Navigate to="/dashboard" replace />;

  return children ? children : <Outlet />;
};

// for admin
export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // validasi
  if (!token) return <Navigate to="/login" replace />;
  // user
  if (user?.user_role_id === 2) return <Navigate to="/home" replace />;

  return children ? children : <Outlet />;
};

// beres login ga bisa ke login page sebelum logout
export const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (token) {
    if (user?.user_role_id === 1) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
