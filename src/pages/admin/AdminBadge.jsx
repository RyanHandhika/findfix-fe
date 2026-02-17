import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getMe } from "../../services/auth";
import {
  getBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from "../../services/badges";

const ICON_OPTIONS = [
  "🎖️",
  "🏆",
  "⭐",
  "👁️",
  "🔍",
  "💎",
  "🦅",
  "🌟",
  "🎯",
  "🛡️",
  "🔥",
  "⚡",
];

const EMPTY_FORM = { name: "", description: "", icon: "🎖️", min_found: "" };

const BadgeForm = ({ data, onChange, onSubmit, onCancel, submitLabel, loading }) => (
  <div className="space-y-4">
    {/* Icon picker */}
    <div>
      <label className="text-gray-500 text-xs font-medium mb-2 block">
        Pilih Icon
      </label>
      <div className="flex gap-2 flex-wrap">
        {ICON_OPTIONS.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange({ ...data, icon })}
            className={`w-10 h-10 rounded-xl text-xl border transition-all ${data.icon === icon
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>

    {/* Fields */}
    {[
      {
        key: "name",
        label: "Nama Badge",
        type: "text",
        placeholder: "Contoh: Legend Finder",
      },
      {
        key: "description",
        label: "Deskripsi",
        type: "text",
        placeholder: "Contoh: Menemukan lebih dari 20 barang",
      },
      {
        key: "min_found",
        label: "Minimum Barang Ditemukan",
        type: "number",
        placeholder: "Contoh: 20",
      },
    ].map(({ key, label, type, placeholder }) => (
      <div key={key}>
        <label className="text-gray-500 text-xs font-medium mb-1 block">
          {label}
        </label>
        <input
          type={type}
          value={data[key]}
          onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50"
        />
      </div>
    ))}

    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        Batal
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Loading..." : submitLabel}
      </button>
    </div>
  </div>
);

const AdminBadge = () => {
  const [admin, setAdmin] = useState(null);
  const [badges, setBadges] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchBadges = async () => {
    try {
      const res = await getBadges();
      setBadges(res.data.data);
    } catch (err) {
      console.error("Gagal fetch badges:", err);
    }
  };

  useEffect(() => {
    getMe()
      .then((res) => setAdmin(res.data.data))
      .catch(console.error);
    fetchBadges();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.description || !form.min_found) {
      alert("Semua field wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await createBadge({
        ...form,
        min_found: parseInt(form.min_found),
      });
      setForm(EMPTY_FORM);
      setShowAdd(false);
      await fetchBadges();
    } catch (err) {
      console.error("Gagal membuat badge:", err);
      alert("Gagal membuat badge");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setLoading(true);
    try {
      await updateBadge(editTarget.id, {
        name: editTarget.name,
        description: editTarget.description,
        icon: editTarget.icon,
        min_found: parseInt(editTarget.min_found),
      });
      setEditTarget(null);
      await fetchBadges();
    } catch (err) {
      console.error("Gagal mengubah badge:", err);
      alert("Gagal mengubah badge");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBadge(deleteTarget.id);
      setDeleteTarget(null);
      await fetchBadges();
    } catch (err) {
      console.error("Gagal menghapus badge:", err);
      alert("Gagal menghapus badge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen Badge">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Manajemen Badge
            </h2>
            <p className="text-gray-500 text-sm">
              {badges.length} badge tersedia
            </p>
          </div>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setShowAdd(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Tambah Badge
          </button>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl flex-shrink-0">
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base">
                    {badge.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">
                  🎯 Min. {badge.min_found} ditemukan
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTarget({ ...badge })}
                    className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteTarget(badge)}
                    className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {badges.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-gray-400 font-medium">Belum ada badge</p>
            <p className="text-gray-300 text-sm mt-1">
              Klik "+ Tambah Badge" untuk membuat badge baru
            </p>
          </div>
        )}
      </div>

      {/* Modal Tambah */}
      {showAdd && (
        <AdminModal title="Tambah Badge Baru" onClose={() => setShowAdd(false)}>
          <BadgeForm
            data={form}
            onChange={setForm}
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            submitLabel="Tambah Badge"
            loading={loading}
          />
        </AdminModal>
      )}

      {/* Modal Edit */}
      {editTarget && (
        <AdminModal title="Edit Badge" onClose={() => setEditTarget(null)}>
          <BadgeForm
            data={editTarget}
            onChange={setEditTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            submitLabel="Simpan Perubahan"
            loading={loading}
          />
        </AdminModal>
      )}

      {/* Modal Hapus */}
      {deleteTarget && (
        <AdminModal title="Hapus Badge?" onClose={() => setDeleteTarget(null)}>
          <div className="text-center mb-6">
            <p className="text-5xl mb-3">{deleteTarget.icon}</p>
            <p className="text-gray-500 text-sm">
              Badge{" "}
              <span className="font-semibold text-gray-800">
                "{deleteTarget.name}"
              </span>{" "}
              akan dihapus permanen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={loading}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default AdminBadge;
