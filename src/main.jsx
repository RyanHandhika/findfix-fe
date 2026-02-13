import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
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
import ProtectedRoute from "./components/ProtectedRoute";
import DetailLaporan from "./pages/DetailLaporan.jsx";
import Statistik from "./pages/Statistik.jsx";
import Profile from "./pages/Profile.jsx";
import TambahLaporan from "./pages/TambahLaporan.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* public route */}
        <Route path="/" element={<App />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="dashboard" element={<DashboardAdmin />} />

        {/* protected route */}
        <Route element={<ProtectedRoute />}>
          <Route path="home" element={<Home />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="detail-laporan" element={<DetailLaporan />} />
          <Route path="statistik" element={<Statistik />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tambah-laporan" element={<TambahLaporan />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
