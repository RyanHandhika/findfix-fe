import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getAllReport } from "../../services/report";
import { getMe } from "../../services/auth";
import { getBadge, countFoundReports } from "../../services/badges";

const AdminUsers = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detailUser, setDetailUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reportsRes] = await Promise.all([
          getMe(),
          getAllReport(),
        ]);
        setAdmin(userRes.data.data);

        const founds = reportsRes.data.data.founds ?? [];
        const map = {};

        founds.forEach((f) => {
          if (!f.user) return;
          if (!map[f.user.id]) {
            map[f.user.id] = {
              ...f.user,
              totalReports: 0,
              lostReports: 0,
              returnedReports: 0,
              reports: [],
            };
          }
          map[f.user.id].totalReports += 1;
          map[f.user.id].reports.push(f);

          if (f.found_status_id === 1 || f.found_status_id === 2) {
            map[f.user.id].lostReports += 1;
          }
          if (f.found_status_id === 3) {
            map[f.user.id].returnedReports += 1;
          }
        });

        const userList = Object.values(map).map((user) => ({
          ...user,
          foundReports: countFoundReports(user.reports, user.id),
        }));

        setUsers(userList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen User">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Manajemen User
          </h2>
          <p className="text-gray-500 text-sm">
            {filtered.length} user ditemukan
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 shadow-sm"
          />
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 bg-gray-100 rounded-xl" />
                  <div className="h-14 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-400 font-medium">
              Tidak ada user ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((user) => {
              const badge = getBadge(user.foundReports);
              const isAdmin = user.user_role_id === 1;

              return (
                <div
                  key={user.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 truncate">
                          {user.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs truncate">
                        {user.email}
                      </p>
                      {user.foundReports >= 1 && badge && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          {badge.icon} {badge.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-xl py-2 text-center">
                      <p className="text-gray-800 font-bold text-sm">
                        {user.totalReports}
                      </p>
                      <p className="text-gray-400 text-xs">Total</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl py-2 text-center">
                      <p className="text-emerald-600 font-bold text-sm">
                        {user.foundReports}
                      </p>
                      <p className="text-gray-400 text-xs">Ditemukan</p>
                    </div>
                    <div className="bg-red-50 rounded-xl py-2 text-center">
                      <p className="text-red-500 font-bold text-sm">
                        {user.lostReports}
                      </p>
                      <p className="text-gray-400 text-xs">Hilang</p>
                    </div>
                  </div>

                  {/* Detail button */}
                  <button
                    onClick={() => setDetailUser(user)}
                    className="mt-3 w-full py-2 rounded-xl bg-gray-50 text-gray-500 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
                  >
                    Lihat Riwayat Laporan →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail User */}
      {detailUser && (
        <AdminModal
          title={`Riwayat — ${detailUser.name}`}
          onClose={() => setDetailUser(null)}
        >
          <div className="space-y-3">
            {detailUser.reports.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                Belum ada laporan
              </p>
            ) : (
              detailUser.reports.map((r) => {
                const STATUS_COLOR = {
                  Ditemukan: "bg-emerald-100 text-emerald-700",
                  Hilang: "bg-red-100 text-red-600",
                  Dikembalikan: "bg-sky-100 text-sky-700",
                  Tersimpan: "bg-amber-100 text-amber-700",
                };
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={
                          r.found_images?.[0]?.found_img_url ??
                          "https://placehold.co/100?text=N%2FA"
                        }
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100?text=N%2FA";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-sm truncate">
                        {r.found_name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {r.category?.name} · {r.room?.name_room}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_COLOR[r.status?.name] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {r.status?.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
