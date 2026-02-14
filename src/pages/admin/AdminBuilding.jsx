import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getBuildings } from "../../services/report";
import { getMe } from "../../services/auth";
import api from "../../services/axios";

const EMPTY_BUILDING_FORM = { building_name: "", description: "" };
const EMPTY_ROOM_FORM = { name_room: "", description: "" };

const AdminBuilding = () => {
  const [admin, setAdmin] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Building modals
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [deleteBuilding, setDeleteBuilding] = useState(null);
  const [buildingForm, setBuildingForm] = useState(EMPTY_BUILDING_FORM);

  // Room modals
  const [showAddRoom, setShowAddRoom] = useState(null); // holds building object
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [roomForm, setRoomForm] = useState(EMPTY_ROOM_FORM);

  // Expanded buildings
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    getMe()
      .then((res) => setAdmin(res.data.data))
      .catch(console.error);
  }, []);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const res = await getBuildings();
      setBuildings(res.data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // ── Building handlers ────────────────────────────────────────────────────

  const handleAddBuilding = async () => {
    if (!buildingForm.building_name || !buildingForm.description) {
      alert("Semua field wajib diisi");
      return;
    }
    setSaving(true);
    try {
      await api.post("/buildings", buildingForm);
      setBuildingForm(EMPTY_BUILDING_FORM);
      setShowAddBuilding(false);
      fetchBuildings();
    } catch {
      alert("Gagal menambah building. Pastikan endpoint /buildings tersedia.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!deleteBuilding) return;
    setSaving(true);
    try {
      await api.delete(`/buildings/${deleteBuilding.id}`);
      setDeleteBuilding(null);
      fetchBuildings();
    } catch {
      alert("Gagal menghapus building.");
    } finally {
      setSaving(false);
    }
  };

  // ── Room handlers ────────────────────────────────────────────────────────

  const handleAddRoom = async () => {
    if (!roomForm.name_room || !roomForm.description || !showAddRoom) {
      alert("Semua field wajib diisi");
      return;
    }
    setSaving(true);
    try {
      await api.post("/rooms", { ...roomForm, building_id: showAddRoom.id });
      setRoomForm(EMPTY_ROOM_FORM);
      setShowAddRoom(null);
      fetchBuildings();
    } catch {
      alert("Gagal menambah room. Pastikan endpoint /rooms tersedia.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deleteRoom) return;
    setSaving(true);
    try {
      await api.delete(`/rooms/${deleteRoom.id}`);
      setDeleteRoom(null);
      fetchBuildings();
    } catch {
      alert("Gagal menghapus room.");
    } finally {
      setSaving(false);
    }
  };

  const totalRooms = buildings.reduce(
    (acc, b) => acc + (b.rooms?.length ?? 0),
    0,
  );

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen Building">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Manajemen Building
            </h2>
            <p className="text-gray-500 text-sm">
              {buildings.length} building · {totalRooms} room terdaftar
            </p>
          </div>
          <button
            onClick={() => {
              setBuildingForm(EMPTY_BUILDING_FORM);
              setShowAddBuilding(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Tambah Building
          </button>
        </div>

        {/* Building List */}
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
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : buildings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="text-gray-400 font-medium">Belum ada building</p>
            <p className="text-gray-300 text-sm mt-1">
              Klik "+ Tambah Building" untuk menambahkan
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {buildings.map((building) => {
              const isExpanded = expanded[building.id] ?? true;

              return (
                <div
                  key={building.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Building Header */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <button
                      onClick={() => toggleExpand(building.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                        🏛️
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {building.building_name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {building.description} · {building.rooms?.length ?? 0}{" "}
                          room
                        </p>
                      </div>
                      <span className="ml-2 text-gray-400 text-sm">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setRoomForm(EMPTY_ROOM_FORM);
                          setShowAddRoom(building);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        + Room
                      </button>
                      <button
                        onClick={() => setDeleteBuilding(building)}
                        className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus Building"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Rooms Grid */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-gray-50 pt-3">
                      {building.rooms?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                          {building.rooms.map((room) => (
                            <div
                              key={room.id}
                              className="bg-gray-50 rounded-xl p-3 flex items-start justify-between group border border-gray-100 hover:border-indigo-200 transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-700 text-sm">
                                  R{room.name_room}
                                </p>
                                <p className="text-gray-400 text-xs truncate mt-0.5">
                                  {room.description}
                                </p>
                              </div>
                              <button
                                onClick={() => setDeleteRoom(room)}
                                className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-red-400 hover:bg-red-50 transition-all flex-shrink-0 ml-1 text-xs"
                                title="Hapus Room"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400 text-sm">
                            Belum ada room di building ini.
                          </p>
                          <button
                            onClick={() => {
                              setRoomForm(EMPTY_ROOM_FORM);
                              setShowAddRoom(building);
                            }}
                            className="mt-2 text-indigo-600 text-sm font-medium hover:underline"
                          >
                            + Tambah room pertama
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal Tambah Building ── */}
      {showAddBuilding && (
        <AdminModal
          title="Tambah Building Baru"
          onClose={() => setShowAddBuilding(false)}
        >
          <div className="space-y-4">
            {[
              {
                key: "building_name",
                label: "Nama Building",
                placeholder: "Contoh: Gedung Utara",
              },
              {
                key: "description",
                label: "Deskripsi",
                placeholder: "Contoh: Gedung di sisi utara kampus",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-gray-500 text-xs font-medium mb-1 block">
                  {label}
                </label>
                <input
                  value={buildingForm[key]}
                  onChange={(e) =>
                    setBuildingForm({ ...buildingForm, [key]: e.target.value })
                  }
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddBuilding(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleAddBuilding}
                disabled={saving}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Tambah Building"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* ── Modal Tambah Room ── */}
      {showAddRoom && (
        <AdminModal
          title={`Tambah Room — ${showAddRoom.building_name}`}
          onClose={() => setShowAddRoom(null)}
        >
          <div className="space-y-4">
            {[
              {
                key: "name_room",
                label: "Nomor / Nama Room",
                placeholder: "Contoh: 5001",
              },
              {
                key: "description",
                label: "Deskripsi",
                placeholder: "Contoh: Ruang kelas lantai 5",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-gray-500 text-xs font-medium mb-1 block">
                  {label}
                </label>
                <input
                  value={roomForm[key]}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, [key]: e.target.value })
                  }
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddRoom(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleAddRoom}
                disabled={saving}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Tambah Room"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* ── Modal Hapus Building ── */}
      {deleteBuilding && (
        <AdminModal
          title="Hapus Building?"
          onClose={() => setDeleteBuilding(null)}
        >
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
            <p className="text-red-600 text-sm font-medium">⚠️ Peringatan!</p>
            <p className="text-red-500 text-xs mt-1">
              Building{" "}
              <span className="font-bold">
                "{deleteBuilding.building_name}"
              </span>{" "}
              beserta{" "}
              <span className="font-bold">
                {deleteBuilding.rooms?.length ?? 0} room
              </span>{" "}
              di dalamnya akan dihapus permanen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteBuilding(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteBuilding}
              disabled={saving}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}

      {/* ── Modal Hapus Room ── */}
      {deleteRoom && (
        <AdminModal title="Hapus Room?" onClose={() => setDeleteRoom(null)}>
          <p className="text-gray-500 text-sm mb-6">
            Room{" "}
            <span className="font-semibold text-gray-800">
              R{deleteRoom.name_room}
            </span>{" "}
            — <span className="text-gray-400">{deleteRoom.description}</span>{" "}
            akan dihapus permanen.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteRoom(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteRoom}
              disabled={saving}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default AdminBuilding;
