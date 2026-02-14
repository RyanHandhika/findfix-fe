import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./styles/index.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto/700.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import App from "./App.jsx";
import LoginPage from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import Home from "./pages/Home.jsx";
import Laporan from "./pages/Laporan.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute, {
  AdminRoute,
  GuestRoute,
} from "./components/ProtectedRoute";
import DetailLaporan from "./pages/DetailLaporan.jsx";
import Statistik from "./pages/Statistik.jsx";
import Profile from "./pages/Profile.jsx";
import TambahLaporan from "./pages/TambahLaporan.jsx";
import Activity from "./pages/Activity.jsx";
// admin
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";
import AdminLaporan from "./pages/admin/AdminLaporan.jsx";
import AdminBadge from "./pages/admin/AdminBadge.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminBuilding from "./pages/admin/AdminBuilding.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* public */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<App />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* admin */}
        <Route element={<AdminRoute />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="admin/laporan" element={<AdminLaporan />} />
          <Route path="admin/badge" element={<AdminBadge />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/building" element={<AdminBuilding />} />
        </Route>

        {/* user */}
        <Route element={<ProtectedRoute />}>
          <Route path="home" element={<Home />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="detail-laporan" element={<DetailLaporan />} />
          <Route path="statistik" element={<Statistik />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tambah-laporan" element={<TambahLaporan />} />
          <Route path="activity" element={<Activity />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
