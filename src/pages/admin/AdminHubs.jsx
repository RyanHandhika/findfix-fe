import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getMe } from "../../services/auth";
import { getHubs, createHub, updateHub, deleteHub } from "../../services/hubs";
import { getBuildings } from "../../services/building";

const EMPTY_HUB_FORM = { hub_name: "", hub_description: "", room_id: "" };
const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-gray-500 text-xs font-medium mb-1 block">
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50"
    />
  </div>
);
const AdminHub = () => {
  const [admin, setAdmin] = useState(null);
  const [hubs, setHubs] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [errorPopup, setErrorPopup] = useState(null);
  const [showAddHub, setShowAddHub] = useState(false);
  const [editHub, setEditHub] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailHub, setDetailHub] = useState(null);
  const [hubForm, setHubForm] = useState(EMPTY_HUB_FORM);
  const [editForm, setEditForm] = useState(EMPTY_HUB_FORM);
  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    getMe()
      .then((r) => setAdmin(r.data.data))
      .catch(console.error);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hubsRes, roomsRes] = await Promise.all([
        getHubs(),
        getBuildings(),
      ]);

      const buildingsData = hubsRes.data.data ?? [];
      const flatHubs = [];
      buildingsData.forEach((building) => {
        building.rooms?.forEach((room) => {
          if (room.hub) {
            flatHubs.push({
              ...room.hub,
              _room: {
                id: room.id,
                name_room: room.name_room,
                description: room.description,
              },
              _building: {
                id: building.id,
                building_name: building.building_name,
              },
            });
          }
        });
      });
      setHubs(flatHubs);

      const buildings = roomsRes.data.data ?? [];
      const flatRooms = [];
      buildings.forEach((b) => {
        b.rooms?.forEach((r) => {
          flatRooms.push({
            ...r,
            building_name: b.building_name,
          });
        });
      });
      setAllRooms(flatRooms);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddHub = async () => {
    if (!hubForm.hub_name.trim()) {
      setErrorPopup({
        title: "Input Tidak Lengkap",
        message: "Nama hub wajib diisi.",
      });
      return;
    }
    if (!hubForm.room_id) {
      setErrorPopup({
        title: "Input Tidak Lengkap",
        message: "Pilih lokasi room terlebih dahulu.",
      });
      return;
    }
    setSaving(true);
    try {
      await createHub({
        hub_name: hubForm.hub_name,
        hub_description: hubForm.hub_description,
        room_id: Number(hubForm.room_id),
      });
      setHubForm(EMPTY_HUB_FORM);
      setShowAddHub(false);
      fetchData();
    } catch (e) {
      const errorMsg = e?.response?.data?.message ?? "";
      const selectedRoom = allRooms.find(
        (r) => r.id === Number(hubForm.room_id),
      );
      const roomLabel = selectedRoom
        ? `${selectedRoom.building_name} · R${selectedRoom.name_room}`
        : "Room ini";

      if (
        errorMsg.toLowerCase().includes("duplicate") ||
        errorMsg.toLowerCase().includes("sudah digunakan") ||
        errorMsg.toLowerCase().includes("already exists") ||
        errorMsg.toLowerCase().includes("unique")
      ) {
        setErrorPopup({
          title: "Room Sudah Digunakan",
          message: `${roomLabel} sudah memiliki hub. Silakan pilih room lain atau edit hub yang sudah ada.`,
        });
      } else {
        setErrorPopup({
          title: "Room Sudah Digunakan",
          message: `${roomLabel} sudah memiliki hub. Silakan pilih room lain atau edit hub yang sudah ada.`,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditHub = async () => {
    if (!editForm.hub_name.trim()) {
      setErrorPopup({
        title: "Input Tidak Lengkap",
        message: "Nama hub wajib diisi.",
      });
      return;
    }
    if (!editForm.room_id) {
      setErrorPopup({
        title: "Input Tidak Lengkap",
        message: "Pilih lokasi room terlebih dahulu.",
      });
      return;
    }
    setSaving(true);
    try {
      await updateHub(editHub.id, {
        hub_name: editForm.hub_name,
        hub_description: editForm.hub_description,
        room_id: Number(editForm.room_id),
      });
      setEditHub(null);
      fetchData();
    } catch (e) {
      const errorMsg = e?.response?.data?.message ?? "";
      const selectedRoom = allRooms.find(
        (r) => r.id === Number(editForm.room_id),
      );
      const roomLabel = selectedRoom
        ? `${selectedRoom.building_name} · R${selectedRoom.name_room}`
        : "Room ini";

      if (
        errorMsg.toLowerCase().includes("duplicate") ||
        errorMsg.toLowerCase().includes("sudah digunakan") ||
        errorMsg.toLowerCase().includes("already exists") ||
        errorMsg.toLowerCase().includes("unique")
      ) {
        setErrorPopup({
          title: "Room Sudah Digunakan",
          message: `${roomLabel} sudah memiliki hub lain. Silakan pilih room yang berbeda.`,
        });
      } else {
        setErrorPopup({
          title: "Gagal Mengubah Hub",
          message: errorMsg || "Terjadi kesalahan saat mengubah hub.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHub = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteHub(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
    } catch (e) {
      setErrorPopup({
        title: "Gagal Menghapus Hub",
        message:
          e?.response?.data?.message ?? "Terjadi kesalahan saat menghapus hub.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen Hub">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Manajemen Hub
            </h2>
            <p className="text-gray-500 text-sm">{hubs.length} hub terdaftar</p>
          </div>
          <button
            onClick={() => {
              setHubForm(EMPTY_HUB_FORM);
              setShowAddHub(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Tambah Hub
          </button>
        </div>

        {/* Hub List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse"
              >
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hubs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-400 font-medium">Belum ada hub</p>
            <p className="text-gray-300 text-sm mt-1">
              Klik "+ Tambah Hub" untuk menambahkan
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {hubs.map((hub) => {
              const isExpanded = expanded[hub.id] ?? true;
              return (
                <div
                  key={hub.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Hub Header */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <button
                      onClick={() => toggleExpand(hub.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                        📦
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {hub.hub_name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {hub.hub_description || "Tidak ada deskripsi"}
                        </p>
                      </div>
                      <span className="ml-2 text-gray-400 text-sm">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setDetailHub(hub)}
                        className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        title="Lihat Detail"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => {
                          setEditForm({
                            hub_name: hub.hub_name,
                            hub_description: hub.hub_description || "",
                            room_id: String(hub.room_id),
                          });
                          setEditHub(hub);
                        }}
                        className="p-1.5 bg-amber-50 text-amber-500 rounded-lg hover:bg-amber-100 transition-colors text-sm"
                        title="Edit Hub"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteTarget(hub)}
                        className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus Hub"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Lokasi Info (expanded) */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-gray-50 pt-3">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">🏛️</span>
                          <span className="text-gray-500">Building:</span>
                          <span className="font-medium text-gray-800">
                            {hub._building?.building_name ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">🚪</span>
                          <span className="text-gray-500">Room:</span>
                          <span className="font-medium text-gray-800">
                            R{hub._room?.name_room ?? "-"}
                          </span>
                          {hub._room?.description && (
                            <span className="text-gray-400 text-xs">
                              · {hub._room.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddHub && (
        <AdminModal
          title="Tambah Hub Baru"
          onClose={() => setShowAddHub(false)}
        >
          <div className="space-y-4">
            <Field
              label="Nama Hub"
              value={hubForm.hub_name}
              onChange={(e) =>
                setHubForm({ ...hubForm, hub_name: e.target.value })
              }
              placeholder="Contoh: Hub Lantai 5 Gedung Utara"
            />

            <Field
              label="Deskripsi (opsional)"
              value={hubForm.hub_description}
              onChange={(e) =>
                setHubForm({ ...hubForm, hub_description: e.target.value })
              }
              placeholder="Contoh: Loker penyimpanan di depan lift"
            />

            {/* Dropdown Room */}
            <div>
              <label className="text-gray-500 text-xs font-medium mb-1 block">
                Lokasi Room
              </label>
              <select
                value={hubForm.room_id}
                onChange={(e) =>
                  setHubForm({ ...hubForm, room_id: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50 cursor-pointer"
              >
                <option value="">-- Pilih Room --</option>
                {allRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.building_name} · R{r.name_room}{" "}
                    {r.description ? `(${r.description})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddHub(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleAddHub}
                disabled={saving}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Tambah Hub"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {editHub && (
        <AdminModal
          title={`Edit — ${editHub.hub_name}`}
          onClose={() => setEditHub(null)}
        >
          <div className="space-y-4">
            <Field
              label="Nama Hub"
              value={editForm.hub_name}
              onChange={(e) =>
                setEditForm({ ...editForm, hub_name: e.target.value })
              }
              placeholder="Nama hub"
            />

            <Field
              label="Deskripsi (opsional)"
              value={editForm.hub_description}
              onChange={(e) =>
                setEditForm({ ...editForm, hub_description: e.target.value })
              }
              placeholder="Deskripsi hub"
            />

            <div>
              <label className="text-gray-500 text-xs font-medium mb-1 block">
                Lokasi Room
              </label>
              <select
                value={editForm.room_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, room_id: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50 cursor-pointer"
              >
                <option value="">-- Pilih Room --</option>
                {allRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.building_name} · R{r.name_room}{" "}
                    {r.description ? `(${r.description})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditHub(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleEditHub}
                disabled={saving}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminModal title="Hapus Hub?" onClose={() => setDeleteTarget(null)}>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
            <p className="text-red-600 text-sm font-medium">⚠️ Peringatan!</p>
            <p className="text-red-500 text-xs mt-1">
              Hub <span className="font-bold">"{deleteTarget.hub_name}"</span>{" "}
              akan dihapus permanen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteHub}
              disabled={saving}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}

      {detailHub && (
        <AdminModal title="Detail Hub" onClose={() => setDetailHub(null)}>
          <div className="space-y-4">
            {/* Hub Name */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-xs text-indigo-600 font-medium mb-1">
                Nama Hub
              </p>
              <p className="text-lg font-bold text-gray-800">
                {detailHub.hub_name}
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Deskripsi
              </p>
              <p className="text-sm text-gray-700">
                {detailHub.hub_description || (
                  <span className="text-gray-400 italic">
                    Tidak ada deskripsi
                  </span>
                )}
              </p>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 font-medium mb-2">Lokasi</p>

              {/* Building */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏛️</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Building</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {detailHub._building?.building_name || "-"}
                  </p>
                </div>
              </div>

              {/* Room */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🚪</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Room</p>
                  <p className="text-sm font-semibold text-gray-800">
                    R{detailHub._room?.name_room || "-"}
                  </p>
                  {detailHub._room?.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {detailHub._room.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {errorPopup && (
        <AdminModal
          title={errorPopup.title}
          onClose={() => setErrorPopup(null)}
        >
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
            <p className="text-gray-700 text-sm text-center leading-relaxed">
              {errorPopup.message}
            </p>
            <button
              onClick={() => setErrorPopup(null)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default AdminHub;
