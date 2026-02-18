import { Link } from "react-router";
import { MdArrowBackIos } from "react-icons/md";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 mt-5">
        <Link to="/login">
          <button className="text-xl flex items-center">
            <MdArrowBackIos />
            <h1 className="text-lg ml-3 font-semibold">Forgot password</h1>
          </button>
        </Link>
      </div>

      <div className="flex-1 px-5 pt-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-400 mb-2">Type your Email</p>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />
          <p className="text-sm text-gray-600 mt-4">
            We texted you a code to verify your Email
          </p>
          <button className="w-full mt-6 py-3 rounded-full bg-indigo-700 text-white font-semibold">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
