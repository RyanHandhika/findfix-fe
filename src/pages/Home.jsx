import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ReportCard from "../components/ReportCard";
import Navbar from "../components/Navbar";
import { getReportStats, getNewestReport } from "../services/report";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [newestLost, setNewestLost] = useState(null);
  const [newestFound, setNewestFound] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getReportStats();
        setStats([
          { count: res.data.data.Hilang, label: "Hilang" },
          { count: res.data.data.Ditemukan, label: "Ditemukan" },
          { count: res.data.data.Dikembalikan, label: "Dikembalikan" },
          { count: res.data.data.Tersimpan, label: "Tersimpan" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchNewestReport = async () => {
      try {
        const res = await getNewestReport();
        setNewestFound(res.data.data.Ditemukan ?? null);
        setNewestLost(res.data.data.Hilang ?? null);
      } catch (error) {
        console.error("Failed to fetch newest report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewestReport();
  }, []);

  const handleSearchClick = () => {
    navigate("/laporan", { state: { focusSearch: true } });
  };

  const getRoleName = (roleId) => {
    return roleId === 2 ? "Mahasiswa" : "Staff";
  };

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);
    const months = Math.floor(diffInSeconds / 2592000);
    const years = Math.floor(diffInSeconds / 31536000);

    if (minutes < 60) return `${minutes} Menit lalu`;
    if (hours < 24) return `${hours} Jam lalu`;
    if (days < 7) return `${days} Hari lalu`;
    if (weeks < 4) return `${weeks} Minggu lalu`;
    if (months < 12) return `${months} Bulan lalu`;
    return `${years} Tahun lalu`;
  };

  const menuItems = [
    {
      icon: "🔍",
      label: "Cari",
      color: "bg-yellow-50",
      onClick: handleSearchClick,
    },
    {
      icon: "➕",
      label: "Laporan",
      color: "bg-blue-50",
      onClick: () => navigate("/tambah-laporan"),
    },
    {
      icon: "🕐",
      label: "Aktivitas",
      color: "bg-purple-50",
      onClick: () => navigate("/activity"),
    },
  ];

  const EmptyReport = ({ message }) => (
    <div className="bg-white rounded-2xl p-5 text-center border border-dashed border-gray-200">
      <p className="text-2xl mb-1">📭</p>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF] to-[#4A3AFF] pb-20">
      <Header />

      <div className="bg-gray-50 rounded-t-[30px] mt-5 p-5 min-h-screen">
        {/* Menu */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>
          <div className="flex gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex-1 bg-white rounded-2xl p-5 shadow-md flex flex-col items-center gap-3 active:scale-95 transition-transform"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl`}
                >
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistik */}
        <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Jumlah Laporan
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.count}
                </div>
                <div className="text-md text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Kehilangan Terbaru */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Laporan Kehilangan Terbaru
            </h3>
            <Link
              to="/laporan?status=Hilang"
              state={{ found_status_id: 2 }}
              className="text-[#4A3AFF] text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-4">Memuat...</p>
          ) : newestLost ? (
            <ReportCard
              name={newestLost.user?.name ?? "-"}
              role={getRoleName(newestLost.user?.user_role_id)}
              time={timeAgo(newestLost.created_at)}
              itemName={newestLost.found_name}
              location={`R${newestLost.room?.name_room ?? "-"}`}
              description={newestLost.found_description}
              status="HILANG"
              statusColor="red"
              borderColor="#EF4444"
            />
          ) : (
            <EmptyReport message="Tidak ada laporan kehilangan saat ini" />
          )}
        </div>

        {/* Barang Ditemukan Terbaru */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Barang Ditemukan Terbaru
            </h3>
            <Link
              to="/laporan?status=Ditemukan"
              state={{ found_status_id: 1 }}
              className="text-[#4A3AFF] text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-4">Memuat...</p>
          ) : newestFound ? (
            <ReportCard
              name={newestFound.user?.name ?? "-"}
              role={getRoleName(newestFound.user?.user_role_id)}
              time={timeAgo(newestFound.created_at)}
              itemName={newestFound.found_name}
              location={`R${newestFound.room?.name_room ?? "-"}`}
              description={newestFound.found_description}
              status="DITEMUKAN"
              statusColor="green"
              borderColor="#22C55E"
            />
          ) : (
            <EmptyReport message="Tidak ada barang ditemukan saat ini" />
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Home;
