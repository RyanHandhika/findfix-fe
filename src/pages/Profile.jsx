import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { IoIosArrowForward } from "react-icons/io";
import { logout, getMe } from "../services/auth";
import { getAllReport } from "../services/report";

const BADGES = [
  {
    id: "super_find_hero",
    name: "Super Find Hero",
    description: "Menemukan lebih dari 10 barang",
    icon: "🏆",
    color: "bg-yellow-50",
    iconColor: "text-yellow-500",
    minFound: 10,
  },
  {
    id: "honesty_hero",
    name: "Honesty Hero",
    description: "Menemukan lebih dari 3 barang",
    icon: "⭐",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    minFound: 3,
  },
  {
    id: "eagle_eye",
    name: "Eagle Eye",
    description: "Orang pertama yang melaporkan di lokasi tertentu",
    icon: "👁️",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    minFound: 1,
  },
];

const getBadge = (foundCount) => {
  if (foundCount > 10) return BADGES[0]; // Super Find Hero
  if (foundCount > 3) return BADGES[1]; // Honesty Hero
  return BADGES[2]; // Eagle Eye (default)
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [totalReports, setTotalReports] = useState(0);
  const [foundReports, setFoundReports] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const [userRes, allReportsRes, foundReportsRes] = await Promise.all([
          getMe(),
          getAllReport(),
          getAllReport({ found_status_id: 1 }),
        ]);

        const currentUser = userRes;
        setUser(currentUser);

        const allFounds = allReportsRes.data.data.founds ?? [];
        const userTotalReports = allFounds.filter(
          (f) => f.user_id === currentUser.data.id,
        );
        setTotalReports(userTotalReports.length);

        const foundFounds = foundReportsRes.data.data.founds ?? [];
        const userFoundReports = foundFounds.filter(
          (f) => f.user_id === currentUser.data.id,
        );
        setFoundReports(userFoundReports.length);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentBadge = getBadge(foundReports);

  return (
    <div className="bg-gradient-to-b from-[#4A3AFF] to-[#5B4CFF]">
      <Header />

      <div className="bg-white rounded-t-[32px] mt-6 px-5 pt-6">
        {/* Badge Section */}
        <p className="text-sm font-semibold text-gray-400 mb-3 tracking-wide uppercase">
          Current Badge
        </p>
        <div
          className={`${currentBadge.color} rounded-2xl p-4 flex items-center gap-4 mb-5`}
        >
          <div
            className={`w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center`}
          >
            <span className="text-2xl">{currentBadge.icon}</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">{currentBadge.name}</p>
            <p className="text-sm text-gray-500">{currentBadge.description}</p>
          </div>
        </div>

        {/* ✅ Statistik */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border">
            <p className="text-2xl font-bold text-gray-800">{totalReports}</p>
            <p className="text-xs text-gray-400 tracking-wide uppercase mt-1">
              Total Laporan
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border">
            <p className="text-2xl font-bold text-[#4A3AFF]">{foundReports}</p>
            <p className="text-xs text-gray-400 tracking-wide uppercase mt-1">
              Barang Ditemukan
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-4">
          <ProfileMenu
            icon="📊"
            label="My Activity"
            onClick={() => navigate("/activity")}
          />
          <ProfileMenu icon="🚪" label="Logout" danger onClick={handleLogout} />
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
