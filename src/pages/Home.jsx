import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ReportCard from "../components/ReportCard";
import Navbar from "../components/Navbar";
import { getReportStats, getNewestReport } from "../services/report";

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
      icon: <SearchIcon />,
      label: "Cari",
      color: "bg-amber-50 text-amber-600",
      onClick: handleSearchClick,
    },
    {
      icon: <PlusIcon />,
      label: "Laporan",
      color: "bg-indigo-50 text-indigo-600",
      onClick: () => navigate("/tambah-laporan"),
    },
    {
      icon: <ClockIcon />,
      label: "Aktivitas",
      color: "bg-purple-50 text-purple-600",
      onClick: () => navigate("/activity"),
    },
  ];

  const EmptyReport = ({ message }) => (
    <div className="bg-white rounded-2xl p-5 text-center border border-dashed border-gray-200">
      <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
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
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}
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
              onClick={() => navigate(`/laporan/${newestLost.id}`)}
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
              onClick={() => navigate(`/laporan/${newestFound.id}`)}
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
