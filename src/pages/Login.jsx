import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import LoginImg from "../assets/sign-in.png";
import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login({ email, password });
      const userRoleId = res.data.data.user?.user_role_id;

      if (userRoleId === 1) {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else if (status === 422) {
        setError("Format email tidak valid.");
      } else if (status === 429) {
        setError("Terlalu banyak percobaan. Coba lagi beberapa saat.");
      } else if (!err.response) {
        setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        setError(
          err.response?.data?.message || "Login gagal. Silakan coba lagi.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-indigo-700 flex flex-col font-poppins">
        <div className="h-24 px-4 flex items-center text-white">
          <Link to="/">
            <button type="button" className="text-xl flex items-center">
              <MdArrowBackIos />
              <h1 className="text-lg ml-3 font-semibold">Sign in</h1>
            </button>
          </Link>
        </div>

        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
          <h2 className="text-2xl font-bold text-indigo-700">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">
            Hello there, sign in to continue
          </p>

          <div className="flex justify-center">
            <div className="w-60 h-60 rounded-full flex items-center justify-center">
              <img
                src={LoginImg}
                alt="Login Image"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-medium">
                Invalid login, please try again
              </p>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-xs text-gray-400">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 rounded-full text-white font-semibold transition-all ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800 active:scale-95"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
