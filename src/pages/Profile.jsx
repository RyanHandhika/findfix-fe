import Navbar from "../components/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router";
import { logout } from "../services/auth";

const Profile = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className=" bg-gradient-to-b from-[#4A3AFF] to-[#5B4CFF]">
      <div className="px-5 pt-10 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="avatar"
              className="w-14 h-14 rounded-full bg-[#FFE9B0]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#4A3AFF] rounded-full" />
          </div>

          <div>
            <p className="font-semibold">Hi, Alex Johnson</p>
            <p className="text-xs text-white/80">Member since 2023</p>
          </div>
        </div>

        <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition">
          ✏️
        </button>
      </div>

      <div className="bg-white rounded-t-[32px] mt-6 px-5 pt-6 min-h-screen">
        <p className="text-md font-semibold text-gray-400 mb-3 tracking-wide">
          CURRENT BADGE
        </p>
        <div className="bg-[#F4F7FB] rounded-2xl p-4 flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[oklch(96.2%_0.059_95.617)] flex items-center justify-center">
            <FaEye className="text-yellow-500 text-xl" />
          </div>

          <div>
            <p className="font-bold text-gray-800">Eagle Eye</p>
            <p className="text-sm text-gray-500">
              Top responder in your district
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border">
            <p className="text-xl font-bold text-gray-800">128</p>
            <p className="text-xs text-gray-400 tracking-wide">TOTAL REPORTS</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border">
            <p className="text-xl font-bold text-[#4A3AFF]">94.2%</p>
            <p className="text-xs text-gray-400 tracking-wide">SUCCESS RATE</p>
          </div>
        </div>
        <div className="space-y-4">
          <ProfileMenu
            icon="📊"
            label="My Activity"
            onClick={() => navigate("/activity")}
          />
          <ProfileMenu
            icon="🛡️"
            label="Security"
            onClick={() => navigate("/security")}
          />
          <ProfileMenu
            icon="🚪"
            label="Logout"
            danger
            onClick={() => {
              handleLogout();
            }}
          />
        </div>
      </div>

      <Navbar />
    </div>
  );
};

const ProfileMenu = ({ icon, label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border 
    active:scale-[0.98] transition
    ${danger ? "text-red-500" : "text-gray-700"}`}
  >
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>

    <span className={danger ? "text-red-400" : "text-gray-400"}>
      <IoIosArrowForward />
    </span>
  </button>
);

export default Profile;
