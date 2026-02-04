import { Link } from "react-router";
import { MdArrowBackIos } from "react-icons/md";

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 mt-5">
        <Link to="/forgot-password">
          <button className="text-xl flex items-center">
            <MdArrowBackIos />
            <h1 className="text-lg ml-3 font-semibold">Reset password</h1>
          </button>
        </Link>
      </div>

      <div className="flex-1 px-6 pt-6">
        <h2 className="text-2xl font-bold text-center mb-3">Reset Password</h2>
        <p className="text-center text-gray-400 text-sm mb-10">
          Your new password must be different from previously used password.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-100 rounded-xl px-4 py-4 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-100 rounded-xl px-4 py-4 outline-none"
            />
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <button className="bg-indigo-700 text-white px-10 py-4 rounded-full font-semibold shadow-lg">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
