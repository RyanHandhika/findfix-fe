import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getReportStats, getAllReport } from "../../services/report";
import { getMe } from "../../services/auth";

const STATUS_STYLE = {
  Ditemukan: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Hilang: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  Dikembalikan: { bg: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  Tersimpan: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
};

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ label, count, icon, color }) => (
  <div className={`rounded-2xl p-5 border ${color} flex items-center gap-4`}>
    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-white">{count ?? 0}</p>
      <p className="text-sm text-white/80 mt-0.5">{label}</p>
    </div>
  </div>
);

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes, reportsRes] = await Promise.all([
          getMe(),
          getReportStats(),
          getAllReport(),
        ]);
        setAdmin(userRes.data.data);
        setStats(statsRes.data.data);
        setReports((reportsRes.data.data.founds ?? []).slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout admin={admin} pageTitle="Overview">
      <div className="space-y-8">
        {/* Stats */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Statistik Keseluruhan
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                label: "Hilang",
                count: stats.Hilang,
                icon: "🔴",
                color: "bg-red-500 border-red-400",
              },
              {
                label: "Ditemukan",
                count: stats.Ditemukan,
                icon: "🟢",
                color: "bg-emerald-500 border-emerald-400",
              },
              {
                label: "Dikembalikan",
                count: stats.Dikembalikan,
                icon: "🔵",
                color: "bg-sky-500 border-sky-400",
              },
              {
                label: "Tersimpan",
                count: stats.Tersimpan,
                icon: "🟡",
                color: "bg-amber-500 border-amber-400",
              },
            ].map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "📋", label: "Kelola Laporan", path: "/admin/laporan" },
              { icon: "🏆", label: "Kelola Badge", path: "/admin/badge" },
              { icon: "👥", label: "Kelola Users", path: "/admin/users" },
              { icon: "🏛️", label: "Kelola Building", path: "/admin/building" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="bg-white border border-gray-100 rounded-2xl py-5 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:border-indigo-200 active:scale-95 transition-all"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-gray-700 text-sm font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Laporan Terbaru
            </h2>
            <button
              onClick={() => navigate("/admin/laporan")}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              Lihat semua →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Barang", "Pelapor", "Lokasi", "Status", "Tanggal"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((item) => {
                    const sc = STATUS_STYLE[item.status?.name] ?? {
                      bg: "bg-gray-100 text-gray-600",
                      dot: "bg-gray-400",
                    };
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={
                                  item.found_images?.[0]?.found_img_url ??
                                  "https://placehold.co/100?text=N%2FA"
                                }
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/100?text=N%2FA";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 truncate max-w-[140px]">
                                {item.found_name}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {item.category?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {item.user?.name ?? "-"}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          <p>{item.room?.name_room}</p>
                          <p className="text-gray-400">
                            {item.room?.building?.building_name}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                            />
                            {item.status?.name}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">
                          {formatDate(item.found_date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {reports.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  Belum ada laporan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
