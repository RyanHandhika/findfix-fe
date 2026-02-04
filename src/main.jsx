import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
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
import DetailLaporal from "./pages/DetailLaporan.jsx";
import Statistik from "./pages/Statistik.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="laporan" element={<Laporan />} />
        <Route path="detail-laporan" element={<DetailLaporal />} />
        <Route path="statistik" element={<Statistik />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
