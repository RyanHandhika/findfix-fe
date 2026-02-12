import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const ManajemenUser = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Ryan Admin",
      email: "ryan@findfix.com",
      role: "Admin",
      status: "Aktif",
      joinDate: "2024-01-15",
      lastLogin: "2025-02-11T10:30:00",
    },
    {
      id: "2",
      name: "Siti Moderator",
      email: "siti@findfix.com",
      role: "Moderator",
      status: "Aktif",
      joinDate: "2024-03-20",
      lastLogin: "2025-02-10T15:45:00",
    },
    {
      id: "3",
      name: "Ahmad User",
      email: "ahmad@example.com",
      role: "User",
      status: "Aktif",
      joinDate: "2024-06-10",
      lastLogin: "2025-02-09T08:20:00",
    },
    {
      id: "4",
      name: "Dewi User",
      email: "dewi@example.com",
      role: "User",
      status: "Nonaktif",
      joinDate: "2024-02-05",
      lastLogin: "2025-01-20T12:00:00",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Aktif",
  });

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchStatus = filterStatus === "all" || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Stats
  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "Admin").length,
    moderator: users.filter((u) => u.role === "Moderator").length,
    user: users.filter((u) => u.role === "User").length,
    active: users.filter((u) => u.status === "Aktif").length,
  };

  const handleAddUser = () => {
    if (formData.name && formData.email) {
      const newUser = {
        id: String(users.length + 1),
        ...formData,
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      setFormData({ name: "", email: "", role: "User", status: "Aktif" });
      setShowAddModal(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowAddModal(true);
  };

  const handleUpdateUser = () => {
    if (editingUser && formData.name && formData.email) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...formData } : u
        )
      );
      setFormData({ name: "", email: "", role: "User", status: "Aktif" });
      setEditingUser(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700";
      case "Moderator":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status) => {
    return status === "Aktif"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF] to-[#5B4CFF]">
      <Header />

      <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 px-5 pt-8 pb-28 min-h-screen">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            👥 Manajemen User
          </h1>
          <p className="text-sm text-gray-500">
            Kelola semua pengguna sistem FindFix
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-xs text-gray-500 mb-1">Total User</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-xs text-gray-500 mb-1">Admin</p>
            <p className="text-2xl font-bold text-purple-600">{stats.admin}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-xs text-gray-500 mb-1">Moderator</p>
            <p className="text-2xl font-bold text-blue-600">{stats.moderator}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-xs text-gray-500 mb-1">User</p>
            <p className="text-2xl font-bold text-gray-600">{stats.user}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-xs text-gray-500 mb-1">Aktif</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          {/* Header & Filters */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold text-gray-800">Daftar User</h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ name: "", email: "", role: "User", status: "Aktif" });
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                ➕ Tambah User
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="🔍 Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] text-sm"
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] text-sm"
              >
                <option value="all">Semua Role</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="User">User</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4A3AFF] to-[#5B4CFF] rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.joinDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.lastLogin).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Navbar />

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingUser ? "✏️ Edit User" : "➕ Tambah User Baru"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]"
                  placeholder="Masukkan nama"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]"
                >
                  <option value="User">User</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setFormData({ name: "", email: "", role: "User", status: "Aktif" });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {editingUser ? "Update" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenUser;