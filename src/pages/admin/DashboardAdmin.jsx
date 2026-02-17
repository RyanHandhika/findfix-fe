import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getReportStats, getAllReport } from "../../services/report";
import { getMe } from "../../services/auth";
import { getNotifications, markAsRead } from "../../services/notifications";

const STATUS_STYLE = {
  Ditemukan: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Hilang: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  Dikembalikan: { bg: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  Tersimpan: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
};

const NOTIF_TYPE_STYLE = {
  info: { bg: "bg-blue-500", ring: "ring-blue-100" },
  success: { bg: "bg-emerald-500", ring: "ring-emerald-100" },
  warning: { bg: "bg-amber-500", ring: "ring-amber-100" },
  error: { bg: "bg-red-500", ring: "ring-red-100" },
};

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);
  const mins = Math.floor(diff / 60);
  const hrs = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins}m lalu`;
  if (hrs < 24) return `${hrs}h lalu`;
  return `${days}d lalu`;
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

const NotifIcon = ({ type }) => {
  const cls = "w-4 h-4 text-white";
  switch (type) {
    case "success":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      );
    case "warning":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      );
    case "error":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
  }
};

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes, reportsRes, notifsRes] = await Promise.all([
          getMe(),
          getReportStats(),
          getAllReport(),
          getNotifications(),
        ]);
        setAdmin(userRes.data.data);
        setStats(statsRes.data.data);
        setReports((reportsRes.data.data.founds ?? []).slice(0, 8));
        setNotifications((notifsRes.data.data.data ?? []).slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNotifClick = async (notif) => {
    try {
      if (!notif.read_at) {
        await markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n,
          ),
        );
      }
    } catch (e) {
      console.error(e);
    }
    if (notif.data?.action_url) {
      navigate("/admin/laporan");
    }
  };

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

        {/* Notifications Panel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Notifikasi Terbaru
            </h2>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-400">
                {notifications.filter((n) => !n.read_at).length} belum dibaca
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Belum ada notifikasi</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
              {notifications.map((notif) => {
                const style = NOTIF_TYPE_STYLE[notif.data?.type] ?? NOTIF_TYPE_STYLE.info;
                const isUnread = !notif.read_at;

                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${isUnread ? "bg-indigo-50/30" : ""
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0 ring-4 ${style.ring}`}>
                      <NotifIcon type={notif.data?.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${isUnread ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}>
                          {notif.data?.title ?? "Notifikasi"}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400">{timeAgo(notif.created_at)}</span>
                          {isUnread && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                        {notif.data?.message}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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
