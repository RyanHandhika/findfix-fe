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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.data.token);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid login, please try again",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-indigo-700 flex flex-col font-poppins">
        <div className="h-24 px-4 flex items-center text-white">
          <Link to="/">
            <button className="text-xl flex items-center">
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

          {error && <p className="text-red">{error}</p>}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right mt-2">
            <Link to="/forgot-password">
              <button className="text-xs text-gray-400">
                Forgot your password ?
              </button>
            </Link>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-full bg-indigo-700 text-white font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
