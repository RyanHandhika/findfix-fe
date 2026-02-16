import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getAllReport } from "../../services/report";
import { getMe, register, getAllUsers } from "../../services/auth";
import { getBadge, countFoundReports } from "../../services/badges";

const AdminUsers = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detailUser, setDetailUser] = useState(null);

  // Add User Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  const fetchUsers = async () => {
    try {
      const [reportsRes, allUsersRes] = await Promise.all([
        getAllReport(),
        getAllUsers(),
      ]);

      const founds = reportsRes.data.data.founds ?? [];
      const allUsers = (allUsersRes.data.data ?? allUsersRes.data ?? []).filter(
        (u) => u.user_role_id === 2,
      );

      const reportMap = {};
      founds.forEach((f) => {
        if (!f.user) return;
        if (!reportMap[f.user.id]) {
          reportMap[f.user.id] = {
            totalReports: 0,
            lostReports: 0,
            returnedReports: 0,
            reports: [],
          };
        }
        reportMap[f.user.id].totalReports += 1;
        reportMap[f.user.id].reports.push(f);
        if (f.found_status_id === 1 || f.found_status_id === 2) {
          reportMap[f.user.id].lostReports += 1;
        }
        if (f.found_status_id === 3) {
          reportMap[f.user.id].returnedReports += 1;
        }
      });

      const userList = allUsers.map((u) => {
        const stats = reportMap[u.id] ?? {
          totalReports: 0,
          lostReports: 0,
          returnedReports: 0,
          reports: [],
        };
        return {
          ...u,
          ...stats,
          foundReports: countFoundReports(stats.reports, u.id),
        };
      });

      setUsers(userList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await getMe();
        setAdmin(userRes.data.data);
        await fetchUsers();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddFormChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
    setAddError("");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError("");

    if (!addForm.name.trim()) {
      setAddError("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (
      !addForm.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)
    ) {
      setAddError("Masukkan alamat email yang valid.");
      return;
    }
    if (!addForm.password.trim() || addForm.password.length < 8) {
      setAddError("Password minimal 8 karakter.");
      return;
    }

    setAddLoading(true);
    try {
      await register({ ...addForm, user_role_id: 2 });
      setAddSuccess(true);
      setAddForm({ name: "", email: "", password: "" });
      await fetchUsers();
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess(false);
      }, 1500);
    } catch (err) {
      setAddError(
        err?.response?.data?.message ?? "Gagal menambahkan user. Coba lagi.",
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddForm({ name: "", email: "", password: "" });
    setAddError("");
    setAddSuccess(false);
    setShowPassword(false);
  };

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Manajemen User
            </h2>
            <p className="text-gray-500 text-sm">
              {filtered.length} user ditemukan
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah User
          </button>
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

      {/* Modal Tambah User */}
      {showAddModal && (
        <AdminModal title="Tambah User Baru" onClose={handleCloseAddModal}>
          {addSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-semibold text-gray-800">
                User berhasil ditambahkan!
              </p>
            </div>
          ) : (
            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 gap-3 focus-within:border-indigo-400 transition-colors">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="name"
                    value={addForm.name}
                    onChange={handleAddFormChange}
                    placeholder="Masukkan nama lengkap"
                    className="flex-1 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 gap-3 focus-within:border-indigo-400 transition-colors">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={addForm.email}
                    onChange={handleAddFormChange}
                    placeholder="contoh@email.com"
                    className="flex-1 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 gap-3 focus-within:border-indigo-400 transition-colors">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={addForm.password}
                    onChange={handleAddFormChange}
                    placeholder="Minimal 8 karakter"
                    className="flex-1 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {addError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{addError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {addLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    "Tambah User"
                  )}
                </button>
              </div>
            </form>
          )}
        </AdminModal>
      )}

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
