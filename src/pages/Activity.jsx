import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReport } from "../services/report";
import { getMe } from "../services/auth";
import Navbar from "../components/Navbar";
import { IoIosArrowBack } from "react-icons/io";

const TABS = [
  { id: "all", label: "Semua" },
  { id: "found", label: "Ditemukan" },
  { id: "lost", label: "Hilang" },
];

const STATUS_CONFIG = {
  Ditemukan: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Hilang: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Dikembalikan: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Tersimpan: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ActivityCard = ({ item }) => {
  const statusCfg = STATUS_CONFIG[item.status?.name] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };
  const imgUrl =
    item.found_images?.[0]?.found_img_url ??
    "https://placehold.co/400x300?text=No+Image";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex gap-3 p-3 active:scale-[0.98] transition-transform">
      {/* Gambar */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={imgUrl}
          alt={item.found_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=No+Image";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Nama & Status */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-gray-800 text-sm truncate">
            {item.found_name}
          </p>
          <span
            className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {item.status?.name ?? "-"}
          </span>
        </div>

        {/* Kategori */}
        <p className="text-xs text-[#4A3AFF] font-medium mb-2">
          {item.category?.name ?? "-"}
        </p>

        {/* Lokasi & Tanggal */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1 truncate">
            📍 {item.room?.name_room ?? "-"}
            {item.room?.building?.building_name
              ? ` (${item.room.building.building_name})`
              : ""}
          </span>
          <span className="flex-shrink-0">
            🗓 {formatDate(item.found_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Activity = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [userId, setUserId] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, reportsRes] = await Promise.all([
          getMe(),
          getAllReport(),
        ]);

        const currentUser = userRes;
        setUserId(currentUser);

        const allFounds = reportsRes.data.data.founds ?? [];
        const myReports = allFounds.filter(
          (f) => f.user_id === currentUser.data.data.id,
        );
        setAllReports(myReports);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReports = allReports.filter((f) => {
    if (activeTab === "all") return true;
    if (activeTab === "found") return f.status?.name === "Ditemukan";
    if (activeTab === "lost") return f.status?.name === "Hilang";
    return true;
  });

  const countAll = allReports.length;
  const countFound = allReports.filter(
    (f) => f.status?.name === "Ditemukan",
  ).length;
  const countLost = allReports.filter(
    (f) => f.status?.name === "Hilang",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A3AFF] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A3AFF]">
      {/* Header */}
      <div className="px-4 py-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0"
        >
          <IoIosArrowBack />
        </button>
        <div className="flex-1 text-center mr-10">
          <h1 className="text-xl font-bold text-white">My Activity</h1>
          <p className="text-white/70 text-sm">Riwayat laporan kamu</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#F3F7FF] rounded-t-[32px] px-4 pt-6 pb-28 min-h-screen">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", count: countAll, color: "text-gray-800" },
            { label: "Ditemukan", count: countFound, color: "text-green-600" },
            { label: "Hilang", count: countLost, color: "text-red-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl py-3 text-center shadow-sm border border-gray-100"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-white rounded-2xl p-1.5 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[#4A3AFF] text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Laporan */}
        <div className="space-y-3">
          {loading ? (
            // loding
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-3 flex gap-3 animate-pulse"
              >
                <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">Belum ada laporan</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === "all"
                  ? "Kamu belum membuat laporan apapun"
                  : activeTab === "found"
                    ? "Kamu belum menemukan barang apapun"
                    : "Kamu belum ada laporan kehilangan"}
              </p>
              <button
                onClick={() => navigate("/tambah-laporan")}
                className="mt-4 px-5 py-2.5 bg-[#4A3AFF] text-white rounded-full text-sm font-medium"
              >
                + Buat Laporan
              </button>
            </div>
          ) : (
            filteredReports.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Activity;
